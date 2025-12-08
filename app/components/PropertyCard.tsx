interface PropertyCardProps {
  id: number;
  title: string;
  address?: string;
  price?: number;
  currency?: string;
  operation_type?: { name: string };
  property_type?: { name: string };
  description?: string;
}

export default function PropertyCard({
  id,
  title,
  address,
  price,
  currency,
  operation_type,
  property_type,
  description,
}: PropertyCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition hover:scale-105 transform">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          📍 {address || 'Dirección no disponible'}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {property_type && (
            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {property_type.name}
            </span>
          )}
          {operation_type && (
            <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              {operation_type.name}
            </span>
          )}
        </div>

        {description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {price ? (
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${price.toLocaleString()} {currency || 'USD'}
          </p>
        ) : (
          <p className="text-lg text-gray-500 dark:text-gray-400">Precio a consultar</p>
        )}

        <button className="mt-4 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition">
          Ver Detalles
        </button>
      </div>
    </div>
  );
}
