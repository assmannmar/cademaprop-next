'use client';

import { useState } from 'react';
import Image from 'next/image';

// ============================================================
// ICONS - SVG inline (sin lucide-react)
// ============================================================
const ChevronLeft = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const MapPin = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const DollarSign = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const Maximize2 = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="3" y2="21"></line>
  </svg>
);

// ============================================================
// CAROUSEL COMPONENT
// ============================================================
interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  location?: string;
  price?: string;
  size?: string;
  type?: string;
  [key: string]: any;
}

interface CarouselProps {
  items: CarouselItem[];
  type: 'properties' | 'parks' | 'logos';
  title: string;
  subtitle?: string;
}

function Carousel({ items, type, title, subtitle }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = type === 'logos' ? 6 : 3;
  const maxIndex = Math.max(0, items.length - itemsPerPage);

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="w-full">
      <div className="mb-12">
        <span className="font-mono text-xs tracking-widest text-[#6b6660] uppercase">{title}</span>
        {subtitle && <h2 className="font-serif text-4xl font-medium text-[#141414] mt-3 leading-tight">{subtitle}</h2>}
      </div>

      <div className="relative">
        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleItems.map((item) => (
            <div key={item.id} className="group">
              {type === 'properties' && (
                <div className="bg-white rounded-lg overflow-hidden border border-[#d8d1c4] hover:border-[#b8252c] transition-colors h-full">
                  {item.image && (
                    <div className="relative h-48 bg-[#ebe6dd]">
                      <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-serif text-lg font-medium text-[#141414]">{item.title}</h4>
                        {item.location && (
                          <div className="flex items-center gap-1 text-sm text-[#6b6660] mt-1">
                            <MapPin size={14} />
                            {item.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#d8d1c4]">
                      {item.price && (
                        <div className="flex items-center gap-1 text-[#b8252c] font-semibold">
                          <DollarSign size={14} />
                          {item.price}
                        </div>
                      )}
                      {item.size && (
                        <div className="flex items-center gap-1 text-sm text-[#2a2a2a]">
                          <Maximize2 size={14} />
                          {item.size}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {type === 'parks' && (
                <div className="bg-white rounded-lg overflow-hidden border border-[#d8d1c4] hover:border-[#b8252c] transition-colors p-6 h-full flex flex-col">
                  {item.image && (
                    <div className="relative h-40 bg-[#ebe6dd] rounded mb-4 -mx-6 -mt-6 mb-4">
                      <Image src={item.image} alt={item.title} fill className="object-cover rounded-t" />
                    </div>
                  )}
                  <h4 className="font-serif text-xl font-medium text-[#141414] mb-2">{item.title}</h4>
                  {item.location && <p className="text-sm text-[#6b6660] mb-3">{item.location}</p>}
                  {item.subtitle && <p className="text-sm font-semibold text-[#2a2a2a]">{item.subtitle}</p>}
                </div>
              )}

              {type === 'logos' && (
                <div className="bg-white rounded-lg border border-[#d8d1c4] hover:border-[#b8252c] transition-colors p-8 flex items-center justify-center h-40 group-hover:bg-[#f4f1ec]">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} width={120} height={60} className="max-h-16 w-auto" />
                  ) : (
                    <div className="text-center">
                      <div className="font-semibold text-[#2a2a2a] text-lg">{item.title}</div>
                      {item.subtitle && <p className="text-xs text-[#6b6660] mt-1">{item.subtitle}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-2 border border-[#d8d1c4] rounded-lg hover:bg-[#b8252c] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="p-2 border border-[#d8d1c4] rounded-lg hover:bg-[#b8252c] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="text-sm text-[#6b6660]">
            {currentIndex + 1} — {Math.ceil(items.length / itemsPerPage)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function IndustriasPage() {
  // Datos de ejemplo - reemplazar con datos reales
  const propiedadesIndustriales: CarouselItem[] = [
    {
      id: '1',
      title: 'Nave Industrial Ruta 6',
      location: 'Campana, Buenos Aires',
      price: 'USD 5.50/m² mes',
      size: '2,500 m²',
      image: '/images/nave-1.jpg',
    },
    {
      id: '2',
      title: 'Lote en CLIP Zárate',
      location: 'Zárate, Buenos Aires',
      price: 'USD 45,000',
      size: '5,000 m²',
      image: '/images/lote-1.jpg',
    },
    {
      id: '3',
      title: 'Centro Logístico Pilar',
      location: 'Pilar, Buenos Aires',
      price: 'USD 6.80/m² mes',
      size: '3,200 m²',
      image: '/images/centro-1.jpg',
    },
    {
      id: '4',
      title: 'Nave Categoría AAA',
      location: 'Escobar, Buenos Aires',
      price: 'USD 7.50/m² mes',
      size: '1,800 m²',
      image: '/images/nave-2.jpg',
    },
  ];

  const parquesIndustriales: CarouselItem[] = [
    {
      id: '1',
      title: 'Ruta 6',
      location: 'Campana, Zárate',
      subtitle: 'Corredor industrial principal',
      image: '/images/parque-ruta6.jpg',
    },
    {
      id: '2',
      title: 'Los Libertadores',
      location: 'Pilar',
      subtitle: 'Parque industrial de categoría AAA',
      image: '/images/parque-libertadores.jpg',
    },
    {
      id: '3',
      title: 'CLIP Zárate',
      location: 'Zárate',
      subtitle: 'Centro logístico industrial',
      image: '/images/parque-clip.jpg',
    },
    {
      id: '4',
      title: 'Plaza Industrial Pilar',
      location: 'Pilar',
      subtitle: 'Emprendimiento de categoría 2',
      image: '/images/parque-plaza-pilar.jpg',
    },
  ];

  const empresasLogos: CarouselItem[] = [
    { id: '1', title: 'Seventeen', subtitle: 'Cortinas y accesorios', image: '/logos/seventeen.png' },
    { id: '2', title: 'Polo Industrial', subtitle: 'Logística', image: '/logos/polo.png' },
    { id: '3', title: 'Tecnometal', subtitle: 'Metalmecánica', image: '/logos/tecnometal.png' },
    { id: '4', title: 'Frigorífico R.', subtitle: 'Alimentos', image: '/logos/frigorifico.png' },
    { id: '5', title: 'Logística AZ', subtitle: 'Transporte', image: '/logos/logistica-az.png' },
    { id: '6', title: 'Aceros del Norte', subtitle: 'Siderurgia', image: '/logos/aceros.png' },
    { id: '7', title: 'Distribuidora P.', subtitle: 'Distribución', image: '/logos/distrib.png' },
    { id: '8', title: 'Plásticos LV', subtitle: 'Plástica', image: '/logos/plasticos.png' },
  ];

  return (
    <>
      
      {/* TOP STRIP */}
      <div className="bg-[#141414] text-[#d6cfb9] text-xs tracking-wide py-2 px-8 mt-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 flex-wrap">
          <div>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full shadow-lg shadow-green-400"></span>
              Búsqueda de propiedades industriales sin costo adicional
            </span>
          </div>
          <a href="tel:+5493489517998" className="text-[#f4f1ec] hover:text-white transition-colors">
            +54 9 3489 517-998
          </a>
        </div>
      </div>

      <main>
        {/* ============================================================
             HERO SECTION
        ============================================================ */}
        <section className="relative py-20 border-b border-[#d8d1c4] overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-25 pointer-events-none" style={{
            backgroundImage: `linear-gradient(#d8d1c4 1px, transparent 1px), linear-gradient(90deg, #d8d1c4 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}></div>

          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
              {/* Left Column */}
              <div>
                <div className="inline-flex items-center gap-2.5 border border-[#c2b9a6] bg-[#fdfcf9] px-3.5 py-1.5 rounded-full mb-7">
                  <div className="w-1.5 h-1.5 bg-[#b8252c] rounded-full"></div>
                  <span className="font-mono text-xs tracking-widest text-[#6b6660]">Zona Norte AMBA</span>
                </div>

                <h1 className="font-serif text-5xl lg:text-6xl font-medium text-[#141414] leading-tight mb-7 tracking-tight">
                  Naves y lotes industriales <em className="italic font-normal text-[#b8252c]">en la mejor ubicación</em>
                </h1>

                <p className="text-lg text-[#2a2a2a] max-w-md mb-8 leading-relaxed">
                  Campana, Pilar, Escobar, Zárate. Búsqueda personalizada, sin costo, con el respaldo de 60 años en real estate industrial.
                </p>

                <div className="flex gap-4 flex-wrap">
                  <a href="#propiedades" className="inline-flex items-center gap-2 bg-[#141414] text-[#f4f1ec] px-6 py-3 rounded-lg font-medium hover:bg-[#b8252c] transition-colors">
                    Ver propiedades <span>→</span>
                  </a>
                  <a href="#formulario" className="inline-flex items-center gap-2 border border-[#d8d1c4] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#ebe6dd] transition-colors">
                    Consultar ahora
                  </a>
                </div>
              </div>

              {/* Right Column - Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-[#d8d1c4]">
                  <div className="font-serif text-4xl font-bold text-[#b8252c] mb-2">60+</div>
                  <p className="text-sm text-[#6b6660]">Años en real estate industrial</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-[#d8d1c4]">
                  <div className="font-serif text-4xl font-bold text-[#b8252c] mb-2">500+</div>
                  <p className="text-sm text-[#6b6660]">Operaciones cerradas</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-[#d8d1c4]">
                  <div className="font-serif text-4xl font-bold text-[#b8252c] mb-2">8-10</div>
                  <p className="text-sm text-[#6b6660]">Días para presentar opciones</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-[#d8d1c4]">
                  <div className="font-serif text-4xl font-bold text-[#b8252c] mb-2">0%</div>
                  <p className="text-sm text-[#6b6660]">Costo de búsqueda</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
             PROPIEDADES DESTACADAS - CAROUSEL
        ============================================================ */}
        <section id="propiedades" className="py-20 border-b border-[#d8d1c4]">
          <div className="max-w-7xl mx-auto px-8">
            <Carousel 
              items={propiedadesIndustriales}
              type="properties"
              title="01 · Propiedades disponibles"
              subtitle="Opciones reales en Zona Norte"
            />
          </div>
        </section>

        {/* ============================================================
             PARQUES INDUSTRIALES - CAROUSEL
        ============================================================ */}
        <section id="parques" className="py-20 border-b border-[#d8d1c4]">
          <div className="max-w-7xl mx-auto px-8">
            <Carousel 
              items={parquesIndustriales}
              type="parks"
              title="02 · Parques industriales"
              subtitle="Emprendimientos destacados en Zona Norte"
            />
          </div>
        </section>

        {/* ============================================================
             HOW WE WORK
        ============================================================ */}
        <section id="como" className="py-20 border-b border-[#d8d1c4]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-16">
              <span className="font-mono text-xs tracking-widest text-[#6b6660] uppercase">03 · Cómo trabajamos</span>
              <h2 className="font-serif text-4xl font-medium text-[#141414] mt-3 leading-tight">
                Un proceso enfocado en <em className="italic font-normal text-[#b8252c]">su decisión</em>, no en cerrar operaciones.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  num: '01',
                  title: 'Entendemos su operación',
                  desc: 'Tipo de industria, logística, ampliaciones previstas, equipamiento, requerimientos eléctricos, normativa aplicable. Antes de mostrar opciones queremos conocer su negocio.',
                },
                {
                  num: '02',
                  title: 'Relevamos opciones reales',
                  desc: 'Comparamos superficies disponibles, valores, beneficios impositivos, servicios e infraestructura entre varios parques y ubicaciones.',
                },
                {
                  num: '03',
                  title: 'Acompañamos hasta la radicación',
                  desc: 'Visitas coordinadas, negociación con desarrolladores, vinculación con constructoras. Honorarios habituales, solo al cierre.',
                },
              ].map((step) => (
                <div key={step.num} className="bg-white p-8 rounded-lg border border-[#d8d1c4] hover:border-[#b8252c] transition-colors">
                  <span className="font-mono text-xs tracking-widest text-[#b8252c] font-semibold">PASO {step.num}</span>
                  <h4 className="font-serif text-lg font-medium text-[#141414] mt-3 mb-3">{step.title}</h4>
                  <p className="text-sm text-[#6b6660] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
             TESTIMONIAL / CASOS
        ============================================================ */}
        <section id="casos" className="py-20 border-b border-[#d8d1c4] bg-[#ebe6dd]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <span className="font-mono text-xs tracking-widest text-[#6b6660] uppercase">04 · Casos</span>
                <h2 className="font-serif text-3xl font-medium text-[#141414] mt-3 leading-tight">
                  Casos reales de empresas que radicamos.
                </h2>
                <p className="text-sm text-[#6b6660] mt-4 leading-relaxed">
                  Trabajamos con pymes en crecimiento, industrias consolidadas y operadores logísticos. Esta es una de las operaciones cerradas en 2023.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-[#d8d1c4]">
                <blockquote className="font-serif text-lg italic text-[#2a2a2a] mb-6 leading-relaxed">
                  "Cuando contactamos a CADEMA estábamos sin lugar donde expandirnos. En dos meses de visitas y reuniones pudimos comprar un terreno en Ruta 6 y hoy estamos terminando la nave a estrenar."
                </blockquote>
                <div className="border-t border-[#d8d1c4] pt-6">
                  <div className="font-semibold text-[#141414]">SEVENTEEN SRL</div>
                  <p className="text-sm text-[#6b6660] mt-1">Fabricación de cortinas y accesorios · Localidad de Munro</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <div className="font-mono text-xs text-[#6b6660] tracking-widest uppercase mb-1">Operación</div>
                      <div className="font-semibold text-[#141414]">Compra de lote</div>
                    </div>
                    <div>
                      <div className="font-mono text-xs text-[#6b6660] tracking-widest uppercase mb-1">Tiempo a cierre</div>
                      <div className="font-semibold text-[#141414]">8 semanas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
             LOGOS / EMPRESAS - CAROUSEL
        ============================================================ */}
        <section className="py-20 border-b border-[#d8d1c4]">
          <div className="max-w-7xl mx-auto px-8">
            <Carousel 
              items={empresasLogos}
              type="logos"
              title="05 · Confían en nosotros"
              subtitle="Empresas que radicamos en Zona Norte"
            />
          </div>
        </section>

        {/* ============================================================
             FAQ
        ============================================================ */}
        <section id="faq" className="py-20 border-b border-[#d8d1c4]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-16">
              <span className="font-mono text-xs tracking-widest text-[#6b6660] uppercase">06 · Consultas frecuentes</span>
              <h2 className="font-serif text-4xl font-medium text-[#141414] mt-3 leading-tight">
                Todo lo que <em className="italic font-normal text-[#b8252c]">conviene saber</em> antes de radicar.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  q: '¿Cuánto cuesta alquilar una nave industrial en Zona Norte?',
                  a: 'El valor de alquiler oscila entre USD 4,50 y USD 7,50 por m² mensual según ubicación, categoría del parque, antigüedad y servicios. En parques AAA con docks y oficinas el rango sube.',
                },
                {
                  q: '¿Qué diferencia hay entre las categorías 1, 2 y 3?',
                  a: 'La categoría define qué actividades se pueden radicar. Cat. 1 admite industrias inocuas, Cat. 2 incómodas y Cat. 3 peligrosas. Verificar es clave antes de comprometerse.',
                },
                {
                  q: '¿Conviene comprar un lote o alquilar una nave?',
                  a: 'Depende del horizonte. Si la operación tiene más de 5 años proyectados y capital disponible, comprar lote suele ser más eficiente. Para entrar en operaciones, alquiler es más rápido.',
                },
                {
                  q: '¿Tienen propiedades fuera de parques industriales?',
                  a: 'Sí, también trabajamos naves y galpones independientes en zonas industriales tradicionales. La diferencia está en la habilitación y el costo operativo.',
                },
                {
                  q: '¿Qué beneficios fiscales ofrecen los parques industriales?',
                  a: 'Varían por jurisdicción. Algunos parques ofrecen exenciones de Ingresos Brutos, descuentos en tasas municipales. Le proveemos el detalle por parque.',
                },
                {
                  q: '¿Cómo cobran sus honorarios?',
                  a: 'Los honorarios son los habituales del sector inmobiliario industrial y se abonan únicamente al cierre. No hay costo por la búsqueda ni por las visitas.',
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg border border-[#d8d1c4]">
                  <h5 className="font-semibold text-[#141414] mb-3">{item.q}</h5>
                  <p className="text-sm text-[#6b6660] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
             FINAL CTA SECTION
        ============================================================ */}
        <section className="py-20 bg-gradient-to-r from-[#141414] to-[#2a2a2a] text-white border-b border-[#141414]">
          <div className="max-w-7xl mx-auto px-8">
            <span className="font-mono text-xs tracking-widest uppercase opacity-70 block mb-6">07 · Empecemos</span>
            <h2 className="font-serif text-5xl font-medium leading-tight mb-4">
              Su <em className="italic font-normal text-[#d97e2f]">próxima planta</em> ya está disponible.
            </h2>
            <p className="text-lg text-gray-300 max-w-xl mb-8">
              Cuéntenos qué necesita su empresa y le respondemos con opciones concretas el mismo día.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="#formulario" className="inline-flex items-center gap-2 bg-white text-[#141414] px-6 py-3 rounded-lg font-semibold hover:bg-[#d97e2f] hover:text-white transition-colors">
                Completar formulario <span>→</span>
              </a>
              <a href="https://api.whatsapp.com/send/?phone=5493489517998" className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#141414] transition-colors">
                WhatsApp directo
              </a>
              <a href="tel:+5493489517998" className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#141414] transition-colors">
                +54 9 3489 517-998
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================
             FORMULARIO
             TODO: Si tienes un componente separado, importa aquí
        ============================================================ */}
        <section id="formulario" className="py-20 bg-[#f4f1ec] border-b border-[#d8d1c4]">
          <div className="max-w-2xl mx-auto px-8">
            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest text-[#6b6660] uppercase">Consulta personalizada</span>
              <h2 className="font-serif text-4xl font-medium text-[#141414] mt-3 leading-tight">
                Cuéntenos qué necesita
              </h2>
            </div>
            
            {/* 
              TODO: Importa tu componente del formulario aquí
              Ejemplo:
              import FormularioBusquedaIndustrial from '@/app/components/FormularioBusquedaIndustrial';
              
              Luego reemplaza esto por:
              <FormularioBusquedaIndustrial />
            */}
            <div className="bg-white p-8 rounded-lg border border-[#d8d1c4] text-center text-[#6b6660]">
              <p className="mb-4">Formulario de búsqueda industrial irá aquí</p>
              <p className="text-sm">Importa tu componente FormularioBusquedaIndustrial y reemplaza este div</p>
            </div>
          </div>
        </section>
      </main>

      
    </>
  );
}