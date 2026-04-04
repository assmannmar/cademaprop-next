export type InstagramPost = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

type InstagramApiResponse = {
  data?: InstagramPost[];
  error?: {
    message?: string;
    type?: string;
    code?: number;
  };
};

export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const accessToken = "IGAAYNHIKSHRRBZAGJrdENzcHhCVS1uRXBNWkNxbTNRdTJGX1RaZAkl0U21sdkQ0TmN5ZAThON3Uwd3ppYW50ZAVQtekZAoRWJlN0syTVNwR0dsQnJhR2tzNWpjejFrNVMxMncyRUh5cjE1UjVnc0ZACenFYZA2lrZAG1sb21SZAVZA2TEY3ZAwZDZD";

  if (!accessToken) {
    throw new Error("Falta INSTAGRAM_ACCESS_TOKEN en variables de entorno");
  }

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
    `&limit=${limit}` +
    `&access_token=${encodeURIComponent(accessToken)}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  const data: InstagramApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Error al consultar la API de Instagram"
    );
  }

  if (!Array.isArray(data.data)) {
    return [];
  }

  return data.data;
}