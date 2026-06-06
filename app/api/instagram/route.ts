import { NextResponse } from "next/server";
import { getInstagramPosts } from "@/lib/instagram";

export async function GET() {
  try {
    const posts = await getInstagramPosts(6);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error en /api/instagram:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error inesperado al consultar Instagram",
      },
      { status: 500 }
    );
  }
}
