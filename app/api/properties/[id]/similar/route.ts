import { NextResponse } from "next/server";

interface TokkoResponse {
  meta?: {
    total_count?: number;
  };
  objects?: unknown[];
}

const TOKKO_PAGE_SIZE = 50;
const MAX_TOKKO_PAGES = 200;
const RELATED_LIMIT = 6;
const PRICE_RANGE_RATIO = 0.3;

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
  "casa de fin de semana": [4],
  office: [5],
  oficina: [5],
  mooring: [6],
  commercial: [7, 8],
  comercial: [7, 8],
  countryside: [9],
  campo: [9],
  deposit: [14],
  deposito: [14],
  storage: [14],
  "industrial ship": [12],
  "nave industrial": [12],
  "deposito/nave industrial": [14, 12],
  "terreno industrial": [27],
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getObjectValue(item: unknown, key: string) {
  return typeof item === "object" && item !== null
    ? (item as Record<string, unknown>)[key]
    : undefined;
}

function getPrice(property: unknown) {
  const operations = getObjectValue(property, "operations");
  if (!Array.isArray(operations)) return 0;

  const firstOperation = operations[0] as Record<string, unknown> | undefined;
  const prices = firstOperation?.prices;
  if (!Array.isArray(prices)) return 0;

  const webPrice = prices.find((price) => {
    return typeof price === "object" && price !== null && (price as Record<string, unknown>).web_price;
  }) as Record<string, unknown> | undefined;

  const firstPrice = prices[0] as Record<string, unknown> | undefined;
  return Number(webPrice?.price ?? firstPrice?.price ?? 0);
}

function getOperationType(property: unknown) {
  const operations = getObjectValue(property, "operations");
  if (!Array.isArray(operations)) return "";

  const firstOperation = operations[0] as Record<string, unknown> | undefined;
  return typeof firstOperation?.operation_type === "string" ? firstOperation.operation_type : "";
}

function getPropertyTypeName(property: unknown) {
  const development = getObjectValue(property, "development");
  const developmentType =
    typeof development === "object" && development !== null
      ? (development as Record<string, unknown>).type
      : undefined;

  if (typeof developmentType === "object" && developmentType !== null) {
    const name = (developmentType as Record<string, unknown>).name;
    if (typeof name === "string" && name.trim()) return name;
  }

  const type = getObjectValue(property, "type");
  if (typeof type === "object" && type !== null) {
    const name = (type as Record<string, unknown>).name;
    if (typeof name === "string" && name.trim()) return name;
  }

  return "";
}

function buildTokkoPropertyUrl(apiKey: string, id: string) {
  const params = new URLSearchParams({
    key: apiKey,
    format: "json",
    lang: "es",
  });

  return `https://www.tokkobroker.com/api/v1/property/${id}/?${params.toString()}`;
}

function buildTokkoSearchUrl(apiKey: string, offset: number, data: object) {
  const params = new URLSearchParams({
    key: apiKey,
    limit: String(TOKKO_PAGE_SIZE),
    offset: String(offset),
    format: "json",
    lang: "es",
    order_by: "id",
    order: "desc",
    data: JSON.stringify(data),
  });

  return `https://www.tokkobroker.com/api/v1/property/search/?${params.toString()}`;
}

async function fetchJson(url: string) {
  const response = await fetch(url, { next: { revalidate: 300 } });

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      data: null,
    };
  }

  return {
    ok: true as const,
    status: response.status,
    data: await response.json(),
  };
}

function shuffle<T>(items: T[]) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function uniqueById(items: unknown[]) {
  const seen = new Set<number>();

  return items.filter((item) => {
    const id = Number(getObjectValue(item, "id"));
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.TOKKO_API_KEY;
  const { id } = await params;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta la API KEY de Tokko. Verifique la configuracion de Vercel." },
      { status: 401 }
    );
  }

  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "ID de propiedad invalido." }, { status: 400 });
  }

  try {
    const propertyResult = await fetchJson(buildTokkoPropertyUrl(apiKey, id));

    if (!propertyResult.ok || !propertyResult.data) {
      return NextResponse.json(
        { error: "No se pudo cargar la propiedad base." },
        { status: propertyResult.status }
      );
    }

    const property = propertyResult.data;
    const operationType = getOperationType(property);
    const propertyTypeName = getPropertyTypeName(property);
    const operationTypeId = operationTypeMap[normalize(operationType)];
    const propertyTypeIds = propertyTypeMap[normalize(propertyTypeName)];

    if (!operationTypeId || !propertyTypeIds?.length) {
      return NextResponse.json({ objects: [] });
    }

    const searchData = {
      current_localization_id: 0,
      current_localization_type: "country",
      division_filters: [],
      price_from: 0,
      price_to: 999999999,
      operation_types: [operationTypeId],
      property_types: propertyTypeIds,
      currency: "ANY",
      filters: [],
      with_tags: [],
      without_tags: [],
      only_available: "checked",
    };

    const candidates: unknown[] = [];
    let totalScanned = 0;

    for (let page = 0; page < MAX_TOKKO_PAGES; page += 1) {
      const offset = page * TOKKO_PAGE_SIZE;
      const result = await fetchJson(buildTokkoSearchUrl(apiKey, offset, searchData));

      if (!result.ok || !result.data) {
        return NextResponse.json(
          { error: "Tokko devolvio un error HTTP.", status_code: result.status },
          { status: result.status }
        );
      }

      const data = result.data as TokkoResponse;
      const objects = Array.isArray(data.objects) ? data.objects : [];
      totalScanned += objects.length;
      candidates.push(
        ...objects.filter((item) => {
          return Number(getObjectValue(item, "id")) !== Number(id);
        })
      );

      const totalCount = data.meta?.total_count;
      if (objects.length === 0 || (typeof totalCount === "number" && totalScanned >= totalCount)) {
        break;
      }
    }

    const uniqueCandidates = uniqueById(candidates);
    const basePrice = getPrice(property);
    const priceCandidates =
      basePrice > 0
        ? uniqueCandidates.filter((item) => {
            const candidatePrice = getPrice(item);
            return (
              candidatePrice > 0 &&
              candidatePrice >= basePrice * (1 - PRICE_RANGE_RATIO) &&
              candidatePrice <= basePrice * (1 + PRICE_RANGE_RATIO)
            );
          })
        : [];

    const selected =
      uniqueCandidates.length > RELATED_LIMIT && basePrice > 0
        ? [
            ...shuffle(priceCandidates).slice(0, RELATED_LIMIT),
            ...shuffle(
              uniqueCandidates.filter((item) => !priceCandidates.includes(item))
            ).slice(0, Math.max(0, RELATED_LIMIT - priceCandidates.length)),
          ].slice(0, RELATED_LIMIT)
        : shuffle(uniqueCandidates).slice(0, RELATED_LIMIT);

    return NextResponse.json({ objects: selected });
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
