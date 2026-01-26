// app/api/simulador/route.ts
import { NextResponse } from "next/server";

const SHEETS_KEY = process.env.GOOGLE_SHEETS_API_KEY;

// Configuración de barrios
const BARRIOS = [
  {
    nombre: "La Amelia",
    spreadsheetId: "17LCtSRckLw_AZYobyxPDwlz6Oa7kAljkcjL1pZWH-eI",
    range: "Lista!A2:G",
    map: (row: any[]) => ({
      barrio: "La Amelia",
      lote: row[0],
      anticipo: Number(row[2]),
      cuota: Number(row[3]),
      cuotas: Number(row[4]),
      precioTotal: Number(row[5]),
      disponible: row[6] === "SI",
    }),
  },
  {
    nombre: "Campo Alto",
    spreadsheetId: "1nUcfMnbRsanlV_lKujAHr1yrFIdT5nIx1_bvqEqgkWE",
    range: "Lotes!A2:F",
    map: (row: any[]) => ({
      barrio: "Campo Alto",
      lote: row[1],
      anticipo: Number(row[0]),
      cuota: Number(row[2]),
      cuotas: Number(row[3]),
      precioTotal: Number(row[4]),
      disponible: row[5] === "Disponible",
    }),
  },
];

export async function GET() {
  if (!SHEETS_KEY) {
    return NextResponse.json(
      { error: "API Key no configurada" },
      { status: 500 }
    );
  }

  try {
    const resultados: any[] = [];

    for (const barrio of BARRIOS) {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${barrio.spreadsheetId}/values/${barrio.range}?key=${SHEETS_KEY}`;

      console.log(`Leyendo sheet de ${barrio.nombre}`);

      const response = await fetch(url, { next: { revalidate: 0 } });
      const data = await response.json();

      if (data.error) {
        console.error(`Error en ${barrio.nombre}:`, data.error.message);
        continue;
      }

      if (!data.values) continue;

      const lotesNormalizados = data.values
        .map(barrio.map)
        .filter((lote: any) => lote.disponible);

      resultados.push(...lotesNormalizados);
    }

    return NextResponse.json(resultados);
  } catch (error: any) {
    console.error("Error crítico simulador:", error.message);
    return NextResponse.json(
      { error: "Error al obtener lotes" },
      { status: 500 }
    );
  }
}
