'use client';

import { useState, useEffect } from 'react';

type InstagramPost = {
  id: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
};

function getImageSrc(post: InstagramPost) {
  if (post.media_type === 'VIDEO') {
    return post.thumbnail_url || post.media_url || '';
  }
  return post.media_url || post.thumbnail_url || '';
}

function truncate(text: string, max = 90) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '…';
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/instagram')
      .then(r => r.json())
      .then(data => {
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-16 text-center">
      <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
    </div>
  );

  if (!posts.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Instagram</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-neutral-900">Últimos posteos</h2>
          </div>
          
            href="https://www.instagram.com/cademabienesraices/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
          >
            Ver perfil
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {posts.map((post) => {
            const imageSrc = getImageSrc(post);
            return (
              
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-2xl bg-neutral-100"
              >
                <div className="relative aspect-square overflow-hidden">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={truncate(post.caption || 'Post de Instagram', 80)}
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
                    {post.media_type === 'VIDEO' ? 'Video / Reel' : post.media_type === 'CAROUSEL_ALBUM' ? 'Carrusel' : 'Imagen'}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-800">
                    {truncate(post.caption || 'Ver publicación en Instagram')}
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