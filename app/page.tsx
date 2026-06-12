"use client";

import { useState, useEffect } from 'react';
import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { 
  EmprendimientosCarousel, 
  DestacadasCarousel, 
  TestimoniosCarousel,
} from './components/Carousels';
import FullScreenLoader from './components/loader';
import InstagramFeed from "./components/InstagramFeed";
import BlogSection from "@/app/components/BlogSection";
import { apiUrl } from "@/lib/api";
import {
  NosotrosIntro,
  NosotrosServicesSection,
  NosotrosStatsSection,
  NosotrosValuesSection,
} from "@/app/components/nosotros/NosotrosSections";
import "./nosotros/nosotros.css";

interface Property {
  id: number;
  publication_title?: string;
  photos?: Array<{ image: string }>;
  type?: { name: string };
  location?: { name: string };
  operations?: Array<{
    operation_type: string;
    prices?: Array<{ price: number; currency: string }>;
  }>;
  custom_tags?: Array<{ name: string; group_name?: string }>;
  development?: { type?: { name: string } };
  is_starred_on_web?: boolean;
}

interface Development {
  id: number;
  name?: string;
  photos?: Array<{ image: string }>;
  location?: { name: string };
  type?: { name: string };
  description?: string;
}

function ApiSectionLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Cargando contenido">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="px-3">
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-200 shadow-lg">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200" />
            <div className="absolute inset-x-8 top-1/2 h-4 -translate-y-1/2 rounded bg-white/70" />
            <div className="absolute inset-x-14 top-[56%] h-3 rounded bg-white/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {

  const [emprendimientos, setEmprendimientos] = useState<Development[]>([]);
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [emprendimientosLoading, setEmprendimientosLoading] = useState(true);
  const [destacadasLoading, setDestacadasLoading] = useState(true);

  const forceDocumentNavigation =
    (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      window.location.assign(href);
    };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowInitialLoader(false);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);


  useEffect(() => {
    let isActive = true;

    const loadDevelopments = async () => {
      try {
        const response = await fetch(apiUrl("developments"));

        if (response.ok) {
          const devData = await response.json();
          if (!isActive) return;
          setEmprendimientos(devData.objects?.slice(0, 20) || []);
        }
      } catch (err) {
        console.error('Error cargando emprendimientos:', err);
      } finally {
        if (isActive) setEmprendimientosLoading(false);
      }
    };

    const loadProperties = async () => {
      try {
        const params = new URLSearchParams({
          featured: "true",
          limit: "50",
          page: "1",
        });
        const response = await fetch(`${apiUrl("properties")}?${params.toString()}`);

        if (response.ok) {
          const propData = await response.json();
          if (!isActive) return;
          setDestacadas(propData.objects || []);
        }
      } catch (err) {
        console.error('Error cargando propiedades destacadas:', err);
      } finally {
        if (isActive) setDestacadasLoading(false);
      }
    };

    loadDevelopments();
    loadProperties();

    return () => {
      isActive = false;
    };
  }, []);
  

  return (
    <>
    {showInitialLoader && <FullScreenLoader />}
    <main className="page">
      {/* PORTADA */}
      <section className="portada">
        <HeroCarousel />

        <div className="portada-overlay">
          {/* LOGO */}
          <img src="/logos/logo-portada.png" alt="Cadema" className="portada-logo" />

          {/* BOTONES SUPERIORES */}
          <div className="portada-botones top">
            <Link
              href="/propiedades/?operation=sale"
              onClick={forceDocumentNavigation("/propiedades/?operation=sale")}
              className="btn-split"
            >
              <span className="btn-text">Comprar</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link href="/tasar-vender" className="btn-split">
              <span className="btn-text">Vender</span>
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN INFERIOR DE LA PORTADA */}
      <section className="portada-bottom">
        <div className="portada-botones bottom">
          <Link
            href="/propiedades/"
            onClick={forceDocumentNavigation("/propiedades/")}
            className="btn-split"
          >
            <span className="btn-text">Residencial</span>
            <span className="btn-arrow">→</span>
          </Link>
          <Link href="/industrias" className="btn-split">
            <span className="btn-text">Industrias</span>
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </section>

      <section className="text-center mx-auto bg-white">
          <h2 className='titulo-portada'>Más de 60 años acompañándote en cada etapa</h2>
      </section>

      {/* EMPRENDIMIENTOS - CAROUSEL */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">Emprendimientos</h2>
            <p className="text-xl text-gray-600">Proyectos exclusivos en las mejores ubicaciones</p>
          </div>

          {emprendimientosLoading ? (
            <ApiSectionLoader />
          ) : emprendimientos.length > 0 ? (
            <EmprendimientosCarousel emprendimientos={emprendimientos} />
          ) : (
            <p className="text-center text-gray-500">No hay emprendimientos disponibles</p>
          )}

          <div className="flex justify-center mt-12">
            <Link href="/emprendimientos" className="btn-split btn-split-bottom btn-split-wide">
              <span className="btn-text">Ver Todos los Emprendimientos</span>
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PROPIEDADES DESTACADAS - CAROUSEL */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">Propiedades Destacadas</h2>
          </div>

          {destacadasLoading ? (
            <ApiSectionLoader />
          ) : destacadas.length > 0 ? (
            <DestacadasCarousel propiedades={destacadas} />
          ) : (
            <p className="text-center text-gray-500">No hay propiedades disponibles</p>
          )}
          <div className="flex justify-center mt-12">
            <Link
              href="/propiedades/"
              onClick={forceDocumentNavigation("/propiedades/")}
              className="btn-split btn-split-bottom btn-split-wide"
            >
              <span className="btn-text">Ver Todas las Propiedades</span>
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* BANNER INMUEBLES INDUSTRIALES */}
      <section className="relative h-130 bg-gray-900">
        {/* IMAGEN */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/industrial-banner.jpg"
            alt="Cadema Industrial"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* OVERLAY OSCURO */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* CONTENIDO */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg tracking-wide">
              Inmuebles Industriales
            </h2>
            <p className="text-xl mb-8 drop-shadow-lg">
              Galpones, naves y terrenos para tu empresa
            </p>

            <div className="flex justify-center">
              <Link
                href="/industrias"
                className="btn-split btn-split-top btn-split-wide"
              >
                <span className="btn-text">Explorar Opciones Industriales</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* QUIENES SOMOS + VALORES + SERVICIOS */}
      <div className="home-nosotros-sections">
        <NosotrosIntro showCta />
        <NosotrosValuesSection />
        <NosotrosStatsSection />
        <NosotrosServicesSection />
      </div>

      {/* TESTIMONIOS - CAROUSEL DE GOOGLE REVIEWS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">La experiencia Cadema</h2>
            <p className="text-xl text-gray-600">Historias reales de clientes que confiaron en nosotros para vender, comprar e invertir</p>
          </div>
          <TestimoniosCarousel />
        </div>
      </section>

      {/* BLOG */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <BlogSection />
        </div>
      </section>

      {/* INSTAGRAM - CAROUSEL */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <InstagramFeed />
        </div>
      </section>

      {/* FORMULARIO CONTACTO */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">Formulario de Contacto</h2>
            <p className="text-xl text-gray-600">Estamos para ayudarte</p>
          </div>
          <iframe
                  width="100%"
                  height="500"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src="https://link.ventux.io/widget/form/ucy1LfDZBfGuZJOStMqg"
                  allowFullScreen
                />
            <Script src="https://link.ventux.io/js/form_embed.js" strategy="lazyOnload" />
          
        </div>
      </section>
    </main>
    </>
  );
}
