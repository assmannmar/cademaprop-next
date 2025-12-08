import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.TOKKO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta la API KEY de Tokko" },
      { status: 500 }
    );
  }

  try {
    const url = `https://www.tokkobroker.com/api/v1/property/?key=${apiKey}&limit=5000&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Tokko devolvió un error", status: response.status },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error llamando a Tokko", details: String(error) },
      { status: 500 }
    );
  }
}
