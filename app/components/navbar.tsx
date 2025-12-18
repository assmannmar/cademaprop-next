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
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* LOGO */}
          <Link 
            href="/" 
            className="text-xl sm:text-2xl font-bold text-red-600 hover:text-red-700 transition z-50"
            onClick={handleLinkClick}
          >
            CADEMA PROP
          </Link>

          {/* LINKS DESKTOP */}
          <div className="hidden sm:flex space-x-6">
            <Link href="/quienes-somos" className="nav-item">
              Quienes Somos
            </Link>
            <Link href="/propiedades" className="nav-item">
              Propiedades
            </Link>
            <Link href="/emprendimientos" className="nav-item">
              Emprendimientos
            </Link>
            <Link 
              href="https://cademaprop.com.ar/parque-industrial/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones/" 
              className="nav-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              Industria
            </Link>
            <Link href="/contacto" className="nav-item">
              Contacto
            </Link>
          </div>

          {/* HAMBURGER BUTTON MOBILE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-gray-700 hover:text-red-600 transition z-50 p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              // X icon cuando está abierto
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            ) : (
              // Hamburger icon cuando está cerrado
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* MENU MOBILE - FULLSCREEN OVERLAY */}
      <div
        className={`fixed inset-0 z-40 sm:hidden transition-all duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overlay oscuro */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Panel del menú */}
        <div
          className={`absolute top-[60px] left-0 right-0 bg-white shadow-2xl transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="flex flex-col py-4">
            <Link
              href="/"
              className="px-6 py-4 text-lg font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-b border-gray-100"
              onClick={handleLinkClick}
            >
              Inicio
            </Link>
            <Link
              href="/quienes-somos"
              className="px-6 py-4 text-lg font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-b border-gray-100"
              onClick={handleLinkClick}
            >
              Quienes Somos
            </Link>
            <Link
              href="/propiedades"
              className="px-6 py-4 text-lg font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-b border-gray-100"
              onClick={handleLinkClick}
            >
              Propiedades
            </Link>
            <Link
              href="/emprendimientos"
              className="px-6 py-4 text-lg font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-b border-gray-100"
              onClick={handleLinkClick}
            >
              Emprendimientos
            </Link>
            <Link
              href="https://cademaprop.com.ar/parque-industrial/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones/"
              className="px-6 py-4 text-lg font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-b border-gray-100"
              onClick={handleLinkClick}
              target="_blank"
              rel="noopener noreferrer"
            >
              Industria
            </Link>
            <Link
              href="/contacto"
              className="px-6 py-4 text-lg font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
              onClick={handleLinkClick}
            >
              Contacto
            </Link>

            {/* Botón de contacto destacado */}
            <div className="px-6 py-4">
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-center transition shadow-lg"
                onClick={handleLinkClick}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}