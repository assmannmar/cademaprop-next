import type { ReactNode } from "react";
import { breadcrumbJsonLd, jsonLdScript, pageMetadata } from "@/app/lib/seo";

export const metadata = pageMetadata({
  title: "Tasar y vender una propiedad | Cadema Bienes Raices",
  description:
    "Solicita una tasacion profesional y vende tu propiedad con estrategia comercial, difusion inteligente y acompanamiento personalizado de Cadema.",
  path: "/tasar-vender",
  image: "/img/diferenciales/tasacion.jpg",
});

const tasarVenderJsonLd = [
  breadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Tasar y vender", path: "/tasar-vender" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "La tasacion tiene costo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La tasacion para comercializar un inmueble con Cadema no tiene costo. Para tasaciones judiciales u otros fines se deben consultar las condiciones.",
        },
      },
      {
        "@type": "Question",
        name: "Como determinan el valor de una propiedad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cadema analiza las caracteristicas del inmueble, su ubicacion, la oferta comparable y el comportamiento real del mercado.",
        },
      },
      {
        "@type": "Question",
        name: "Se ocupan de las consultas y visitas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Si. El equipo filtra interesados, coordina visitas y gestiona el contacto comercial durante el proceso de venta.",
        },
      },
      {
        "@type": "Question",
        name: "Acompanian hasta la firma?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Si. Cadema acompana desde la tasacion inicial hasta la firma, incluyendo negociacion, coordinacion y asistencia documental.",
        },
      },
    ],
  },
];

export default function TasarVenderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(tasarVenderJsonLd)}
      />
    </>
  );
}
