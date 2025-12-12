'use client';

import { useState } from 'react';

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  division: string;
  location: string;
  operation_type: string;
  property_type: string;
  bedrooms: string;
  has_parking: string;
  has_pool: string;
  credit_eligible: string;
  max_price: string;
}

export default function PropertyFilters({ onFilterChange }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    division: '',
    location: '',
    operation_type: '',
    property_type: '',
    bedrooms: '',
    has_parking: '',
    has_pool: '',
    credit_eligible: '',
    max_price: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterValues = {
      division: '',
      location: '',
      operation_type: '',
      property_type: '',
      bedrooms: '',
      has_parking: '',
      has_pool: '',
      credit_eligible: '',
      max_price: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const FilterContent = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Filtros de Búsqueda</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* División */}
        <div>
          <label className="block text-sm font-semibold mb-2">División</label>
          <select
            name="division"
            value={filters.division}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas</option>
            <option value="ciudad">Ciudad</option>
            <option value="barrio">Barrio</option>
            <option value="country">Country</option>
          </select>
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-semibold mb-2">Ubicación</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Barrio, zona..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Tipo de Operación */}
        <div>
          <label className="block text-sm font-semibold mb-2">Tipo de Operación</label>
          <select
            name="operation_type"
            value={filters.operation_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas</option>
            <option value="sale">Venta</option>
            <option value="rental">Alquiler</option>
            <option value="temporary_rental">Alquiler Temporal</option>
          </select>
        </div>

        {/* Tipo de Propiedad */}
        <div>
          <label className="block text-sm font-semibold mb-2">Tipo de Propiedad</label>
          <select
            name="property_type"
            value={filters.property_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas</option>
            <option value="house">Casa</option>
            <option value="apartment">Departamento</option>
            <option value="land">Terreno</option>
            <option value="comercial">Comercial</option>
          </select>
        </div>

        {/* Cantidad de Dormitorios */}
        <div>
          <label className="block text-sm font-semibold mb-2">Dormitorios</label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="">Cualquiera</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        {/* Cochera */}
        <div>
          <label className="block text-sm font-semibold mb-2">Cochera</label>
          <select
            name="has_parking"
            value={filters.has_parking}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="">No importa</option>
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Pileta */}
        <div>
          <label className="block text-sm font-semibold mb-2">Pileta</label>
          <select
            name="has_pool"
            value={filters.has_pool}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="">No importa</option>
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Apto Crédito */}
        <div>
          <label className="block text-sm font-semibold mb-2">Apto Crédito</label>
          <select
            name="credit_eligible"
            value={filters.credit_eligible}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="">No importa</option>
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Precio Máximo */}
        <div>
          <label className="block text-sm font-semibold mb-2">Precio Máximo</label>
          <input
            type="number"
            name="max_price"
            value={filters.max_price}
            onChange={handleChange}
            placeholder="Ej: 500000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Botón Limpiar */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* BOTÓN MÓVIL - Solo visible en pantallas pequeñas */}
      <div className="lg:hidden flex justify-center mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md flex items-center gap-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
        </button>
      </div>

      {/* MODAL MÓVIL */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl max-h-[85vh] overflow-y-auto p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Filtros</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-3xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      {/* FILTROS DESKTOP - Siempre visible en pantallas grandes */}
      <div className="hidden lg:block bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8 shadow-md">
        <FilterContent />
      </div>
    </>
  );
}