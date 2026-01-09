'use client';

import { useState, useEffect } from 'react';
import './islas-barrios-nauticos.css';
import VentuxForm from "@/app/emprendimientos/islas-barrios-nauticos/Form-islas";

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

export default function IslasPage() {
  const EMPRENDIMIENTO_ID = 55491;

  const [development, setDevelopment] = useState<Development | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [showNavbar, setShowNavbar] = useState(false);

  const datosLocales = {
    subtitulo: "Tu lugar en Zárate",
    descripcionExtra: `Para quienes aman vivir en contacto con la naturaleza, para los que disfrutan de los deportes acuáticos y las tardes con amigos, para los que encuentran tranquilidad en el sonido de los pájaros, para los navegantes, soñadores despiertos, incansables buscadores de una vida mejor.`,
    
    caracteristicas: [
      { icon: "📏", titulo: "Lotes desde 500m²", descripcion: "Amplios espacios para tu proyecto" },
      { icon: "💡", titulo: "Todos los servicios", descripcion: "Agua, luz, gas, cloacas" },
      { icon: "🏞️", titulo: "Espacios verdes", descripcion: "Más del 40% de área verde" },
      { icon: "🔒", titulo: "Seguridad 24hs", descripcion: "Vigilancia permanente" },
      { icon: "🏊", titulo: "Amenities", descripcion: "Pileta, quincho, juegos" },
    ],

    faqs: [
      {
        pregunta: "¿Cuáles son las dimensiones de los lotes?",
        respuesta: "Contamos con lotes desde 500m² hasta 1000m², todos con servicios incluidos."
      },
      {
        pregunta: "¿Qué servicios incluye el barrio?",
        respuesta: "Incluye agua corriente, energía eléctrica, gas natural, cloacas, internet fibra óptica, seguridad 24hs y espacios verdes."
      },
      {
        pregunta: "¿Cuáles son las opciones de financiamiento?",
        respuesta: "Ofrecemos planes de financiación flexibles con hasta 60 cuotas sin interés, dependiendo del lote."
      },
      {
        pregunta: "¿Se puede visitar el proyecto?",
        respuesta: "Sí, realizamos visitas guiadas con cita previa. Contactanos para agendar tu visita."
      }
    ],

    testimonios: [
      {
        texto: "Desde que conocí Islas, supe que era el lugar ideal para desconectarme sin irme tan lejos. La naturaleza, los canales y la tranquilidad son inigualables.",
        autor: "María S., propietaria"
      },
      {
        texto: "La experiencia náutica es increíble, y tener la lancha en mi propia amarra es un lujo que jamás imaginé que podía permitirme.",
        autor: "Carlos R., propietario"
      }
    ],

    whatsapp: "5491112345678",
  };

  useEffect(() => {
    fetchDevelopment();
    
    const handleScroll = () => {
      setShowNavbar(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E4E4E4' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4" style={{ borderColor: '#2F52A0' }}></div>
          <p className="mt-4 text-xl" style={{ color: '#2F52A0' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  const nombre = development?.name || development?.publication_title || 'Islas Barrios Náuticos';
  const ubicacion = development?.location?.full_location || development?.location?.name || 'Villa Paranacito, Entre Ríos';
  const descripcionTokko = development?.rich_description || development?.description || '';
  const fotos = development?.photos?.filter(p => !p.is_blueprint) || [];
  const videos = development?.videos || [];

  return (
    <div style={{ fontFamily: "'Nexa', sans-serif", backgroundColor: '#E4E4E4' }}>
      

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {fotos.length > 0 && (
          <div className="absolute inset-0">
            <img
              src={fotos[0].image}
              alt={nombre}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5))'}}></div>
          </div>
        )}
        
        {/* <div className="absolute top-5 left-10 z-10">
          <img src="/logo/header-islas.png" alt={nombre} style={{ width: '120px' }} />
        </div> */}
        
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <img 
            src="/logos/header-islas.png"
            alt={nombre}
            className="mx-auto w-full max-w-2xl md:max-w-4xl h-auto drop-shadow-2xl mb-6"
          />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8" style={{ color: '#2F52A0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </header>

      {/* Quote Section */}
      <section className="py-20 px-4 flex justify-end" style={{ backgroundColor: '#E4E4E4' }}>
        <div className="max-w-4xl w-full text-right">
          <blockquote 
            className="text-2xl md:text-3xl leading-relaxed italic mb-6 pl-5"
            style={{ 
              color: '#2F52A0',
              borderLeft: '4px solid #2F52A0'
            }}
          >
            "{datosLocales.descripcionExtra}"
          </blockquote>
          <footer className="text-xl font-semibold mr-10" style={{ color: '#000' }}>
            — creamos ISLAS, Barrios Náuticos
          </footer>
        </div>
      </section>

      {/* Parallax Section */}
        {fotos.length > 1 && (
        <section 
            className="relative h-96 flex items-center justify-center overflow-hidden"
            style={{
            backgroundImage: `url(${fotos[1].image})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
            }}
        >
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(47, 82, 160, 0.6)' }}></div>
            <div className="relative z-10 text-center">
            <a 
                href="/landings/brochure/brochure-islas.pdf" 
                download="Brochure-Islas-Barrios-Nauticos.pdf"
                className="px-10 py-4 font-bold text-lg rounded-full shadow-2xl transition-all transform hover:scale-105 hover:bg-white hover:text-[#2F52A0] flex items-center gap-3"
                style={{ 
                backgroundColor: '#E4E4E4', 
                color: '#2F52A0',
                display: 'inline-flex'
                }}
            >
                <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar Brochure
            </a>
            </div>
        </section>
        )}

      {/* Descripción detallada */}
        <section className="py-20 animate-fade-in" style={{ backgroundColor: '#2F52A0' }}>
        <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-12" style={{ color: '#E4E4E4' }}>
            Islas Barrios Náuticos: Un Estilo de Vida Único
            </h2>
            
            <div className="space-y-6 text-lg md:text-xl leading-relaxed" style={{ color: '#E4E4E4' }}>
            <p>
                Islas constituye un emprendimiento inmobiliario único ubicado en Islas del Ibicuy, Entre Ríos.
            </p>
            
            <p>
                Más de <span className="font-bold">300 hectáreas</span> situadas estratégicamente a pocos metros al bajar del puente Zárate-Brazo Largo, visible en una hermosa vista panorámica desde el mismo, y con acceso directo al río Paraná Guazú.
            </p>
            
            <p>
                Un desarrollo integral, un nuevo lugar de referencia en el Delta, concebido en un gran masterplan cuya primera etapa es el <span className="font-bold uppercase">Barrio ISLA VICTORIA</span>. Con 252 lotes cuidadosamente diseñados, con superficies que van desde los 450 m2 a los 1500 m2. Este rincón paradisíaco garantiza un entorno residencial exclusivo y sofisticado.
            </p>
            </div>

        </div>
        </section>

      {/* Sección de Beneficios (Un Paraíso Náutico) */}
        <section className="py-20 animate-fade-in" style={{ backgroundColor: '#E4E4E4' }}>
        <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#2F52A0' }}>
            Un Paraíso Náutico
            </h2>
            
            {/* Contenedor Flex con centrado automático */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            
            {/* Lotes con amarras */}
            <div className="flex flex-col items-center text-center w-64 p-4 transition-all hover:scale-105">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img src="/img/house.png" alt="Lotes" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2F52A0' }}>
                Lotes con amarras propias
                </h3>
                <p className="text-base text-gray-700">El río en el frente de tu casa.</p>
            </div>

            {/* Canales navegables */}
            <div className="flex flex-col items-center text-center w-64 p-4 transition-all hover:scale-105">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img src="/img/barco.png" alt="Barco" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2F52A0' }}>
                Canales navegables
                </h3>
                <p className="text-base text-gray-700">Con calados de 0,7 a 2,5 metros.</p>
            </div>

            {/* Guardería Náutica */}
            <div className="flex flex-col items-center text-center w-64 p-4 transition-all hover:scale-105">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img src="/img/ancla.png" alt="Ancla" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2F52A0' }}>
                Guardería Náutica
                </h3>
                <p className="text-base text-gray-700">SUM, playa y bajada náutica</p>
            </div>

            {/* Servicios subterráneos */}
            <div className="flex flex-col items-center text-center w-64 p-4 transition-all hover:scale-105">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img src="/img/energy.png" alt="Energía" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2F52A0' }}>
                Servicios subterráneos
                </h3>
                <p className="text-base text-gray-700">Cuidado paisajismo urbano y natural</p>
            </div>

            {/* Wakeboard & Paseos */}
            <div className="flex flex-col items-center text-center w-64 p-4 transition-all hover:scale-105">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img src="/img/sea.png" alt="Mar" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2F52A0' }}>
                Wakeboard & Paseos
                </h3>
                <p className="text-base text-gray-700">Disfrutá el río en el Meeting Point.</p>
            </div>

            </div>
        </div>
        </section>

      {/* Galería */}
      {fotos.length > 0 && (
        <section className="py-20" style={{ backgroundColor: '#fff' }}>
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-16" style={{ color: '#2F52A0' }}>
              Galería
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {fotos.slice(0, 4).map((foto, idx) => (
                <div 
                  key={idx}
                  className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer transform hover:scale-105 transition-all"
                  onClick={() => setSelectedImage(idx)}
                >
                  <img
                    src={foto.image}
                    alt={`${nombre} - ${idx + 1}`}
                    className="w-full h-96 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20" style={{ backgroundColor: '#E4E4E4' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-5xl font-bold text-center mb-16" style={{ color: '#2F52A0' }}>
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-4">
            {datosLocales.faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-lg overflow-hidden"
                style={{ backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}
              >
                <button
                  onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition"
                >
                  <span className="text-xl font-semibold pr-8" style={{ color: '#2F52A0' }}>
                    {faq.pregunta}
                  </span>
                  <svg 
                    className={`w-6 h-6 flex-shrink-0 transition-transform ${activeAccordion === idx ? 'rotate-180' : ''}`}
                    style={{ color: '#2F52A0' }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    activeAccordion === idx ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-lg" style={{ color: '#333' }}>
                    {faq.respuesta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20" style={{ backgroundColor: '#fff' }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-5xl font-bold text-center mb-16" style={{ color: '#2F52A0' }}>
            +70 familias ya eligieron Islas
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {datosLocales.testimonios.map((test, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-lg shadow-md"
                style={{ backgroundColor: '#fff', borderLeft: '5px solid #2F52A0' }}
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

      {/* Videos */}
      {videos.length > 0 && (
        <section className="py-20" style={{ backgroundColor: '#E4E4E4' }}>
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-16" style={{ color: '#2F52A0' }}>
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

      {/* Mapa */}
      {development?.geo_lat && development?.geo_long && (
        <section className="py-20" style={{ backgroundColor: '#fff' }}>
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-16" style={{ color: '#2F52A0' }}>
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
              <p className="text-center mt-8 text-xl flex items-center justify-center gap-2" style={{ color: '#2F52A0' }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {ubicacion}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Formulario */}
      <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Solicitá más información
                  </h2>
                  <p className="text-xl text-gray-600">
                    Completá el formulario y te contactaremos a la brevedad
                  </p>
                </div>
                <VentuxForm />
              </div>
            </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-8">
            
            <div className="flex items-center gap-12">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-3">Comercializa</p>
                <div className="text-white font-semibold text-lg">Cadema Bienes Raíces</div>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-3">Desarrolla</p>
                <div className="text-white font-semibold text-lg">Sygsa Desarrollos</div>
              </div>
            </div>

            <div className="flex gap-6">
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href={`https://wa.me/${datosLocales.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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