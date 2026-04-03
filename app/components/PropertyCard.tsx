import Link from "next/link";
import { generatePropertyUrl } from "@/utils/urlHelpers";

export default function PropertyCard(property: any) {
  const {
    publication_title,
    address,
    fake_address,
    location,
    operations,
    type,
    suite_amount,
    room_amount,
    bathroom_amount,
    parking_lot_amount,
    surface,
    roofed_surface,
    total_surface,
    photos,
    tags,
    custom_tags,
    credit_eligible,
  } = property;

  const displayAddress = fake_address || address || "Consultar ubicación";
  const locationName = location?.name || "";

  const totalRooms = (room_amount || 0) + (suite_amount || 0);

  const propertyType = type?.name || "Propiedad";

  const translatePropertyType = (type: string) => {
    if (!type) return "Propiedad";

    const normalized = type.toLowerCase();

    const translations: Record<string, string> = {
      house: "Casa",
      apartment: "Departamento",
      land: "Terreno",
      commercial: "Local Comercial",
      office: "Oficina",
      building: "Edificio",
      ph: "PH",

      "weekend house": "Casa de fin de semana",
      "country house": "Casa quinta",
      storage: "Depósito",
      warehouse: "Depósito",
      "industrial ship": "Nave industrial",
      "industrial warehouse": "Depósito industrial",
      farm: "Campo",
      ranch: "Campo",
      lot: "Terreno",
      parcel: "Terreno",
      condo: "Departamento",
      loft: "Loft",
      studio: "Monoambiente",
    };

    return translations[normalized] || type;
  };


  const operationType = operations?.[0]?.operation_type || "";

  const translateOperationType = (type: string) => {
    const normalized = type?.toLowerCase();

    const translations: Record<string, string> = {
      sale: "Venta",
      rental: "Alquiler",
      "temporary rental": "Alquiler Temporal",
    };

    return translations[normalized] || type;
  };

  const operationTypeSpanish = translateOperationType(operationType);

  const propertyTypeSpanish = translatePropertyType(propertyType);

  const operation = operations?.[0];
  const price = operation?.prices?.[0]?.price;
  const currency = operation?.prices?.[0]?.currency || "USD";

  const formattedPrice =
    price && price > 0
      ? `${currency === "USD" ? "u$s" : currency} ${price.toLocaleString(
          "es-AR"
        )}`
      : "Consultar";

  const coverImage =
    photos?.find((p: any) => p.is_front_cover)?.image || photos?.[0]?.image;

  const isCreditEligible =
    credit_eligible === "Eligible" ||
    tags?.some((t: any) => t.name.toLowerCase().includes("credit")) ||
    custom_tags?.some((t: any) =>
      t.name.toLowerCase().includes("crédito")
    );

  const propertyUrl = generatePropertyUrl(property);

  const landSurface = total_surface || surface || 0;
  const coveredSurface = roofed_surface || 0;

  const badges = [
    totalRooms > 0 && {
      label: `${totalRooms} ${totalRooms === 1 ? "Ambiente" : "Ambientes"}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2v-4h6v4h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },

    bathroom_amount > 0 && {
      label: `${bathroom_amount} ${bathroom_amount === 1 ? "Baño" : "Baños"}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 2a1 1 0 00-1 1v6a5 5 0 0010 0V3a1 1 0 00-1-1H6zM4 10a6 6 0 0012 0H4z" />
        </svg>
      ),
    },

    parking_lot_amount > 0 && {
      label: `${parking_lot_amount} ${
        parking_lot_amount === 1 ? "Cochera" : "Cocheras"
      }`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 11h10l1 4H4l1-4zm1-6h8l1 4H5l1-4z" />
        </svg>
      ),
    },

    landSurface > 0 && {
      label: `${landSurface} m2 Terreno`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 3h14v14H3V3z" />
        </svg>
      ),
    },

    coveredSurface > 0 && {
      label: `${coveredSurface} m2 Cubierto`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4h12v12H4V4z" />
        </svg>
      ),
    },
  ].filter(Boolean);

  return (
    <Link href={propertyUrl} className="group block">
      <article
        className="
          h-full 
          bg-white 
          rounded-[20px] 
          overflow-hidden 
          border border-[#ececec]
          shadow-[0_4px_18px_rgba(0,0,0,0.04)]
          transition-all duration-300 ease-out
          group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]
          group-hover:scale-[1.015]
        "
      >
        {/* FOTO */}
        <div className="relative">
          <div className="aspect-[1.25/1] w-full">
            <img
              src={coverImage}
              alt={publication_title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* BOTÓN VER FICHA */}
          <div className="absolute top-4 right-4">
            <span className="
              bg-white 
              text-[#c60c23] 
              text-xs 
              font-semibold 
              px-5 py-2 
              rounded-full 
              shadow-sm 
              uppercase 
              tracking-wide
            ">
              Ver ficha
            </span>
          </div>

          {/* CINTA APTO CRÉDITO */}
          {isCreditEligible && (
            <div className="
              absolute 
              left-[-60px] 
              top-[24px] 
              w-[200px] 
              -rotate-45 
              bg-[#c60c23] 
              text-white 
              text-xs 
              font-semibold 
              py-2 
              text-center 
              shadow-md
            ">
              Apto Crédito
            </div>
          )}
        </div>

        {/* CONTENIDO */}
        <div className="px-5 pt-4 pb-5">
          {/* TITULO + PRECIO */}
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="
              text-[clamp(1.2rem,1.4vw,1.6rem)] 
              font-bold 
              leading-tight 
              text-black
            ">
              {propertyTypeSpanish} en {operationTypeSpanish}
            </h3>

            <div className="
              text-[clamp(1.2rem,1.4vw,1.6rem)] 
              font-bold 
              whitespace-nowrap 
              text-black
            ">
              {formattedPrice}
            </div>
          </div>

          {/* UBICACIÓN */}
          <div className="flex gap-2 text-[14.5px] text-[#5a5a5a] mb-4">
            <span>📍</span>
            <p className="line-clamp-2">
              {displayAddress}
              {locationName && `, ${locationName}`}
            </p>
          </div>

          {/* BADGES */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((b, i) => (
                <span
                  key={i}
                  className="
                    flex items-center gap-2 
                    bg-[#f6f6f6] 
                    border border-[#e5e5e5] 
                    px-3 py-2 
                    rounded-full 
                    text-sm 
                    text-[#4b5563]
                  "
                >
                  {b.icon}
                  {b.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}