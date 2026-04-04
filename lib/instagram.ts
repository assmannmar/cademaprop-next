// import "server-only";

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
    console.error("Instagram: falta INSTAGRAM_ACCESS_TOKEN");
    return [];
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "force-cache",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Instagram API error:", response.status, text);
      return [];
    }

    const data: InstagramApiResponse = await response.json();

    if (!Array.isArray(data.data)) {
      console.error("Instagram: respuesta sin data válida", data);
      return [];
    }

    return data.data;
  } catch (error) {
    console.error("Instagram fetch failed:", error);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}