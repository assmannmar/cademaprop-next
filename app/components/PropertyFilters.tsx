'use client';

import { useState, useEffect, useMemo } from 'react';

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

const emptyFilters: FilterValues = {
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

export default function PropertyFilters({
  onFilterChange,
  onSearch,
  initialFilters,
}: FilterProps) {
  const [filters, setFilters] = useState<FilterValues>(initialFilters || emptyFilters);

  // Arranca colapsado por defecto
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'division') return false; // hoy no se usa
      return value !== '';
    }).length;
  }, [filters]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
    onSearch();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      {/* Header clickeable */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-gray-50"
        aria-expanded={isOpen}
        aria-controls="property-filters-panel"
      >
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900 md:text-xl">
              Filtros de Búsqueda
            </h2>

            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <span className="mt-1 text-sm text-gray-500">
            {isOpen ? 'Ocultar filtros' : 'Abrir filtros para refinar tu búsqueda'}
          </span>
        </div>

        <span
          className={`ml-4 shrink-0 transform text-gray-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Panel colapsable */}
      <div
        id="property-filters-panel"
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-200 px-5 py-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Seleccioná los criterios que querés aplicar.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-md bg-gray-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-600"
              >
                Limpiar filtros
              </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Ubicación */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleChange}
                  placeholder="Barrio, zona..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Tipo de Operación */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Tipo de Operación
                </label>
                <select
                  name="operation_type"
                  value={filters.operation_type}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Todas</option>
                  <option value="sale">Venta</option>
                  <option value="rent">Alquiler</option>
                </select>
              </div>

              {/* Tipo de Propiedad */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Tipo de Propiedad
                </label>
                <select
                  name="property_type"
                  value={filters.property_type}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
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

              {/* Dormitorios */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Dormitorios
                </label>
                <select
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Cochera
                </label>
                <select
                  name="has_parking"
                  value={filters.has_parking}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">No importa</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* Pileta */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Pileta
                </label>
                <select
                  name="has_pool"
                  value={filters.has_pool}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">No importa</option>
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* Apto Crédito */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Apto Crédito
                </label>
                <select
                  name="credit_eligible"
                  value={filters.credit_eligible}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">No importa</option>
                  <option value="Eligible">Sí</option>
                  <option value="Not eligible">No</option>
                </select>
              </div>

              {/* Precio Máximo */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Precio Máximo
                </label>
                <input
                  type="number"
                  name="max_price"
                  value={filters.max_price}
                  onChange={handleChange}
                  placeholder="Ej: 500000"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Botón Buscar */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="rounded-md bg-red-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-red-700"
              >
                Buscar Propiedades
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}