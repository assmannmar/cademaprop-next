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
    const map: any = {
      House: "Casa",
      Apartment: "Departamento",
      Land: "Terreno",
      house: "Casa",
      apartment: "Departamento",
      land: "Terreno",
    };
    return map[type] || type;
  };

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

  const badges = [
    totalRooms > 0 && {
      label: `${totalRooms}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2v-4h6v4h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    bathroom_amount && {
      label: `${bathroom_amount}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 2a1 1 0 00-1 1v6a5 5 0 0010 0V3a1 1 0 00-1-1H6zM4 10a6 6 0 0012 0H4z" />
        </svg>
      ),
    },
    parking_lot_amount && {
      label: `${parking_lot_amount}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 11h10l1 4H4l1-4zm1-6h8l1 4H5l1-4z" />
        </svg>
      ),
    },
    (total_surface || surface) && {
      label: `${total_surface || surface} m²`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 3h14v14H3V3z" />
        </svg>
      ),
    },
    roofed_surface && {
      label: `${roofed_surface} m²`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4h12v12H4V4z" />
        </svg>
      ),
    },
  ].filter(Boolean) as any[];

  return (
    <Link href={propertyUrl} className="group block">
      <article className="h-full">
        {/* FOTO */}
        <div className="relative overflow-hidden rounded-[20px]">
          <div className="aspect-[1.25/1]">
            <img
              src={coverImage}
              alt={publication_title}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          </div>

          {/* VER FICHA */}
          <div className="absolute top-4 right-4">
            <span className="bg-white text-[#c60c23] text-xs font-semibold px-5 py-2 rounded-full shadow-sm uppercase tracking-wide">
              Ver ficha
            </span>
          </div>

          {/* CINTA */}
          {isCreditEligible && (
            <div className="absolute left-[-60px] top-[24px] w-[200px] -rotate-45 bg-[#c60c23] text-white text-xs font-semibold py-2 text-center shadow-md">
              Apto Crédito
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="pt-4 px-1">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="text-[clamp(1.4rem,1.6vw,1.9rem)] font-bold leading-tight">
              {propertyTypeSpanish} en Venta
            </h3>

            <div className="text-[clamp(1.2rem,1.4vw,1.7rem)] font-bold whitespace-nowrap">
              {formattedPrice}
            </div>
          </div>

          {/* UBICACION */}
          <div className="flex gap-2 text-[15px] text-gray-600 mb-4">
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
                  className="flex items-center gap-2 bg-[#f5f5f5] border border-gray-200 px-3 py-2 rounded-full text-sm text-gray-700"
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