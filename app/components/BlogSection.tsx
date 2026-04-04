import Link from "next/link";

type WpPost = {
  id: number;
  slug: string;
  link: string;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    ["wp:featuredmedia"]?: Array<{
      source_url: string;
      alt_text?: string;
    }>;
  };
};

async function getLatestPosts(): Promise<WpPost[]> {
  const res = await fetch(
    "https://cademaprop.com.ar/blog/wp-json/wp/v2/posts?per_page=3&_embed",
    {
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error("No se pudieron cargar los posts del blog");
  }

  return res.json();
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default async function BlogSection() {
  const posts = await getLatestPosts();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">
            Blog
          </h2>
          <p className="text-xl text-gray-600">
            Últimas novedades y consejos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => {
            const image =
              post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

            const altText =
              post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ||
              stripHtml(post.title.rendered);

            return (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
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

                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2 capitalize">
                    {formatDate(post.date)}
                  </p>

                  <h3
                    className="text-xl font-bold mb-3 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />

                  <p className="text-gray-600 mb-4 line-clamp-3">
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
            );
          })}
        </div>
      </div>
    </section>
  );
}