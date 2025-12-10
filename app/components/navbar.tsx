"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      // Si estoy bajando → oculto
      if (currentY > lastY && currentY > 50) {
        setVisible(false);
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

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-transform duration-300 
      ${visible ? "translate-y-0" : "-translate-y-full"} 
      bg-white/70 backdrop-blur shadow-md`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600">
          LOGO
        </Link>

        {/* LINKS */}
        <div className="hidden sm:flex space-x-6">
          <Link href="/quienes-somos" className="nav-item">Quienes Somos</Link>
          <Link href="/propiedades" className="nav-item">Propiedades</Link>
          <Link href="/emprendimientos" className="nav-item">Emprendimientos</Link>
          <Link href="/industria" className="nav-item">Industria</Link>
          <Link href="/contacto" className="nav-item">Contacto</Link>
        </div>

        {/* MENU MOBILE */}
        <div className="sm:hidden text-gray-700 text-lg">
          ☰
        </div>

      </div>
    </nav>
  );
}
