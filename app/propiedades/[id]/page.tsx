'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

interface Property {
  id: number;
  publication_title?: string;
  address?: string;
  fake_address?: string;
  description?: string;
  rich_description?: string;
  location?: {
    name: string;
    short_location?: string;
    full_location?: string;
  };
  geo_lat?: string;
  geo_long?: string;
  operations?: Array<{
    operation_type: string;
    prices?: Array<{
      price: number;
      currency: string;
      web_price?: boolean;
    }>;
  }>;
  type?: { name: string };
  development?: {
    type?: { name: string };
  };
  suite_amount?: number;
  room_amount?: number;
  bathroom_amount?: number;
  toilet_amount?: number;
  parking_lot_amount?: number;
  surface?: number;
  roofed_surface?: number;
  total_surface?: number;
  front_measure?: string;
  depth_measure?: string;
  age?: number;
  orientation?: string;
  disposition?: string;
  credit_eligible?: string;
  expenses?: number;
  photos?: Array<{
    image: string;
    original?: string;
    description?: string;
    is_blueprint?: boolean;
    is_front_cover?: boolean;
  }>;
  videos?: Array<{
    player_url: string;
    title?: string;
  }>;
  tags?: Array<{ name: string }>;
  custom_tags?: Array<{ name: string; group_name?: string }>;
  branch?: {
    name: string;
    phone?: string;
    phone_area?: string;
    email?: string;
    address?: string;
  };
}

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [currentUrl, setCurrentUrl] = useState('');
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, property, selectedImage]);

  const fetchProperty = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Error al cargar la propiedad');

      const data = await response.json();
      const foundProperty = data.objects.find((p: Property) => p.id === parseInt(id as string));

      if (!foundProperty) throw new Error('Propiedad no encontrada');

      setProperty(foundProperty);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const translateOperationType = (type: string) => {
    const translations: Record<string, string> = {
      Sale: 'Venta',
      Rental: 'Alquiler',
      'Temporary Rental': 'Alquiler Temporal',
    };
    return translations[type] || type;
  };

  const translatePropertyType = (type: string) => {
    const translations: Record<string, string> = {
      House: 'Casa',
      'Weekend House': 'Casa de Fin de Semana',
      Apartment: 'Departamento',
      Land: 'Terreno',
      Commercial: 'Comercial',
      Office: 'Oficina',
      Building: 'Edificio',
      PH: 'PH',
      'Industrial Ship': 'Nave Industrial',
    };
    return translations[type] || type;
  };

  const translateOrientation = (orientation: string) => {
    const translations: Record<string, string> = {
      North: 'Norte',
      South: 'Sur',
      East: 'Este',
      West: 'Oeste',
      Northeast: 'Noreste',
      Northwest: 'Noroeste',
      Southeast: 'Sudeste',
      Southwest: 'Sudoeste',
    };
    return translations[orientation] || orientation;
  };

  const translateCreditEligible = (credit: string) => {
    const translations: Record<string, string> = {
      Eligible: 'Sí',
      'Not specified': 'No',
      Yes: 'Sí',
      No: 'No',
    };
    return translations[credit] || credit;
  };

  const formatCurrency = (currency?: string) => {
    if (!currency) return 'USD';
    if (currency.toUpperCase() === 'USD') return 'U$S';
    return currency;
  };

  const formatNumber = (value?: number | string, decimals = 0) => {
    if (value === undefined || value === null || value === '') return null;
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    return num.toLocaleString('es-AR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const nextImage = () => {
    if (!property?.photos) return;
    const normalPhotos = property.photos.filter((p) => !p.is_blueprint);
    if (normalPhotos.length <= 1) return;

    setSelectedImage((prev) => (prev === normalPhotos.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!property?.photos) return;
    const normalPhotos = property.photos.filter((p) => !p.is_blueprint);
    if (normalPhotos.length <= 1) return;

    setSelectedImage((prev) => (prev === 0 ? normalPhotos.length - 1 : prev - 1));
  };

  const photos = useMemo(
    () => property?.photos?.filter((p) => !p.is_blueprint) || [],
    [property]
  );

  const blueprints = useMemo(
    () => property?.photos?.filter((p) => p.is_blueprint) || [],
    [property]
  );

  useEffect(() => {
    if (photos.length <= 1 || autoplayPaused || isFullscreen) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [photos.length, autoplayPaused, isFullscreen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[100px] bg-white">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-red-600" />
          <p className="mt-4 text-lg text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-[100px] bg-white">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">Propiedad no encontrada</h1>
          <p className="mb-6 text-gray-600">{error}</p>
          <Link
            href="/propiedades"
            className="inline-flex rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Volver a Propiedades
          </Link>
        </div>
      </div>
    );
  }

  const mainOperation = property.operations?.[0];
  const webPrice = mainOperation?.prices?.find((p) => p.web_price);
  const price = webPrice?.price || mainOperation?.prices?.[0]?.price;
  const currency = webPrice?.currency || mainOperation?.prices?.[0]?.currency || 'USD';
  const operationType = translateOperationType(mainOperation?.operation_type || '');
  const propertyType = translatePropertyType(
    property.development?.type?.name || property.type?.name || 'Propiedad'
  );

  const displayAddress = property.fake_address || property.address || 'Consultar ubicación';
  const totalRooms = (property.room_amount || 0) + (property.suite_amount || 0);

  const isCreditEligible =
    property.credit_eligible === 'Eligible' ||
    property.credit_eligible === 'Yes' ||
    property.tags?.some((tag) => tag.name.toLowerCase().includes('credit')) ||
    property.custom_tags?.some((tag) => tag.name.toLowerCase().includes('crédito'));

  const description = property.rich_description || property.description || null;
  const heroImage = photos[0]?.original || photos[0]?.image || '';
  const title =
    property.publication_title ||
    `${propertyType} en ${operationType}${property.location?.name ? ` - ${property.location.name}` : ''}`;

  const specs = [
    totalRooms > 0 ? { label: 'Ambientes', value: totalRooms } : null,
    property.bathroom_amount ? { label: 'Baños', value: property.bathroom_amount } : null,
    property.parking_lot_amount && property.parking_lot_amount > 0
      ? { label: 'Cochera', value: property.parking_lot_amount }
      : null,
    property.surface ? { label: 'Terreno', value: `${formatNumber(property.surface)} m²` } : null,
    property.roofed_surface
      ? { label: 'Sup. cubierta', value: `${formatNumber(property.roofed_surface)} m²` }
      : null,
    property.age !== undefined && property.age !== null
      ? { label: 'Antigüedad', value: `${property.age} años` }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string | number }>;

  const detailRows = [
    { label: 'ID del inmueble', value: property.id },
    { label: 'Tipo de inmueble', value: propertyType },
    { label: 'Tipo de operación', value: operationType || '-' },
    price ? { label: 'Precio', value: `${formatCurrency(currency)} ${formatNumber(price)}` } : null,
    property.roofed_surface
      ? { label: 'Superficie cubierta', value: `${formatNumber(property.roofed_surface)} m²` }
      : null,
    property.surface
      ? { label: 'Superficie terreno', value: `${formatNumber(property.surface)} m²` }
      : null,
    property.total_surface
      ? { label: 'Superficie total', value: `${formatNumber(property.total_surface)} m²` }
      : null,
    property.front_measure && parseFloat(property.front_measure) > 0
      ? { label: 'Frente', value: `${formatNumber(property.front_measure)} m` }
      : null,
    property.depth_measure && parseFloat(property.depth_measure) > 0
      ? { label: 'Fondo', value: `${formatNumber(property.depth_measure)} m` }
      : null,
    property.orientation
      ? { label: 'Orientación', value: translateOrientation(property.orientation) }
      : null,
    property.disposition ? { label: 'Disposición', value: property.disposition } : null,
    property.age !== undefined && property.age !== null
      ? { label: 'Antigüedad', value: `${property.age} años` }
      : null,
    property.credit_eligible
      ? { label: 'Apto crédito', value: translateCreditEligible(property.credit_eligible) }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string | number }>;

  return (
    <>
      <div className="bg-[#f5f3ef] text-[#1f1f1f]">
        <section className="relative isolate min-h-[75vh] overflow-hidden">
          {heroImage && (
            <img
              src={heroImage}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/35" />

          <div className="relative z-10 flex min-h-[75vh] items-end">
            <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-32 sm:px-6 lg:px-8 lg:pb-14">
              <div className="max-w-4xl text-white">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
                    {propertyType} en {operationType}
                  </span>

                  {isCreditEligible && (
                    <span className="rounded-full border border-white/25 bg-emerald-500/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur-sm">
                      Apto crédito
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-bold leading-none sm:text-5xl lg:text-7xl">
                  {title}
                </h1>

                <div className="mt-4 flex items-start gap-2 text-base text-white/90 sm:text-xl">
                  <span className="mt-1">📍</span>
                  <span>{displayAddress}</span>
                </div>

                {specs.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/95 sm:text-lg">
                    {specs.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                        <span>
                          <strong className="font-semibold">{item.value}</strong> {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    {price && price > 0 ? (
                      <>
                        <p className="mb-1 text-sm uppercase tracking-[0.16em] text-white/75">
                          Precio
                        </p>
                        <p className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                          {formatCurrency(currency)} {formatNumber(price)}
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl font-bold sm:text-3xl">Consultar precio</p>
                    )}
                  </div>

                  <a
                    href="#consulta"
                    className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1f1f1f] transition hover:scale-[1.02] hover:bg-white/90"
                  >
                    Consultar por esta propiedad
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto -mt-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-[28px] bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-5"
            onMouseEnter={() => setAutoplayPaused(true)}
            onMouseLeave={() => setAutoplayPaused(false)}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Galería
                </p>
                <h2 className="mt-1 text-xl font-bold sm:text-2xl">Recorré la propiedad</h2>
              </div>

              {photos.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevImage}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-100"
                    aria-label="Imagen anterior"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-100"
                    aria-label="Imagen siguiente"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            {photos.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="group relative block h-[260px] w-full overflow-hidden rounded-[24px] bg-gray-200 sm:h-[360px] lg:h-[520px]"
                >
                  <img
                    src={photos[selectedImage]?.image}
                    alt={photos[selectedImage]?.description || title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                    {selectedImage + 1} / {photos.length}
                  </div>
                </button>

                {photos.length > 1 && (
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                    {photos.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(idx)}
                        className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-2xl border transition sm:h-24 sm:w-36 ${
                          selectedImage === idx
                            ? 'border-red-600 ring-2 ring-red-200'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={photo.image}
                          alt={`Miniatura ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="space-y-8">
              <div className="rounded-[28px] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] sm:p-8">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Propiedad
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <Link href="/" className="hover:text-red-600">
                      Inicio
                    </Link>
                    <span>/</span>
                    <Link href="/propiedades" className="hover:text-red-600">
                      Propiedades
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-gray-800">#{property.id}</span>
                  </div>
                </div>

                {description && (
                  <div className="mb-8">
                    <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Descripción</h2>
                    <div
                      className="prose prose-gray max-w-none leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: property.rich_description || description.replace(/\n/g, '<br />'),
                      }}
                    />
                  </div>
                )}

                <div className="rounded-[24px] border border-gray-200 p-5 sm:p-6">
                  <h3 className="mb-5 text-xl font-bold sm:text-2xl">Características</h3>

                  <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                    {detailRows.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start justify-between gap-4 border-b border-gray-100 py-2"
                      >
                        <span className="text-sm font-medium text-gray-500">{item.label}</span>
                        <span className="text-right text-sm font-semibold text-gray-900">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {property.tags && property.tags.length > 0 && (
                    <div className="mt-6">
                      <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                        Amenities / destacados
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {property.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-[#f4f1ec] px-3 py-1.5 text-sm text-gray-700"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {property.geo_lat && property.geo_long && (
                <div className="rounded-[28px] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] sm:p-8">
                  <h2 className="mb-5 text-2xl font-bold sm:text-3xl">Ubicación</h2>
                  <div className="overflow-hidden rounded-[24px] border border-gray-200">
                    <iframe
                      width="100%"
                      height="420"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps?q=${property.geo_lat},${property.geo_long}&z=15&output=embed`}
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {blueprints.length > 0 && (
                <div className="rounded-[28px] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] sm:p-8">
                  <h2 className="mb-5 text-2xl font-bold sm:text-3xl">Planos</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {blueprints.map((blueprint, idx) => (
                      <img
                        key={idx}
                        src={blueprint.image}
                        alt={`Plano ${idx + 1}`}
                        className="w-full rounded-[20px] border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {property.videos && property.videos.length > 0 && (
                <div className="rounded-[28px] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] sm:p-8">
                  <h2 className="mb-5 text-2xl font-bold sm:text-3xl">Videos</h2>
                  <div className="space-y-4">
                    {property.videos.map((video, idx) => (
                      <iframe
                        key={idx}
                        src={video.player_url}
                        className="h-72 w-full rounded-[20px]"
                        allowFullScreen
                        title={video.title || `Video ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:pt-2">
              <div
                id="consulta"
                className="rounded-[28px] bg-white p-6 shadow-[0_18px_48px_rgba(0,0,0,0.08)] lg:sticky lg:top-24"
              >
                {isCreditEligible && (
                  <div className="mb-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Apto crédito
                  </div>
                )}

                <div className="mb-6 border-b border-gray-200 pb-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Precio
                  </p>
                  {price && price > 0 ? (
                    <p className="text-3xl font-bold leading-none text-[#8f3f2d] sm:text-4xl">
                      {formatCurrency(currency)} {formatNumber(price)}
                    </p>
                  ) : (
                    <p className="text-2xl font-bold text-gray-700">Consultar precio</p>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="mb-4 text-2xl font-bold">Dejanos tu consulta</h3>

                  <div className="min-h-[560px] w-full">
                    <div
                      id="polite-slide-in-right-OWI77RP94NZkMNa4BIaz"
                      className="ventux-container"
                      data-layout='{"id":"POLITE_SLIDE_IN","minimizedTitle":"","isLeftAligned":false,"isRightAligned":true,"allowMinimize":false}'
                      data-trigger-type="alwaysShow"
                      data-activation-type="alwaysActivated"
                      data-form-name={`Propiedad ${property.fake_address || property.id}`}
                      data-form-id="OWI77RP94NZkMNa4BIaz"
                      data-source={currentUrl}
                    />
                  </div>
                </div>

                {property.branch && (
                  <div className="border-t border-gray-200 pt-6 text-sm text-gray-600">
                    <h4 className="mb-3 text-base font-bold text-gray-900">{property.branch.name}</h4>

                    {property.branch.address && <p className="mb-2">📍 {property.branch.address}</p>}
                    {property.branch.phone && (
                      <p className="mb-2">
                        📞 {property.branch.phone_area ? `(${property.branch.phone_area}) ` : ''}
                        {property.branch.phone}
                      </p>
                    )}
                    {property.branch.email && <p>✉️ {property.branch.email}</p>}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

        {isFullscreen && photos.length > 0 && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute right-4 top-4 z-10 text-white transition hover:text-red-400"
              aria-label="Cerrar"
            >
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={photos[selectedImage]?.image}
              alt={photos[selectedImage]?.description || title}
              className="max-h-[92vh] max-w-[94vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-4 text-white transition hover:bg-white/30"
                  aria-label="Imagen anterior"
                >
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-4 text-white transition hover:bg-white/30"
                  aria-label="Imagen siguiente"
                >
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-5 py-2 text-sm font-medium text-white">
              {selectedImage + 1} / {photos.length}
            </div>
          </div>
        )}

        <Script
          src="https://link.ventux.io/js/form_embed.js"
          strategy="afterInteractive"
          onLoad={() => {
            // @ts-ignore
            if (window.initVentux) window.initVentux();
          }}
        />
      </div>
    </>
  );
}