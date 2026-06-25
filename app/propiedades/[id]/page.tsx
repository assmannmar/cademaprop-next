import type { Metadata } from "next";
import PropertyDetailClient, { type Property } from "./PropertyDetailClient";
import {
  absoluteUrl,
  brandName,
  breadcrumbJsonLd,
  jsonLdScript,
} from "@/app/lib/seo";

type PageProps = {
  params: Promise<{ id: string }>;
};

function getPropertyId(slug?: string) {
  if (!slug || slug === "placeholder") return null;
  const id = slug.split("-")[0];
  return /^\d+$/.test(id) ? id : null;
}

function stripHtml(value?: string) {
  return value ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}...`;
}

function translateOperationType(type?: string) {
  const translations: Record<string, string> = {
    Sale: "venta",
    Rent: "alquiler",
    "Temporary Rent": "alquiler temporal",
  };
  return translations[type || ""] || type || "";
}

function translatePropertyType(type?: string) {
  const translations: Record<string, string> = {
    House: "Casa",
    Apartment: "Departamento",
    Land: "Terreno",
    Office: "Oficina",
    Commercial: "Local comercial",
    "Industrial Ship": "Nave industrial",
    Storage: "Deposito",
  };
  return translations[type || ""] || type || "Propiedad";
}

function getPropertyTitle(property: Property) {
  const operationType = translateOperationType(property.operations?.[0]?.operation_type);
  const propertyType = translatePropertyType(
    property.development?.type?.name || property.type?.name
  );
  const location = property.location?.name;

  return (
    property.publication_title ||
    `${propertyType}${operationType ? ` en ${operationType}` : ""}${
      location ? ` en ${location}` : ""
    }`
  );
}

function getPropertyDescription(property: Property) {
  const rawDescription = stripHtml(property.rich_description || property.description);
  if (rawDescription) return truncate(rawDescription, 155);

  const operationType = translateOperationType(property.operations?.[0]?.operation_type);
  const propertyType = translatePropertyType(
    property.development?.type?.name || property.type?.name
  );
  const location = property.location?.name || property.location?.short_location;
  const specs = [
    property.room_amount ? `${property.room_amount} ambientes` : null,
    property.suite_amount ? `${property.suite_amount} dormitorios` : null,
    property.bathroom_amount ? `${property.bathroom_amount} banos` : null,
    property.surface ? `${property.surface} m2 de terreno` : null,
  ].filter(Boolean);

  return truncate(
    `${propertyType}${operationType ? ` en ${operationType}` : ""}${
      location ? ` en ${location}` : ""
    }. ${specs.join(", ")}. Consulta precio y coordina una visita con Cadema.`,
    155
  );
}

function getMainImage(property: Property) {
  const photo =
    property.photos?.find((item) => item.is_front_cover) || property.photos?.[0];
  return photo?.original || photo?.image || "/carousel/2.jpg";
}

function getPrice(property: Property) {
  const mainOperation = property.operations?.[0];
  const webPrice = mainOperation?.prices?.find((price) => price.web_price);
  return webPrice || mainOperation?.prices?.[0] || null;
}

async function getProperty(id: string): Promise<Property | null> {
  const apiKey = process.env.TOKKO_API_KEY;
  if (!apiKey) return null;

  try {
    const params = new URLSearchParams({
      key: apiKey,
      format: "json",
      lang: "es",
    });
    const response = await fetch(
      `https://www.tokkobroker.com/api/v1/property/${id}/?${params.toString()}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) return null;
    return (await response.json()) as Property;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: slug } = await params;
  const propertyId = getPropertyId(slug);

  if (!propertyId) {
    return {
      title: "Propiedad en venta o alquiler",
      description:
        "Ficha de propiedad publicada por Cadema Bienes Raices. Consulta precio, ubicacion, caracteristicas, fotos y coordina una visita con el equipo comercial.",
      openGraph: {
        type: "website",
        locale: "es_AR",
        siteName: brandName,
        title: "Propiedad en venta o alquiler",
        description:
          "Ficha de propiedad publicada por Cadema Bienes Raices. Consulta precio, ubicacion, caracteristicas, fotos y coordina una visita con el equipo comercial.",
        images: [absoluteUrl("/carousel/2.jpg")],
      },
    };
  }

  const property = await getProperty(propertyId);
  if (!property) {
    return {
      title: "Propiedad en venta o alquiler",
      description:
        "Ficha de propiedad publicada por Cadema Bienes Raices. Consulta precio, ubicacion, caracteristicas, fotos y coordina una visita con el equipo comercial.",
    };
  }

  const title = getPropertyTitle(property);
  const description = getPropertyDescription(property);
  const image = absoluteUrl(getMainImage(property));
  const canonical = absoluteUrl(`/propiedades/${slug}`);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: brandName,
      title,
      description,
      url: canonical,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

function propertyJsonLd(property: Property, slug: string) {
  const title = getPropertyTitle(property);
  const price = getPrice(property);
  const image = absoluteUrl(getMainImage(property));
  const url = absoluteUrl(`/propiedades/${slug}`);
  const location = property.location?.full_location || property.location?.name;

  return [
    breadcrumbJsonLd([
      { name: "Inicio", path: "/" },
      { name: "Propiedades", path: "/propiedades" },
      { name: title, path: `/propiedades/${slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: title,
      description: getPropertyDescription(property),
      image,
      url,
      brand: {
        "@type": "RealEstateAgent",
        name: brandName,
      },
      category: translatePropertyType(property.development?.type?.name || property.type?.name),
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        url,
        price: price?.price,
        priceCurrency: price?.currency || "USD",
        seller: {
          "@type": "RealEstateAgent",
          name: brandName,
        },
      },
      additionalProperty: [
        property.surface
          ? { "@type": "PropertyValue", name: "Superficie terreno", value: property.surface }
          : null,
        property.roofed_surface
          ? {
              "@type": "PropertyValue",
              name: "Superficie cubierta",
              value: property.roofed_surface,
            }
          : null,
        property.room_amount
          ? { "@type": "PropertyValue", name: "Ambientes", value: property.room_amount }
          : null,
        property.suite_amount
          ? { "@type": "PropertyValue", name: "Dormitorios", value: property.suite_amount }
          : null,
      ].filter(Boolean),
      areaServed: location,
    },
  ];
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id: slug } = await params;
  const propertyId = getPropertyId(slug);
  const initialProperty = propertyId ? await getProperty(propertyId) : null;

  return (
    <>
      <PropertyDetailClient initialProperty={initialProperty} />
      {initialProperty && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(propertyJsonLd(initialProperty, slug))}
        />
      )}
    </>
  );
}
