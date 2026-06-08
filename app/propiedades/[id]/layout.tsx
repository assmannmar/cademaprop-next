import type { ReactNode } from "react";
import type { Metadata } from "next";
import { absoluteUrl, brandName } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "Propiedad en venta o alquiler",
  description:
    "Ficha de propiedad publicada por Cadema Bienes Raices. Consulta precio, ubicacion, caracteristicas, fotos y coordina una visita con el equipo comercial.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: brandName,
    title: "Propiedad en venta o alquiler | Cadema Bienes Raices",
    description:
      "Ficha de propiedad publicada por Cadema Bienes Raices. Consulta precio, ubicacion, caracteristicas, fotos y coordina una visita con el equipo comercial.",
    images: [
      {
        url: absoluteUrl("/carousel/2.jpg"),
        width: 1200,
        height: 630,
        alt: "Propiedad publicada por Cadema Bienes Raices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Propiedad en venta o alquiler | Cadema Bienes Raices",
    description:
      "Ficha de propiedad publicada por Cadema Bienes Raices. Consulta precio, ubicacion, caracteristicas, fotos y coordina una visita con el equipo comercial.",
    images: [absoluteUrl("/carousel/2.jpg")],
  },
};

export default function PropiedadDetalleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
