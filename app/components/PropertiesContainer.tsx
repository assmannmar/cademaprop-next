'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PropertyFilters from '@/app/components/PropertyFilters';
import PropertyCard from '@/app/components/PropertyCard';
import type { FilterValues } from '@/app/components/PropertyFilters';
import { buildSearchUrl } from '@/utils/urlHelpers';
import { apiUrl } from "@/lib/api";

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
  surface?: number | string;
  roofed_surface?: number | string;
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
    total_pages?: number;
    page?: number;
  };
}

type SortOption =
  | 'recent_desc'
  | 'recent_asc'
  | 'price_desc'
  | 'price_asc'
  | 'surface_desc'
  | 'surface_asc'
  | 'roofed_desc'
  | 'roofed_asc';

const ITEMS_PER_PAGE = 30;

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

export default function PropertiesContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent_desc');
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pendingFilters, setPendingFilters] = useState<FilterValues>(emptyFilters);

  const getCurrentPage = () => {
    const pageParam = Number(searchParams.get('page') || '1');
    return Number.isFinite(pageParam) && pageParam > 0 ? Math.trunc(pageParam) : 1;
  };

  const getFiltersFromUrl = (): FilterValues => ({
    division: searchParams.get('division') || '',
    location: searchParams.get('ubicacion') || '',
    operation_type: searchParams.get('operacion') || searchParams.get('operation') || '',
    property_type: searchParams.get('tipo') || '',
    bedrooms: searchParams.get('dormitorios') || '',
    has_parking: searchParams.get('cochera') || '',
    has_pool: searchParams.get('pileta') || '',
    credit_eligible: searchParams.get('credito') || '',
    max_price: searchParams.get('precio-max') || '',
  });

  const getSortFromUrl = (): SortOption => {
    const sort = searchParams.get('orden') as SortOption | null;
    const validSorts: SortOption[] = [
      'recent_desc',
      'recent_asc',
      'price_desc',
      'price_asc',
      'surface_desc',
      'surface_asc',
      'roofed_desc',
      'roofed_asc',
    ];

    return sort && validSorts.includes(sort) ? sort : 'recent_desc';
  };

  const buildApiQuery = (filterValues: FilterValues, page: number) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(ITEMS_PER_PAGE),
      sort: getSortFromUrl(),
    });

    const apiParamMap: Record<keyof FilterValues, string> = {
      division: 'division',
      location: 'location',
      operation_type: 'operation_type',
      property_type: 'property_type',
      bedrooms: 'bedrooms',
      has_parking: 'has_parking',
      has_pool: 'has_pool',
      credit_eligible: 'credit_eligible',
      max_price: 'max_price',
    };

    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        params.set(apiParamMap[key as keyof FilterValues], value);
      }
    });

    return params.toString();
  };

  const fetchProperties = async (filterValues: FilterValues, page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl("properties")}?${buildApiQuery(filterValues, page)}`);

      if (!response.ok) {
        throw new Error(`Error al cargar propiedades: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      setProperties(data.objects || []);
      setTotalProperties(data.meta?.total_count || 0);
      setTotalPages(Math.max(data.meta?.total_pages || 1, 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar propiedades');
      setProperties([]);
      setTotalProperties(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialFilters = getFiltersFromUrl();
    setPendingFilters(initialFilters);
    setSortBy(getSortFromUrl());
    fetchProperties(initialFilters, getCurrentPage());
  }, [searchParams]);

  useEffect(() => {
    setDisplayedProperties(properties);
  }, [properties]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setPendingFilters(newFilters);
  };

  const handleSearch = (filtersOverride?: FilterValues) => {
    const filtersToApply = filtersOverride || pendingFilters;
    const nextUrl = buildSearchUrl({ ...filtersToApply });
    const params = new URLSearchParams(nextUrl.split('?')[1] || '');
    const currentSort = getSortFromUrl();

    if (currentSort !== 'recent_desc') {
      params.set('orden', currentSort);
    }

    const queryString = params.toString();
    router.push(`/propiedades${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const goToPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage === 1) {
      params.delete('page');
    } else {
      params.set('page', String(nextPage));
    }

    const queryString = params.toString();
    router.push(`/propiedades${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const paginationItems = () => {
    const currentPage = getCurrentPage();
    const pages = new Set<number>([1, totalPages]);

    for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
      if (page >= 1 && page <= totalPages) {
        pages.add(page);
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextSort = e.target.value as SortOption;

    setSortBy(nextSort);
    params.set('orden', nextSort);
    params.delete('page');

    const queryString = params.toString();
    router.push(`/propiedades${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const currentPage = getCurrentPage();

  const PaginationControls = ({ className = '' }: { className?: string }) => {
    if (totalPages <= 1) return null;

    return (
      <nav
        className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
        aria-label="Paginacion de propiedades"
      >
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>

        {paginationItems().map((page, index, pages) => (
          <div key={page} className="flex items-center gap-2">
            {index > 0 && page - pages[index - 1] > 1 && (
              <span className="px-1 text-gray-400">...</span>
            )}
            <button
              onClick={() => goToPage(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`h-10 min-w-10 rounded-md border px-3 text-sm font-semibold transition ${
                currentPage === page
                  ? 'border-red-600 bg-red-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          </div>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente
        </button>
      </nav>
    );
  };

  return (
    <div className="w-full">
      <section
        className="relative w-full min-h-[60vh] md:min-h-[60vh] flex items-end"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.35) 100%), url('/carousel/2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-8 lg:px-6 pb-10 md:pb-14 lg:pb-16 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-white uppercase font-extrabold tracking-[0.08em] text-[clamp(2.4rem,5vw,4.3rem)] leading-none">
              Propiedades
            </h1>

            <p className="mt-4 text-white/90 text-sm md:text-lg lg:text-xl max-w-2xl">
              Encontrá tu propiedad ideal entre nuestras opciones
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <PropertyFilters
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          initialFilters={pendingFilters}
        />

        {!loading && properties.length > 0 && (
          <div className="grid gap-4 mb-6 mt-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold">{displayedProperties.length}</span> de{' '}
              <span className="font-semibold">{totalProperties}</span> propiedades
            </p>

            <PaginationControls className="lg:justify-center" />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:justify-end">
              <label className="text-sm font-semibold text-gray-700 ">
                Ordenar por:
              </label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
            <p className="mt-4 text-lg text-gray-600">
              Cargando propiedades...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400  text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error al cargar propiedades</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && displayedProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>

            <PaginationControls className="mt-10" />
          </>
        ) : (
          !loading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                No se encontraron propiedades con los filtros seleccionados.
              </p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
