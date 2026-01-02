
'use client';

import { useState, useEffect } from 'react';

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
    subtitulo: "Tu lugar en Zárate",
    descripcionExtra: `Campo Alto es un emprendimiento único que combina la tranquilidad 
    del campo con la cercanía a todos los servicios. Ubicado estratégicamente, 
    ofrece lotes amplios con todos los servicios.`,
    
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
        texto: "Campo Alto superó todas mis expectativas. La tranquilidad del lugar y la cercanía a la ciudad son perfectas.",
        autor: "María S., propietaria"
      },
      {
        texto: "La mejor inversión que hicimos. Los chicos tienen espacio para jugar y nosotros la paz que buscábamos.",
        autor: "Carlos R., propietario"
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
          <p className="mt-4 text-xl text-white">Cargando...</p>
        </div>
      </div>
    );
  }

  const nombre = development?.name || development?.publication_title || 'Campo Alto';
  const ubicacion = development?.location?.full_location || development?.location?.name || 'Zárate, Buenos Aires';
  const descripcionTokko = development?.rich_description || development?.description || '';
  const fotos = development?.photos?.filter(p => !p.is_blueprint) || [];
  const planos = development?.photos?.filter(p => p.is_blueprint) || [];
  const videos = development?.videos || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm shadow-lg z-50 transition-all">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-white hover:text-red-400 transition">
            {nombre}
          </a>
          <a 
            href="#contacto" 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105"
          >
            Vení a Conocer
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {fotos.length > 0 && (
          <div className="absolute inset-0">
            <img
              src={fotos[0].image}
              alt={nombre}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900"></div>
          </div>
        )}
        
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl">
            {nombre}
          </h1>
          <p className="text-3xl md:text-4xl text-white/90 mb-8 drop-shadow-lg">
            {datosLocales.subtitulo}
          </p>
          <a 
            href="#descripcion" 
            className="inline-block px-10 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold text-lg rounded-full shadow-2xl transition transform hover:scale-110"
          >
            Descubrí Campo Alto
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </header>

      {/* Quote Section */}
      <section id="descripcion" className="py-20 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <blockquote className="text-center">
            <p className="text-2xl md:text-3xl text-white/90 leading-relaxed italic mb-6">
              "{datosLocales.descripcionExtra}"
            </p>
            <footer className="text-xl text-red-400 font-semibold">
              — Tu nuevo hogar te espera
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Parallax Section con imagen de fondo */}
      {fotos.length > 1 && (
        <section className="relative h-96 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={fotos[1].image}
              alt="Campo Alto"
              className="w-full h-full object-cover"
              style={{ transform: 'translateZ(0)' }}
            />
            <div className="absolute inset-0 bg-gray-900/60"></div>
          </div>
          <div className="relative z-10 text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 drop-shadow-2xl">
              Vivir en armonía
            </h2>
          </div>
        </section>
      )}

      {/* Descripción detallada */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-5xl font-bold text-white text-center mb-12">
            Un Estilo de Vida Único
          </h2>
          
          {descripcionTokko && (
            <div 
              className="text-lg text-gray-300 leading-relaxed prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: descripcionTokko }}
            />
          )}
        </div>
      </section>

      {/* Beneficios - Estilo Islas */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Un Lugar Para Disfrutar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {datosLocales.caracteristicas.map((car, idx) => (
              <div 
                key={idx}
                className="group bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-red-500 transition-all transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform">
                  {car.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 text-center">
                  {car.titulo}
                </h3>
                <p className="text-gray-300 text-center">
                  {car.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería */}
      {fotos.length > 0 && (
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className={`grid ${fotos.length === 1 ? 'grid-cols-1' : fotos.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-4 max-w-7xl mx-auto`}>
              {fotos.slice(0, 4).map((foto, idx) => (
                <div 
                  key={idx}
                  className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer transform hover:scale-105 transition-all"
                  onClick={() => setSelectedImage(idx)}
                >
                  <img
                    src={foto.image}
                    alt={`${nombre} - ${idx + 1}`}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-semibold">Ver imagen completa</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ - Estilo Islas con accordion */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-4">
            {datosLocales.faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-700/30 transition"
                >
                  <span className="text-xl font-semibold text-white pr-8">
                    {faq.pregunta}
                  </span>
                  <svg 
                    className={`w-6 h-6 text-red-400 flex-shrink-0 transition-transform ${activeAccordion === idx ? 'rotate-180' : ''}`}
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
                  <div className="px-6 pb-5 text-gray-300 text-lg">
                    {faq.respuesta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios - Estilo Islas */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            +50 familias ya eligieron Campo Alto
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {datosLocales.testimonios.map((test, idx) => (
              <div 
                key={idx}
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-red-500 transition-all"
              >
                <blockquote className="text-xl text-gray-300 italic mb-4">
                  "{test.texto}"
                </blockquote>
                <cite className="text-red-400 font-semibold not-italic">
                  {test.autor}
                </cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      {videos.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-white text-center mb-16">
              Recorrido Virtual
            </h2>
            
            <div className="max-w-5xl mx-auto space-y-8">
              {videos.map((video, idx) => (
                <div key={idx} className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700">
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
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-white text-center mb-16">
              Ubicación
            </h2>

            <div className="max-w-5xl mx-auto">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${development.geo_lat},${development.geo_long}&z=15&output=embed`}
                  allowFullScreen
                />
              </div>
              <p className="text-center text-gray-300 mt-8 text-xl flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {ubicacion}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Formulario - Integrado */}
      <section id="contacto" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-6">
              Consultanos
            </h2>
            <h3 className="text-3xl text-gray-300">
              Agendá una Visita
            </h3>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-2xl">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Mensaje
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition resize-none"
                  placeholder="Contanos qué te interesa saber..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg shadow-lg transition transform hover:scale-105"
              >
                Enviar consulta
              </button>
            </form>
          </div>
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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          50% {
            transform: translateY(-20px) translateX(-50%);
          }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Backdrop blur support */
        @supports (backdrop-filter: blur(10px)) {
          .backdrop-blur-sm {
            backdrop-filter: blur(10px);
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #1f2937;
        }

        ::-webkit-scrollbar-thumb {
          background: #ef4444;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
}