// Función para generar slug SEO-friendly
export function generateSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Espacios a guiones
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^\w\-]+/g, '')       // Remover caracteres especiales
    .replace(/\-\-+/g, '-')         // Múltiples guiones a uno solo
    .replace(/^-+/, '')             // Remover guiones al inicio
    .replace(/-+$/, '');            // Remover guiones al final
}

// Generar URL de propiedad SEO-friendly: /propiedades/123-casa-venta-av-libertador-1234
export function generatePropertyUrl(property: {
  id: number;
  type?: { name: string };
  operations?: Array<{ operation_type: string }>;
  fake_address?: string;
  address?: string;
}): string {
  const id = property.id;
  const tipo = property.type?.name || 'propiedad';
  const operacion = property.operations?.[0]?.operation_type || 'venta';
  const direccion = property.fake_address || property.address || 'consultar';
  
  const tipoSlug = generateSlug(translatePropertyType(tipo));
  const operacionSlug = generateSlug(translateOperationType(operacion));
  const direccionSlug = generateSlug(direccion);
  
  // CAMBIO AQUÍ: sin /propiedades/, directo con guion
  return `/propiedades-${id}-${tipoSlug}-${operacionSlug}-${direccionSlug}`;
}

// Parsear ID de URL SEO-friendly
export function parsePropertyId(slug: string): number | null {
  const match = slug.match(/^(\d+)-/);
  return match ? parseInt(match[1]) : null;
}

// Traducir tipo de propiedad
function translatePropertyType(type: string): string {
  const translations: Record<string, string> = {
    'House': 'casa',
    'Apartment': 'departamento',
    'Land': 'terreno',
    'Commercial': 'comercial',
    'Office': 'oficina',
    'Building': 'edificio',
    'PH': 'ph',
    'Warehouse': 'deposito',
    'Country house': 'quinta',
    'Farm': 'campo',
    'Industrial Ship': 'nave-industrial',
    'Weekend House': 'casa-fin-de-semana',
  };
  return translations[type] || generateSlug(type);
}

// Traducir tipo de operación
function translateOperationType(type: string): string {
  const translations: Record<string, string> = {
    'Sale': 'venta',
    'Rental': 'alquiler',
    'Temporary Rental': 'alquiler-temporal',
    'sale': 'venta',
    'rental': 'alquiler',
    'temporary rental': 'alquiler-temporal',
  };
  return translations[type] || generateSlug(type);
}

// Construir query string desde filtros
export function buildQueryString(filters: Record<string, string>): string {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '') {
      params.append(key, value);
    }
  });
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

// Parsear filtros desde URL
export function parseFiltersFromUrl(searchParams: URLSearchParams): Record<string, string> {
  return {
    division: searchParams.get('division') || '',
    location: searchParams.get('location') || '',
    operation_type: searchParams.get('operation') || '',
    property_type: searchParams.get('tipo') || '',
    bedrooms: searchParams.get('dormitorios') || '',
    has_parking: searchParams.get('cochera') || '',
    has_pool: searchParams.get('pileta') || '',
    credit_eligible: searchParams.get('credito') || '',
    max_price: searchParams.get('precio-max') || '',
  };
}

// Construir URL de búsqueda SEO-friendly
export function buildSearchUrl(filters: Record<string, string>): string {
  const params = new URLSearchParams();
  
  // Mapeo de nombres SEO-friendly
  const paramMap: Record<string, string> = {
    'division': 'division',
    'location': 'ubicacion',
    'operation_type': 'operacion',
    'property_type': 'tipo',
    'bedrooms': 'dormitorios',
    'has_parking': 'cochera',
    'has_pool': 'pileta',
    'credit_eligible': 'credito',
    'max_price': 'precio-max',
  };
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '') {
      const paramName = paramMap[key] || key;
      params.append(paramName, value);
    }
  });
  
  const queryString = params.toString();
  return `/propiedades${queryString ? `?${queryString}` : ''}`;
}


