import { NextResponse } from "next/server";

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { 
        error: "Falta el access token de Instagram",
        posts: [] 
      },
      { status: 400 }
    );
  }

  try {
    // Instagram Basic Display API
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}&limit=12`;

    const response = await fetch(url, {
      cache: 'no-store', // No cachear para obtener posts actualizados
      next: { revalidate: 3600 } // Revalidar cada hora
    });

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      // Filtrar solo imágenes y carousels (no videos por ahora)
      const posts = data.data
        .filter((post: any) => 
          post.media_type === 'IMAGE' || 
          post.media_type === 'CAROUSEL_ALBUM'
        )
        .map((post: any) => ({
          id: post.id,
          media_url: post.media_url,
          thumbnail_url: post.thumbnail_url,
          permalink: post.permalink,
          caption: post.caption || '',
          timestamp: post.timestamp
        }));

      return NextResponse.json({
        posts,
        count: posts.length
      });
    }

    return NextResponse.json(
      { 
        error: "No se encontraron posts",
        posts: [] 
      },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    return NextResponse.json(
      { 
        error: "Error al obtener feed de Instagram",
        details: String(error),
        posts: []
      },
      { status: 500 }
    );
  }
}
