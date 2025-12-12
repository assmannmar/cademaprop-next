import Link from 'next/link';
import Image from 'next/image';

interface PropertyCardProps {
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
    thumb?: string;
  }>;
  videos?: Array<any>;
  tags?: Array<{ name: string }>;
  custom_tags?: Array<{ name: string }>;
}

export default function PropertyCard(property: PropertyCardProps) {
  const {
    id,
    publication_title,
    address,
    fake_address,
    location,
    operations,
    type: propertyTypeObj,
    suite_amount,
    room_amount,
    bathroom_amount,
    parking_lot_amount,
    surface,
    roofed_surface,
    total_surface,
    photos,
    videos,
    tags,
    custom_tags,
  } = property;

  // Obtener imagen de portada
  const coverImage = photos?.find(p => p.is_front_cover)?.image || photos?.[0]?.image;
  
  // Obtener operación y precio
  const mainOperation = operations?.[0];
  const operationType = mainOperation?.operation_type || '';
  const price = mainOperation?.prices?.[0]?.price;
  const currency = mainOperation?.prices?.[0]?.currency || 'USD';

  // Traducir tipo de operación
  const translateOperationType = (type: string) => {
    const translations: Record<string, string> = {
      'Sale': 'Venta',
      'Rental': 'Alquiler',
      'Temporary Rental': 'Alquiler Temporal',
      'sale': 'Venta',
      'rental': 'Alquiler',
      'temporary rental': 'Alquiler Temporal',
    };
    return translations[type] || type;
  };

  // Tipo de propiedad
  const propertyType = propertyTypeObj?.name || 'Propiedad';

  // Traducir tipo de propiedad
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
      'house': 'Casa',
      'apartment': 'Departamento',
      'land': 'Terreno',
      'commercial': 'Comercial',
      'office': 'Oficina',
      'building': 'Edificio',
    };
    return translations[type] || type;
  };

  const operationTypeSpanish = translateOperationType(operationType);
  const propertyTypeSpanish = translatePropertyType(propertyType);

  // Verificar si es apto crédito
  const isCreditEligible = 
    tags?.some(tag => tag.name.toLowerCase().includes('credit')) ||
    custom_tags?.some(tag => tag.name.toLowerCase().includes('crédito'));

  // Contar fotos y videos
  const photoCount = photos?.length || 0;
  const videoCount = videos?.length || 0;

  // Dirección a mostrar (ficticia tiene prioridad)
  const displayAddress = fake_address || address || 'Consultar ubicación';
  const locationName = location?.name || '';

  // Total de dormitorios/ambientes
  const totalRooms = (room_amount || 0) + (suite_amount || 0);

  return (
    <Link href={`/propiedades/${id}`}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-[1.02] transform cursor-pointer">
        
        {/* IMAGEN DE PORTADA */}
        <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
          {coverImage ? (
            <img
              src={coverImage}
              alt={publication_title || propertyType}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          )}
          
          {/* Badge de Apto Crédito */}
          {isCreditEligible && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
              Apto Crédito
            </div>
          )}

          {/* Contador de fotos y videos */}
          <div className="absolute bottom-2 right-2 flex gap-2">
            {photoCount > 0 && (
              <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                {photoCount}
              </div>
            )}
            {videoCount > 0 && (
              <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                {videoCount}
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          {/* TIPOLOGÍA Y OPERACIÓN */}
          <div className="mb-2">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {propertyType} en {operationType}
            </span>
          </div>

          {/* TÍTULO DE PUBLICACIÓN */}
          <h3 className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
            {publication_title || `${propertyType} en ${locationName}`}
          </h3>
          
          {/* DIRECCIÓN Y UBICACIÓN */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-start gap-1">
            <span className="text-base">📍</span>
            <span className="line-clamp-1">
              {displayAddress}
              {locationName && `, ${locationName}`}
            </span>
          </p>

          {/* CARACTERÍSTICAS */}
          <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
            {totalRooms > 0 && (
              <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>{totalRooms}</span>
              </div>
            )}
            {bathroom_amount && bathroom_amount > 0 && (
              <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span>{bathroom_amount}</span>
              </div>
            )}
            {parking_lot_amount && parking_lot_amount > 0 && (
              <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <span>{parking_lot_amount}</span>
              </div>
            )}
          </div>

          {/* SUPERFICIES */}
          <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-600 dark:text-gray-400">
            {(total_surface || surface) && (total_surface || surface)! > 0 && (
              <div>
                <span className="font-semibold">Terreno:</span> {total_surface || surface}m²
              </div>
            )}
            {roofed_surface && roofed_surface > 0 && (
              <div>
                <span className="font-semibold">Cubierta:</span> {roofed_surface}m²
              </div>
            )}
          </div>

          {/* PRECIO */}
          {price && price > 0 ? (
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-3">
              {currency} ${price.toLocaleString('es-AR')}
            </p>
          ) : (
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-3">
              Consultar precio
            </p>
          )}

          {/* BOTÓN */}
          <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition">
            Ver Detalles
          </button>
        </div>
      </div>
    </Link>
  );
}