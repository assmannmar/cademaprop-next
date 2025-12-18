"use client";

import { useState, useEffect } from 'react';
import HeroCarousel from "./components/HeroCarousel";
import VentuxForm from "@/app/components/VentuxForm";
import Link from "next/link";

// Importar los carousels
import { 
  EmprendimientosCarousel, 
  DestacadasCarousel, 
  TestimoniosCarousel, 
  InstagramCarousel 
} from './components/Carousels';

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
      // Fetch emprendimientos desde el nuevo endpoint
      const devRes = await fetch('/api/developments');
      const devData = await devRes.json();
      
      // Tomar los primeros 20 emprendimientos
      setEmprendimientos(devData.objects?.slice(0, 20) || []);

      // Fetch propiedades para destacadas
      const propRes = await fetch('/api/properties');
      const propData = await propRes.json();
      
      // Propiedades destacadas (primeras 12)
      setDestacadas(propData.objects?.slice(0, 12) || []);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col -mt-[70px]">
      {/* HERO SECTION */}
      <section className="relative w-full h-[500px] md:h-[600px] z-0">
        <HeroCarousel />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Encontrá tu hogar ideal
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-lg">
              Más de 25 años conectando personas con propiedades
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <Link href="/propiedades?operation=sale" className="px-6 py-4 bg-white hover:bg-red-600 hover:text-white shadow-xl rounded-lg border-2 border-white hover:border-red-600 transition-all text-center text-lg font-semibold transform hover:scale-105">
                Comprar
              </Link>
              <Link href="/propiedades?operation=rental" className="px-6 py-4 bg-white hover:bg-red-600 hover:text-white shadow-xl rounded-lg border-2 border-white hover:border-red-600 transition-all text-center text-lg font-semibold transform hover:scale-105">
                Alquilar
              </Link>
              <Link href="/propiedades" className="px-6 py-4 bg-white hover:bg-red-600 hover:text-white shadow-xl rounded-lg border-2 border-white hover:border-red-600 transition-all text-center text-lg font-semibold transform hover:scale-105">
                Residencial
              </Link>
              <Link href="https://cademaprop.com.ar/parque-industrial/" className="px-6 py-4 bg-white hover:bg-red-600 hover:text-white shadow-xl rounded-lg border-2 border-white hover:border-red-600 transition-all text-center text-lg font-semibold transform hover:scale-105">
                Industrial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* EMPRENDIMIENTOS - CAROUSEL */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Emprendimientos</h2>
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

          <div className="text-center mt-12">
            <Link href="/emprendimientos" className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105">
              Ver Todos los Emprendimientos
            </Link>
          </div>
        </div>
      </section>

      {/* PROPIEDADES DESTACADAS - CAROUSEL */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Propiedades Destacadas</h2>
            <p className="text-xl text-gray-600">Selección especial de inmuebles</p>
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

          <div className="text-center mt-12">
            <Link href="/propiedades" className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105">
              Ver Todas las Propiedades
            </Link>
          </div>
        </div>
      </section>

      {/* BANNER INMUEBLES INDUSTRIALES */}
      <section className="relative h-96 bg-gray-900">
        <img
          src="/industrial-banner.jpg"
          alt="Inmuebles Industriales"
          className="w-full h-full object-cover opacity-40"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Inmuebles Industriales</h2>
            <p className="text-2xl mb-8 drop-shadow-lg">Galpones, naves y terrenos para tu empresa</p>
            <Link
              href="https://cademaprop.com.ar/parque-industrial/"
              className="inline-block px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xl transition transform hover:scale-105 text-lg"
            >
              Explorar Sector Industrial
            </Link>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Quiénes Somos</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Con más de 25 años de experiencia en el mercado inmobiliario, Cadema Prop se ha consolidado como una de las inmobiliarias más confiables de la región.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Nuestro compromiso es brindar un servicio personalizado y profesional, acompañando a nuestros clientes en cada paso del proceso de compra, venta o alquiler de su propiedad.
              </p>
              <Link href="/quienes-somos" className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition">
                Conocer Más
              </Link>
            </div>
            <div className="bg-gray-300 h-96 rounded-xl shadow-xl overflow-hidden">
              <img
                src="/about-image.jpg"
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
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Cadema en Números</h2>
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
      </section>

      {/* TESTIMONIOS - CAROUSEL DE GOOGLE REVIEWS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Testimonios</h2>
            <p className="text-xl text-gray-600">Lo que dicen nuestros clientes</p>
          </div>
          <TestimoniosCarousel />
        </div>
      </section>

      {/* BLOG */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Blog</h2>
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Síguenos en Instagram</h2>
            <p className="text-xl text-gray-600">@cademaprop</p>
          </div>
          <InstagramCarousel />
          <div className="text-center mt-8">
            <a
              href="https://instagram.com/cademaprop"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Formulario de Contacto</h2>
            <p className="text-xl text-gray-600">Estamos para ayudarte</p>
          </div>
          <VentuxForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-red-600">CADEMA PROP</h3>
              <p className="text-gray-400">Tu socio inmobiliario de confianza desde 1998</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Inicio</Link></li>
                <li><Link href="/propiedades" className="text-gray-400 hover:text-white">Propiedades</Link></li>
                <li><Link href="/emprendimientos" className="text-gray-400 hover:text-white">Emprendimientos</Link></li>
                <li><Link href="/quienes-somos" className="text-gray-400 hover:text-white">Quiénes Somos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +54 11 1234-5678</li>
                <li>📧 info@cademaprop.com</li>
                <li>📍 Campana, Buenos Aires</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Redes Sociales</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white text-2xl">📘</a>
                <a href="#" className="text-gray-400 hover:text-white text-2xl">📷</a>
                <a href="#" className="text-gray-400 hover:text-white text-2xl">🐦</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 Cadema Prop. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}