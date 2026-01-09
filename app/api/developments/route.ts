import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.TOKKO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta la API KEY de Tokko." },
      { status: 401 }
    );
  }

  try {
    // Agregamos order_by para que los más nuevos aparezcan primero
    const url = `https://api.tokkobroker.com/api/v1/development/?format=json&key=${apiKey}&limit=100&lang=es&order_by=id&order=desc`;

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      return NextResponse.json({ error: "Error en Tokko" }, { status: response.status });
    }

    const data = await response.json();
    
    const processedDevelopments = data.objects
      .filter((dev: any) => dev.photos && dev.photos.length > 0)
      .map((dev: any) => {
        // LÓGICA DE DIVISIÓN:
        // Buscamos si entre sus tags o nombre existe la palabra "Industrial", "Parque", "Logístico"
        // O si el type es específico de industria.
        const tags = (dev.tags || []).map((t: any) => t.name.toLowerCase());
        const name = (dev.name || "").toLowerCase();
        
        const isIndustrial = 
          tags.some((t: string) => t.includes("industrial") || t.includes("logistico") || t.includes("deposito")) ||
          name.includes("parque industrial") || 
          name.includes("polo logístico");

        return {
          ...dev,
          is_industrial: isIndustrial // Enviamos este booleano al frontend
        };
      });

    return NextResponse.json({
      ...data,
      objects: processedDevelopments
    });
    
  } catch (error) {
    return NextResponse.json({ error: "Error de red" }, { status: 500 });
  }
}