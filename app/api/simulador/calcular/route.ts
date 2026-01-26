import { NextResponse } from "next/server";
import { calcularOpciones } from "@/app/simulador/logica/simulador";

export async function POST(req: Request) {
  try {
    const { anticipo, cuota } = await req.json();

    if (!anticipo || !cuota) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const response = await fetch(new URL("/api/simulador", req.url));
    const lotes = await response.json();

    const opciones = calcularOpciones(lotes, anticipo, cuota);

    return NextResponse.json({
      totalOpciones: opciones.length,
      mejorOpcion: opciones[0] || null,
      opciones,
    });
  } catch (error: any) {
    console.error("🔥 ERROR CALCULAR:", error);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
