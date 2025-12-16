import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json(
      { 
        error: "Faltan credenciales de Google Places",
        reviews: [] 
      },
      { status: 400 }
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=es`;

    const response = await fetch(url, {
      cache: 'no-store' // No cachear para obtener reseñas actualizadas
    });

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'OK' && data.result?.reviews) {
      // Ordenar por fecha (más recientes primero)
      const sortedReviews = data.result.reviews.sort((a: any, b: any) => b.time - a.time);
      
      return NextResponse.json({
        reviews: sortedReviews,
        rating: data.result.rating,
        total_ratings: data.result.user_ratings_total
      });
    }

    return NextResponse.json(
      { 
        error: "No se encontraron reseñas",
        reviews: [] 
      },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      { 
        error: "Error al obtener reseñas de Google",
        details: String(error),
        reviews: []
      },
      { status: 500 }
    );
  }
}
