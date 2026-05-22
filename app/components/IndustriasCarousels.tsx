'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

// ============ SEED PARA SHUFFLE ============
const SESSION_SEED = typeof window !== 'undefined' 
  ? Math.floor(Math.random() * 1_000_000) 
  : 123456;

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 4294967296;
  };
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ============ PROPIEDADES INDUSTRIALES CAROUSEL ============
interface Property {
  id: number;
  publication_title?: string;
  photos?: Array<{ image: string }>;
  type?: { name: string };
  location?: { name: string };
  operations?: Array<{
    prices?: Array<{ price: number; currency: string }>;
  }>;
}

interface PropiedadesIndustrialesCarouselProps {
  propiedades: Property[];
}

export function PropiedadesIndustrialesCarousel({ propiedades }: PropiedadesIndustrialesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  
  const shuffledData = useMemo(() => {
    return seededShuffle(propiedades, SESSION_SEED);
  }, [propiedades]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, propiedades.length - itemsPerView);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  if (!propiedades || propiedades.length === 0) {
    return <p className="text-center text-gray-500">No hay propiedades industriales disponibles</p>;
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {shuffledData.map((prop) => {
            return (
              <div
                key={prop.id}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <Link href={`/propiedades/${prop.id}`} className="block group">
                  <div className="relative aspect-[3/4] overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
                    <img
                      src={prop.photos?.[0]?.image || '/placeholder.jpg'}
                      alt={prop.publication_title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75"
                    />
                
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                    <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-2xl line-clamp-2">
                        {prop.publication_title || `${prop.type?.name} en ${prop.location?.name}`}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {propiedades.length > itemsPerView && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-xl transition z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-xl transition z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-8 bg-red-600' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ============ EMPRENDIMIENTOS INDUSTRIALES CAROUSEL ============
interface Development {
  id: number;
  name?: string;
  publication_title?: string;
  photos?: Array<{ image: string }>;
  location?: { name: string };
  web_url?: string;
}

interface EmprendimientosIndustrialesCarouselProps {
  emprendimientos: Development[];
}

export function EmprendimientosIndustrialesCarousel({ emprendimientos }: EmprendimientosIndustrialesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  const shuffledData = useMemo(() => {
    return seededShuffle(emprendimientos, SESSION_SEED);
  }, [emprendimientos]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, emprendimientos.length - itemsPerView);
  
  const next = useCallback(() => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1)), [maxIndex]);
  const prev = useCallback(() => setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1)), [maxIndex]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  if (!emprendimientos || emprendimientos.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {shuffledData.map((emp) => {
            const hasWebUrl = emp.web_url && emp.web_url.trim() !== '';
            const linkProps = hasWebUrl 
              ? { href: emp.web_url, target: "_blank", rel: "noopener noreferrer" }
              : { href: `/propiedades/${emp.id}` };

            return (
              <div key={emp.id} className="flex-shrink-0 px-3" style={{ width: `${100 / itemsPerView}%` }}>
                <a {...linkProps} className="block group">
                  <div className="relative aspect-[3/4] overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                    <img
                      src={emp.photos?.[0]?.image || '/placeholder.jpg'}
                      alt={emp.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center px-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white text-center drop-shadow-2xl translate-y-4">
                        {emp.name || emp.publication_title || emp.location?.name}
                      </h3>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {emprendimientos.length > itemsPerView && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-xl transition z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-xl transition z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-8 bg-red-600' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ============ LOGOS CAROUSEL ============
interface Logo {
  id?: string;
  name?: string;
}

interface LogosCarouselProps {
  logos: Logo[];
  title?: string;
  subtitle?: string;
}

export function LogosCarousel({ 
  logos, 
  title = "05 · Confían en nosotros",
  subtitle = "Empresas que radicamos en Zona Norte"
}: LogosCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 768) {
        setItemsPerView(3);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(4);
      } else {
        setItemsPerView(6);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, logos.length - itemsPerView);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  if (!logos || logos.length === 0) {
    return <p className="text-center text-gray-500">No hay logos disponibles</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <span className="font-mono text-xs tracking-widest text-[#6b6660] uppercase block mb-2">
          {title}
        </span>
        <h2 className="font-serif text-4xl font-medium text-[#141414] leading-tight">
          {subtitle}
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {logos.map((logo) => (
              <div
                key={logo.id || logo.name}
                className="flex-shrink-0"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div className="bg-white aspect-2/1 rounded-lg border border-[#d8d1c4] flex items-center justify-center p-6 hover:border-[#141414] hover:shadow-md transition-all cursor-pointer group h-32 px-3">
                  <span className="font-serif font-semibold text-[#6b6660] text-center group-hover:text-[#141414] transition-colors text-sm md:text-base">
                    {logo.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botones navegación */}
        {logos.length > itemsPerView && (
          <>
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:translate-x-0 md:left-2 bg-white border border-[#d8d1c4] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#141414] hover:text-white transition-all z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-0 md:right-2 bg-white border border-[#d8d1c4] rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#141414] hover:text-white transition-all z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-8 bg-[#141414]' : 'w-2 bg-[#d8d1c4] hover:bg-[#6b6660]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}