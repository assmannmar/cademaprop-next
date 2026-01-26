import { NextResponse } from "next/server";
import { getLotes } from "@/app/simulador/logica/getLotes";

export async function GET() {
  try {
    const lotes = await getLotes();
    return NextResponse.json(lotes);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
