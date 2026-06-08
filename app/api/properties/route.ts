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

const DEFAULT_PAGE_SIZE = 30;
const MAX_PAGE_SIZE = 50;
const ALL_OPERATION_TYPES = [1, 2, 3];
const ALL_PROPERTY_TYPES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25,
];

const operationTypeMap: Record<string, number> = {
  sale: 1,
  rent: 2,
  rental: 2,
  "temporary rent": 3,
  "temporary rental": 3,
};

const propertyTypeMap: Record<string, number[]> = {
  land: [1],
  terreno: [1],
  apartment: [2],
  appartment: [2],
  departamento: [2],
  house: [3],
  casa: [3],
  "weekend house": [4],
  office: [5],
  oficina: [5],
  mooring: [6],
  commercial: [7, 8],
  comercial: [7, 8],
  countryside: [9],
  campo: [9],
  "industrial ship": [17],
  "nave industrial": [17],
  "terreno industrial": [1],
};

function clampNumber(value: string | null, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.trunc(parsed), min), max);
}

function buildTokkoSearchUrl(apiKey: string, limit: number, offset: number, data: object) {
  const params = new URLSearchParams({
    key: apiKey,
    limit: String(limit),
    offset: String(offset),
    format: "json",
    lang: "es",
    data: JSON.stringify(data),
  });

  return `https://www.tokkobroker.com/api/v1/property/search/?${params.toString()}`;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function getLocationIds(apiKey: string, query: string) {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    key: apiKey,
    q: query,
    format: "json",
    lang: "es",
  });

  const response = await fetch(
    `https://www.tokkobroker.com/api/v1/location/quicksearch/?${params.toString()}`,
    { next: { revalidate: 300 } }
  );

  if (!response.ok) return [];

  const data = await response.json();
  const objects = Array.isArray(data.objects) ? data.objects : Array.isArray(data) ? data : [];

  return objects
    .map((item: { id?: number | string }) => Number(item.id))
    .filter((id: number) => Number.isFinite(id));
}

function getSearchData(searchParams: URLSearchParams, locationIds: number[]) {
  const operationType = searchParams.get("operation_type") || searchParams.get("operacion") || "";
  const propertyType = searchParams.get("property_type") || searchParams.get("tipo") || "";
  const bedrooms = searchParams.get("bedrooms") || searchParams.get("dormitorios") || "";
  const parking = searchParams.get("has_parking") || searchParams.get("cochera") || "";
  const pool = searchParams.get("has_pool") || searchParams.get("pileta") || "";
  const division = searchParams.get("division") || "";
  const maxPrice = searchParams.get("max_price") || searchParams.get("precio-max") || "";
  const credit = searchParams.get("credit_eligible") || searchParams.get("credito") || "";
  const featured = searchParams.get("featured") === "true";

  const operationId = operationTypeMap[normalize(operationType)];
  const propertyTypeIds = propertyTypeMap[normalize(propertyType)];
  const filters: unknown[] = [];

  if (bedrooms) {
    filters.push(["room_amount", ">=", Number(bedrooms)]);
  }

  if (parking === "yes") {
    filters.push(["parking_lot_amount", ">", 0]);
  }

  if (parking === "no") {
    filters.push(["parking_lot_amount", "=", 0]);
  }

  if (pool === "yes") {
    filters.push(["tags__name", "op", "Pool"]);
  }

  if (pool === "no") {
    filters.push(["tags__name", "!=", "Pool"]);
  }

  if (division) {
    filters.push(["custom_tags__name", "op", division]);
  }

  if (credit === "Eligible") {
    filters.push(["credit_eligible", "=", "Eligible"]);
  }

  if (credit === "Not eligible") {
    filters.push(["credit_eligible", "!=", "Eligible"]);
  }

  if (featured) {
    filters.push(["is_starred_on_web", "=", true]);
  }

  return {
    current_localization_id: locationIds.length === 1 ? locationIds[0] : 0,
    current_localization_type: locationIds.length === 1 ? "division" : "country",
    division_filters: locationIds.length > 1 ? locationIds : [],
    price_from: 0,
    price_to: maxPrice ? Number(maxPrice) : 999999999,
    operation_types: operationId ? [operationId] : ALL_OPERATION_TYPES,
    property_types: propertyTypeIds || ALL_PROPERTY_TYPES,
    currency: "ANY",
    filters,
    only_available: "checked",
  };
}

export async function GET(request: Request) {
  const apiKey = process.env.TOKKO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta la API KEY de Tokko. Verifique la configuracion de Vercel." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = clampNumber(searchParams.get("page"), 1, 1, 10000);
    const limit = clampNumber(searchParams.get("limit"), DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE);
    const offset = (page - 1) * limit;
    const location = searchParams.get("location") || searchParams.get("ubicacion") || "";
    const locationIds = await getLocationIds(apiKey, location);
    const searchData = getSearchData(searchParams, locationIds);
    const response = await fetch(buildTokkoSearchUrl(apiKey, limit, offset, searchData), {
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

    return NextResponse.json({
      meta: {
        ...data.meta,
        limit,
        offset,
        page,
        total_pages: Math.ceil((data.meta?.total_count ?? 0) / limit),
      },
      objects: Array.isArray(data.objects) ? data.objects : [],
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
