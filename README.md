# Cadema Bienes Raíces — Sitio Web Inmobiliario

Sitio web institucional y de gestión de propiedades para **Cadema Bienes Raíces**, inmobiliaria con sede en Campana, Buenos Aires. Construido con **Next.js 14 (App Router)**, **TypeScript** y **Tailwind CSS**, con integración a múltiples APIs externas y deploy en Vercel.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS + CSS Modules por página |
| Fuentes | Geist, Montserrat, Nexa, Univers (locales) |
| Formularios | Ventux (iframe embed) |
| Deploy | Vercel |
| APIs externas | Tokko Broker, Google Sheets, Instagram Basic Display |

---

## Estructura de Carpetas

```
/
├── app/
│   ├── api/
│   │   ├── developments/        # Emprendimientos desde Tokko
│   │   ├── properties/          # Propiedades desde Tokko
│   │   ├── reviews/             # Reseñas desde Google Sheets
│   │   ├── instagram-feed/      # Posts desde Instagram API
│   │   └── simulador/
│   │       ├── route.ts         # Devuelve lotes disponibles
│   │       └── calcular/        # Cruza presupuesto con lotes
│   ├── components/
│   │   ├── Carousels.tsx        # Emprendimientos, Destacadas, Testimonios, Instagram
│   │   ├── HeroCarousel.jsx     # Carrusel de imágenes de portada
│   │   ├── navbar.tsx           # Navbar con submenús y scroll behavior
│   │   ├── Footer.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyFilters.tsx
│   │   ├── PropertiesContainer.tsx
│   │   ├── PropertyGallery.tsx
│   │   ├── PropertyHeader.tsx
│   │   ├── PropertyInfo.tsx
│   │   ├── PropertyFeatures.tsx
│   │   ├── VentuxForm.tsx       # Formulario de contacto (iframe Ventux)
│   │   ├── WhatsappButton.tsx   # Botón flotante WhatsApp
│   │   └── loader.tsx
│   ├── emprendimientos/
│   │   ├── page.tsx             # Listado con hero animado y filtros
│   │   ├── emprendimientos.css
│   │   ├── campo-alto/          # Landing individual
│   │   └── islas-barrios-nauticos/  # Landing individual
│   ├── propiedades/
│   │   ├── page.tsx             # Listado con filtros
│   │   └── [id]/
│   │       ├── page.tsx         # Detalle de propiedad
│   │       └── propiedad.css
│   ├── simulador/
│   │   ├── page.tsx
│   │   └── logica/
│   │       ├── getLotes.ts      # Consulta Google Sheets por barrio
│   │       └── simulador.ts     # Lógica de filtrado
│   ├── quienes-somos/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Home
├── public/
│   ├── carousel/                # Imágenes del hero (1.jpg, 2.jpg, 3.jpg)
│   ├── logos/
│   ├── fonts/
│   └── emprendimientos/         # Assets de landings específicas
├── utils/
│   └── urlHelpers.ts            # Generación de URLs SEO-friendly
└── .env.local
```

---

## Variables de Entorno

Las claves están almacenadas directamente en **Vercel** y no se versionan en el repositorio.  
Para consultarlas o modificarlas: **Vercel Dashboard → Project → Settings → Environment Variables**.

| Variable | Descripción |
|---|---|
| `TOKKO_API_KEY` | Clave de la API de Tokko Broker |
| `GOOGLE_SHEETS_API_KEY` | Clave de Google Cloud para leer Sheets |
| `INSTAGRAM_ACCESS_TOKEN` | Token de Instagram Basic Display API |

> **Para desarrollo local:** crear un archivo `.env.local` en la raíz (no se sube al repo, está en `.gitignore`) y copiar los valores desde el panel de Vercel.

```env
TOKKO_API_KEY=...
GOOGLE_SHEETS_API_KEY=...
INSTAGRAM_ACCESS_TOKEN=...
```

---

## Correr el Proyecto Localmente

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/cademaprop-next.git
cd cademaprop-next

# Instalar dependencias
npm install

# Crear el archivo de variables de entorno
cp .env.example .env.local
# Completar las variables en .env.local

# Iniciar el servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:3000`.

---

## API Routes

### `GET /api/properties`

Consulta todas las propiedades desde Tokko Broker usando paginación de 300 por tanda.
Devuelve el objeto completo de Tokko sin transformaciones adicionales.
**Los filtros se aplican en el cliente** dentro de `PropertiesContainer.tsx`.

```
URL Tokko: /api/v1/property/?key=...&limit=300&offset=...&format=json&lang=es
```

---

### `GET /api/developments`

Consulta todos los emprendimientos desde Tokko, ordenados por ID descendente.  
Filtra los que **no tienen fotos** y agrega dos campos calculados:

- `is_industrial: boolean` — detectado por el custom tag con `id: 5050`
- `is_residential: boolean` — detectado por el custom tag con `id: 5049`
- `category: 'industrial' | 'residential'`

```
URL Tokko: /api/v1/development/?...&order_by=id&order=desc
```

---

### `GET /api/reviews`

Lee reseñas desde una **Google Sheet** específica.  
- Spreadsheet ID: `1nWEyaRGyfd4fxxu_-Is7pAVIrwmflSJj-AnZ74LlIwA`  
- Rango: `Reviews!A2:C10`  
- Columnas esperadas: `[nombre, puntaje (1-5), texto]`

---

### `GET /api/instagram-feed`

Consulta los últimos 12 posts de Instagram usando la Basic Display API.  
Filtra solo imágenes y carousels (excluye videos).  
Devuelve: `id, media_url, thumbnail_url, permalink, caption, timestamp`.

---

### `GET /api/simulador`

Llama a `getLotes.ts` que consulta **5 Google Sheets diferentes** (una por barrio) y devuelve todos los lotes con estado `"Disponible"` normalizados a un formato común.

### `POST /api/simulador/calcular`

Recibe `{ anticipo: number, cuota: number }` y devuelve los lotes cuyo anticipo y cuota sean menores o iguales a los valores ingresados, ordenados por anticipo ascendente.

---

## Filtros de Propiedades

Los filtros se aplican **del lado del cliente** sobre el total de propiedades descargadas. Los parámetros se reflejan en la URL para poder compartir búsquedas:

| Parámetro URL | Filtro |
|---|---|
| `ubicacion` | Texto libre sobre dirección/barrio |
| `operacion` | `sale` / `rental` |
| `tipo` | Tipo de propiedad (house, apartment, land, etc.) |
| `dormitorios` | Mínimo de ambientes |
| `cochera` | `yes` / `no` |
| `pileta` | `yes` (via tags) |
| `credito` | `Eligible` / `Not eligible` |
| `precio-max` | Precio máximo en la moneda original |

---

## Agregar un Nuevo Emprendimiento con Landing Propia

1. **Crear la carpeta** en `app/emprendimientos/nombre-del-emprendimiento/`

2. **Crear el formulario Ventux** en `Form-nombre.tsx` con el iframe ID correspondiente (solicitarlo a Ventux).

3. **Crear `page.tsx`** copiando como base `campo-alto/page.tsx`. Cambiar:
   - `EMPRENDIMIENTO_ID` — ID del desarrollo en Tokko Broker
   - `datosLocales` — características, servicios, lotes y número de WhatsApp
   - El import del formulario

4. **Agregar al menú** en `app/components/navbar.tsx`, dentro del array `navLinks` en el submenu de `EMPRENDIMIENTOS`.

5. **Agregar al simulador** si el barrio tiene financiación en `app/simulador/logica/getLotes.ts` (ver sección siguiente).

---

## Simulador — Agregar un Nuevo Barrio

En `app/simulador/logica/getLotes.ts`, agregar un objeto al array `BARRIOS`:

```typescript
{
  nombre: "Nombre del Barrio",
  spreadsheetId: "ID_DE_LA_HOJA",   // Desde la URL de Google Sheets
  range: "Lotes!A2:H",              // Rango con los datos
  map: (row: any[]) => ({
    barrio: "Nombre del Barrio",
    lote: row[0],
    anticipo: Number(row[5]),
    cuota: Number(row[7]),
    cuotas: Number(row[6]),
    precioTotal: Number(row[4]),
    disponible: row[2] === "Disponible",   // Valor exacto en la columna de estado
  }),
},
```

> **Importante:** Los índices de columna (`row[0]`, `row[2]`, etc.) varían por barrio. Revisar la hoja correspondiente antes de mapear. La columna de estado debe contener exactamente el texto `"Disponible"`.

La sheet debe ser **pública** (o accesible con la API Key de Google).

En `app/simulador/page.tsx`, agregar la URL de la landing y el mensaje de WhatsApp a los objetos `LANDINGS` y `WA_MENSAJES`.

---

## Deploy en Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Configurar las variables de entorno en **Project Settings → Environment Variables**
3. El framework se detecta automáticamente como Next.js
4. Cada push a `main` dispara un nuevo deploy

> Las API Routes usan `cache: 'no-store'` para garantizar datos frescos en cada request. No es necesario configurar ISR.

---

## Mantenimiento

### ⚠️ Token de Instagram (cada 60 días)

El `INSTAGRAM_ACCESS_TOKEN` vence cada 60 días. Para renovarlo:

1. Ir a [Meta for Developers](https://developers.facebook.com) → tu app → Instagram Basic Display
2. Usar el endpoint de refresh: `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=TOKEN_ACTUAL`
3. Actualizar la variable en Vercel y hacer un redeploy (o usar una función automática de renovación)

Si el token está vencido, el carousel de Instagram mostrará imágenes de placeholder de Unsplash sin romper el resto del sitio.

### Google Sheets — Reseñas

Las reseñas se leen del rango `Reviews!A2:C10`. Para agregar más, extender el rango en `app/api/reviews/route.ts` (ej: `Reviews!A2:C20`).

### Tokko Broker — Propiedades

La API de propiedades se consulta por páginas de 300 y la ruta acumula todas las páginas disponibles antes de responder. Si el catálogo crece mucho, revisar el tiempo de respuesta de `app/api/properties/route.ts` y la cache de 5 minutos.

### Imágenes del Hero

Las imágenes del carrusel de portada se sirven desde `/public/carousel/` (archivos `1.jpg`, `2.jpg`, `3.jpg`). Para cambiarlas, reemplazar los archivos manteniendo los mismos nombres.

