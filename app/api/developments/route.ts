import { NextResponse } from "next/server";

interface TokkoResponse {
  meta: {
    limit: number;
    offset: number;
    total_count: number;
  };
  objects: any[];
}

export async function GET() {
  const apiKey = process.env.TOKKO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta la API KEY de Tokko. Verifique la configuración de Vercel." },
      { status: 401 }
    );
  }

  try {
    const url = `https://api.tokkobroker.com/api/v1/development/?format=json&key=${apiKey}&limit=100`;

    const response = await fetch(url, {
      cache: 'no-store' // No cachear para obtener datos actualizados
    });

    if (!response.ok) {
      let tokkoErrorBody = null;
      
      try {
        tokkoErrorBody = await response.json();
      } catch (e) {
        // Si no pudo leer el JSON, significa que Tokko devolvió texto o un cuerpo vacío
      }
      
      return NextResponse.json(
        { 
          error: "Tokko devolvió un error HTTP.", 
          status_code: response.status,
          tokko_details: tokkoErrorBody 
        },
        { status: response.status }
      );
    }

    const data: TokkoResponse = await response.json();
    
    // Filtrar solo emprendimientos activos y con fotos
    const activeDevelopments = data.objects.filter(dev => {
      // Puedes agregar más filtros según necesites
      const hasPhotos = dev.photos && dev.photos.length > 0;
      const isActive = !dev.is_starred_on_web || dev.is_starred_on_web === true;
      
      return hasPhotos && isActive;
    });

    return NextResponse.json({
      ...data,
      objects: activeDevelopments
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Error de red o timeout al llamar a Tokko Broker.", 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}