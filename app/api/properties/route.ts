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
const TOKKO_PAGE_SIZE = 50;
const MAX_TOKKO_PAGES = 200;
const ALL_OPERATION_TYPES = [1, 2, 3];
const INDUSTRIAL_PROPERTY_TYPES = [14, 12, 27];
const CITY_PROPERTY_TYPES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27,
].filter((id) => !INDUSTRIAL_PROPERTY_TYPES.includes(id));
const ALL_PROPERTY_TYPES = [...CITY_PROPERTY_TYPES, ...INDUSTRIAL_PROPERTY_TYPES].sort(
  (a, b) => a - b
);

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
  deposit: [14],
  deposito: [14],
  depósito: [14],
  "industrial ship": [12],
  "nave industrial": [12],
  "deposito/nave industrial": [14, 12],
  "depósito/nave industrial": [14, 12],
  "terreno industrial": [27],
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

function resolvePropertyTypes(propertyType: string, division: string) {
  const propertyTypeIds = propertyTypeMap[normalize(propertyType)];
  const divisionTypes =
    normalize(division) === "industria"
      ? INDUSTRIAL_PROPERTY_TYPES
      : normalize(division) === "ciudad"
        ? CITY_PROPERTY_TYPES
        : ALL_PROPERTY_TYPES;

  if (!propertyTypeIds) {
    return divisionTypes;
  }

  if (!division) {
    return propertyTypeIds;
  }

  const intersection = propertyTypeIds.filter((id) => divisionTypes.includes(id));
  return intersection.length > 0 ? intersection : [0];
}

function getSearchData(searchParams: URLSearchParams) {
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
  const propertyTypeIds = resolvePropertyTypes(propertyType, division);
  const filters: unknown[] = [];
  const withTags: number[] = [];
  const withoutTags: number[] = [];

  if (bedrooms) {
    filters.push(["suite_amount", "=", Number(bedrooms)]);
  }

  if (parking === "yes") {
    filters.push(["parking_lot_amount", ">", 0]);
  }

  if (parking === "no") {
    filters.push(["parking_lot_amount", "=", 0]);
  }

  if (pool === "yes") {
    withTags.push(51);
  }

  if (pool === "no") {
    withoutTags.push(51);
  }

  if (credit === "Eligible") {
    filters.push(["credit_eligible", "op", "1"]);
  }

  if (credit === "Not eligible") {
    filters.push(["credit_eligible", "!=", "1"]);
  }

  if (featured) {
    filters.push(["is_starred_on_web", "=", true]);
  }

  return {
    current_localization_id: 0,
    current_localization_type: "country",
    division_filters: [],
    price_from: 0,
    price_to: maxPrice ? Number(maxPrice) : 999999999,
    operation_types: operationId ? [operationId] : ALL_OPERATION_TYPES,
    property_types: propertyTypeIds,
    currency: "ANY",
    filters,
    with_tags: withTags,
    without_tags: withoutTags,
    only_available: "checked",
  };
}

async function fetchTokkoSearch(apiKey: string, limit: number, offset: number, searchData: object) {
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

    return {
      ok: false as const,
      status: response.status,
      error: tokkoErrorBody,
      data: null,
    };
  }

  return {
    ok: true as const,
    status: response.status,
    error: null,
    data: (await response.json()) as TokkoResponse,
  };
}

function matchesTextSearch(property: unknown, query: string) {
  if (!query.trim() || typeof property !== "object" || property === null) return true;

  const item = property as Record<string, unknown>;
  const haystack = [
    item.publication_title,
    item.real_address,
    item.fake_address,
    item.address,
  ]
    .filter((value): value is string => typeof value === "string")
    .map(normalize)
    .join(" ");

  return haystack.includes(normalize(query));
}

async function fetchTextFilteredSearch(
  apiKey: string,
  page: number,
  limit: number,
  searchData: object,
  textQuery: string
) {
  const matches: unknown[] = [];
  let totalScanned = 0;
  let lastMeta: TokkoResponse["meta"] | null = null;

  for (let tokkoPage = 0; tokkoPage < MAX_TOKKO_PAGES; tokkoPage += 1) {
    const offset = tokkoPage * TOKKO_PAGE_SIZE;
    const result = await fetchTokkoSearch(apiKey, TOKKO_PAGE_SIZE, offset, searchData);

    if (!result.ok) {
      return result;
    }

    const data = result.data;
    const objects = Array.isArray(data.objects) ? data.objects : [];
    lastMeta = data.meta;
    totalScanned += objects.length;
    matches.push(...objects.filter((property) => matchesTextSearch(property, textQuery)));

    const totalCount = data.meta?.total_count;
    if (objects.length === 0 || (typeof totalCount === "number" && totalScanned >= totalCount)) {
      break;
    }
  }

  const offset = (page - 1) * limit;

  return {
    ok: true as const,
    status: 200,
    error: null,
    data: {
      meta: {
        ...lastMeta,
        limit,
        offset,
        total_count: matches.length,
      },
      objects: matches.slice(offset, offset + limit),
    },
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
    const searchData = getSearchData(searchParams);
    const result = location.trim()
      ? await fetchTextFilteredSearch(apiKey, page, limit, searchData, location)
      : await fetchTokkoSearch(apiKey, limit, offset, searchData);

    if (!result.ok) {
      return NextResponse.json(
        {
          error: "Tokko devolvio un error HTTP.",
          status_code: result.status,
          tokko_details: result.error,
        },
        { status: result.status }
      );
    }

    const data: TokkoResponse = result.data;

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
