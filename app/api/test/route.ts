import { NextRequest } from "next/server";

interface TokkoProperty {
  id: number;
  title: string;
  // agrega los campos que necesites
  [key: string]: any;
}

interface TokkoResponse {
  objects: TokkoProperty[];
  meta: {
    next: string | null;
    total_count: number;
  };
}

export async function GET(req: NextRequest) {
  try {
    let page = 1;
    let allProps: TokkoProperty[] = [];
    let keepGoing = true;

    while (keepGoing) {
      const url = `https://www.tokkobroker.com/api/v1/property/?format=json&lang=es_ar&key=${process.env.TOKKO_API_KEY}&page=${page}`;

      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        return Response.json(
          { error: "Error al obtener datos de Tokko" },
          { status: res.status }
        );
      }

      const data: TokkoResponse = await res.json();

      allProps.push(...data.objects);

      if (!data.meta?.next) {
        keepGoing = false;
      } else {
        page++;
      }
    }

    return Response.json({ count: allProps.length, properties: allProps });

  } catch (error) {
    console.error("Tokko API error:", error);
    return Response.json({ error: "Error interno en el servidor" }, { status: 500 });
  }
}
