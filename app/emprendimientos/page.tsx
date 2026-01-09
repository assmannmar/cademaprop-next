"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Development {
  id: number;
  name?: string;
  publication_title?: string;
  photos?: Array<{ image: string; is_front_cover?: boolean }>;
  type?: { name: string }; // Esto es la Tipología (ej: "Departamento")
  location?: { name: string; short_location?: string };
  description?: string;
  web_url?: string;
  is_industrial?: boolean; // Campo asumido para división
}

export default function EmprendimientosPage() {
  const [emprendimientos, setEmprendimientos] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de Filtros
  const [filterLoc, setFilterLoc] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all'); // all, residencial, industrial

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

  // Lógica de filtrado combinada
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

  // Listas únicas para los selects
  const uniqueLocations = Array.from(new Set(emprendimientos.map(e => e.location?.name).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(emprendimientos.map(e => e.type?.name).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50 -mt-[70px] pt-[70px]">
      {/* Hero Section */}
      <section className="bg-gray-900 h-[400px] md:h-[500px] flex items-center text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4">Nuestros Proyectos</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Explora desarrollos exclusivos filtrando por tus necesidades específicas.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        
        {/* Barra de Filtros Moderna */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 -mt-20 relative z-20 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Filtro División */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">División</label>
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-red-500 outline-none font-medium"
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
              >
                <option value="all">Todas las Divisiones</option>
                <option value="residencial">Residencial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            {/* Filtro Ubicación */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Ubicación</label>
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-red-500 outline-none font-medium"
                value={filterLoc}
                onChange={(e) => setFilterLoc(e.target.value)}
              >
                <option value="all">Todas las Ubicaciones</option>
                {uniqueLocations.map(loc => <option key={loc} value={loc!}>{loc}</option>)}
              </select>
            </div>

            {/* Filtro Tipología */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Tipología</label>
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-red-500 outline-none font-medium"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Todas las Tipologías</option>
                {uniqueTypes.map(type => <option key={type} value={type!}>{type}</option>)}
              </select>
            </div>

            {/* Contador de Resultados */}
            <div className="flex flex-col justify-end">
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center border border-red-100">
                <span className="text-xl font-bold block">{filteredItems.length}</span>
                <span className="text-[10px] uppercase font-black">Proyectos Encontrados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Listado de Fichas */}
        <div className="grid grid-cols-1 gap-12">
          {filteredItems.map((emp) => {
            const coverImage = emp.photos?.find(p => p.is_front_cover)?.image || emp.photos?.[0]?.image;
            return (
              <div key={emp.id} className="group flex flex-col md:flex-row bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 min-h-[400px]">
                {/* Lado Imagen */}
                <div className="md:w-5/12 relative overflow-hidden">
                  <img src={coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={emp.name} />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter text-gray-900 shadow-sm">
                      {emp.type?.name || 'Proyecto'}
                    </span>
                    {emp.is_industrial && (
                      <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">
                        Industrial
                      </span>
                    )}
                  </div>
                </div>

                {/* Lado Texto */}
                <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-red-600 mb-4 font-bold text-sm uppercase tracking-widest">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" /></svg>
                      {emp.location?.name}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 group-hover:text-red-600 transition-colors">
                      {emp.name || emp.publication_title}
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed line-clamp-3 mb-8">
                      {emp.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-auto">
                    <Link 
                      href={emp.web_url || `/propiedades/${emp.id}`}
                      className="px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-red-600 transition-all hover:-translate-y-1 shadow-lg"
                    >
                      Ver Proyecto
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="py-20 text-center bg-gray-100 rounded-3xl">
              <p className="text-gray-500 font-bold">No se encontraron proyectos con esos filtros.</p>
              <button onClick={() => { setFilterLoc('all'); setFilterType('all'); setFilterDivision('all'); }} className="text-red-600 font-bold mt-2 underline">Limpiar filtros</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}