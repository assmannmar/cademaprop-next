import type { Metadata } from "next";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://cademaprop.com.ar"
).replace(/\/$/, "");

export const brandName = "Cadema Bienes Raices";
export const defaultTitle =
  "Cadema Bienes Raices | Inmobiliaria en Campana, Zarate y Corredor Norte";
export const defaultDescription =
  "Inmobiliaria con mas de 60 anos de trayectoria en Campana, Zarate y Exaltacion de la Cruz. Propiedades, emprendimientos, tasaciones e inmuebles industriales.";

export const socialProfiles = [
  "https://www.facebook.com/cademabienesraices",
  "https://www.instagram.com/cademabienesraices",
  "https://www.instagram.com/cademaindustrias",
  "https://www.linkedin.com/company/cademabienesraices",
  "https://www.tiktok.com/@cademabienesraices",
  "https://cademaprop.com.ar/blog",
];

export const officeLocations = [
  {
    name: "Cadema Bienes Raices - Campana",
    address: "Av. Varela 420, Campana, Buenos Aires, Argentina",
    phone: "+5493489368518",
  },
  {
    name: "Cadema Bienes Raices - Zarate",
    address: "Av. Gallesio 55, Zarate, Buenos Aires, Argentina",
    phone: "+5493487624830",
  },
  {
    name: "Cadema Industrias",
    address: "Parque Industrial Ruta 6 - Autovia 6 km 180, Buenos Aires, Argentina",
    phone: "+5493489517998",
  },
];

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  image = "/logos/logo-portada.png",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: brandName,
      title,
      description,
      url,
      images: [
        {
          url: imageUrl,
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
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: brandName,
    url: siteUrl,
    logo: absoluteUrl("/logos/logo.png"),
    image: absoluteUrl("/logos/logo-portada.png"),
    description: defaultDescription,
    areaServed: [
      "Campana",
      "Zarate",
      "Exaltacion de la Cruz",
      "Corredor Norte",
      "Buenos Aires",
    ],
    sameAs: socialProfiles,
    email: "info@cademaprop.com.ar",
    telephone: "+5493489368518",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Varela 420",
      addressLocality: "Campana",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    department: officeLocations.map((office) => ({
      "@type": "RealEstateAgent",
      name: office.name,
      address: office.address,
      telephone: office.phone,
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: brandName,
    url: siteUrl,
    inLanguage: "es-AR",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/propiedades?ubicacion={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function jsonLdScript(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
