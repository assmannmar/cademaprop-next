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
      // 1. Buscamos el tag 5050 en 'custom_tags' que es donde aparece en tu JSON
      const isIndustrial = dev.custom_tags?.some((t: any) => t.id === 5050);

      // 2. Opcional: Identificar residenciales (en tu JSON, el ID 5049 es "Ciudad")
      const isResidential = dev.custom_tags?.some((t: any) => t.id === 5049);

      return {
        ...dev,
        is_industrial: isIndustrial,
        is_residential: isResidential,
        // Agregamos una categoría simple para usar en el frontend
        category: isIndustrial ? 'industrial' : 'residential'
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
