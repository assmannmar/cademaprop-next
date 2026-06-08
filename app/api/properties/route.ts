import { NextResponse } from "next/server";

interface TokkoResponse {
  meta: {
    limit: number;
    offset?: number;
    total_count?: number;
    next?: string | null;
    previous?: string | null;
  };
  objects: unknown[];
}

const PAGE_SIZE = 300;
const MAX_PAGES = 200;

function buildTokkoUrl(apiKey: string, offset: number) {
  const params = new URLSearchParams({
    key: apiKey,
    limit: String(PAGE_SIZE),
    offset: String(offset),
    format: "json",
    lang: "es",
  });

  return `https://www.tokkobroker.com/api/v1/property/?${params.toString()}`;
}

export async function GET() {
  const apiKey = process.env.TOKKO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta la API KEY de Tokko. Verifique la configuracion de Vercel." },
      { status: 401 }
    );
  }

  try {
    const properties: unknown[] = [];
    let offset = 0;
    let lastMeta: TokkoResponse["meta"] | null = null;

    for (let page = 0; page < MAX_PAGES; page += 1) {
      const response = await fetch(buildTokkoUrl(apiKey, offset), {
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        let tokkoErrorBody = null;

        try {
          tokkoErrorBody = await response.json();
        } catch {
          // Tokko puede devolver texto o un cuerpo vacio.
        }

        return NextResponse.json(
          {
            error: "Tokko devolvio un error HTTP.",
            status_code: response.status,
            tokko_details: tokkoErrorBody,
          },
          { status: response.status }
        );
      }

      const data: TokkoResponse = await response.json();
      const currentObjects = Array.isArray(data.objects) ? data.objects : [];
      properties.push(...currentObjects);
      lastMeta = data.meta;

      const totalCount = data.meta?.total_count;
      const nextOffset = offset + currentObjects.length;

      if (currentObjects.length === 0) {
        break;
      }

      if (typeof totalCount === "number" && nextOffset >= totalCount) {
        break;
      }

      if (typeof totalCount !== "number" && !data.meta?.next) {
        break;
      }

      offset += PAGE_SIZE;
    }

    return NextResponse.json({
      meta: {
        ...lastMeta,
        limit: properties.length,
        offset: 0,
        total_count: lastMeta?.total_count ?? properties.length,
        next: null,
        previous: null,
      },
      objects: properties,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error de red o timeout al llamar a Tokko Broker.",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
