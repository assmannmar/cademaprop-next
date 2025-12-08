// C:\Users\assma\Documents\GitHub\cademaprop-next\app\api\properties\route.ts
import { NextResponse } from "next/server";

// Define el tipo de la respuesta de Tokko para claridad
interface TokkoResponse {
  meta: {
    limit: number;
    // ... otros metadatos
  };
  objects: any[];
}

export async function GET() {
  const apiKey = process.env.TOKKO_API_KEY;

  // 1. Manejo de la clave API (cambiamos a 401/404)
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta la API KEY de Tokko. Verifique la configuración de Vercel." },
      { status: 401 } // No autorizado
    );
  }

  try {
    // Mantuvimos el límite reducido para asegurar que el build pase
    const url = `https://www.tokkobroker.com/api/v1/property/?key=${apiKey}&limit=100&format=json`;

    const response = await fetch(url, {
        // Configuraciones de cacheado para asegurar que Vercel no use una respuesta antigua
        cache: 'no-store' 
    });

    // 2. Manejo de errores de Tokko (ej. 401/403 si la clave es mala)
    if (!response.ok) {
        
        let tokkoErrorBody = null;
        
        // Intentamos leer el JSON de error que Tokko pudo haber enviado
        try {
            tokkoErrorBody = await response.json();
        } catch (e) {
            // Si no pudo leer el JSON, significa que Tokko devolvió texto o un cuerpo vacío
        }
        
        // Devolvemos el status real de Tokko (401, 403, 404, etc.)
        return NextResponse.json(
            { 
                error: "Tokko devolvió un error HTTP.", 
                status_code: response.status,
                tokko_details: tokkoErrorBody 
            },
            { status: response.status }
        );
    }

    // 3. Respuesta exitosa
    const data: TokkoResponse = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    // 4. Manejo de errores de red (ej. Timeout)
    return NextResponse.json(
      { 
        error: "Error de red o timeout al llamar a Tokko Broker.", 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}