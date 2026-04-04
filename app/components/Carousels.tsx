'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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

// Shuffle para mostrar los emprendimientos destacados en un orden diferente cada vez, pero siempre el mismo para cada usuario gracias a la semilla fija por sesión

const SESSION_SEED = typeof window !== 'undefined' 
  ? Math.floor(Math.random() * 1_000_000) 
  : 123456; // Semilla default para el servidor

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

export function EmprendimientosCarousel({ emprendimientos }: EmprendimientoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Mezclar los datos de forma persistente durante la sesión
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
          {shuffledData.map((prop) => {
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
  author_photo?: string;
  profile_photo_url?: string;
}

export function TestimoniosCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else {
        setCardsToShow(2); // 👈 SIEMPRE 2 en desktop (clave diseño)
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSheetReviews = useCallback(async () => {
    try {
      const response = await fetch('/api/reviews');

      if (!response.ok) throw new Error();

      const data = await response.json();

      if (Array.isArray(data)) setReviews(data);
    } catch (error) {
      setReviews([
        {
          author_name: 'Cliente',
          rating: 5,
          text: 'Excelente experiencia trabajando con Cadema.',
        },
      ]);
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

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (reviews.length > cardsToShow) {
      const timer = setInterval(next, 5000);
      return () => clearInterval(timer);
    }
  }, [next, reviews.length, cardsToShow]);

  const getInitial = (name: string) =>
    name?.charAt(0)?.toUpperCase() || 'C';

  const getPhoto = (review: Review) =>
    review.author_photo || review.profile_photo_url || '';

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        Cargando testimonios...
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="w-full bg-white py-10 md:py-15">
      <div className="mx-auto max-w-6xl px-6">

        {/* CAROUSEL */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
              }}
            >
              {reviews.map((review, idx) => {
                const photo = getPhoto(review);

                return (
                  <div
                    key={idx}
                    className="flex-shrink-0 px-8 md:px-12"
                    style={{ width: `${100 / cardsToShow}%` }}
                  >
                    <div className="flex items-start gap-8 md:gap-10">
                      
                      {/* FOTO */}
                      <div className="pt-10">
                        {photo ? (
                          <img
                            src={photo}
                            alt={review.author_name}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#e6e1db] flex items-center justify-center text-[#7a746c] text-2xl font-semibold">
                            {getInitial(review.author_name)}
                          </div>
                        )}
                      </div>

                      {/* CONTENIDO */}
                      <div className="max-w-[440px]">
                        
                        {/* QUOTE */}
                        <div className="text-[80px] md:text-[95px] leading-none text-[#e7e1db] font-serif select-none mb-2">
                          “
                        </div>

                        {/* TEXTO */}
                        <p className="text-[15px] md:text-[16px] leading-7 text-[#6f685f]">
                          {review.text}
                        </p>

                        {/* NOMBRE */}
                        <p className="mt-4 font-semibold text-[#2b2b2b] text-[17px]">
                          {review.author_name}
                        </p>

                        {/* ESTRELLAS */}
                        <div className="flex gap-[3px] mt-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-[14px] h-[14px] ${
                                i < review.rating
                                  ? 'fill-[#b9b1a7]'
                                  : 'fill-[#e4ded7]'
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FLECHAS */}
          {reviews.length > cardsToShow && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 text-[#8a837a] hover:text-black transition"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 text-[#8a837a] hover:text-black transition"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* DOTS */}
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                idx === currentIndex
                  ? 'bg-[#9b9186]'
                  : 'bg-[#e2ddd7]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
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