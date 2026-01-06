'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ============ CAROUSEL DE EMPRENDIMIENTOS ============
interface EmprendimientoCarouselProps {
  emprendimientos: Array<{
    id: number;
    name?: string;
    publication_title?: string;
    photos?: Array<{ image: string }>;
    location?: { name: string };
    web_url?: string;
  }>;
}

export function EmprendimientosCarousel({ emprendimientos }: EmprendimientoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

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
  const prev = () => setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));

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
          {emprendimientos.map((emp) => {
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
      {/* ... Botones de navegación (Omitidos por brevedad, mantener los tuyos) ... */}
    </div>
  );
}

// ============ CAROUSEL DE PROPIEDADES DESTACADAS ============

interface DestacadasCarouselProps {
  propiedades: Array<{
    id: number;
    publication_title?: string;
    photos?: Array<{ image: string }>;
    type?: { name: string };
    location?: { name: string };
    operations?: Array<{
      prices?: Array<{ price: number; currency: string }>;
    }>;
  }>;
}

export function DestacadasCarousel({ propiedades }: DestacadasCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

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

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [currentIndex, maxIndex]);

  if (!propiedades || propiedades.length === 0) {
    return <p className="text-center text-gray-500">No hay propiedades disponibles</p>;
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {propiedades.map((prop) => {
            const price = prop.operations?.[0]?.prices?.[0];

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

// ============ CAROUSEL DE TESTIMONIOS (GOOGLE SHEETS) ============
interface Review {
  author_name: string;
  rating: number;
  text: string;
}

export function TestimoniosCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSheetReviews = useCallback(async () => {
    try {
      const response = await fetch('/api/reviews');
      
      if (!response.ok) {
        throw new Error('Error al conectar con la API interna');
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (error) {
      console.error('Error cargando testimonios:', error);
      setReviews([{ 
        author_name: "Prueba", 
        rating: 5, 
        text: "Excelente servicio inmobiliario." 
      }]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSheetReviews();
  }, [fetchSheetReviews]);

  const maxIndex = Math.max(0, reviews.length - cardsToShow);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (reviews.length > cardsToShow) {
      const timer = setInterval(next, 5000);
      return () => clearInterval(timer);
    }
  }, [next, reviews.length, cardsToShow]);

  // Función para obtener la inicial del nombre
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Función para generar un color aleatorio basado en el nombre
  const getColorFromName = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) return <div className="py-20 text-center text-gray-500">Cargando testimonios...</div>;
  if (reviews.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}
        >
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / cardsToShow}%` }}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all h-full flex flex-col">
                {/* Header con foto de perfil y nombre */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Avatar circular con inicial */}
                  <div className={`w-12 h-12 rounded-full ${getColorFromName(review.author_name)} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-xl">
                      {getInitial(review.author_name)}
                    </span>
                  </div>
                  
                  {/* Nombre y estrellas */}
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-left">
                      {review.author_name}
                    </h4>
                    <div className="flex text-yellow-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-gray-300'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Texto de la reseña */}
                <p className="text-gray-700 text-left leading-relaxed flex-1">
                  {review.text}
                </p>

                {/* Logo de Google (opcional) 
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      {reviews.length > cardsToShow && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-xl transition z-10"
            aria-label="Testimonio anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-xl transition z-10"
            aria-label="Siguiente testimonio"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicadores */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Ir al grupo de testimonios ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-8 bg-red-600' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ============ CAROUSEL DE INSTAGRAM ============
export function InstagramCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstagramPosts();
  }, []);

  const fetchInstagramPosts = async () => {
    try {
      const response = await fetch('/api/instagram-feed');
      const data = await response.json();
      
      if (data.posts && data.posts.length > 0) {
        setPosts(data.posts);
      } else {
        setPosts(Array.from({ length: 12 }, (_, i) => ({
          id: i,
          media_url: `https://images.unsplash.com/photo-${1560518883 + i}-ce09059eeffa?w=400&q=80`,
          permalink: 'https://instagram.com/cademaprop',
          caption: `Post de Instagram ${i + 1}`
        })));
      }
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      setPosts(Array.from({ length: 8 }, (_, i) => ({
        id: i,
        media_url: `https://images.unsplash.com/photo-${1560518883 + i}-ce09059eeffa?w=400&q=80`,
        permalink: 'https://instagram.com/cademaprop',
        caption: `Post ${i + 1}`
      })));
    } finally {
      setLoading(false);
    }
  };

  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
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

  const maxIndex = Math.max(0, posts.length - itemsPerView);

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (posts.length > itemsPerView) {
      const timer = setInterval(next, 4000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, posts.length, itemsPerView]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 relative">
                  <img
                    src={post.media_url}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {posts.length > itemsPerView && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full shadow-xl transition z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full shadow-xl transition z-10"
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
              idx === currentIndex ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}