'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Property {
  id: number;
  publication_title?: string;
  address?: string;
  fake_address?: string;
  description?: string;
  location?: {
    name: string;
    short_location?: string;
    full_location?: string;
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
  toilet_amount?: number;
  parking_lot_amount?: number;
  surface?: number;
  roofed_surface?: number;
  total_surface?: number;
  age?: number;
  photos?: Array<{
    image: string;
    original?: string;
    description?: string;
    is_blueprint?: boolean;
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

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

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
      'Apartment': 'Departamento',
      'Land': 'Terreno',
      'Commercial': 'Comercial',
      'Office': 'Oficina',
      'Building': 'Edificio',
      'PH': 'PH',
    };
    return translations[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
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
  const price = mainOperation?.prices?.[0]?.price;
  const currency = mainOperation?.prices?.[0]?.currency || 'USD';
  const operationType = translateOperationType(mainOperation?.operation_type || '');
  const propertyType = translatePropertyType(property.type?.name || '');
  const displayAddress = property.fake_address || property.address || 'Consultar ubicación';
  const totalRooms = (property.room_amount || 0) + (property.suite_amount || 0);

  // Filtrar fotos (excluir blueprints)
  const photos = property.photos?.filter(p => !p.is_blueprint) || [];
  const blueprints = property.photos?.filter(p => p.is_blueprint) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-red-600">Inicio</Link>
          {' > '}
          <Link href="/propiedades" className="hover:text-red-600">Propiedades</Link>
          {' > '}
          <span className="text-gray-800 font-semibold">{property.publication_title}</span>
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
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Botones de navegación */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage(prev => prev === 0 ? photos.length - 1 : prev - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setSelectedImage(prev => prev === photos.length - 1 ? 0 : prev + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                      >
                        →
                      </button>
                    </>
                  )}

                  {/* Contador */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm">
                    {selectedImage + 1} / {photos.length}
                  </div>
                </div>

                {/* Miniaturas */}
                {photos.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {photos.slice(0, 10).map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition ${
                          selectedImage === idx ? 'border-red-600' : 'border-gray-300'
                        }`}
                      >
                        <img src={photo.image} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Información Principal */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="mb-4">
                <span className="text-sm font-semibold text-red-600 uppercase">
                  {propertyType} en {operationType}
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-4">
                {property.publication_title || `${propertyType} en ${property.location?.name}`}
              </h1>

              <p className="text-lg text-gray-600 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {displayAddress}, {property.location?.name}
              </p>

              {/* Características Principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                {totalRooms > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{totalRooms}</p>
                    <p className="text-sm text-gray-600">Dormitorios</p>
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
                {(property.total_surface || property.surface) && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{property.total_surface || property.surface}m²</p>
                    <p className="text-sm text-gray-600">Terreno</p>
                  </div>
                )}
                {property.roofed_surface && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{property.roofed_surface}m²</p>
                    <p className="text-sm text-gray-600">Cubierta</p>
                  </div>
                )}
              </div>

              {/* Descripción */}
              {property.description && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-3">Descripción</h2>
                  <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
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

              {/* Formulario de Contacto */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Contactar</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-600"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-600"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-600"
                  />
                  <textarea
                    placeholder="Mensaje"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-600"
                    defaultValue={`Hola, estoy interesado en ${property.publication_title}`}
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
                  >
                    Enviar Consulta
                  </button>
                </form>
              </div>

              {/* Info Sucursal */}
              {property.branch && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-bold mb-2">{property.branch.name}</h3>
                  {property.branch.phone && (
                    <p className="text-sm text-gray-600 mb-1">📞 {property.branch.phone}</p>
                  )}
                  {property.branch.email && (
                    <p className="text-sm text-gray-600">📧 {property.branch.email}</p>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}