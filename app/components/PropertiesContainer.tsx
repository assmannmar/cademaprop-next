'use client';

import { useState, useEffect } from 'react';
import PropertyFilters from '@/app/components/PropertyFilters';
import PropertyCard from '@/app/components/PropertyCard';
import type { FilterValues } from '@/app/components/PropertyFilters';

interface Property {
  id: number;
  publication_title?: string;
  address?: string;
  fake_address?: string;
  location?: { 
    name: string;
    short_location?: string;
  };
  operations?: Array<{
    operation_type: string;
    prices?: Array<{
      price: number;
      currency: string;
    }>;
  }>;
  type?: { name: string };
  suite_amount?: number;
  room_amount?: number;
  bathroom_amount?: number;
  parking_lot_amount?: number;
  surface?: number;
  roofed_surface?: number;
  total_surface?: number;
  photos?: Array<{ 
    image: string; 
    is_front_cover?: boolean;
  }>;
  videos?: Array<any>;
  tags?: Array<{ name: string }>;
  custom_tags?: Array<{ name: string; group_name?: string }>;
  created_at?: string;
}

interface ApiResponse {
  objects: Property[];
  meta: {
    limit: number;
    offset: number;
    total_count?: number;
  };
}

type SortOption = 'surface' | 'roofed_surface' | 'price' | 'recent';

export default function PropertiesContainer() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    sortProperties(sortBy);
  }, [properties, sortBy]);

  const fetchProperties = async (filterValues?: FilterValues) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/properties');

      if (!response.ok) {
        throw new Error(`Error al cargar propiedades: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      let filtered = data.objects;

      // Aplicar filtros del lado del cliente
      if (filterValues) {
        filtered = data.objects.filter((prop) => {
          // Filtro por división
          if (filterValues.division) {
            const hasDivision = prop.custom_tags?.some(tag => 
              tag.group_name === 'División' && 
              tag.name.toLowerCase().includes(filterValues.division.toLowerCase())
            );
            if (!hasDivision) return false;
          }

          // Filtro por ubicación
          if (filterValues.location) {
            const searchTerm = filterValues.location.toLowerCase();
            const matchAddress = prop.address?.toLowerCase().includes(searchTerm);
            const matchLocation = prop.location?.name.toLowerCase().includes(searchTerm);
            const matchFakeAddress = prop.fake_address?.toLowerCase().includes(searchTerm);
            const matchShortLocation = prop.location?.short_location?.toLowerCase().includes(searchTerm);
            if (!matchAddress && !matchLocation && !matchFakeAddress && !matchShortLocation) {
              return false;
            }
          }

          // Filtro por tipo de operación
          if (filterValues.operation_type) {
            const hasOperation = prop.operations?.some(op => 
              op.operation_type.toLowerCase() === filterValues.operation_type.toLowerCase()
            );
            if (!hasOperation) return false;
          }

          // Filtro por tipo de propiedad
          if (filterValues.property_type) {
            const propertyTypeName = prop.type?.name.toLowerCase() || '';
            if (!propertyTypeName.includes(filterValues.property_type.toLowerCase())) {
              return false;
            }
          }

          // Filtro por dormitorios
          if (filterValues.bedrooms) {
            const minBedrooms = parseInt(filterValues.bedrooms);
            const totalRooms = (prop.room_amount || 0) + (prop.suite_amount || 0);
            if (totalRooms < minBedrooms) {
              return false;
            }
          }

          // Filtro por cochera
          if (filterValues.has_parking === 'yes' && (!prop.parking_lot_amount || prop.parking_lot_amount === 0)) {
            return false;
          }
          if (filterValues.has_parking === 'no' && prop.parking_lot_amount && prop.parking_lot_amount > 0) {
            return false;
          }

          // Filtro por pileta
          if (filterValues.has_pool === 'yes') {
            const hasPool = prop.tags?.some(tag => 
              tag.name.toLowerCase().includes('pool') || 
              tag.name.toLowerCase().includes('swimming')
            ) || prop.custom_tags?.some(tag =>
              tag.name.toLowerCase().includes('pileta') || 
              tag.name.toLowerCase().includes('piscina')
            );
            if (!hasPool) return false;
          }

          // Filtro por apto crédito
          if (filterValues.credit_eligible === 'yes') {
            const isCreditEligible = 
              prop.tags?.some(tag => tag.name.toLowerCase().includes('credit')) ||
              prop.custom_tags?.some(tag => tag.name.toLowerCase().includes('crédito'));
            if (!isCreditEligible) return false;
          }

          // Filtro por precio máximo
          if (filterValues.max_price) {
            const maxPrice = parseFloat(filterValues.max_price);
            const propertyPrice = prop.operations?.[0]?.prices?.[0]?.price;
            if (propertyPrice && propertyPrice > maxPrice) {
              return false;
            }
          }

          return true;
        });
      }

      setProperties(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar propiedades');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const sortProperties = (criteria: SortOption) => {
    const sorted = [...properties].sort((a, b) => {
      switch (criteria) {
        case 'surface':
          return (b.total_surface || b.surface || 0) - (a.total_surface || a.surface || 0);
        case 'roofed_surface':
          return (b.roofed_surface || 0) - (a.roofed_surface || 0);
        case 'price':
          const priceA = a.operations?.[0]?.prices?.[0]?.price || 0;
          const priceB = b.operations?.[0]?.prices?.[0]?.price || 0;
          return priceB - priceA;
        case 'recent':
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        default:
          return 0;
      }
    });
    setDisplayedProperties(sorted);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    fetchProperties(newFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Propiedades Disponibles</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Encuentra tu propiedad ideal entre nuestras opciones
      </p>

      {/* Filtros */}
      <PropertyFilters onFilterChange={handleFilterChange} />

      {/* Barra de ordenamiento y resultados */}
      {!loading && properties.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Mostrando <span className="font-semibold">{displayedProperties.length}</span> propiedades
          </p>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Ordenar por:
            </label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="recent">Más recientes</option>
              <option value="price">Precio (mayor a menor)</option>
              <option value="surface">Superficie terreno (mayor a menor)</option>
              <option value="roofed_surface">Superficie cubierta (mayor a menor)</option>
            </select>
          </div>
        </div>
      )}

      {/* Estado de carga */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Cargando propiedades...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Error al cargar propiedades</p>
          <p>{error}</p>
        </div>
      )}

      {/* Grid de propiedades */}
      {!loading && displayedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No se encontraron propiedades con los filtros seleccionados.
            </p>
          </div>
        )
      )}
    </div>
  );
}