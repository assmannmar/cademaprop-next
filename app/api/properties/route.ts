import { NextResponse } from "next/server";

const API_KEY = process.env.TOKKO_API_KEY!;
const BASE_URL = "https://www.tokkobroker.com/api/v1/property/";

export async function GET() {
  let page = 1;
  const allProps: any[] = [];

  try {
    while (true) {
      const url = `${BASE_URL}?key=${API_KEY}&page=${page}&format=json`;

      const res = await fetch(url);

      // Si Tokko devuelve error → salimos
      if (!res.ok) break;

      let data: any;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Error parseando JSON de Tokko:", err);
        break;
      }

      if (!data.objects || data.objects.length === 0) break;

      allProps.push(...data.objects);
      page++;
    }

    return NextResponse.json(allProps);

  } catch (error) {
    console.error("Tokko API ERROR:", error);
    return NextResponse.json(
      { error: "Tokko API failed" },
      { status: 500 }
    );
  }
}
