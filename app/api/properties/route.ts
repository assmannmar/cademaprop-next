import { NextResponse } from "next/server";

const API_KEY = process.env.TOKKO_API_KEY!;
const BASE_URL = "https://www.tokkobroker.com/api/v1/property/";

export async function GET() {
  try {
    let page = 1;
    const allProps: any[] = [];
    let keepGoing = true;

    while (keepGoing) {
      const url = `${BASE_URL}?key=${API_KEY}&page=${page}&format=json`;

      const res = await fetch(url);

      // --- Problemas de red / servidor Tokko ---
      if (!res.ok) {
        return NextResponse.json(
          { error: `Tokko respondió ${res.status}`, page },
          { status: 500 }
        );
      }

      // --- Leemos como texto para evitar JSON roto ---
      const text = await res.text();

      if (!text.trim()) {
        return NextResponse.json(
          { error: "Tokko devolvió vacío", page },
          { status: 500 }
        );
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        return NextResponse.json(
          {
            error: "Tokko devolvió JSON inválido",
            raw: text.slice(0, 200)
          },
          { status: 500 }
        );
      }

      if (!data.objects || data.objects.length === 0) {
        keepGoing = false;
        break;
      }

      allProps.push(...data.objects);
      page++;
    }

    return NextResponse.json({
      total: allProps.length,
      properties: allProps,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: "Error inesperado", details: err.message },
      { status: 500 }
    );
  }
}
