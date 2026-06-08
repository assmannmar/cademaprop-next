import type { ReactNode } from "react";
import { pageMetadata } from "@/app/lib/seo";

export const metadata = pageMetadata({
  title: "Islas Barrios Nauticos en Zarate | Cadema Bienes Raices",
  description:
    "Islas Barrios Nauticos es un emprendimiento en Zarate con lotes, naturaleza y acceso al rio Parana Guazu. Consulta disponibilidad con Cadema.",
  path: "/emprendimientos/islas-barrios-nauticos",
  image: "/emprendimientos/islas-barrios-nauticos/islas-masterplan.jpg",
});

export default function IslasLayout({ children }: { children: ReactNode }) {
  return children;
}
