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
      setScrolled(currentY > 50);
      if (currentY > lastY && currentY > 50) {
        setVisible(false);
        setMobileMenuOpen(false);
      } else {
        setVisible(true);
      }
      setLastY(currentY);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  const linkClass = `nav-item ${scrolled ? "nav-link-scrolled" : "nav-link-white"}`;

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 
        ${visible ? "translate-y-0" : "-translate-y-full"} 
        ${scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
        
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* LOGO A LA IZQUIERDA */}
          <Link href="/" className="flex-shrink-0">
            <img 
              src="/logos/logo.png" 
              alt="Logo" 
              className="h-auto w-full max-w-[140px] md:max-w-[180px]" 
            />
          </Link>

          {/* MENU DESKTOP A LA DERECHA */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/quienes-somos" className={linkClass}>Quienes Somos</Link>
            <Link href="/propiedades" className={linkClass}>Propiedades</Link>
            <Link href="/emprendimientos" className={linkClass}>Emprendimientos</Link>
            <Link href="/industria" className={linkClass}>Industria</Link>
            <Link href="/contacto" className={linkClass}>Contacto</Link>
            <Link href="/blog" className={linkClass}>Blog</Link>
            
            {/* Redes Sociales */}
            <div className="flex items-center ml-4 space-x-4">
              <a href="https://www.instagram.com/cademabienesraices" target="_blank" className={linkClass}>
                <span className="text-xl">📸</span> 
              </a>
              <a href="https://wa.me/5493489517993" target="_blank" className={linkClass}>
                <span className="text-xl">💬</span>
              </a>
            </div>
          </div>

          {/* BOTON HAMBURGUESA (Mobile) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden text-2xl ${scrolled ? "text-gray-800" : "text-white"}`}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU (Igual que antes pero usando las nuevas clases) */}
      {/* ... (tu código de mobile menu aquí abajo) ... */}
    </>
  );
}