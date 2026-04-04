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
  const accessToken = "IGAAYNHIKSHRRBZAGF6OVlQUkFpcVR6NGp3QzRLSVVyYV9Yem1LR2s1VEwwQzRIeGpncHRwTzlUZAFQzUnRWVG5zMExydTZApaDNDamlDMnpDZAkRrNngyT3pXWEJlaG91QTJGel9hMzNmZADdmOXI0dENobklnYmV6ZAERqRXlMQ1ZAmSQZDZD";
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