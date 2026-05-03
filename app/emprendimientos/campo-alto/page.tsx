'use client';

import { useState, useEffect } from 'react';
import VentuxForm from "@/app/emprendimientos/campo-alto/Form-campo-alto";

// Paleta: verde campo oscuro + crema cálido
const C = {
  primary: '#2B5E2A',
  bg: '#EDE9DF',
  white: '#FFFFFF',
};

interface Development {
  id: number;
  name?: string;
  publication_title?: string;
  description?: string;
  rich_description?: string;
  photos?: Array<{
    image: string;
    is_blueprint?: boolean;
  }>;
  videos?: Array<{
    player_url: string;
    title?: string;
  }>;
  location?: {
    name: string;
    full_location?: string;
  };
  geo_lat?: string;
  geo_long?: string;
  tags?: Array<{ name: string }>;
  custom_tags?: Array<{ name: string }>;
}

export default function CampoAltoPage() {
  const EMPRENDIMIENTO_ID = 61960;

  const [development, setDevelopment] = useState<Development | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const datosLocales = {
    descripcionExtra: `Para quienes buscan vivir en armonía con la naturaleza, para los que disfrutan del aire puro y los atardeceres sobre el campo abierto, para quienes quieren espacio, silencio y la tranquilidad de saber que llegaron al lugar que siempre imaginaron.`,

    caracteristicas: [
      { img: "/emprendimientos/img/house.png", titulo: "Lotes desde 600m²", descripcion: "Espacios generosos para construir tu hogar ideal" },
      { img: "/emprendimientos/img/energy.png", titulo: "Todos los servicios", descripcion: "Agua, luz, gas, cloacas e internet" },
      { img: "/emprendimientos/img/sea.png", titulo: "Espacios verdes", descripcion: "Más del 35% del predio reservado a parques y plazas" },
      { img: "/emprendimientos/img/ancla.png", titulo: "Seguridad 24hs", descripcion: "Acceso controlado y vigilancia permanente" },
      { img: "/emprendimientos/img/barco.png", titulo: "Amenities", descripcion: "SUM, parrillas comunitarias y área deportiva" },
    ],

    faqs: [
      {
        pregunta: "¿Cuáles son las dimensiones de los lotes?",
        respuesta: "Contamos con lotes desde 600m² hasta 1.200m², todos con escritura y servicios incluidos."
      },
      {
        pregunta: "¿Qué servicios incluye el barrio?",
        respuesta: "Agua corriente, energía eléctrica, gas natural, cloacas, internet fibra óptica, alumbrado público, acceso asfaltado y seguridad 24hs."
      },
      {
        pregunta: "¿Cuáles son las opciones de financiamiento?",
        respuesta: "Ofrecemos planes de financiación en pesos y dólares, con cuotas fijas de hasta 60 meses. Consultanos por las condiciones vigentes."
      },
      {
        pregunta: "¿Se puede visitar el proyecto?",
        respuesta: "Sí, realizamos visitas guiadas de martes a domingo con turno previo. Escribinos y coordinamos tu recorrido sin cargo."
      },
      {
        pregunta: "¿En qué etapa se encuentra el proyecto?",
        respuesta: "Campo Alto ya cuenta con calles delimitadas, infraestructura de servicios en avance y obra en desarrollo. Podés conocer el estado actual en el plano interactivo."
      }
    ],

    testimonios: [
      {
        texto: "Siempre quise criar a mis hijos en contacto con la naturaleza sin alejarme de la ciudad. Campo Alto fue la respuesta perfecta.",
        autor: "Sebastián M., propietario"
      },
      {
        texto: "El proceso de compra fue muy claro y el equipo de Cadema nos acompañó en todo momento. Ya estamos proyectando la casa.",
        autor: "Valeria G., propietaria"
      }
    ],

    whatsapp: "5491112345678",
  };

  useEffect(() => {
    fetchDevelopment();
  }, []);

  const fetchDevelopment = async () => {
    try {
      const response = await fetch('/api/developments');
      if (!response.ok) throw new Error('Error al cargar datos');
      const data = await response.json();
      const found = data.objects.find((d: Development) => d.id === EMPRENDIMIENTO_ID);
      if (found) setDevelopment(found);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.bg }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4" style={{ borderColor: C.primary }}></div>
          <p className="mt-4 text-xl" style={{ color: C.primary }}>Cargando...</p>
        </div>
      </div>
    );
  }

  const nombre = development?.name || development?.publication_title || 'Campo Alto';
  const ubicacion = development?.location?.full_location || development?.location?.name || 'Zárate, Buenos Aires';
  const descripcionTokko = development?.rich_description || development?.description || '';
  const fotos = development?.photos?.filter(p => !p.is_blueprint) || [];
  const videos = development?.videos || [];

  return (
    <div style={{ fontFamily: "'Nexa', sans-serif", backgroundColor: C.bg }}>

      {/* ── HERO ── */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {fotos.length > 0 && (
          <div className="absolute inset-0">
            <img
              src={fotos[0].image}
              alt={nombre}
              className="w-full h-full object-cover opacity-45"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.15), rgba(0,0,0,0.55))' }}
            />
          </div>
        )}

        <div className="relative z-10 text-center px-4 animate-fade-in">
          <img
            src="/logos/header-campo-alto.png"
            alt={nombre}
            className="mx-auto w-full max-w-2xl md:max-w-4xl h-auto drop-shadow-2xl mb-6"
          />
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8" style={{ color: C.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </header>

      {/* ── QUOTE ── */}
      <section className="py-20 px-4 flex justify-end" style={{ backgroundColor: C.bg }}>
        <div className="max-w-4xl w-full text-right">
          <blockquote
            className="text-2xl md:text-3xl leading-relaxed italic mb-6 pl-5"
            style={{ color: C.primary, borderLeft: `4px solid ${C.primary}` }}
          >
            "{datosLocales.descripcionExtra}"
          </blockquote>
          <footer className="text-xl font-semibold mr-10" style={{ color: '#000' }}>
            — creamos CAMPO ALTO
          </footer>
        </div>
      </section>

      {/* ── PARALLAX + BROCHURE ── */}
      {fotos.length > 1 && (
        <section
          className="relative h-96 flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `url(${fotos[1].image})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(43, 94, 42, 0.62)` }} />
          <div className="relative z-10 text-center">
            <a
              href="/emprendimientos/brochure/brochure-campo-alto.pdf"
              download="Brochure-Campo-Alto.pdf"
              className="px-10 py-4 font-bold text-lg rounded-full shadow-2xl transition-all transform hover:scale-105 hover:bg-white flex items-center gap-3 inline-flex"
              style={{ backgroundColor: C.bg, color: C.primary }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar Brochure
            </a>
          </div>
        </section>
      )}

      {/* ── DESCRIPCIÓN ── */}
      <section className="py-20 animate-fade-in" style={{ backgroundColor: C.primary }}>
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12" style={{ color: C.bg }}>
            Campo Alto: Vivir en la naturaleza sin renunciar a nada
          </h2>

          <div className="space-y-6 text-lg md:text-xl leading-relaxed" style={{ color: C.bg }}>
            <p>
              Campo Alto es un desarrollo residencial ubicado en Zárate, Buenos Aires, concebido para quienes eligen una vida más plena, en contacto con el campo y el paisaje bonaerense.
            </p>
            <p>
              Con lotes desde <span className="font-bold">600m²</span> diseñados con criterio urbanístico moderno, amplias áreas verdes y una infraestructura completa, Campo Alto garantiza confort, seguridad y tranquilidad a metros de la ciudad.
            </p>
            {descripcionTokko && (
              <div
                className="prose prose-invert prose-lg max-w-none text-left mt-8"
                dangerouslySetInnerHTML={{ __html: descripcionTokko }}
              />
            )}
          </div>
        </div>
      </section>

      {/* ── CARACTERÍSTICAS ── */}
      <section className="py-20 animate-fade-in" style={{ backgroundColor: C.bg }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: C.primary }}>
            Todo lo que necesitás
          </h2>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {datosLocales.caracteristicas.map((car, idx) => (
              <div key={idx} className="flex flex-col items-center text-center w-56 p-4 transition-all hover:scale-105">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <img src={car.img} alt={car.titulo} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: C.primary }}>
                  {car.titulo}
                </h3>
                <p className="text-base text-gray-700">{car.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERÍA ── */}
      {fotos.length > 0 && (
        <section className="py-20" style={{ backgroundColor: C.white }}>
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-16" style={{ color: C.primary }}>
              Galería
            </h2>

            {/* Imagen principal */}
            <div className="max-w-5xl mx-auto">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-6">
                <img
                  src={fotos[selectedImage].image}
                  alt={`${nombre} - ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                />
                {fotos.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => prev === 0 ? fotos.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition"
                      style={{ color: C.primary }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev === fotos.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition"
                      style={{ color: C.primary }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm">
                  {selectedImage + 1} / {fotos.length}
                </div>
              </div>

              {/* Thumbnails */}
              {fotos.length > 1 && (
                <div className="flex gap-3 justify-center overflow-x-auto pb-2">
                  {fotos.map((foto, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition ${
                        selectedImage === idx ? 'ring-2 opacity-100' : 'opacity-50 hover:opacity-80'
                      }`}
                      style={selectedImage === idx ? { outline: `2px solid ${C.primary}` } : {}}
                    >
                      <img src={foto.image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="py-20" style={{ backgroundColor: C.bg }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-5xl font-bold text-center mb-16" style={{ color: C.primary }}>
            Preguntas Frecuentes
          </h2>

          <div className="space-y-4">
            {datosLocales.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-lg overflow-hidden"
                style={{ backgroundColor: C.white, borderBottom: '1px solid #ddd' }}
              >
                <button
                  onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="text-xl font-semibold pr-8" style={{ color: C.primary }}>
                    {faq.pregunta}
                  </span>
                  <svg
                    className={`w-6 h-6 flex-shrink-0 transition-transform ${activeAccordion === idx ? 'rotate-180' : ''}`}
                    style={{ color: C.primary }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === idx ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-6 pb-5 text-lg" style={{ color: '#333' }}>
                    {faq.respuesta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="py-20" style={{ backgroundColor: C.white }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-5xl font-bold text-center mb-16" style={{ color: C.primary }}>
            Familias que ya eligieron Campo Alto
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {datosLocales.testimonios.map((test, idx) => (
              <div
                key={idx}
                className="p-8 rounded-lg shadow-md"
                style={{ backgroundColor: C.white, borderLeft: `5px solid ${C.primary}` }}
              >
                <blockquote className="text-xl italic mb-4" style={{ color: '#333' }}>
                  "{test.texto}"
                </blockquote>
                <cite className="font-semibold not-italic" style={{ color: '#777' }}>
                  {test.autor}
                </cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEOS ── */}
      {videos.length > 0 && (
        <section className="py-20" style={{ backgroundColor: C.bg }}>
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-16" style={{ color: C.primary }}>
              Recorrido Virtual
            </h2>
            <div className="max-w-5xl mx-auto space-y-8">
              {videos.map((video, idx) => (
                <div key={idx} className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    src={video.player_url}
                    className="w-full h-full"
                    allowFullScreen
                    title={video.title || `Video ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MAPA ── */}
      {development?.geo_lat && development?.geo_long && (
        <section className="py-20" style={{ backgroundColor: C.white }}>
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-16" style={{ color: C.primary }}>
              Ubicación
            </h2>
            <div className="max-w-5xl mx-auto">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${development.geo_lat},${development.geo_long}&z=15&output=embed`}
                  allowFullScreen
                />
              </div>
              <p className="text-center mt-8 text-xl flex items-center justify-center gap-2" style={{ color: C.primary }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {ubicacion}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── PLANO INTERACTIVO ── */}
      <section className="py-24" style={{ backgroundColor: C.bg }}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-5xl font-bold mb-4" style={{ color: C.primary }}>
              Explorá el Plano Interactivo
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#555' }}>
              Descubrí la distribución del barrio, visualizá los lotes disponibles y conocé cada sector del proyecto.
            </p>
          </div>

          <a
            href="/emprendimientos/campo-alto/estadolotes.html"
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative overflow-hidden rounded-3xl shadow-2xl"
          >
            <img
              src="/emprendimientos/campo-alto/campo-alto-masterplan.jpg"
              alt="Plano interactivo de Campo Alto"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div
                className="px-8 py-4 rounded-full text-lg md:text-xl font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                style={{ backgroundColor: C.bg, color: C.primary }}
              >
                Ingresar al plano interactivo
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ── FORMULARIO ── */}
      <section className="py-16" style={{ backgroundColor: C.white }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: C.primary }}>
              Solicitá más información
            </h2>
            <p className="text-xl text-gray-600">
              Completá el formulario y te contactaremos a la brevedad
            </p>
          </div>
          <VentuxForm />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-8">

            <div className="flex items-center gap-12">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-3">Comercializa</p>
                <div className="text-white font-semibold text-lg">Cadema Bienes Raíces</div>
              </div>
            </div>

            <div className="flex gap-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 hover:bg-green-700 rounded-full flex items-center justify-center text-white transition transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 hover:bg-green-700 rounded-full flex items-center justify-center text-white transition transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={`https://wa.me/${datosLocales.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 hover:bg-green-700 rounded-full flex items-center justify-center text-white transition transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>

            <p className="text-gray-400 text-sm">
              &copy; 2025 {nombre}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
