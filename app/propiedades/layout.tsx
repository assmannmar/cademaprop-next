import type { ReactNode } from "react";
import { breadcrumbJsonLd, jsonLdScript, pageMetadata } from "@/app/lib/seo";

export const metadata = pageMetadata({
  title: "Propiedades en venta y alquiler | Cadema Bienes Raices",
  description:
    "Busca casas, departamentos, terrenos, locales e inmuebles industriales en Campana, Zarate, Exaltacion de la Cruz y Corredor Norte.",
  path: "/propiedades",
  image: "/carousel/2.jpg",
});

export default function PropiedadesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Propiedades", path: "/propiedades" },
          ])
        )}
      />
    </>
  );
}
