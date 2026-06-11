import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const industriaRedirects = new Set([
  '/industria',
  '/parque-industrial',
  '/parque-industrial/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones',
  '/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones',
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalizedPathname = pathname.replace(/\/$/, '') || '/';

  if (industriaRedirects.has(normalizedPathname)) {
    const newUrl = new URL('/industrias', request.url);
    return NextResponse.redirect(newUrl, 301);
  }

  const match = pathname.match(/^\/propiedad-(\d+)(?:-.+)?\/?$/);

  if (match) {
    const [, id] = match;
    const newUrl = new URL(`/propiedades/${id}/`, request.url);
    return NextResponse.redirect(newUrl, 301);
  }
}

export const config = {
  matcher: [
    '/propiedad-:path*',
    '/industria',
    '/parque-industrial/:path*',
    '/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones',
  ],
};
