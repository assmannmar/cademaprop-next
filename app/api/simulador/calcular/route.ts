import { NextResponse } from "next/server";
import { getLotes } from "@/app/simulador/logica/getLotes";
import { calcularOpciones } from "@/app/simulador/logica/simulador";

export async function POST(req: Request) {
  const { anticipo, cuota } = await req.json();

  if (!anticipo || !cuota) {
    return NextResponse.json(
      { error: "Datos incompletos" },
      { status: 400 }
    );
  }

  try {
    const lotes = await getLotes();
    const opciones = calcularOpciones(lotes, anticipo, cuota);

    return NextResponse.json({
      totalOpciones: opciones.length,
      mejorOpcion: opciones[0] || null,
      opciones,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
