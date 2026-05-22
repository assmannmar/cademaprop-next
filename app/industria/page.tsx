'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PropiedadesIndustrialesCarousel, EmprendimientosIndustrialesCarousel } from '@/app/components/IndustriasCarousels';

// ============================================================
// ICONS - SVG inline
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
// TYPES
// ============================================================
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
  publication_title?: string;
  photos?: Array<{ image: string }>;
  location?: { name: string };
  type?: { name: string };
  description?: string;
  web_url?: string;
}

// ============================================================
// CAROUSEL COMPONENT - Genérico reutilizable (para logos)
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
  const [propiedadesIndustriales, setPropiedadesIndustriales] = useState<Property[]>([]);
  const [emprendimientosIndustriales, setEmprendimientosIndustriales] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);

  // Datos de logos - hardcodeados
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

  // Fetch datos de la API
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const load = async () => {
      try {
        const [propRes, devRes] = await Promise.allSettled([
          fetch('/api/properties'),
          fetch('/api/developments'),
        ]);

        // Filtrar propiedades industriales
        if (propRes.status === 'fulfilled' && propRes.value.ok) {
          const propData = await propRes.value.json();
          const industriales = propData.objects?.filter(
            (p: Property) => 
              p.type?.name?.toLowerCase().includes('industrial') ||
              p.custom_tags?.some(tag => tag.name?.toLowerCase().includes('industrial'))
          ) || [];
          setPropiedadesIndustriales(industriales.slice(0, 12));
        }

        // Filtrar emprendimientos industriales
        if (devRes.status === 'fulfilled' && devRes.value.ok) {
          const devData = await devRes.value.json();
          const industriales = devData.objects?.filter(
            (d: Development) => 
              d.type?.name?.toLowerCase().includes('industrial') ||
              d.description?.toLowerCase().includes('industrial')
          ) || [];
          setEmprendimientosIndustriales(industriales.slice(0, 12));
        }

      } catch (err) {
        console.error('❌ Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* TOP STRIP
      <div className="bg-[#141414] text-[#d6cfb9] text-xs tracking-wide py-2 px-8 mt-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 flex-wrap">
          <div>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full shadow-lg shadow-green-400"></span>
              Búsqueda de propiedades industriales sin costo adicional
            </span>
          </div>
          <a href="tel:+5493489517998" className="text-[#f4f1ec] hover:text-white transition-colors">
            +54 9 3489 517998
          </a>
        </div>
      </div> */}

      <main className="pt-20">
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
             PROPIEDADES INDUSTRIALES - CAROUSEL (API)
        ============================================================ */}
        <section id="propiedades" className="py-20 border-b border-[#d8d1c4]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest text-[#6b6660] uppercase">01 · Propiedades disponibles</span>
              <h2 className="font-serif text-4xl font-medium text-[#141414] mt-3 leading-tight">Opciones reales en Zona Norte</h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#b8252c]"></div>
              </div>
            ) : propiedadesIndustriales.length > 0 ? (
              <PropiedadesIndustrialesCarousel propiedades={propiedadesIndustriales} />
            ) : (
              <p className="text-center text-gray-500">No hay propiedades industriales disponibles en este momento</p>
            )}
          </div>
        </section>

        {/* ============================================================
             EMPRENDIMIENTOS INDUSTRIALES - CAROUSEL (API)
        ============================================================ */}
        <section id="parques" className="py-20 border-b border-[#d8d1c4]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest text-[#6b6660] uppercase">02 · Parques industriales</span>
              <h2 className="font-serif text-4xl font-medium text-[#141414] mt-3 leading-tight">Emprendimientos destacados en Zona Norte</h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#b8252c]"></div>
              </div>
            ) : emprendimientosIndustriales.length > 0 ? (
              <EmprendimientosIndustrialesCarousel emprendimientos={emprendimientosIndustriales} />
            ) : (
              <p className="text-center text-gray-500">No hay emprendimientos industriales disponibles en este momento</p>
            )}
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
        ============================================================ */}
        <section id="formulario" className="py-20 bg-[#f4f1ec] border-b border-[#d8d1c4]">
          <div className="max-w-2xl mx-auto px-8">
            <div className="mb-12">
              <span className="font-mono text-xs tracking-widest text-[#6b6660] uppercase">Consulta personalizada</span>
              <h2 className="font-serif text-4xl font-medium text-[#141414] mt-3 leading-tight">
                Cuéntenos qué necesita
              </h2>
            </div>
            
            {/* TODO: Importa tu componente del formulario aquí */}
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