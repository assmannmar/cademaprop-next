import type { ReactNode } from "react";
import { pageMetadata } from "@/app/lib/seo";

export const metadata = pageMetadata({
  title: "Simulador de lotes",
  description:
    "Simula opciones y consulta informacion comercial sobre lotes y emprendimientos disponibles con Cadema Bienes Raices.",
  path: "/simulador",
});

export default function SimuladorLayout({ children }: { children: ReactNode }) {
  return children;
}
