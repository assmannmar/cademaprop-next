'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { apiUrl } from '@/lib/api';

type InstagramPost = {
  id: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  fallback?: boolean;
};

const instagramProfileUrl = 'https://www.instagram.com/cademabienesraices/';

const fallbackPosts: InstagramPost[] = [
  {
    id: 'instagram-fallback-1',
    media_url: '/carousel/3.jpg',
    permalink: instagramProfileUrl,
    caption: 'Conoce nuestras novedades y propiedades en Instagram',
    media_type: 'IMAGE',
    fallback: true,
  },
  {
    id: 'instagram-fallback-2',
    media_url: '/carousel/5.jpg',
    permalink: instagramProfileUrl,
    caption: 'Seguinos para ver los ultimos posteos de Cadema',
    media_type: 'IMAGE',
    fallback: true,
  },
  {
    id: 'instagram-fallback-3',
    media_url: '/carousel/7.jpg',
    permalink: instagramProfileUrl,
    caption: 'Tasaciones, lanzamientos y oportunidades en Zona Norte',
    media_type: 'IMAGE',
    fallback: true,
  },
];

function getImageSrc(post: InstagramPost) {
  if (post.media_type === 'VIDEO') {
    return post.thumbnail_url || post.media_url || '';
  }
  return post.media_url || post.thumbnail_url || '';
}

function truncate(text: string, max = 90) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '...';
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl('instagram'))
      .then((r) => r.json())
      .then((data) => {
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-pink-500" />
      </div>
    );
  }

  const hasLivePosts = posts.length > 0;
  const visiblePosts = hasLivePosts ? posts : fallbackPosts;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Seguinos en Instagram
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-900 md:text-4xl">
              {hasLivePosts ? 'Ultimos posteos' : 'Novedades de Cadema'}
            </h2>
            {!hasLivePosts && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
                No pudimos cargar el feed en vivo en este momento. Mientras tanto,
                podes entrar al perfil para ver las publicaciones recientes.
              </p>
            )}
          </div>

          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 md:inline-flex"
          >
            Ver perfil
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {visiblePosts.map((post) => {
            const imageSrc = getImageSrc(post);
            return (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-2xl bg-neutral-100"
              >
                <div className="relative aspect-square overflow-hidden">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={truncate(post.caption || 'Post de Instagram', 80)}
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      unoptimized
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-sm text-neutral-500">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    {post.fallback
                      ? 'Instagram'
                      : post.media_type === 'VIDEO'
                        ? 'Video / Reel'
                        : post.media_type === 'CAROUSEL_ALBUM'
                          ? 'Carrusel'
                          : 'Imagen'}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-800">
                    {truncate(post.caption || 'Ver publicacion en Instagram')}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
