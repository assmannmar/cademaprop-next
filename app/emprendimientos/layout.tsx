import type { ReactNode } from "react";
import { breadcrumbJsonLd, jsonLdScript, pageMetadata } from "@/app/lib/seo";

export const metadata = pageMetadata({
  title: "Emprendimientos inmobiliarios | Cadema Bienes Raices",
  description:
    "Conoce emprendimientos residenciales e industriales en Campana, Zarate, Exaltacion de la Cruz y zonas de crecimiento del norte bonaerense.",
  path: "/emprendimientos",
  image: "/nosotros/cadema-oficina.jpg",
});

export default function EmprendimientosLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Emprendimientos", path: "/emprendimientos" },
          ])
        )}
      />
    </>
  );
}
