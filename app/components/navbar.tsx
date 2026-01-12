"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      
      // Lógica de ocultar/mostrar al hacer scroll
      if (currentY > lastY.current && currentY > 50) {
        setVisible(false);
        setMobileMenuOpen(false); // Cierra el menú si el usuario scrollea hacia abajo
      } else {
        setVisible(true);
      }
      lastY.current = currentY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = `nav-item ${scrolled ? "nav-link-scrolled" : "nav-link-white"}`;

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 
        ${visible ? "translate-y-0" : "-translate-y-full"} 
        ${scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
        
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* LOGO */}
          <Link href="/" className="flex-shrink-0">
            <img 
              src="/logos/logo.png" 
              alt="Logo" 
              className="h-auto w-full max-w-[140px] md:max-w-[180px]" 
            />
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/quienes-somos" className={linkClass}>Quienes Somos</Link>
            <Link href="/propiedades" className={linkClass}>Propiedades</Link>
            <Link href="/emprendimientos" className={linkClass}>Emprendimientos</Link>
            <Link href="/industria" className={linkClass}>Industria</Link>
            <Link href="/contacto" className={linkClass}>Contacto</Link>
            <Link href="/blog" className={linkClass}>Blog</Link>
            <Link href="/simulador" className={linkClass}>Simulador</Link>
            <Link href="/sinor" className={linkClass}>SINOR</Link>
            
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
            className={`md:hidden text-3xl z-50 transition-colors ${
              mobileMenuOpen || scrolled ? "text-gray-800" : "text-white"
            }`}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col items-center justify-center h-full space-y-6 text-lg font-medium text-gray-800">
          <Link href="/quienes-somos" onClick={() => setMobileMenuOpen(false)}>Quienes Somos</Link>
          <Link href="/propiedades" onClick={() => setMobileMenuOpen(false)}>Propiedades</Link>
          <Link href="/emprendimientos" onClick={() => setMobileMenuOpen(false)}>Emprendimientos</Link>
          <Link href="/industria" onClick={() => setMobileMenuOpen(false)}>Industria</Link>
          <Link href="/contacto" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
          <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          <Link href="/simulador" onClick={() => setMobileMenuOpen(false)}>Simulador</Link>
          <Link href="/sinor" onClick={() => setMobileMenuOpen(false)}>SINOR</Link>
          
          <div className="flex space-x-8 pt-6">
            <a href="https://www.instagram.com/cademabienesraices" target="_blank" className="text-3xl text-pink-600">📸</a>
            <a href="https://wa.me/5493489517993" target="_blank" className="text-3xl text-green-500">💬</a>
          </div>
        </div>
      </div>
    </>
  );
}