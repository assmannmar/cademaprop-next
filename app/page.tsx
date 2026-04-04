// hola
"use client";

import { useState, useEffect } from 'react';
import HeroCarousel from "./components/HeroCarousel";
import VentuxForm from "@/app/components/VentuxForm";
import Link from "next/link";
import Image from "next/image";
import { 
  EmprendimientosCarousel, 
  DestacadasCarousel, 
  TestimoniosCarousel,
} from './components/Carousels';
import FullScreenLoader from './components/loader';
import InstagramFeed from "./components/InstagramFeed";

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

export default function HomePage() {
  const [emprendimientos, setEmprendimientos] = useState<Development[]>([]);
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // carga emprendimientos desde la API
      const devRes = await fetch('/api/developments');
      const devData = await devRes.json();
      setEmprendimientos(devData.objects?.slice(0, 20) || []);

      // carga propiedades desde la API
      const propRes = await fetch('/api/properties');
      const propData = await propRes.json();
      
      // toma las propiedades destacadas, marcadas en tokko como destacar en la web
      const propiedadesStarred = propData.objects?.filter((prop: Property) => {
        return prop.is_starred_on_web === true;
      }) || [];

      if (propiedadesStarred.length > 0) {
        setDestacadas(propiedadesStarred.slice(0, 12));
      } else {
        const propiedadesDestacadas = propData.objects?.filter((prop: Property) => {
          return prop.custom_tags?.some(tag => 
            tag.name.toLowerCase().includes('destacar') && 
            tag.name.toLowerCase().includes('landing')
          );
        }) || [];

        if (propiedadesDestacadas.length > 0) {
          setDestacadas(propiedadesDestacadas.slice(0, 12));
        } else {
          // si no hay propiedades marcadas como destacadas, toma las primeras 12
          setDestacadas(propData.objects?.slice(0, 12) || []);
        }
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading && <FullScreenLoader />}
    <main className="page">
      {/* PORTADA */}
      <section className="portada">
        <HeroCarousel />

        <div className="portada-overlay">
          {/* LOGO */}
          <img src="/logos/logo-portada.png" alt="Cadema" className="portada-logo" />

          {/* BOTONES SUPERIORES */}
          <div className="portada-botones top">
            <Link href="/propiedades?operation=sale" className="btn-split">
              <span className="btn-text">Comprar</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link href="/propiedades?operation=rental" className="btn-split">
              <span className="btn-text">Vender</span>
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN INFERIOR DE LA PORTADA */}
      <section className="portada-bottom">
        <div className="portada-botones bottom">
          <Link href="/propiedades" className="btn-split">
            <span className="btn-text">Residencial</span>
            <span className="btn-arrow">→</span>
          </Link>
          <Link href="https://cademaprop.com.ar/parque-industrial/" className="btn-split">
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

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
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

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : destacadas.length > 0 ? (
            <DestacadasCarousel propiedades={destacadas} />
          ) : (
            <p className="text-center text-gray-500">No hay propiedades disponibles</p>
          )}
          <div className="flex justify-center mt-12">
            <Link href="/propiedades" className="btn-split btn-split-bottom btn-split-wide">
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
                href="https://cademaprop.com.ar/parque-industrial/"
                className="btn-split btn-split-top btn-split-wide"
              >
                <span className="btn-text">Explorar Opciones Industriales</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* QUIÉNES SOMOS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-wide">Quiénes Somos</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Con más de 60 años de experiencia en el mercado inmobiliario, nuestro compromiso es brindar un servicio personalizado y profesional, acompañando a nuestros clientes en cada paso del proceso de compra, venta o alquiler de su propiedad.
              </p>
              <Link href="/quienes-somos" className="btn-split btn-split-bottom btn-split-wide">
                <span className="btn-text">Conocé más</span>
                <span className="btn-arrow">→</span>
              </Link>
            </div>
            <div className="bg-gray-300 h-96 rounded-xl shadow-xl overflow-hidden">
              <img
                src="/img/directores.jpg"
                alt="Cadema Prop"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CADEMA EN NÚMEROS */}
      {/* <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 tracking-wide">Cadema en Números</h2>
            <p className="text-xl">Nuestra trayectoria nos respalda</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">25+</div>
              <p className="text-xl">Años de experiencia</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">500+</div>
              <p className="text-xl">Propiedades</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">2000+</div>
              <p className="text-xl">Clientes satisfechos</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">15</div>
              <p className="text-xl">Agentes expertos</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* TESTIMONIOS - CAROUSEL DE GOOGLE REVIEWS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">Testimonios</h2>
            <p className="text-xl text-gray-600">La experiencia Cadema contada por nuestros clientes</p>
          </div>
          <TestimoniosCarousel />
        </div>
      </section>

      {/* BLOG */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">Blog</h2>
            <p className="text-xl text-gray-600">Últimas novedades y consejos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">12 de Diciembre, 2025</p>
                  <h3 className="text-xl font-bold mb-3">Título del artículo {i}</h3>
                  <p className="text-gray-600 mb-4">Extracto del contenido del artículo...</p>
                  <Link href="#" className="text-red-600 font-semibold hover:text-red-700">
                    Leer más →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM - CAROUSEL */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">Seguinos en Instagram</h2>
            <p className="text-xl text-gray-600">@cademabienesraices</p>
          </div>
          <InstagramFeed />
          <div className="text-center mt-8">
            
             <a href="https://instagram.com/cademabienesraices"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg transition"
            >
              Ver Perfil de Instagram
            </a>
          </div>
        </div>
      </section>

      {/* FORMULARIO CONTACTO */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">Formulario de Contacto</h2>
            <p className="text-xl text-gray-600">Estamos para ayudarte</p>
          </div>
          <VentuxForm />
        </div>
      </section>
    </main>
    </>
  );
}