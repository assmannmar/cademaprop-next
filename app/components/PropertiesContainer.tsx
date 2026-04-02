'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PropertyFilters from '@/app/components/PropertyFilters';
import PropertyCard from '@/app/components/PropertyCard';
import type { FilterValues } from '@/app/components/PropertyFilters';
import { buildSearchUrl } from '@/utils/urlHelpers';

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

type SortOption = 'recent_desc' | 'recent_asc' | 'price_desc' | 'price_asc' | 'surface_desc' | 'surface_asc' | 'roofed_desc' | 'roofed_asc';

export default function PropertiesContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent_desc');
  
  // Filtros pendientes (no aplicados hasta hacer click en Buscar)
  const [pendingFilters, setPendingFilters] = useState<FilterValues>({
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

  // Cargar filtros desde URL al iniciar
  useEffect(() => {
    const initialFilters: FilterValues = {
      division: searchParams.get('division') || '',
      location: searchParams.get('ubicacion') || '',
      operation_type: searchParams.get('operacion') || '',
      property_type: searchParams.get('tipo') || '',
      bedrooms: searchParams.get('dormitorios') || '',
      has_parking: searchParams.get('cochera') || '',
      has_pool: searchParams.get('pileta') || '',
      credit_eligible: searchParams.get('credito') || '',
      max_price: searchParams.get('precio-max') || '',
    };
    
    setPendingFilters(initialFilters);
    fetchProperties(initialFilters);
  }, []);

  // El ordenamiento se aplica automáticamente cuando cambian las propiedades
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
        console.log('🔍 Filtros aplicados:', filterValues);
        
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
          const normalize = (text: string) =>
            text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          
          const creditField = (prop as any).credit_eligible;

          const hasPropertyField = creditField === 'Eligible';
          const hasTag = prop.tags?.some(tag => normalize(tag.name).includes('credit'));
          const hasCustomTag = prop.custom_tags?.some(tag => normalize(tag.name).includes('credito'));

          const isCreditEligible = hasPropertyField || hasTag || hasCustomTag;

          // SI = solo apto crédito
          if (filterValues.credit_eligible === 'Eligible' && !isCreditEligible) {
            return false;
          }

          // NO = no apto crédito + no especificado
          if (filterValues.credit_eligible === 'Not eligible' && isCreditEligible) {
            return false;
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
        case 'surface_desc':
          return (b.total_surface || b.surface || 0) - (a.total_surface || a.surface || 0);
        case 'surface_asc':
          return (a.total_surface || a.surface || 0) - (b.total_surface || b.surface || 0);
        case 'roofed_desc':
          return (b.roofed_surface || 0) - (a.roofed_surface || 0);
        case 'roofed_asc':
          return (a.roofed_surface || 0) - (b.roofed_surface || 0);
        case 'price_desc':
          const priceA_desc = a.operations?.[0]?.prices?.[0]?.price || 0;
          const priceB_desc = b.operations?.[0]?.prices?.[0]?.price || 0;
          return priceB_desc - priceA_desc;
        case 'price_asc':
          const priceA_asc = a.operations?.[0]?.prices?.[0]?.price || 0;
          const priceB_asc = b.operations?.[0]?.prices?.[0]?.price || 0;
          return priceA_asc - priceB_asc;
        case 'recent_desc':
          const dateA_desc = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB_desc = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB_desc - dateA_desc;
        case 'recent_asc':
          const dateA_asc = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB_asc = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateA_asc - dateB_asc;
        default:
          return 0;
      }
    });
    setDisplayedProperties(sorted);
  };

  // Manejar cambios en los filtros (solo actualiza el estado local)
  const handleFilterChange = (newFilters: FilterValues) => {
    setPendingFilters(newFilters);
  };

  // Aplicar filtros y actualizar URL
  const handleSearch = () => {
    // Actualizar URL
    const newUrl = buildSearchUrl({
      division: pendingFilters.division,
      location: pendingFilters.location,
      operation_type: pendingFilters.operation_type,
      property_type: pendingFilters.property_type,
      bedrooms: pendingFilters.bedrooms,
      has_parking: pendingFilters.has_parking,
      has_pool: pendingFilters.has_pool,
      credit_eligible: pendingFilters.credit_eligible,
      max_price: pendingFilters.max_price,
    });
    
    router.push(newUrl);
    
    // Aplicar filtros
    fetchProperties(pendingFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  return (
    <div className="w-full">
      {/* PORTADA */}
      <section
        className="relative w-full min-h-[60vh] md:min-h-[68vh] flex items-end"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.28) 35%, rgba(0,0,0,0.12) 100%), url('carousel/2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="w-full px-6 md:px-10 lg:px-16 pb-10 md:pb-14 lg:pb-16 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-white uppercase font-extrabold tracking-[0.08em] text-4xl md:text-6xl lg:text-7xl leading-none">
              Propiedades
            </h1>

            <p className="mt-4 text-white/90 text-sm md:text-lg lg:text-xl max-w-2xl">
              Encuentra tu propiedad ideal entre nuestras opciones
            </p>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="container mx-auto px-4 py-10">
        <PropertyFilters
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          initialFilters={pendingFilters}
        />

        {!loading && properties.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-8">
            <p className="text-gray-600 dark:text-gray-400">
              Mostrando <span className="font-semibold">{displayedProperties.length}</span>{' '}
              propiedades
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
                <option value="recent_desc">Más recientes primero</option>
                <option value="recent_asc">Más antiguos primero</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="surface_desc">Sup. terreno: mayor a menor</option>
                <option value="surface_asc">Sup. terreno: menor a mayor</option>
                <option value="roofed_desc">Sup. cubierta: mayor a menor</option>
                <option value="roofed_asc">Sup. cubierta: menor a mayor</option>
              </select>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Cargando propiedades...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error al cargar propiedades</p>
            <p>{error}</p>
          </div>
        )}

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
      </section>
    </div>
  );
}