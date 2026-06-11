import type { ReactNode } from "react";
import { pageMetadata } from "@/app/lib/seo";

export const metadata = pageMetadata({
  title: "Nosotros",
  description:
    "Conoce la trayectoria de Cadema Bienes Raices, inmobiliaria lider del Corredor Norte con oficinas en Campana, Zarate y division industrial.",
  path: "/nosotros",
  image: "/nosotros/hero-nosotros.jpg",
});

export default function NosotrosLayout({ children }: { children: ReactNode }) {
  return children;
}
