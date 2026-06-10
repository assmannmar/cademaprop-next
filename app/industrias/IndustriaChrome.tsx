"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import WhatsAppButtonIndustria from "@/app/components/Whatsappbuttonindustria";

export default function IndustriaChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarIndustrias />
      {children}
      <WhatsAppButtonIndustria />
    </>
  );
}

function NavbarIndustrias() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);

      if (currentY > lastY.current && currentY > 100) {
        setVisible(false);
        setMobileMenuOpen(false);
      } else {
        setVisible(true);
      }

      lastY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Como trabajamos", href: "#como" },
    { label: "Propiedades", href: "#propiedades" },
    { label: "Parques", href: "#parques" },
    { label: "Casos", href: "#casos" },
    { label: "Preguntas", href: "#faq" },
    { label: "Ir a web Cadema", href: "/" },
  ];

  const linkClass = `nav-item inline-flex h-11 items-center px-3 py-2 font-bold leading-none transition-colors duration-200 ${
    scrolled ? "text-gray-800 hover:text-red-600" : "text-white hover:text-white/75"
  }`;

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) {
      return;
    }

    event.preventDefault();
    setMobileMenuOpen(false);

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", href);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transform transition-all duration-500 ${
          visible ? "translate-y-0" : "-translate-y-full"
        } ${scrolled ? "bg-white/95 py-2 shadow-md backdrop-blur-md" : "bg-transparent py-5"}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex-shrink-0">
            <img
              src="/logos-industria/logo-industria.png"
              alt="Cadema Industria"
              className={`h-auto w-full max-w-[130px] transition-all duration-300 md:max-w-[170px] ${
                scrolled ? "" : "drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
              }`}
            />
          </Link>

          <div className="ml-auto hidden items-center space-x-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={linkClass}
                onClick={(event) => handleNavClick(event, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#formulario"
            onClick={(event) => handleNavClick(event, "#formulario")}
            className={`ml-3 hidden rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.08em] transition md:inline-flex ${
              scrolled
                ? "bg-[#141414] text-white hover:bg-[#c60c23]"
                : "border border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15"
            }`}
          >
            Contactar
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`z-50 ml-auto text-3xl lg:hidden ${
              mobileMenuOpen || scrolled ? "text-gray-900" : "text-white"
            }`}
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? "x" : "☰"}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 flex flex-col bg-white transition-transform duration-500 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col items-center justify-start space-y-2 overflow-y-auto px-6 pb-10 pt-24 text-xl font-semibold text-gray-800">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              className="w-full border-b border-gray-50 py-4 text-center"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#formulario"
            onClick={(event) => handleNavClick(event, "#formulario")}
            className="mt-6 inline-flex rounded-full bg-[#c60c23] px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white"
          >
            Contactar
          </a>
        </div>
      </div>
    </>
  );
}
