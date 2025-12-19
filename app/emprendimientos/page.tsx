"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Development {
  id: number;
  name?: string;
  publication_title?: string;
  photos?: Array<{ image: string; is_front_cover?: boolean }>;
  type?: { name: string };
  location?: { name: string; short_location?: string };
  description?: string;
  web_url?: string;
}

export default function EmprendimientosPage() {
  const [emprendimientos, setEmprendimientos] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    fetchEmprendimientos();
  }, []);

  const fetchEmprendimientos = async () => {
    setLoading(true);
    setError(null);

    try {
      // Usar el mismo endpoint que el carousel del home
      const response = await fetch('/api/developments');
      
      if (!response.ok) {
        throw new Error('Error al cargar emprendimientos');
      }

      const data = await response.json();
      
      // Tomar los emprendimientos del endpoint (ya vienen filtrados)
      setEmprendimientos(data.objects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmprendimientos = emprendimientos.filter(emp => {
    if (selectedFilter === 'all') return true;
    
    const location = emp.location?.name.toLowerCase() || '';
    return location.includes(selectedFilter.toLowerCase());
  });

  // Extraer ubicaciones únicas para filtros
  const uniqueLocations = Array.from(
    new Set(emprendimientos.map(e => e.location?.name).filter(Boolean))
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 -mt-[70px] pt-[70px]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow-lg">
              Emprendimientos Exclusivos
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Descubrí proyectos únicos en las mejores ubicaciones de la zona
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <p className="text-3xl font-bold">{emprendimientos.length}</p>
                <p className="text-sm">Proyectos</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <p className="text-3xl font-bold">{uniqueLocations.length}+</p>
                <p className="text-sm">Ubicaciones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        
        {/* Filtros */}
        {uniqueLocations.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Filtrar por ubicación</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-6 py-2 rounded-full font-semibold transition ${
                    selectedFilter === 'all'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos ({emprendimientos.length})
                </button>
                {uniqueLocations.map((location) => {
                  const count = emprendimientos.filter(
                    e => e.location?.name === location
                  ).length;
                  return (
                    <button
                      key={location}
                      onClick={() => setSelectedFilter(location!)}
                      className={`px-6 py-2 rounded-full font-semibold transition ${
                        selectedFilter === location
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {location} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Estado de carga */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mb-4"></div>
            <p className="text-xl text-gray-600">Cargando emprendimientos...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <svg className="w-16 h-16 mx-auto text-red-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-semibold text-lg">{error}</p>
          </div>
        )}

        {/* Grid de Emprendimientos */}
        {!loading && !error && filteredEmprendimientos.length > 0 ? (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Mostrando <span className="font-bold text-gray-900">{filteredEmprendimientos.length}</span> emprendimientos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEmprendimientos.map((emp) => {
                const coverImage = emp.photos?.find(p => p.is_front_cover)?.image || emp.photos?.[0]?.image;
                const hasWebUrl = emp.web_url && emp.web_url.trim() !== '';

                return (
                  <div key={emp.id} className="group">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      {/* Imagen */}
                      <div className="relative h-72 bg-gray-200 overflow-hidden">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={emp.publication_title || emp.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Badge */}
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          🏗️ Emprendimiento
                        </div>

                        {/* Fotos count */}
                        {emp.photos && emp.photos.length > 0 && (
                          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            {emp.photos.length}
                          </div>
                        )}
                      </div>

                      {/* Contenido */}
                      <div className="p-6">
                        {/* Ubicación */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold">{emp.location?.name}</span>
                        </div>

                        {/* Título */}
                        <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-red-600 transition-colors min-h-[3.5rem]">
                          {emp.name || emp.publication_title || `Emprendimiento en ${emp.location?.name}`}
                        </h3>

                        {/* Descripción breve */}
                        {emp.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {emp.description}
                          </p>
                        )}

                        {/* CTA - Condicional según tenga web_url */}
                        {hasWebUrl ? (
                          <a
                            href={emp.web_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full mt-4 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 text-center"
                          >
                            Ver Landing
                          </a>
                        ) : (
                          <Link
                            href={`/propiedades/${emp.id}`}
                            className="block w-full mt-4 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 text-center"
                          >
                            Ver Detalles
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          !loading && !error && (
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-2xl text-gray-600 mb-4">No hay emprendimientos disponibles en este momento</p>
              <Link
                href="/propiedades"
                className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition"
              >
                Ver Todas las Propiedades
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}