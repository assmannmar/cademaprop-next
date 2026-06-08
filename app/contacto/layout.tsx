import type { ReactNode } from "react";
import { pageMetadata } from "@/app/lib/seo";

export const metadata = pageMetadata({
  title: "Contacto | Cadema Bienes Raices",
  description:
    "Contacta a Cadema Bienes Raices en Campana, Zarate o la division Industrias. Telefonos, WhatsApp, email, oficinas y formulario de consulta.",
  path: "/contacto",
  image: "/img/oficinas/oficina-campana.jpg",
});

export default function ContactoLayout({ children }: { children: ReactNode }) {
  return children;
}
