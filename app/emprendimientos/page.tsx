"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// 1. Diccionarios de Traducción
const TIPOLOGIAS_MAP: Record<string, string> = {
  "apartment": "Departamento",
  "house": "Casa",
  "land": "Terreno",
  "building": "Edificio",
  "industrial": "Parque Industrial",
  "private neighborhood": "Barrio Cerrado",
  "local": "Local Comercial",
  "office": "Oficina",
  "industrial condo": "Condominio Industrial",
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
  location?: { name: string; short_location?: string };
  description?: string;
  web_url?: string;
  construction_status?: number; 
  construction_date?: string;   
  is_industrial?: boolean; // Este viene de tu Route Handler
}

export default function EmprendimientosPage() {
  const [emprendimientos, setEmprendimientos] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Filtros
  const [filterLoc, setFilterLoc] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all');

  useEffect(() => {
    const fetchEmprendimientos = async () => {
      try {
        const response = await fetch('/api/developments');
        const data = await response.json();
        setEmprendimientos(data.objects || []);
      } catch (err) {
        console.error("Error cargando desarrollos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmprendimientos();
  }, []);

  // Lógica de Filtrado (Mantiene el filtro de División anterior)
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
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-4">Nuestros <span className="text-red-600">Proyectos</span></h1>
          <p className="text-xl text-gray-300 max-w-2xl">Oportunidades exclusivas en las ubicaciones más estratégicas.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        
        {/* Barra de Filtros (Mantiene el Select de División) */}
        <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 -mt-20 relative z-20 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">División</label>
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-red-500 font-bold text-gray-700 outline-none"
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="residencial">Residencial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Ubicación</label>
              <select className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 font-bold outline-none" value={filterLoc} onChange={(e) => setFilterLoc(e.target.value)}>
                <option value="all">Todas</option>
                {uniqueLocations.map(loc => <option key={loc} value={loc!}>{loc}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tipología</label>
              <select className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 font-bold outline-none" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">Todas</option>
                {uniqueTypes.map(type => <option key={type} value={type!}>{translateType(type)}</option>)}
              </select>
            </div>

            <div className="flex items-end">
              <div className="w-full bg-red-600 text-white p-3 rounded-xl text-center shadow-lg">
                <span className="text-xl font-black block leading-none">{filteredItems.length}</span>
                <span className="text-[9px] uppercase font-bold tracking-tighter">Resultados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Listado de Tarjetas */}
        <div className="flex flex-col gap-10">
          {loading ? (
            <div className="text-center py-20 animate-pulse text-gray-400 font-bold">CARGANDO EMPRENDIMIENTOS...</div>
          ) : (
            filteredItems.map((emp) => {
              const coverImage = emp.photos?.find(p => p.is_front_cover)?.image || emp.photos?.[0]?.image;
              const deliveryDate = emp.construction_date 
                ? new Date(emp.construction_date).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
                : "Consulte fecha";

              return (
                <div key={emp.id} className="group flex flex-col md:flex-row bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 min-h-[420px]">
                  
                  {/* FOTO DE PORTADA Y TIPOLOGÍA */}
                  <div className="md:w-[40%] h-72 md:h-auto relative overflow-hidden shrink-0">
                    <img src={coverImage || "/placeholder.jpg"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={emp.name} />
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-xl">
                        {translateType(emp.type?.name)}
                      </span>
                    </div>
                  </div>

                  {/* INFO DETALLADA */}
                  <div className="md:w-[60%] p-8 md:p-12 flex flex-col justify-between">
                    <div>
                      {/* UBICACIÓN */}
                      <div className="flex items-center gap-2 text-red-600 mb-3 font-bold text-xs uppercase tracking-widest">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" /></svg>
                        {emp.location?.name}
                      </div>

                      {/* NOMBRE Y TÍTULO */}
                      <div className="mb-6">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{emp.name}</p>
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                          {emp.publication_title || emp.name}
                        </h2>
                      </div>

                      {/* ESTADO Y ENTREGA */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <p className="text-[9px] uppercase font-black text-gray-400 mb-1">Estado</p>
                          <p className="font-bold text-gray-700 text-sm">{emp.construction_status ? ESTADOS_MAP[emp.construction_status] : 'A estrenar'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <p className="text-[9px] uppercase font-black text-gray-400 mb-1">Entrega</p>
                          <p className="font-bold text-gray-700 text-sm capitalize">{deliveryDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* BOTÓN WEB Y PIE */}
                    <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                      {emp.web_url ? (
                        <Link 
                          href={emp.web_url}
                          target="_blank"
                          className="px-8 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-red-600 transition-all shadow-lg text-xs uppercase tracking-widest"
                        >
                          Visitar Web del Proyecto
                        </Link>
                      ) : (
                        <Link 
                          href={`/emprendimientos/${emp.id}`}
                          className="px-8 py-4 bg-gray-200 text-gray-700 font-black rounded-xl hover:bg-gray-300 transition-all text-xs uppercase tracking-widest"
                        >
                          Ver Detalles
                        </Link>
                      )}
                      
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-gray-300 uppercase">Referencia</span>
                        <span className="text-sm font-bold text-gray-400 italic">ID {emp.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}