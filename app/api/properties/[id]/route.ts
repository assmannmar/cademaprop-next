import { NextResponse } from "next/server";

function buildTokkoPropertyUrl(apiKey: string, id: string) {
  const params = new URLSearchParams({
    key: apiKey,
    format: "json",
    lang: "es",
  });

  return `https://www.tokkobroker.com/api/v1/property/${id}/?${params.toString()}`;
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
    const response = await fetch(buildTokkoPropertyUrl(apiKey, id), {
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

    const property = await response.json();
    return NextResponse.json(property);
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
