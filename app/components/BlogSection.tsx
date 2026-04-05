'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type WpPost = {
  id: number;
  slug: string;
  link: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    ['wp:featuredmedia']?: Array<{
      source_url: string;
      alt_text?: string;
    }>;
  };
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function BlogSection() {
  const [posts, setPosts] = useState<WpPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

  useEffect(() => {
    fetch('https://cademaprop.com.ar/blog/wp-json/wp/v2/posts?per_page=6&_embed')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

  const extendedPosts = useMemo(() => {
    if (!posts.length) return [];
    return [...posts, ...posts.slice(0, cardsToShow)];
  }, [posts, cardsToShow]);

  useEffect(() => {
    if (!posts.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [posts]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [cardsToShow]);

  const handleTransitionEnd = () => {
    if (currentIndex >= posts.length) {
      setIsTransitionEnabled(false);
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    if (!isTransitionEnabled) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitionEnabled(true);
        });
      });

      return () => cancelAnimationFrame(id);
    }
  }, [isTransitionEnabled]);

  const goToNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const goToPrev = () => {
    if (currentIndex === 0) {
      setIsTransitionEnabled(false);
      setCurrentIndex(posts.length - 1);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitionEnabled(true);
        });
      });
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const totalDots = posts.length;
  const activeDot = posts.length ? currentIndex % posts.length : 0;

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!posts.length) return null;

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">
            Blog
          </h2>
          <p className="text-xl text-gray-600">Últimas novedades y noticias</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className={`flex ${isTransitionEnabled ? 'transition-transform duration-700 ease-in-out' : ''}`}
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedPosts.map((post, idx) => {
                const image =
                  post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

                const altText =
                  post._embedded?.['wp:featuredmedia']?.[0]?.alt_text ||
                  stripHtml(post.title.rendered);

                return (
                  <div
                    key={`${post.id}-${idx}`}
                    className="shrink-0 px-3"
                    style={{ width: `${100 / cardsToShow}%` }}
                  >
                    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition h-full flex flex-col">
                      <Link
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={altText}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="h-48 bg-gray-300" />
                        )}
                      </Link>

                      <div className="p-6 flex flex-col flex-grow">
                        <p className="text-sm text-gray-500 mb-2 capitalize">
                          {formatDate(post.date)}
                        </p>

                        <h3
                          className="text-xl font-bold mb-3 line-clamp-2 min-h-[3.5rem]"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />

                        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                          {stripHtml(post.excerpt.rendered)}
                        </p>

                        <Link
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 font-semibold hover:text-red-700"
                        >
                          Leer más →
                        </Link>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={goToPrev}
            aria-label="Anterior"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center text-2xl text-gray-700 hover:text-red-600 transition z-10"
          >
            ‹
          </button>

          <button
            onClick={goToNext}
            aria-label="Siguiente"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center text-2xl text-gray-700 hover:text-red-600 transition z-10"
          >
            ›
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalDots }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                activeDot === i ? 'w-8 bg-red-600' : 'w-2.5 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="https://cademaprop.com.ar/blog/" target="_blank" rel="noopener" className="btn-split btn-split-bottom btn-split-wide">
            <span className="btn-text">Ver todas las notas</span>
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}