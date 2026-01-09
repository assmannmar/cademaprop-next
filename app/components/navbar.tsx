"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      // Cambiar el estado de "scrolled" cuando se baja
      setScrolled(currentY > 50);

      // Si estoy bajando → oculto
      if (currentY > lastY && currentY > 50) {
        setVisible(false);
        setMobileMenuOpen(false);
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

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

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
        className={`fixed top-0 w-full z-50 transition-all duration-300 
        ${visible ? "translate-y-0" : "-translate-y-full"} 
        ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"}`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* LOGO */}
          <Link 
            href="/" 
            className={`text-xl sm:text-2xl font-bold transition-colors ${
              scrolled ? "text-blue-600" : "text-white drop-shadow-lg"
            }`}
            onClick={handleLinkClick}
          >
            <img 
              src="/logos/logo.png"
              className="mx-auto w-full max-w-[150px] md:max-w-[250px] h-auto drop-shadow-2xl mb-6"
              alt="Logo"
            />
          </Link>

          {/* LINKS DESKTOP */}
          <div className="hidden sm:flex space-x-6">
            <Link 
              href="/quienes-somos" 
              className={`nav-item transition-colors ${
                scrolled ? "text-gray-700 hover:text-red-600" : "text-white hover:text-red-400 drop-shadow-md"
              }`}
            >
              Quienes Somos
            </Link>
            <Link 
              href="/propiedades" 
              className={`nav-item transition-colors ${
                scrolled ? "text-gray-700 hover:text-red-600" : "text-white hover:text-red-400 drop-shadow-md"
              }`}
            >
              Propiedades
            </Link>
            <Link 
              href="/emprendimientos" 
              className={`nav-item transition-colors ${
                scrolled ? "text-gray-700 hover:text-red-600" : "text-white hover:text-red-400 drop-shadow-md"
              }`}
            >
              Emprendimientos
            </Link>
            <Link 
              href="https://cademaprop.com.ar/parque-industrial/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones/" 
              className={`nav-item transition-colors ${
                scrolled ? "text-gray-700 hover:text-red-600" : "text-white hover:text-red-400 drop-shadow-md"
              }`}
            >
              Industria
            </Link>
            <Link 
              href="/contacto" 
              className={`nav-item transition-colors ${
                scrolled ? "text-gray-700 hover:text-red-600" : "text-white hover:text-red-400 drop-shadow-md"
              }`}
            >
              Contacto
            </Link>
          </div>

          {/* MENU MOBILE - HAMBURGER BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`sm:hidden text-2xl p-2 transition-colors ${
              scrolled ? "text-gray-700" : "text-white drop-shadow-lg"
            }`}
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