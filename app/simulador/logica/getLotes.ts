import { NextResponse } from "next/server";

const SHEETS_KEY = process.env.GOOGLE_SHEETS_API_KEY;

const BARRIOS = [
  {
    nombre: "La Amelia",
    spreadsheetId: "1gaYsEH9MhRWlILxguwP7CAzN6ISAyee6qm86ue2NFys",
    range: "Lotes!A2:H",
    map: (row: any[]) => ({
      barrio: "La Amelia",
      lote: row[0],
      anticipo: Number(row[5]),
      cuota: Number(row[7]),
      cuotas: Number(row[6]),
      precioTotal: Number(row[3]),
      disponible: row[2] === "Disponible",
    }),
  },
  {
    nombre: "Campo Alto",
    spreadsheetId: "1qnhqiMYouJMeK16xzlTIkwJ8pfWo_NwA6jWRsBqyVho",
    range: "Lotes!A2:H",
    map: (row: any[]) => ({
      barrio: "Campo Alto",
      lote: row[0],
      anticipo: Number(row[5]),
      cuota: Number(row[7]),
      cuotas: Number(row[6]),
      precioTotal: Number(row[4]),
      disponible: row[2] === "Disponible",
    }),
  },
];

export async function getLotes() {
  if (!SHEETS_KEY) {
    throw new Error("API Key no configurada");
  }

  const resultados: any[] = [];

  for (const barrio of BARRIOS) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${barrio.spreadsheetId}/values/${barrio.range}?key=${SHEETS_KEY}`;

    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();

    if (!data.values) continue;

    const normalizados = data.values
      .map(barrio.map)
      .filter((lote: any) => lote.disponible);

    resultados.push(...normalizados);
  }

  return resultados;
}
