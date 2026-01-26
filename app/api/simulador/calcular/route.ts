import { NextResponse } from "next/server";
import { calcularOpciones } from "@/app/simulador/logica/simulador";

export async function POST(req: Request) {
  const { anticipo, cuota } = await req.json();

  if (!anticipo || !cuota) {
    return NextResponse.json(
      { error: "Datos incompletos" },
      { status: 400 }
    );
  }

  const response = await fetch(`${process.env.BASE_URL}/api/simulador`);
  const lotes = await response.json();

  const opciones = calcularOpciones(lotes, anticipo, cuota);

  return NextResponse.json({
    totalOpciones: opciones.length,
    mejorOpcion: opciones[0] || null,
    opciones
  });
}
