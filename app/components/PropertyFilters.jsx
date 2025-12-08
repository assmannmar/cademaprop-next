'use client';

import { useState } from 'react';

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  operation_type: string;
  property_type: string;
  min_price: string;
  max_price: string;
  limit: string;
}

export default function PropertyFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    operation_type: '',
    property_type: '',
    min_price: '',
    max_price: '',
    limit: '50',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      operation_type: '',
      property_type: '',
      min_price: '',
      max_price: '',
      limit: '50',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8 shadow-md">
      <h2 className="text-2xl font-bold mb-4">Filtros de Búsqueda</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Precio Mínimo */}
        <div>
          <label className="block text-sm font-semibold mb-2">Precio Mínimo</label>
          <input
            type="number"
            name="min_price"
            value={filters.min_price}
            onChange={handleChange}
            placeholder="Ej: 50000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
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

        {/* Límite de Resultados */}
        <div>
          <label className="block text-sm font-semibold mb-2">Resultados por Página</label>
          <select
            name="limit"
            value={filters.limit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {/* Botón Limpiar */}
        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
