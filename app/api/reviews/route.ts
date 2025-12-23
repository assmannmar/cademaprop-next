// app/api/reviews/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const SPREADSHEET_ID = '1nWEyaRGyfd4fxxu_-Is7pAVIrwmflSJj-AnZ74LlIwA';
  const RANGE = 'Reviews!A2:C10';
  const SHEETS_KEY = process.env.GOOGLE_SHEETS_API_KEY;

  console.log("--- Iniciando petición a Google Sheets ---");
  console.log("API Key configurada:", !!SHEETS_KEY);

  if (!SHEETS_KEY) {
    return NextResponse.json({ error: "API Key no configurada" }, { status: 500 });
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${SHEETS_KEY}`;
    const response = await fetch(url, { next: { revalidate: 0 } }); // Revalidate 0 para debuggear sin cache
    const data = await response.json();

    // ======= LOGS DE DIAGNÓSTICO =======
    console.log("Status de la respuesta:", response.status);
    
    if (data.error) {
      console.error("Error devuelto por Google:", data.error.message);
      return NextResponse.json({ error: data.error.message }, { status: response.status });
    }

    console.log("Filas crudas recibidas:", data.values);
    // ===================================

    if (!data.values || data.values.length === 0) {
      console.warn("La hoja está vacía o el rango no tiene datos.");
      return NextResponse.json([]);
    }

    const mappedReviews = data.values.map((row: any, index: number) => {
      console.log(`Mapeando fila ${index + 1}:`, row);
      return {
        author_name: row[0] || "Cliente",
        rating: parseInt(row[1]) || 5,
        text: row[2] || "",
      };
    });

    return NextResponse.json(mappedReviews);
  } catch (error: any) {
    console.error("Error crítico en el servidor:", error.message);
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }
}