import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Busca el patrón /propiedad-XXXXXX-...
  const match = pathname.match(/^\/propiedad-(\d+)-(.+)$/);
  
  if (match) {
    const [, id, slug] = match;
    const newUrl = new URL(`/propiedades/${id}-casa-venta-${slug}`, request.url);
    return NextResponse.redirect(newUrl, 301);
  }
}

export const config = {
  matcher: '/propiedad-:path*',
};