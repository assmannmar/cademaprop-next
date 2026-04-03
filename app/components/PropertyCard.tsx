import React from "react";
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
      "industrial warehouse": "Nave industrial",
      farm: "Campo",
      ranch: "Campo",
      countryside: "Campo",
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
      rent: "Alquiler",
      "temporary rent": "Alquiler Temporal",
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

  const landSurface = surface || 0;
  const coveredSurface = roofed_surface || total_surface || 0;

  type Badge = {
    label: string;
    icon: React.ReactNode;
  };

  const badges: Badge[] = [];

  if (totalRooms > 0) {
    badges.push({
      label: `${totalRooms} ${totalRooms === 1 ? "Ambiente" : "Ambientes"}`,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.9}
            d="M3.75 9.75L12 3l8.25 6.75V20.25a.75.75 0 01-.75.75h-15a.75.75 0 01-.75-.75V9.75z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.9}
            d="M9 21v-6.75A1.25 1.25 0 0110.25 13h3.5A1.25 1.25 0 0115 14.25V21"
          />
        </svg>
      ),
    });
  }

  if ((bathroom_amount || 0) > 0) {
    badges.push({
      label: `${bathroom_amount} ${bathroom_amount === 1 ? "Baño" : "Baños"}`,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.9}
            d="M7 4.75h10"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.9}
            d="M8.25 4.75v5.5a3.75 3.75 0 007.5 0v-5.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.9}
            d="M5 13.25h14"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.9}
            d="M7.5 13.25v3.25A3.5 3.5 0 0011 20h2a3.5 3.5 0 003.5-3.5v-3.25"
          />
        </svg>
      ),
    });
  }

  if ((parking_lot_amount || 0) > 0) {
    badges.push({
      label: `${parking_lot_amount} ${
        parking_lot_amount === 1 ? "Cochera" : "Cocheras"
      }`,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.9}
            d="M5.5 16.5h13l-1.2-5.1A2 2 0 0015.35 9H8.65a2 2 0 00-1.95 2.4L5.5 16.5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.9}
            d="M7 16.5v1.25A1.25 1.25 0 008.25 19h.5A1.25 1.25 0 0010 17.75V16.5m4 0v1.25A1.25 1.25 0 0015.25 19h.5A1.25 1.25 0 0017 17.75V16.5"
          />
          <circle cx="8.5" cy="13.25" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="13.25" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      ),
    });
  }

  if (landSurface > 0) {
    badges.push({
      label: `Terreno ${Math.round(landSurface).toLocaleString("es-AR")} m2`,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect
            x="4.5"
            y="4.5"
            width="15"
            height="15"
            rx="1.5"
            strokeWidth={1.9}
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.9}
            d="M9 4.5v15M15 4.5v15M4.5 9h15M4.5 15h15"
          />
        </svg>
      ),
    });
  }

  if (coveredSurface > 0) {
    badges.push({
      label: `Cubierto ${Math.round(coveredSurface).toLocaleString("es-AR")} m2`,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.9}
            d="M4 10.25L12 4l8 6.25"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.9}
            d="M6.25 9.75v8.75h11.5V9.75"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.9}
            d="M9.5 18.5v-4.25A1.25 1.25 0 0110.75 13h2.5a1.25 1.25 0 011.25 1.25v4.25"
          />
        </svg>
      ),
    });
  }

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
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3
              className="
                min-w-0
                flex-1
                text-[1.2rem] md:text-[1.2rem] xl:text-[1.2rem]
                font-bold
                leading-none
                tracking-tight
                text-black
              "
            >
              {propertyTypeSpanish} en {operationTypeSpanish}
            </h3>

            <div
              className="
                shrink-0
                whitespace-nowrap
                text-[1.2rem] md:text-[1.2rem] xl:text-[1.2rem]
                font-bold
                leading-none
                tracking-tight
                text-black
              "
            >
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
              {badges.map((b) => (
                <span
                  key={b.label}
                  className="
                    inline-flex items-center gap-1.5
                    rounded-full
                    border border-[#e7e7e7]
                    bg-[#f7f7f7]
                    px-2 py-1
                    text-xs font-medium text-[#4b5563]
                  "
                >
                  <span className="text-[#6b7280]">{b.icon}</span>
                  <span>{b.label}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}