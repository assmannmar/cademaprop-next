"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import WhatsAppButton from "./WhatsappButton";

export default function GlobalChrome() {
  const pathname = usePathname();
  const isIndustria = pathname?.startsWith("/industrias") || pathname?.startsWith("/industria");

  if (isIndustria) {
    return null;
  }

  return (
    <>
      <Navbar />
      <WhatsAppButton />
    </>
  );
}
