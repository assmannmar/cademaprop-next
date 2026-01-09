"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ... (Interfaces se mantienen igual)
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
    try {
      const response = await fetch('/api/developments');
      if (!response.ok) throw new Error('Error al cargar emprendimientos');
      const data = await response.json();
      setEmprendimientos(data.objects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmprendimientos = emprendimientos.filter(emp => {
    if (selectedFilter === 'all') return true;
    return emp.location?.name === selectedFilter;
  });

  const uniqueLocations = Array.from(
    new Set(emprendimientos.map(e => e.location?.name).filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-slate-50 -mt-[70px] pt-[70px]">
      {/* Hero Section Refinado */}
      <section className="relative h-[400px] flex items-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" 
            className="w-full h-full object-cover" 
            alt="Background"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight text-white drop-shadow-md">
            Proyectos <span className="text-red-500">Destacados</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-xl">
            Inversiones exclusivas y desarrollos de vanguardia seleccionados para vos.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        
        {/* Filtros Estilo "Segmented Control" */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Todos
            </button>
            {uniqueLocations.map((location) => (
              <button
                key={location}
                onClick={() => setSelectedFilter(location!)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  selectedFilter === location
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
          <p className="text-gray-500 font-medium">
            <span className="text-gray-900 font-bold">{filteredEmprendimientos.length}</span> resultados encontrados
          </p>
        </div>

        {/* Grid de Emprendimientos - Formato Tarjeta Horizontal */}
        <div className="flex flex-col gap-10">
          {filteredEmprendimientos.map((emp) => {
            const coverImage = emp.photos?.find(p => p.is_front_cover)?.image || emp.photos?.[0]?.image;
            const hasWebUrl = emp.web_url && emp.web_url.trim() !== '';

            return (
              <div 
                key={emp.id} 
                className="group flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                {/* Imagen (40% de la tarjeta) */}
                <div className="relative w-full md:w-[40%] h-72 md:h-auto overflow-hidden">
                  <img
                    src={coverImage || '/placeholder-building.jpg'}
                    alt={emp.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md text-red-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                      Nuevo Proyecto
                    </span>
                  </div>
                </div>

                {/* Contenido (60% de la tarjeta) */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-red-600 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-bold text-sm tracking-wide uppercase">{emp.location?.name}</span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                    {emp.name || emp.publication_title}
                  </h3>

                  <p className="text-gray-500 text-lg leading-relaxed mb-8 line-clamp-3">
                    {emp.description || "Un desarrollo exclusivo diseñado pensando en la comodidad, ubicación estratégica y calidad constructiva superior."}
                  </p>

                  <div className="flex flex-wrap items-center gap-6">
                    {hasWebUrl ? (
                      <a
                        href={emp.web_url}
                        target="_blank"
                        className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200"
                      >
                        Visitar Sitio Web
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </a>
                    ) : (
                      <Link
                        href={`/propiedades/${emp.id}`}
                        className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200"
                      >
                        Ver Ficha Técnica
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </Link>
                    )}
                    
                    <span className="text-sm font-bold text-gray-400">
                      ID: #{emp.id}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}