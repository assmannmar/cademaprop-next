'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PropertyGallery from '@/app/components/PropertyGallery';
import PropertyHeader from '@/app/components/PropertyHeader';
import PropertyInfo from '@/app/components/PropertyInfo';
import VentuxForm from '@/app/components/VentuxForm';

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
  const [showScheduleModal, setShowScheduleModal] = useState(false);

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
      'Warehouse': 'Depósito',
      'Country house': 'Quinta',
      'Farm': 'Campo',
    };
    return translations[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center -mt-[70px] pt-[70px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
          <p className="mt-6 text-xl text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 -mt-[70px] pt-[70px]">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Propiedad no encontrada</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/propiedades" className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-lg">
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
  
  const propertyType = translatePropertyType(
    property.development?.type?.name || property.type?.name || 'Propiedad'
  );
  
  const displayAddress = property.fake_address || property.address || 'Consultar ubicación';

  const photos = property.photos?.filter(p => !p.is_blueprint) || [];
  const blueprints = property.photos?.filter(p => p.is_blueprint) || [];

  const description = property.rich_description || property.description || '';

  return (
    <div className="min-h-screen bg-gray-50 -mt-[70px] pt-[70px]">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-red-600 transition">Inicio</Link>
          {' > '}
          <Link href="/propiedades" className="hover:text-red-600 transition">Propiedades</Link>
          {' > '}
          <span className="text-gray-800 font-semibold">#{property.id}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA - Galería e Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Galería */}
            <PropertyGallery photos={photos} propertyTitle={property.publication_title || propertyType} />

            {/* Header */}
            <PropertyHeader
              id={property.id}
              publication_title={property.publication_title}
              propertyType={propertyType}
              operationType={operationType}
              displayAddress={displayAddress}
              locationName={property.location?.name}
              fullLocation={property.location?.full_location}
              price={price}
              currency={currency}
              tags={property.tags}
              custom_tags={property.custom_tags}
            />

            {/* Información y Características */}
            <PropertyInfo
              suite_amount={property.suite_amount}
              room_amount={property.room_amount}
              bathroom_amount={property.bathroom_amount}
              toilet_amount={property.toilet_amount}
              parking_lot_amount={property.parking_lot_amount}
              surface={property.surface}
              roofed_surface={property.roofed_surface}
              total_surface={property.total_surface}
              front_measure={property.front_measure}
              depth_measure={property.depth_measure}
              age={property.age}
              orientation={property.orientation}
              disposition={property.disposition}
              credit_eligible={property.credit_eligible}
              expenses={property.expenses}
            />

            {/* Descripción */}
            {description && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Descripción</h2>
                <div 
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            )}

            {/* Amenities */}
            {property.tags && property.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {property.tags.map((tag, idx) => (
                    <span key={idx} className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      ✓ {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mapa */}
            {property.geo_lat && property.geo_long && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Ubicación</h2>
                <div className="w-full h-96 rounded-lg overflow-hidden shadow-md mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${property.geo_lat},${property.geo_long}&z=15&output=embed`}
                    allowFullScreen
                  />
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {displayAddress}, {property.location?.name}
                </p>
              </div>
            )}

            {/* Planos */}
            {blueprints.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Planos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blueprints.map((blueprint, idx) => (
                    <img
                      key={idx}
                      src={blueprint.image}
                      alt={`Plano ${idx + 1}`}
                      className="w-full rounded-lg border-2 border-gray-200 hover:border-red-600 transition cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {property.videos && property.videos.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Videos</h2>
                <div className="space-y-4">
                  {property.videos.map((video, idx) => (
                    <div key={idx}>
                      <iframe
                        src={video.player_url}
                        className="w-full h-64 md:h-96 rounded-lg shadow-md"
                        allowFullScreen
                        title={video.title || `Video ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA - Contacto Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Card de Contacto Principal */}
              <div className="bg-white rounded-lg shadow-xl p-6">
                
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

                {/* Botón Sticky CTA */}
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="w-full mb-4 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Agendar Visita
                </button>

                {/* Formulario Ventux */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Contactar</h3>
                  <VentuxForm />
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/5491112345678?text=Hola, estoy interesado en la propiedad ${property.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Consultar por WhatsApp
                </a>
              </div>

              {/* Info Sucursal */}
              {property.branch && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-900">{property.branch.name}</h3>
                  {property.branch.phone && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {property.branch.phone_area ? `(${property.branch.phone_area}) ` : ''}{property.branch.phone}
                    </p>
                  )}
                  {property.branch.email && (
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {property.branch.email}
                    </p>
                  )}
                  {property.branch.address && (
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {property.branch.address}
                    </p>
                  )}
                </div>
              )}

              {/* Compartir */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Compartir</h3>
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    Facebook
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition">
                    Twitter
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal Agendar Visita */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={() => setShowScheduleModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Agendar Visita</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <VentuxForm />
          </div>
        </div>
      )}
    </div>
  );
}