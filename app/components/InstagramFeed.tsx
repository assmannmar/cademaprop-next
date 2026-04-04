type InstagramPost = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

async function getInstagramPosts(): Promise<InstagramPost[]> {
  const baseUrl =
    process.env."https://cademaprop.com.ar" || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/instagram`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.posts || [];
}

function getImageSrc(post: InstagramPost) {
  if (post.media_type === "VIDEO") {
    return post.thumbnail_url || post.media_url || "";
  }

  return post.media_url || post.thumbnail_url || "";
}

function truncate(text: string, max = 110) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

export default async function InstagramFeed() {
  const posts = await getInstagramPosts();

  if (!posts.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Instagram
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-neutral-900">
              Últimos posteos
            </h2>
          </div>

          <a
            href="https://www.instagram.com/cademabienesraices/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
          >
            Ver perfil
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {posts.map((post) => {
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
                    <img
                      src={imageSrc}
                      alt={post.caption ? truncate(post.caption, 80) : "Post de Instagram"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-sm text-neutral-500">
                      Sin imagen
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                </div>

                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    {post.media_type === "VIDEO"
                      ? "Video / Reel"
                      : post.media_type === "CAROUSEL_ALBUM"
                      ? "Carrusel"
                      : "Imagen"}
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-neutral-800">
                    {truncate(post.caption || "Ver publicación en Instagram")}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-8 md:hidden">
          <a
            href="https://www.instagram.com/cademabienesraices/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
          >
            Ver perfil
          </a>
        </div>
      </div>
    </section>
  );
}