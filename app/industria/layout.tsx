'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import WhatsAppButtonIndustria from './WhatsappButtonIndustria';

export default function IndustriaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarIndustrias />
      {children}
      {/* Botón WhatsApp específico para Industria */}
      <WhatsAppButtonIndustria />
    </>
  );
}

function NavbarIndustrias() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#f4f1ec]/92 backdrop-blur-md border-b border-[#d8d1c4]">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between py-4.5">
        {/* LOGO */}
        <Link href="/industria" className="flex items-baseline gap-2.5">
          <img 
              src="/logos-industria/logo-industria.png" 
              alt="Logo" 
              className="h-auto w-full max-w-[120px] md:max-w-[160px] transition-all duration-300" 
            />
        </Link>
        
        {/* MENU DESKTOP */}
        <ul className="hidden lg:flex gap-8">
          <li>
            <a href="#propiedades" className="text-sm font-medium text-[#2a2a2a] hover:border-b border-[#141414] pb-0.5 transition-colors">
              Propiedades
            </a>
          </li>
          <li>
            <a href="#parques" className="text-sm font-medium text-[#2a2a2a] hover:border-b border-[#141414] pb-0.5 transition-colors">
              Parques
            </a>
          </li>
          <li>
            <a href="#como" className="text-sm font-medium text-[#2a2a2a] hover:border-b border-[#141414] pb-0.5 transition-colors">
              Cómo trabajamos
            </a>
          </li>
          <li>
            <a href="#casos" className="text-sm font-medium text-[#2a2a2a] hover:border-b border-[#141414] pb-0.5 transition-colors">
              Casos
            </a>
          </li>
          <li>
            <a href="#faq" className="text-sm font-medium text-[#2a2a2a] hover:border-b border-[#141414] pb-0.5 transition-colors">
              Preguntas
            </a>
          </li>
        </ul>

        {/* BOTÓN CTA */}
        <a 
          href="#formulario" 
          className="hidden md:inline-block bg-[#141414] text-[#f4f1ec] px-4.5 py-2.5 rounded-full text-sm font-medium hover:bg-[#b8252c] transition-colors"
        >
          Contactar
        </a>
      </div>
    </nav>
  );
}