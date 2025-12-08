'use client';

import { useState, useEffect } from 'react';
import PropertyFilters from '@/app/components/PropertyFilters';
import PropertyCard from '@/app/components/PropertyCard';

interface FilterValues {
  operation_type: string;
  property_type: string;
  min_price: string;
  max_price: string;
  limit: string;
}

interface Property {
  id: number;
  title: string;
  address?: string;
  price?: number;
  currency?: string;
  operation_type?: { name: string };
  property_type?: { name: string };
  description?: string;
  operations?: Array<{
    prices?: Array<{
      price: number;
      currency: string;
    }>;
  }>;
}

interface ApiResponse {
  objects: Property[];
  meta: {
    limit: number;
    offset: number;
    total_count?: number;
  };
}

export default function PropertiesContainer() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<FilterValues>({
    operation_type: '',
    property_type: '',
    min_price: '',
    max_price: '',
    limit: '50',
  });

  // Fetch inicial de propiedades
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (filterValues?: FilterValues) => {
    setLoading(true);
    setError(null);

    try {
      const filtersToUse = filterValues || filters;
      const queryParams = new URLSearchParams();

      queryParams.append('limit', filtersToUse.limit);
      
      if (filtersToUse.operation_type) {
        queryParams.append('operation_type', filtersToUse.operation_type);
      }
      if (filtersToUse.property_type) {
        queryParams.append('property_type', filtersToUse.property_type);
      }
      if (filtersToUse.min_price) {
        queryParams.append('min_price', filtersToUse.min_price);
      }
      if (filtersToUse.max_price) {
        queryParams.append('max_price', filtersToUse.max_price);
      }

      const response = await fetch(`/api/properties?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Error al cargar propiedades: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      // Extrae precio de la estructura anidada de Tokko si es necesario
      const processedProperties = data.objects.map((prop) => {
        if (!prop.price && prop.operations?.[0]?.prices?.[0]) {
          return {
            ...prop,
            price: prop.operations[0].prices[0].price,
            currency: prop.operations[0].prices[0].currency,
          };
        }
        return prop;
      });

      setProperties(processedProperties);
      setTotalCount(data.meta.total_count || data.objects.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar propiedades');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Propiedades Disponibles</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Encuentra tu propiedad ideal entre nuestras opciones
      </p>

      {/* Filtros */}
      <PropertyFilters onFilterChange={handleFilterChange} />

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

      {/* Información de resultados */}
      {!loading && properties.length > 0 && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Mostrando <span className="font-semibold">{properties.length}</span> de{' '}
          <span className="font-semibold">{totalCount}</span> propiedades
        </p>
      )}

      {/* Grid de propiedades */}
      {!loading && properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              address={property.address}
              price={property.price}
              currency={property.currency}
              operation_type={property.operation_type}
              property_type={property.property_type}
              description={property.description}
            />
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
