# AI Agent Instructions for cademaprop-next

## Project Overview

**cademaprop-next** is a Next.js 16 real estate property browser application that integrates with the Tokko Broker API to display property listings. Built with React 19, TypeScript, and Tailwind CSS v4.

### Architecture

- **Frontend**: Next.js App Router (React 19) with TypeScript + JSX
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`
- **Backend**: Next.js API routes (minimal - acts as proxy)
- **External Service**: Tokko Broker API (`https://www.tokkobroker.com/api/v1/property/`)
- **Data Flow**: Tokko API → `/api/properties` route → React components

## Critical Developer Workflows

### Local Development
```bash
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Build for production
npm start            # Run production build locally
npm run lint         # Run ESLint with Next.js config
```

### Environment Variables
- **`TOKKO_API_KEY`**: Required for Tokko API authentication (set in Vercel deployment settings)
- **`NEXT_PUBLIC_BASE_URL`**: Public URL for client-side API calls (used in `app/propiedades/page.jsx`)
- **`VERCEL_URL`**: Used in `app/page.tsx` for internal API calls during SSR

## Project-Specific Patterns & Conventions

### 1. Data Fetching from Tokko API with Filtering

**Pattern**: Internal proxy API route approach with dynamic filtering support
- **Why**: Keeps Tokko API key server-side only, enables error handling before client receives data
- **Route**: `app/api/properties/route.ts` - accepts GET with query filters
- **Key Behaviors**:
  - Returns `401` if `TOKKO_API_KEY` is missing
  - Returns Tokko's HTTP status code if external request fails
  - Wraps response in `{ objects: [...], meta: {...} }` from Tokko
  - Uses `cache: 'no-store'` to prevent stale data in builds
  - **Filters supported**: `limit`, `offset`, `operation_type`, `property_type`, `min_price`, `max_price`

**Example from `app/api/properties/route.ts`**:
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "50";
  const operationType = searchParams.get("operation_type") || "";
  
  let url = `https://www.tokkobroker.com/api/v1/property/?key=${apiKey}&limit=${limit}&format=json`;
  if (operationType) url += `&operation=${operationType}`;
  
  const response = await fetch(url, { cache: 'no-store' });
}
```

**Client-side usage** (from `PropertiesContainer.tsx`):
```typescript
const queryParams = new URLSearchParams();
queryParams.append('limit', filters.limit);
if (filters.operation_type) queryParams.append('operation_type', filters.operation_type);

const response = await fetch(`/api/properties?${queryParams.toString()}`);
const data: ApiResponse = await response.json();
```

### 2. Component File Mixing

**Convention**: The codebase uses **both `.tsx` and `.jsx`** - intentional co-existence
- `app/page.tsx` - Main home page (TypeScript, SSR with direct fetch)
- `app/propiedades/page.jsx` - Properties listing page (JSX, simple wrapper)
- `app/components/`:
  - `PropertyFilters.jsx` - Client-side filter controls (JSX for React hooks)
  - `PropertyCard.tsx` - Presentational component (pure display, TypeScript)
  - `PropertiesContainer.tsx` - Client orchestrator handling filters & data fetching
- **Recommendation**: Client components with hooks → `.jsx`; Pure presentation → `.tsx`

### 3. Client-side Filtering Architecture

**Pattern**: Reactive client component managing filter state and API calls
- **Component**: `PropertiesContainer.tsx` ('use client') - orchestrates all filtering logic
- **Filter State**: `{ operation_type, property_type, min_price, max_price, limit }`
- **Data Flow**:
  1. `PropertyFilters` (child) emits `onFilterChange` callback with new filters
  2. `PropertiesContainer` receives filters and calls `/api/properties` with query params
  3. Fetched properties re-render in grid layout
  4. Error states, loading spinners, and empty states handled gracefully

**Key Pattern** - Immutable state updates:
```jsx
const handleFilterChange = (newFilters) => {
  setFilters(newFilters);
  fetchProperties(newFilters); // Pass to fetch, not state read
};
```

### 4. Server & Client Component Split

**Pattern**: Mix of server and client components
- **Server Components**: `app/page.tsx` uses async fetch during SSR (prerendering)
- **Client Components**: `PropertiesContainer.tsx` uses `'use client'` for interactive filtering
- Data pattern: Tokko returns `{ objects: [...], meta: {...} }`
- Page wrappers keep component tree minimal - delegate client logic to containers

**Example from `app/propiedades/page.jsx`** (simple server wrapper):
```jsx
import PropertiesContainer from '@/app/components/PropertiesContainer';

export default function PropertiesPage() {
  return <PropertiesContainer />;
}
```

### 5. Error Handling & Build Resilience

**Pattern**: Return empty arrays or fallback data to prevent build failures
- If Tokko is down during build, pages still render with empty state
- Catch JSON parsing errors explicitly (avoid "Unexpected end of JSON input")
- Log errors to console for debugging in Vercel logs
- Client components display user-friendly error messages

**From `app/page.tsx`**:
```typescript
if (!res.ok) {
  console.error("Failed to fetch properties:", errorData);
  return []; // Return empty, don't crash the build
}
```

### 6. Path Aliases

**Convention**: `@/*` maps to project root (from `tsconfig.json`)
```json
"paths": { "@/*": ["./*"] }
```
- Use `@/app`, `@/public`, `@/app/components` for imports
- Enables cleaner imports across the project

## External Integration Points

### Tokko Broker API
- **Endpoint**: `https://www.tokkobroker.com/api/v1/property/`
- **Authentication**: Query param `key=${TOKKO_API_KEY}`
- **Response Structure**:
  ```json
  {
    "meta": { "limit": 10, "offset": 0, ... },
    "objects": [
      {
        "id": number,
        "title": string,
        "address": string,
        "operations": [{ "prices": [{ "price": number, "currency": string }] }],
        "property_type": { "name": string },
        "operation_type": { "name": string }
      }
    ]
  }
  ```
- **Query Parameters**: `limit`, `offset`, `operation`, `type`, `price_from`, `price_to`
- **Rate Limits**: Unknown - assume standard API limits; consider pagination for large datasets

## Code Quality

- **Linting**: ESLint 9 via `eslint-config-next` (TypeScript & Core Web Vitals)
- **Type Safety**: `strict: true` in `tsconfig.json` - prefer types over `any`
- **Auto-ignore**: `.next/`, `out/`, `build/` directories (configured in `eslint.config.mjs`)
- **Styling**: Tailwind v4 with dark mode support (see `globals.css`)

## When Modifying Existing Code

1. **Fixing API route**: Test with invalid `TOKKO_API_KEY` first to verify error paths
2. **Adding new pages**: Keep async Server Component pattern; fetch in component body
3. **Adding filters**: Update both API route params and `FilterValues` interface in `PropertiesContainer.tsx`
4. **Styling**: Use Tailwind v4 classes; check `globals.css` for base styles and theme variables
5. **Building/Deploying**: Ensure pages degrade gracefully if Tokko is unreachable (empty state OK)
