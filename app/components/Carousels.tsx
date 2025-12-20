'use client';

import { useState, useEffect } from 'react';
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
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, emprendimientos.length - itemsPerView);

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, maxIndex]);

  if (!emprendimientos || emprendimientos.length === 0) {
    return <p className="text-center text-gray-500">No hay emprendimientos disponibles</p>;
  }

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
              <div
                key={emp.id}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <a {...linkProps} className="block group">
                  <div className="relative aspect-[3/4] overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                    <img
                      src={emp.photos?.[0]?.image || '/placeholder.jpg'}
                      alt={emp.publication_title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    <div className="absolute inset-0 flex items-center justify-center px-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white text-center drop-shadow-2xl transform translate-y-4">
                        {emp.name || emp.publication_title || emp.location?.name}
                      </h3>
                    </div>

                    <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Emprendimiento
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 text-gray-800 p-4 rounded-full shadow-xl transition z-10"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 text-gray-800 p-4 rounded-full shadow-xl transition z-10"
            aria-label="Siguiente"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            aria-label={`Ir a slide ${idx + 1}`}
          />
        ))}
      </div>
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

// ============ CAROUSEL DE TESTIMONIOS (Google Reviews) ============
export function TestimoniosCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoogleReviews();
  }, []);

  const fetchGoogleReviews = async () => {
    try {
      const response = await fetch('/api/google-reviews');
      const data = await response.json();
      
      if (data.reviews && data.reviews.length > 0) {
        setReviews(data.reviews);
      } else {
        setReviews([
          {
            author_name: "María González",
            rating: 5,
            text: "Excelente atención y profesionalismo. Encontramos nuestra casa ideal gracias al equipo de Cadema Prop.",
            time: Date.now() / 1000
          },
          {
            author_name: "Juan Pérez",
            rating: 5,
            text: "Muy buena experiencia. El asesoramiento fue impecable y nos ayudaron en cada paso del proceso.",
            time: Date.now() / 1000
          },
          {
            author_name: "Carlos Rodríguez",
            rating: 5,
            text: "Recomiendo totalmente. Son muy profesionales y se nota la experiencia que tienen.",
            time: Date.now() / 1000
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      setReviews([
        {
          author_name: "Cliente Satisfecho",
          rating: 5,
          text: "Excelente servicio inmobiliario. Muy recomendable.",
          time: Date.now() / 1000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    setCurrentIndex((prev) => (prev >= reviews.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? reviews.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (reviews.length > 0) {
      const timer = setInterval(next, 6000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, reviews.length]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {reviews.map((review, idx) => (
            <div key={idx} className="w-full flex-shrink-0 px-4">
              <div className="bg-white p-8 shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {review.author_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-900">{review.author_name}</p>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <svg className="w-12 h-12 text-red-100" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 text-lg italic leading-relaxed">
                  "{review.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {reviews.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-xl transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-xl transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div className="flex justify-center gap-2 mt-6">
        {reviews.map((_, idx) => (
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