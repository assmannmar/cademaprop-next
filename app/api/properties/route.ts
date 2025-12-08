import { NextResponse } from "next/server";

const API_KEY = process.env.TOKKO_API_KEY!;
const BASE_URL = "https://www.tokkobroker.com/api/v1/property/";

export async function GET() {
  try {
    let page = 1;
    const allProps: any[] = [];
    let keepGoing = true;

    while (keepGoing) {
      const res = await fetch(`${BASE_URL}?key=${API_KEY}&page=${page}&format=json`);
      const data = await res.json();

      if (!data.objects || data.objects.length === 0) {
        keepGoing = false;
        break;
      }

      allProps.push(...data.objects);
      page++;
    }

    return NextResponse.json({ total: allProps.length, properties: allProps });

  } catch (err) {
    return NextResponse.json(
      { error: "Tokko API error", details: (err as any).message },
      { status: 500 }
    );
  }
}
