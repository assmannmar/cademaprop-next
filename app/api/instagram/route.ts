import { NextResponse } from "next/server";

type InstagramMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

export async function GET() {
  const accessToken = process.env.EAAThQZBAMRH4BRMDhYYWCdyA0yIBjyZBFAwkiYfnZAW0LLT2e8uHqCtZCae4nwWroPyHqwUrqrR8sbA5jVMBch9D6h5EGhMJ5TlXOE8fgSj1xHWgpv7IIOscUopt3Li4IaigcZBf1UZCWWpGb5X14sq7gZCqx7jp04facmfaCaGnWLvXpmviPPg420e5YF0M9itxorKZBdwZBmoeIZCNlyvhvi8F1Gqqzy8NUHvTcLmpz6ZByG1DU0JF0YMkBKC0eFGGoEjAH65TJRUbJ8OPwZAXqVZCsIWFJ6TJx4MTkoJVCHCRBL7o9lQtLvSZAHhV89Vmg86d7W;
  const limit = process.env.INSTAGRAM_FEED_LIMIT || "6";

  if (!accessToken) {
    return NextResponse.json(
      { error: "Falta INSTAGRAM_ACCESS_TOKEN en las variables de entorno." },
      { status: 500 }
    );
  }

  try {
    const fields = [
      "id",
      "caption",
      "media_type",
      "media_url",
      "thumbnail_url",
      "permalink",
      "timestamp",
    ].join(",");

    const url =
      `https://graph.instagram.com/me/media` +
      `?fields=${encodeURIComponent(fields)}` +
      `&limit=${encodeURIComponent(limit)}` +
      `&access_token=${encodeURIComponent(accessToken)}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // cache 1 hora
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Error al consultar Instagram",
          details: data,
        },
        { status: response.status }
      );
    }

    const posts: InstagramMedia[] = Array.isArray(data.data) ? data.data : [];

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error inesperado al consultar Instagram",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}