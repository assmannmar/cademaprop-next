import { NextResponse } from 'next/server';

export async function GET() {
  const SPREADSHEET_ID = '1nWEyaRGyfd4fxxu_-Is7pAVIrwmflSJj-AnZ74LlIwA';
  const RANGE = 'Reviews!A2:C10';
  const SHEETS_KEY = process.env.GOOGLE_SHEETS_API_KEY; // Sin el prefijo NEXT_PUBLIC_

  if (!SHEETS_KEY) {
    return NextResponse.json({ error: "API Key no configurada" }, { status: 500 });
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${SHEETS_KEY}`;
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache opcional de 1 hora
    const data = await response.json();

    if (!data.values) {
      return NextResponse.json([]);
    }

    const mappedReviews = data.values.map((row: any) => ({
      author_name: row[0] || "Cliente",
      rating: parseInt(row[1]) || 5,
      text: row[2] || "",
    }));

    return NextResponse.json(mappedReviews);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }
}