"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      // Si estoy bajando → oculto
      if (currentY > lastY && currentY > 50) {
        setVisible(false);
        setMobileMenuOpen(false); // Cerrar menú mobile al hacer scroll
      }
      // Si subo → muestro
      else {
        setVisible(true);
      }

      setLastY(currentY);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  // Cerrar menú cuando se hace click en un link
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-transform duration-300 
        ${visible ? "translate-y-0" : "-translate-y-full"} 
        bg-white/70 backdrop-blur shadow-md`}
      >
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">

          {/* LOGO */}
          <Link 
            href="/" 
            className="text-xl sm:text-2xl font-bold text-blue-600"
            onClick={handleLinkClick}
          >
            LOGO
          </Link>

          {/* LINKS DESKTOP */}
          <div className="hidden sm:flex space-x-6">
            <Link href="/quienes-somos" className="nav-item">Quienes Somos</Link>
            <Link href="/propiedades" className="nav-item">Propiedades</Link>
            <Link href="/emprendimientos" className="nav-item">Emprendimientos</Link>
            <Link href="https://cademaprop.com.ar/parque-industrial/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones/" className="nav-item">Industria</Link>
            <Link href="/contacto" className="nav-item">Contacto</Link>
          </div>

          {/* MENU MOBILE - HAMBURGER BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-gray-700 text-2xl p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

        </div>
      </nav>

      {/* MENU MOBILE - DROPDOWN */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-[60px] left-0 right-0 bg-white/95 backdrop-blur shadow-lg animate-slide-down">
            <div className="flex flex-col">
              <Link
                href="/quienes-somos"
                className="px-6 py-4 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition border-b border-gray-200"
                onClick={handleLinkClick}
              >
                Quienes Somos
              </Link>
              <Link
                href="/propiedades"
                className="px-6 py-4 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition border-b border-gray-200"
                onClick={handleLinkClick}
              >
                Propiedades
              </Link>
              <Link
                href="/emprendimientos"
                className="px-6 py-4 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition border-b border-gray-200"
                onClick={handleLinkClick}
              >
                Emprendimientos
              </Link>
              <Link
                href="https://cademaprop.com.ar/parque-industrial/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones/"
                className="px-6 py-4 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition border-b border-gray-200"
                onClick={handleLinkClick}
              >
                Industria
              </Link>
              <Link
                href="/contacto"
                className="px-6 py-4 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                onClick={handleLinkClick}
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}