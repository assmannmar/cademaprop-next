import type { ReactNode } from "react";
import { breadcrumbJsonLd, jsonLdScript, pageMetadata } from "@/app/lib/seo";
import IndustriaChrome from "./IndustriaChrome";

export const metadata = pageMetadata({
  title: "Inmuebles industriales y parques industriales",
  description:
    "Galpones, naves, terrenos, parques industriales y busqueda personalizada para empresas en Campana, Pilar, Escobar, Zarate y Corredor Norte.",
  path: "/industrias",
  image: "/industrial-banner.jpg",
});

const industriaJsonLd = [
  breadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Industrias", path: "/industrias" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "En que zonas trabaja Cadema Industrias?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cadema Industrias se especializa en Zona Norte del GBA, principalmente Zarate, Campana, Escobar y Pilar, y tambien puede realizar busquedas en otros corredores industriales.",
        },
      },
      {
        "@type": "Question",
        name: "Que tipo de propiedades industriales comercializa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Trabaja con naves industriales, galpones, lotes, fracciones, parques industriales y centros logisticos dentro y fuera de parques.",
        },
      },
      {
        "@type": "Question",
        name: "Cadema realiza busquedas a medida para empresas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Si. Releva requerimientos operativos, superficie, accesos, potencia, actividad, plazos y alternativas disponibles para proponer opciones acordes.",
        },
      },
      {
        "@type": "Question",
        name: "Como cobra sus honorarios Cadema Industrias?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Los honorarios son los habituales del sector inmobiliario industrial y se abonan al cierre de la operacion.",
        },
      },
    ],
  },
];

export default function IndustriaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <IndustriaChrome>{children}</IndustriaChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(industriaJsonLd)}
      />
    </>
  );
}
