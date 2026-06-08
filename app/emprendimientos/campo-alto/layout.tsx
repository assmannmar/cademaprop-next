import type { ReactNode } from "react";
import { pageMetadata } from "@/app/lib/seo";

export const metadata = pageMetadata({
  title: "Campo Alto en Zarate | Cadema Bienes Raices",
  description:
    "Campo Alto es un desarrollo residencial en Zarate, Buenos Aires. Conoce ubicacion, caracteristicas, galeria, disponibilidad y opciones de consulta.",
  path: "/emprendimientos/campo-alto",
  image: "/carousel/2.jpg",
});

export default function CampoAltoLayout({ children }: { children: ReactNode }) {
  return children;
}
