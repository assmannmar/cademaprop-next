"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
    { name: "Industria", href: "/industria" },
    { name: "Contacto", href: "/contacto" },
    { name: "Blog", href: "/blog" },
    { name: "Simulador", href: "/simulador" },
    { name: "SINOR", href: "/sinor" },
  ];

  const linkClass = `nav-item px-3 py-2 transition-colors duration-200 ${
    scrolled ? "text-gray-800 hover:text-blue-600" : "text-white hover:text-gray-300"
  }`;

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 transform
          ${visible ? "translate-y-0" : "-translate-y-full"} 
          ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2" : "bg-transparent py-5"}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* LOGO */}
          <Link href="/" className="flex-shrink-0">
            <img 
              src="/logos/logo.png" 
              alt="Logo" 
              className={`h-auto w-full max-w-[140px] md:max-w-[180px] transition-all duration-300 `} 
            />
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center ml-4 space-x-4">
              <a href="https://instagram.com/..." target="_blank" className={linkClass}>📸</a>
              <a href="https://wa.me/..." target="_blank" className={linkClass}>💬</a>
            </div>
          </div>

          {/* HAMBURGER */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className={`lg:hidden text-3xl z-50 ${
              mobileMenuOpen || scrolled ? "text-gray-800" : "text-white"
            }`}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-40 bg-white flex flex-col transition-transform duration-500 ease-in-out lg:hidden ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-xl font-semibold text-gray-800">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-blue-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex space-x-10 pt-10">
            <a href="#" className="text-4xl text-pink-600">📸</a>
            <a href="#" className="text-4xl text-green-500">💬</a>
          </div>
        </div>
      </div>
    </>
  );
}