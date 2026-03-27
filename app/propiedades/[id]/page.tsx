'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import FullScreenLoader from '@/app/components/loader';

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
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); 
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Cargar script de Ventux para el formulario
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://link.ventux.io/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpiar el script al desmontar el componente
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Manejar teclas del teclado para navegación en pantalla completa
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, selectedImage]); // Dependencias para que las funciones siempre tengan el estado actualizado

  const fetchProperty = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Error al cargar la propiedad');
      }

      const data = await response.json();
      const foundProperty = data.objects.find((p: Property) => p.id === parseInt(id as string));

      if (!foundProperty) {
        throw new Error('Propiedad no encontrada');
      }

      setProperty(foundProperty);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Funciones de navegación de imágenes
  const nextImage = () => {
    if (!property?.photos) return;
    const photos = property.photos.filter(p => !p.is_blueprint);
    setSelectedImage((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!property?.photos) return;
    const photos = property.photos.filter(p => !p.is_blueprint);
    setSelectedImage((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  // Traducciones
  const translateOperationType = (type: string) => {
    const translations: Record<string, string> = {
      'Sale': 'Venta',
      'Rental': 'Alquiler',
      'Temporary Rental': 'Alquiler Temporal',
    };
    return translations[type] || type;
  };

  const translatePropertyType = (type: string) => {
    const translations: Record<string, string> = {
      'House': 'Casa',
      'Weekend House': 'Casa de Fin de Semana',
      'Apartment': 'Departamento',
      'Land': 'Terreno',
      'Commercial': 'Comercial',
      'Office': 'Oficina',
      'Building': 'Edificio',
      'PH': 'PH',
      'Industrial Ship': 'Nave Industrial',
    };
    return translations[type] || type;
  };

  const translateOrientation = (orientation: string) => {
    const translations: Record<string, string> = {
      'North': 'Norte',
      'South': 'Sur',
      'East': 'Este',
      'West': 'Oeste',
      'Northeast': 'Noreste',
      'Northwest': 'Noroeste',
      'Southeast': 'Sudeste',
      'Southwest': 'Sudoeste',
    };
    return translations[orientation] || orientation;
  };

  const translateCreditEligible = (credit: string) => {
    const translations: Record<string, string> = {
      'Eligible': 'Sí',
      'Not specified': 'No',
    };
    return translations[credit] || credit;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center  pt-[100px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4  pt-[100px]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Propiedad no encontrada</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/propiedades" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
            Volver a Propiedades
          </Link>
        </div>
      </div>
    );
  }

  const mainOperation = property.operations?.[0];
  const webPrice = mainOperation?.prices?.find(p => p.web_price);
  const price = webPrice?.price || mainOperation?.prices?.[0]?.price;
  const currency = webPrice?.currency || mainOperation?.prices?.[0]?.currency || 'USD';
  const operationType = translateOperationType(mainOperation?.operation_type || '');
  
  // Tipo de propiedad (priorizar development.type si existe)
  const propertyType = translatePropertyType(
    property.development?.type?.name || property.type?.name || 'Propiedad'
  );
  
  const displayAddress = property.fake_address || property.address || 'Consultar ubicación';
  const totalRooms = (property.room_amount || 0) + (property.suite_amount || 0);

  // Filtrar fotos (excluir blueprints)
  const photos = property.photos?.filter(p => !p.is_blueprint) || [];
  const blueprints = property.photos?.filter(p => p.is_blueprint) || [];

  // check apto credito
  const isCreditEligible = 
    property.credit_eligible === 'Eligible' ||
    property.tags?.some(tag => tag.name.toLowerCase().includes('credit')) ||
    property.custom_tags?.some(tag => tag.name.toLowerCase().includes('crédito'));

  // Descripción con formato
  const description = property.rich_description || property.description || null;

  return (
    <>
    {loading && <FullScreenLoader />}
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-12">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-red-600">Inicio</Link>
          {' > '}
          <Link href="/propiedades" className="hover:text-red-600">Propiedades</Link>
          {' > '}
          <span className="text-gray-800 font-semibold">Propiedad #{property.id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA - Galería e Info */}
          <div className="lg:col-span-2">
            
            {/* Galería de Imágenes */}
            {photos.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                {/* Imagen Principal */}
                <div className="relative w-full h-96 bg-gray-200">
                  <img
                    src={photos[selectedImage]?.image}
                    alt={property.publication_title}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => setIsFullscreen(true)}
                  />
                  
                  {/* Botones de navegación */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                        aria-label="Imagen anterior"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                        aria-label="Imagen siguiente"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Contador */}
                  <div className="absolute bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    {selectedImage + 1} / {photos.length}
                  </div>

                  {/* Botón pantalla completa */}
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white p-2 rounded-lg transition"
                    aria-label="Pantalla completa"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                </div>

                {/* Miniaturas */}
                {photos.length > 1 && (
                  <div className="p-4 bg-gray-50">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {photos.map((photo, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-3 transition-all hover:scale-105 ${
                            selectedImage === idx
                              ? 'border-red-600 ring-2 ring-red-600 ring-offset-2'
                              : 'border-gray-300 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={photo.image}
                            alt={`Miniatura ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Información Principal */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              {/* Código de propiedad */}
              <div className="mb-2">
                <span className="text-xs text-gray-500">Código: #{property.id}</span>
              </div>

              <div className="mb-4">
                <span className="text-sm font-semibold text-red-600 uppercase">
                  {propertyType} en {operationType}
                </span>
              </div>

              {/* Titular de Tokko */}
              <h1 className="text-3xl font-bold mb-2">
                {property.publication_title || `${propertyType} en ${property.location?.name}`}
              </h1>

              {/* Descripción automática */}
              <p className="text-lg text-gray-600 mb-4">
                {propertyType} en {operationType} en {property.location?.name}
              </p>

              {/* Dirección ficticia */}
              <p className="text-lg text-gray-600 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {displayAddress}
              </p>

              {/* Ubicación completa */}
              {property.location?.full_location && (
                <p className="text-sm text-gray-500 mb-6">
                  📍 {property.location.full_location}
                </p>
              )}

              {/* Características Principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                {totalRooms > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{totalRooms}</p>
                    <p className="text-sm text-gray-600">Ambientes</p>
                  </div>
                )}
                {property.bathroom_amount && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{property.bathroom_amount}</p>
                    <p className="text-sm text-gray-600">Baños</p>
                  </div>
                )}
                {property.parking_lot_amount && property.parking_lot_amount > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{property.parking_lot_amount}</p>
                    <p className="text-sm text-gray-600">Cocheras</p>
                  </div>
                )}
                {property.surface && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{property.surface}m²</p>
                    <p className="text-sm text-gray-600">Sup. Terreno</p>
                  </div>
                )}
                {property.roofed_surface && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{property.roofed_surface}m²</p>
                    <p className="text-sm text-gray-600">Sup. Cubierta</p>
                  </div>
                )}
                {property.front_measure && parseFloat(property.front_measure) > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{property.front_measure}m</p>
                    <p className="text-sm text-gray-600">Frente</p>
                  </div>
                )}
                {property.depth_measure && parseFloat(property.depth_measure) > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{property.depth_measure}m</p>
                    <p className="text-sm text-gray-600">Fondo</p>
                  </div>
                )}
                {property.age !== undefined && property.age !== null && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{property.age}</p>
                    <p className="text-sm text-gray-600">Años</p>
                  </div>
                )}
              </div>

              {/* Detalles adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                {property.orientation && (
                  <div className="flex justify-between border-b border-gray-200 py-2">
                    <span className="font-semibold text-gray-700">Orientación:</span>
                    <span className="text-gray-600">{translateOrientation(property.orientation)}</span>
                  </div>
                )}
                {property.disposition && (
                  <div className="flex justify-between border-b border-gray-200 py-2">
                    <span className="font-semibold text-gray-700">Disposición:</span>
                    <span className="text-gray-600">{property.disposition}</span>
                  </div>
                )}
                {property.credit_eligible && (
                  <div className="flex justify-between border-b border-gray-200 py-2">
                    <span className="font-semibold text-gray-700">Apto Crédito:</span>
                    <span className={`font-semibold ${property.credit_eligible === 'Yes' ? 'text-green-600' : 'text-gray-600'}`}>
                      {translateCreditEligible(property.credit_eligible)}
                    </span>
                  </div>
                )}
                {/* {property.expenses && property.expenses > 0 && (
                  <div className="flex justify-between border-b border-gray-200 py-2">
                    <span className="font-semibold text-gray-700">Expensas:</span>
                    <span className="text-gray-600">${property.expenses.toLocaleString('es-AR')}</span>
                  </div>
                )} */}
              </div>

              {/* Descripción */}
              {description && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-3 border-b pb-2">Descripción</h2>
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      // Si es rich_description lo pasa directo, si es texto plano respeta los saltos de línea
                      __html: property.rich_description || description.replace(/\n/g, '<br />') 
                    }}
                  />
                </div>
              )}

              {/* Amenities/Tags */}
              {property.tags && property.tags.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-3">Características</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mapa */}
            {property.geo_lat && property.geo_long && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Ubicación</h2>
                <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${property.geo_lat},${property.geo_long}&z=15&output=embed`}
                    allowFullScreen
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Coordenadas: {property.geo_lat}, {property.geo_long}
                </p>
              </div>
            )}

            {/* Planos */}
            {blueprints.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Planos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blueprints.map((blueprint, idx) => (
                    <img
                      key={idx}
                      src={blueprint.image}
                      alt={`Plano ${idx + 1}`}
                      className="w-full rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {property.videos && property.videos.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Videos</h2>
                {property.videos.map((video, idx) => (
                  <div key={idx} className="mb-4">
                    <iframe
                      src={video.player_url}
                      className="w-full h-64 rounded-lg"
                      allowFullScreen
                      title={video.title || `Video ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA - Precio y Contacto */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              
              {isCreditEligible && (
                <div className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md mb-2">
                  Apto Crédito
                </div>
              )}

              {/* Precio */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                {price && price > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 mb-1">Precio</p>
                    <p className="text-4xl font-bold text-red-600">
                      {currency} ${price.toLocaleString('es-AR')}
                    </p>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-gray-600">Consultar precio</p>
                )}
              </div>

              {/* Formulario de Contacto - Iframe */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Contactar</h3>
                <div className="w-full">
                  <iframe
                    src={`https://link.ventux.io/widget/form/OWI77RP94NZkMNa4BIaz?property_id=${property.id}`}
                    loading="lazy"
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '619px',
                      border: 'none',
                      borderRadius: '3px'
                    }}
                    id="inline-contact-form"
                    data-layout='{"id":"INLINE"}'
                    data-trigger-type="alwaysShow"
                    data-trigger-value=""
                    data-activation-type="alwaysActivated"
                    data-activation-value=""
                    data-deactivation-type="neverDeactivate"
                    data-deactivation-value=""
                    data-height="619"
                    data-layout-iframe-id="inline-contact-form"
                    data-form-name={`Propiedad ${property.id}`}
                    title={`Consulta Propiedad ${property.id}`}
                  />
                  <script src="https://link.ventux.io/js/form_embed.js"></script>
                </div>
              </div>

              {/* Info Sucursal */}
              {property.branch && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-bold mb-2">{property.branch.name}</h3>
                  {property.branch.phone && (
                    <p className="text-sm text-gray-600 mb-1">
                      📞 {property.branch.phone_area ? `(${property.branch.phone_area}) ` : ''}{property.branch.phone}
                    </p>
                  )}
                  {property.branch.email && (
                    <p className="text-sm text-gray-600 mb-1">📧 {property.branch.email}</p>
                  )}
                  {property.branch.address && (
                    <p className="text-sm text-gray-600">📍 {property.branch.address}</p>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modal Pantalla Completa */}
      {isFullscreen && photos.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-red-500 transition z-10"
            aria-label="Cerrar"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img
            src={photos[selectedImage]?.image}
            alt={photos[selectedImage]?.description || property.publication_title}
            className="max-w-[95vw] max-h-[95vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition"
                aria-label="Imagen anterior"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition"
                aria-label="Imagen siguiente"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg text-lg font-medium">
            {selectedImage + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
    </>
  );
}