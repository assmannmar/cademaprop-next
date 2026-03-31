'use client';

import { useState, useEffect } from 'react';

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  onSearch: () => void;
  initialFilters?: FilterValues;
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

export default function PropertyFilters({ onFilterChange, onSearch, initialFilters }: FilterProps) {
  const [filters, setFilters] = useState<FilterValues>(initialFilters || {
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

  // Sincronizar con initialFilters cuando cambian (desde URL)
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

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
    onSearch();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Filtros de Búsqueda</h2>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition text-sm"
        >
          Limpiar Filtros
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* División */}
        {/* <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">División</label>
          <select
            name="division"
            value={filters.division}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Todas</option>
            <option value="ciudad">Ciudad</option>
            <option value="barrio">Barrio</option>
            <option value="country">Country</option>
          </select>
        </div> */}

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Ubicación</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Barrio, zona..."
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Tipo de Operación */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Tipo de Operación</label>
          <select
            name="operation_type"
            value={filters.operation_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Todas</option>
            <option value="sale">Venta</option>
            <option value="rental">Alquiler</option>
          </select>
        </div>

        {/* Tipo de Propiedad */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Tipo de Propiedad</label>
          <select
            name="property_type"
            value={filters.property_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Todas</option>
            <option value="house">Casa</option>
            <option value="apartment">Departamento</option>
            <option value="land">Terreno</option>
            <option value="comercial">Comercial</option>
            <option value="Office">Oficina</option>
            <option value="Countryside">Campo</option>
            <option value="Industrial Ship">Nave Industrial</option>
            <option value="Terreno industrial">Terreno Industrial</option>
          </select>
        </div>

        {/* Cantidad de Dormitorios */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Dormitorios</label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
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
          <label className="block text-sm font-semibold mb-2 text-gray-700">Cochera</label>
          <select
            name="has_parking"
            value={filters.has_parking}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">No importa</option>
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Pileta */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Pileta</label>
          <select
            name="has_pool"
            value={filters.has_pool}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">No importa</option>
            <option value="yes">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        {/* Apto Crédito */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Apto Crédito</label>
          <select
            name="credit_eligible"
            value={filters.credit_eligible}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Not specified">No importa</option>
            <option value="Eligible">Sí</option>
            <option value="Not eligible">No</option>
          </select>
        </div>

        {/* Precio Máximo */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Precio Máximo</label>
          <input
            type="number"
            name="max_price"
            value={filters.max_price}
            onChange={handleChange}
            placeholder="Ej: 500000"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Botón Buscar */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition text-lg shadow-lg"
        >
          Buscar Propiedades
        </button>
      </div>
    </form>
  );
}