"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Componentes de Iconos SVG 
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      
      // 1. Handle background color change
      setScrolled(currentY > 50);

      // 2. Handle show/hide logic
      if (currentY > lastY.current && currentY > 100) {
        // Scrolling Down - hide and close mobile menu
        setVisible(false);
        setMobileMenuOpen(false);
      } else {
        // Scrolling Up - show
        setVisible(true);
      }
      
      lastY.current = currentY;
    };

    // Use passive: true for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Quienes Somos", href: "/quienes-somos" },
    { name: "Propiedades", href: "/propiedades" },
    { name: "Emprendimientos", href: "/emprendimientos" },
    { name: "Industria", href: "https://cademaprop.com.ar/parque-industrial/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones/" },
    { name: "Contacto", href: "/contacto" },
    { name: "Blog", href: "/blog" },
    { name: "Simulador", href: "/simulador" },
    { name: "SINOR", href: "https://sinor.com.ar/" },
  ];

  const linkClass = `nav-item px-3 py-2 transition-colors duration-200 font-semibold ${
    scrolled ? "text-white-800 hover:text-blue-600" : "text-white hover:text-gray-300"
  }`;

return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 transform
          ${visible ? "translate-y-0" : "-translate-y-full"} 
          ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2" : "bg-transparent py-5"}`}
      >
        {/* Cambiamos justify-between por una estructura más sólida */}
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* LOGO - Se mantiene a la izquierda */}
          <Link href="/" className="flex-shrink-0">
            <img 
              src="/logos/logo.png" 
              alt="Logo" 
              className="h-auto w-full max-w-[140px] md:max-w-[180px] transition-all duration-300" 
            />
          </Link>

          {/* MENU DESKTOP - Agrupamos TODO aquí */}
          <div className="hidden lg:flex items-center ml-auto space-x-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.name}
              </Link>
            ))}
            
            {/* Redes sociales como parte del mismo grupo de space-x */}
            <a href="https://instagram.com/cademabienesraices" target="_blank" className={linkClass} aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://wa.me/5493489517993" target="_blank" className={linkClass} aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>
          </div>

          {/* HAMBURGER - Solo aparece en móvil */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden ml-auto text-3xl z-50 ${
              mobileMenuOpen || scrolled ? "text-gray-800" : "text-white"
            }`}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY (Se mantiene igual con el pt-24 que agregamos antes) */}
      <div className={`fixed inset-0 z-40 bg-white flex flex-col transition-transform duration-500 ease-in-out lg:hidden ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col items-center justify-start h-full pt-24 space-y-6 text-xl font-semibold text-gray-800 overflow-y-auto">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex space-x-8 pt-8 border-t w-1/2 justify-center border-gray-100">
            <a href="#" className="text-pink-600 scale-150"><InstagramIcon /></a>
            <a href="#" className="text-green-500 scale-150"><WhatsAppIcon /></a>
          </div>
        </div>
      </div>
    </>
  );
}