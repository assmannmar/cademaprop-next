"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// 1. Diccionario de Traducción para Tipologías de Tokko
const TIPOLOGIAS_MAP: Record<string, string> = {
  "apartment": "Departamento",
  "house": "Casa",
  "land": "Terreno",
  "office": "Oficina",
  "local": "Local Comercial",
  "industrial": "Industrial",
  "building": "Edificio",
  "store": "Depósito",
  "commercial_property": "Local Comercial"
};

const translateType = (type: string | undefined) => {
  if (!type) return "Proyecto";
  return TIPOLOGIAS_MAP[type.toLowerCase()] || type;
};

interface Development {
  id: number;
  name?: string;
  publication_title?: string;
  photos?: Array<{ image: string; is_front_cover?: boolean }>;
  type?: { name: string };
  location?: { name: string; short_location?: string };
  description?: string;
  web_url?: string;
  is_industrial?: boolean; // Viene procesado desde tu route.ts
}

export default function EmprendimientosPage() {
  const [emprendimientos, setEmprendimientos] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de Filtros
  const [filterLoc, setFilterLoc] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all');

  useEffect(() => {
    const fetchEmprendimientos = async () => {
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
    fetchEmprendimientos();
  }, []);

  // 2. Lógica de Filtrado Combinada
  const filteredItems = useMemo(() => {
    return emprendimientos.filter(emp => {
      const matchLoc = filterLoc === 'all' || emp.location?.name === filterLoc;
      const matchType = filterType === 'all' || emp.type?.name === filterType;
      
      let matchDiv = true;
      if (filterDivision === 'industrial') matchDiv = emp.is_industrial === true;
      if (filterDivision === 'residencial') matchDiv = emp.is_industrial !== true;

      return matchLoc && matchType && matchDiv;
    });
  }, [emprendimientos, filterLoc, filterType, filterDivision]);

  // 3. Listas Únicas para los Selects
  const uniqueLocations = Array.from(new Set(emprendimientos.map(e => e.location?.name).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(emprendimientos.map(e => e.type?.name).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50 -mt-[70px] pt-[70px]">
      
      {/* Hero Section - Altura Ajustada */}
      <section className="relative h-[400px] flex items-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-4">Nuestros <span className="text-red-600">Proyectos</span></h1>
          <p className="text-xl text-gray-300 max-w-2xl">Descubrí oportunidades exclusivas en las ubicaciones más estratégicas.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        
        {/* Barra de Filtros */}
        <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 -mt-20 relative z-20 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* División */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">División</label>
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-red-500 font-bold text-gray-700 outline-none"
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
              >
                <option value="all">Residencial & Industrial</option>
                <option value="residencial">Solo Residencial</option>
                <option value="industrial">Solo Industrial</option>
              </select>
            </div>

            {/* Ubicación */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Ubicación</label>
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-red-500 font-bold text-gray-700 outline-none"
                value={filterLoc}
                onChange={(e) => setFilterLoc(e.target.value)}
              >
                <option value="all">Todas las Ubicaciones</option>
                {uniqueLocations.map(loc => <option key={loc} value={loc!}>{loc}</option>)}
              </select>
            </div>

            {/* Tipología */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tipología</label>
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-red-500 font-bold text-gray-700 outline-none"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Todas las Tipologías</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type!}>
                    {translateType(type)}
                  </option>
                ))}
              </select>
            </div>

            {/* Contador */}
            <div className="flex flex-col justify-end">
              <div className="bg-red-600 text-white p-3 rounded-xl text-center shadow-lg shadow-red-200">
                <span className="text-xl font-black block leading-none">{filteredItems.length}</span>
                <span className="text-[9px] uppercase font-bold tracking-tighter">Proyectos Disponibles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Listado de Fichas Horizontales */}
        <div className="flex flex-col gap-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((emp) => {
              const coverImage = emp.photos?.find(p => p.is_front_cover)?.image || emp.photos?.[0]?.image;
              
              return (
                <div 
                  key={emp.id} 
                  className="group flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 md:h-[480px]" // <--- ALTURA FIJA EN DESKTOP
                >
                  {/* Lado Imagen: h-full asegura que ocupe toda la altura de la ficha */}
                  <div className="md:w-[45%] h-80 md:h-full relative overflow-hidden shrink-0">
                    <img 
                      src={coverImage || "/placeholder.jpg"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={emp.name} 
                    />
                    <div className="absolute top-8 left-8 flex flex-col gap-2">
                      <span className="bg-white/90 backdrop-blur px-5 py-2 rounded-full text-[11px] font-black uppercase text-gray-900 shadow-xl">
                        {translateType(emp.type?.name)}
                      </span>
                      {emp.is_industrial && (
                        <span className="bg-red-600 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase shadow-xl">
                          División Industrial
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Lado Info: h-full y flex-col justify-between para distribuir el espacio */}
                  <div className="md:w-[55%] p-10 md:p-14 flex flex-col h-full">
                    <div className="flex-1"> {/* Este div envuelve el texto para permitir que el botón quede siempre abajo */}
                      <div className="flex items-center gap-2 text-red-600 mb-4 font-black text-xs uppercase tracking-[0.2em]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        {emp.location?.name}
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                        {emp.name || emp.publication_title}
                      </h2>

                      <p className="text-gray-500 text-base md:text-lg leading-relaxed line-clamp-4 mb-6">
                        {emp.description || "Sin descripción disponible."}
                      </p>
                    </div>

                    {/* El botón siempre quedará alineado al fondo gracias a flex-1 arriba */}
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                      <Link 
                        href={emp.web_url || `/propiedades/${emp.id}`}
                        target={emp.web_url ? "_blank" : "_self"}
                        className="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-red-600 transition-all shadow-xl text-sm"
                      >
                        VER DETALLES
                      </Link>
                      
                      <span className="text-gray-300 font-bold text-sm tracking-tighter">
                        ID #{emp.id}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Estado sin resultados... */
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-xl font-medium">No coinciden proyectos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}