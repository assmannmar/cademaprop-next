'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import VentuxForm from "@/app/components/VentuxForm";

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
  // ========== CONFIGURACIÓN: Cambia este ID por el de tu emprendimiento ==========
  const EMPRENDIMIENTO_ID = 61960; // ← ID de Tokko para este emprendimiento
  // ===============================================================================

  const [development, setDevelopment] = useState<Development | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // ========== DATOS LOCALES (lo que NO viene de Tokko) ==========
  const datosLocales = {
    subtitulo: "Tu casa en el campo, cerca de todo",
    descripcionExtra: `Campo Alto es un emprendimiento único que combina la tranquilidad 
    del campo con la cercanía a todos los servicios. Ubicado estratégicamente, 
    ofrece lotes amplios con todos los servicios.`,
    
    caracteristicas: [
      { icon: "📏", titulo: "Lotes desde 500m²", descripcion: "Amplios espacios para tu proyecto" },
      { icon: "💡", titulo: "Todos los servicios", descripcion: "Agua, luz, gas, cloacas" },
      { icon: "🏞️", titulo: "Espacios verdes", descripcion: "Más del 40% de área verde" },
      { icon: "🔒", titulo: "Seguridad 24hs", descripcion: "Vigilancia permanente" },
      { icon: "🏊", titulo: "Amenities", descripcion: "Pileta, quincho, juegos" },
      { icon: "🚗", titulo: "Acceso asfaltado", descripcion: "Calles pavimentadas" },
    ],

    servicios: [
      "Agua corriente",
      "Energía eléctrica",
      "Gas natural",
      "Cloacas",
      "Internet fibra óptica",
      "Alumbrado público",
      "Portón de acceso",
      "Vigilancia 24hs",
    ],

    lotes: [
      { tipo: "Lote 500m²", precio: "USD 45,000", cuotas: "36 cuotas sin interés" },
      { tipo: "Lote 750m²", precio: "USD 65,000", cuotas: "48 cuotas sin interés" },
      { tipo: "Lote 1000m²", precio: "USD 85,000", cuotas: "60 cuotas sin interés" },
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
      
      // Buscar el emprendimiento por ID
      const found = data.objects.find((d: Development) => d.id === EMPRENDIMIENTO_ID);
      
      if (found) {
        setDevelopment(found);
      } else {
        console.error(`Emprendimiento con ID ${EMPRENDIMIENTO_ID} no encontrado`);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center -mt-[70px] pt-[70px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Datos combinados: TOKKO + LOCAL
  const nombre = development?.name || development?.publication_title || 'Campo Alto';
  const ubicacion = development?.location?.full_location || development?.location?.name || 'Campana, Buenos Aires';
  const descripcionTokko = development?.rich_description || development?.description || '';
  const fotos = development?.photos?.filter(p => !p.is_blueprint) || [];
  const planos = development?.photos?.filter(p => p.is_blueprint) || [];
  const videos = development?.videos || [];
  
  // Tags de Tokko
  const amenitiesTokko = [
    ...(development?.tags?.map(t => t.name) || []),
    ...(development?.custom_tags?.map(t => t.name) || [])
  ];

  return (
    <div className="min-h-screen bg-gray-50 -mt-[70px] pt-[70px]">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">Inicio</Link>
            {' > '}
            <Link href="/emprendimientos" className="hover:text-red-600">Emprendimientos</Link>
            {' > '}
            <span className="text-gray-800 font-semibold">{nombre}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gray-900">
        {fotos.length > 0 ? (
          <>
            <img
              src={fotos[0].image}
              alt={nombre}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800" />
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-6xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
              {nombre}
            </h1>
            <p className="text-2xl md:text-3xl mb-6 drop-shadow-lg">
              {datosLocales.subtitulo}
            </p>
            <div className="flex items-center justify-center gap-2 text-xl">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {ubicacion}
            </div>
          </div>
        </div>
      </section>

      {/* Descripción */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
              Un lugar para vivir como siempre soñaste
            </h2>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8 text-center">
              {datosLocales.descripcionExtra}
            </p>

            {descripcionTokko && (
              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: descripcionTokko }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Características Destacadas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {datosLocales.caracteristicas.map((car, idx) => (
              <div 
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-4 text-center">{car.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  {car.titulo}
                </h3>
                <p className="text-gray-600 text-center">
                  {car.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería - Fotos de Tokko */}
      {fotos.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Galería de Imágenes
            </h2>

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
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev === fotos.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                  {selectedImage + 1} / {fotos.length}
                </div>
              </div>

              {fotos.length > 1 && (
                <div className="flex gap-4 justify-center overflow-x-auto pb-2">
                  {fotos.map((foto, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-3 transition ${
                        selectedImage === idx ? 'border-red-600 ring-2 ring-red-600' : 'border-gray-300 opacity-60 hover:opacity-100'
                      }`}
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

      {/* Servicios */}
      <section className="py-16 bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Servicios e Infraestructura
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Servicios locales */}
            {datosLocales.servicios.map((servicio, idx) => (
              <div key={`local-${idx}`} className="flex items-center gap-3 bg-white/10 backdrop-blur p-4 rounded-lg">
                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">{servicio}</span>
              </div>
            ))}

            {/* Amenities de Tokko */}
            {amenitiesTokko.map((amenity, idx) => (
              <div key={`tokko-${idx}`} className="flex items-center gap-3 bg-white/10 backdrop-blur p-4 rounded-lg">
                <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lotes y Precios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Lotes Disponibles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {datosLocales.lotes.map((lote, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-gray-100"
              >
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {lote.tipo}
                </h3>
                <p className="text-5xl font-bold text-red-600 mb-4">
                  {lote.precio}
                </p>
                <p className="text-gray-600 mb-6">
                  {lote.cuotas}
                </p>
                <a
                  href={`https://wa.me/${datosLocales.whatsapp}?text=Hola, me interesa el ${lote.tipo} en ${nombre}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-center"
                >
                  Consultar
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos de Tokko */}
      {videos.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Recorrido Virtual
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
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

      {/* Planos de Tokko */}
      {planos.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Planos del Proyecto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {planos.map((plano, idx) => (
                <img
                  key={idx}
                  src={plano.image}
                  alt={`Plano ${idx + 1}`}
                  className="w-full rounded-lg border border-gray-200 shadow-lg"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mapa de Tokko */}
      {development?.geo_lat && development?.geo_long && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
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
              <p className="text-center text-gray-600 mt-6 text-lg">
                📍 {ubicacion}
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

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para conocer {nombre}?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Visitanos y descubrí todo lo que este emprendimiento tiene para ofrecerte
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/contacto"
              className="px-8 py-4 bg-white text-red-600 hover:bg-gray-100 font-bold rounded-lg shadow-lg transition transform hover:scale-105"
            >
              Agendar Visita
            </Link>
            <a
              href={`https://wa.me/${datosLocales.whatsapp}?text=Hola, quiero más información sobre ${nombre}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}