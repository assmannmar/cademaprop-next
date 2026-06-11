import type { ReactNode } from "react";
import { breadcrumbJsonLd, jsonLdScript } from "@/app/lib/seo";

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
