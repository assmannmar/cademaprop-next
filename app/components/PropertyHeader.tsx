interface PropertyHeaderProps {
  id: number;
  publication_title?: string;
  propertyType: string;
  operationType: string;
  displayAddress: string;
  locationName?: string;
  fullLocation?: string;
  price?: number;
  currency: string;
  tags?: Array<{ name: string }>;
  custom_tags?: Array<{ name: string; group_name?: string }>;
}

export default function PropertyHeader({
  id,
  publication_title,
  propertyType,
  operationType,
  displayAddress,
  locationName,
  fullLocation,
  price,
  currency,
  tags,
  custom_tags,
}: PropertyHeaderProps) {
  
  // Verificar si es apto crédito
  const isCreditEligible = 
    tags?.some(tag => tag.name.toLowerCase().includes('credit')) ||
    custom_tags?.some(tag => tag.name.toLowerCase().includes('crédito'));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Código de propiedad */}
      <div className="mb-2">
        <span className="text-xs text-gray-500 font-medium">Código: #{id}</span>
      </div>

      {/* Tipo de propiedad y operación */}
      <div className="mb-4">
        <span className="text-sm font-semibold text-red-600 uppercase">
          {propertyType} en {operationType}
        </span>
      </div>

      {/* Titular de Tokko */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
        {publication_title || `${propertyType} en ${locationName}`}
      </h1>

      {/* Descripción automática */}
      <p className="text-lg text-gray-600 mb-4">
        {propertyType} en {operationType} en {locationName}
      </p>

      {/* Dirección ficticia */}
      <div className="flex items-start gap-2 text-lg text-gray-700 mb-2">
        <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="font-semibold">{displayAddress}</p>
          {fullLocation && (
            <p className="text-sm text-gray-500 mt-1">
              {fullLocation}
            </p>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {isCreditEligible && (
          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Apto Crédito
          </span>
        )}
        
        {/* Precio como badge en mobile */}
        {price && price > 0 && (
          <span className="inline-flex items-center px-4 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold lg:hidden">
            {currency} ${price.toLocaleString('es-AR')}
          </span>
        )}
      </div>
    </div>
  );
}