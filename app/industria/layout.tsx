import type { ReactNode } from "react";
import { breadcrumbJsonLd, jsonLdScript, pageMetadata } from "@/app/lib/seo";
import IndustriaChrome from "./IndustriaChrome";

export const metadata = pageMetadata({
  title: "Inmuebles industriales y parques industriales | Cadema Industrias",
  description:
    "Galpones, naves, terrenos, parques industriales y busqueda personalizada para empresas en Campana, Pilar, Escobar, Zarate y Corredor Norte.",
  path: "/industria",
  image: "/industrial-banner.jpg",
});

export default function IndustriaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <IndustriaChrome>{children}</IndustriaChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Industria", path: "/industria" },
          ])
        )}
      />
    </>
  );
}
