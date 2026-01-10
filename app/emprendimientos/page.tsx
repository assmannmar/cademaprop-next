"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// 1. Diccionario de Traducción para Tipologías y Estados
const TIPOLOGIAS_MAP: Record<string, string> = {
  "apartment": "Departamento",
  "house": "Casa",
  "land": "Terreno",
  "building": "Edificio",
  "industrial": "Parque Industrial",
  "private neighborhood": "Barrio Cerrado",
};

const ESTADOS_MAP: Record<number, string> = {
  1: "En Pozo",
  2: "En Construcción",
  3: "Próxima Entrega",
  4: "Finalizado",
  5: "Suspendido",
  6: "A Estrenar"
};

const translateType = (type: string | undefined) => {
  if (!type) return "Emprendimiento";
  return TIPOLOGIAS_MAP[type.toLowerCase()] || type;
};

interface Development {
  id: number;
  name?: string;
  publication_title?: string;
  photos?: Array<{ image: string; is_front_cover?: boolean }>;
  type?: { name: string };
  location?: { name: string; short_location?: string; full_location?: string };
  description?: string;
  web_url?: string;
  construction_status?: number; // Campo de Tokko
  construction_date?: string;   // Campo de Tokko
  is_industrial?: boolean;
}

export default function EmprendimientosPage() {
  const [emprendimientos, setEmprendimientos] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const uniqueLocations = Array.from(new Set(emprendimientos.map(e => e.location?.name).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(emprendimientos.map(e => e.type?.name).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50 -mt-[70px] pt-[70px]">
      {/* ... Hero Section ... (Sin cambios) */}

      <div className="container mx-auto px-4 py-12">
        {/* ... Barra de Filtros ... (Sin cambios) */}

        <div className="flex flex-col gap-10">
          {loading ? (
             <div className="text-center py-20 animate-pulse text-gray-400">Cargando proyectos...</div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((emp) => {
              // 1. Foto de Portada
              const coverImage = emp.photos?.find(p => p.is_front_cover)?.image || emp.photos?.[0]?.image;
              
              // 2. Formateo de Fecha de Entrega
              const deliveryDate = emp.construction_date 
                ? new Date(emp.construction_date).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
                : "A confirmar";

              return (
                <div 
                  key={emp.id} 
                  className="group flex flex-col md:flex-row bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 min-h-[420px] rounded-r-3xl" 
                >
                  {/* FOTO DE PORTADA */}
                  <div className="md:w-[40%] h-72 md:h-auto relative overflow-hidden shrink-0">
                    <img 
                      src={coverImage || "/placeholder.jpg"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      alt={emp.name} 
                    />
                    {/* TIPOLOGÍA (Badge sobre imagen) */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <span className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-xl">
                        {translateType(emp.type?.name)}
                      </span>
                    </div>
                  </div>

                  {/* INFO DEL EMPRENDIMIENTO */}
                  <div className="md:w-[60%] p-8 md:p-12 flex flex-col">
                    <div className="flex-1">
                      
                      {/* UBICACIÓN */}
                      <div className="flex items-center gap-2 text-red-600 mb-3 font-bold text-xs uppercase tracking-wider">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {emp.location?.short_location || emp.location?.name}
                      </div>

                      {/* NOMBRE Y TÍTULO DE PUBLICACIÓN */}
                      <div className="mb-6">
                        <h3 className="text-sm font-black text-gray-400 uppercase mb-1">{emp.name}</h3>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                          {emp.publication_title || emp.name}
                        </h2>
                      </div>

                      {/* DATOS CLAVE: ESTADO Y ENTREGA */}
                      <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div>
                          <p className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">Estado de Obra</p>
                          <p className="font-bold text-gray-700">{emp.construction_status ? ESTADOS_MAP[emp.construction_status] : 'No informado'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">Fecha de Entrega</p>
                          <p className="font-bold text-gray-700 capitalize">{deliveryDate}</p>
                        </div>
                      </div>

                      {/* DESCRIPCIÓN CORTA */}
                      <p className="text-gray-500 text-sm md:text-base line-clamp-2 mb-6 italic">
                        {emp.description ? `"${emp.description.substring(0, 120)}..."` : "Consulte para más información sobre este proyecto."}
                      </p>
                    </div>

                    {/* BOTÓN / LINK A LANDING (Web Url) */}
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                      <Link 
                        href={emp.web_url || `/emprendimientos/${emp.id}`}
                        target="_blank"
                        className="px-8 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200 text-xs uppercase tracking-widest"
                      >
                        Ir a la Web del Proyecto
                      </Link>
                      
                      <div className="text-right">
                         <p className="text-[9px] font-black text-gray-300 uppercase">Referencia</p>
                         <p className="text-sm font-bold text-gray-400"># {emp.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20">No se encontraron resultados.</div>
          )}
        </div>
      </div>
    </div>
  );
}