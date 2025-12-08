import { NextResponse } from "next/server";

const API_KEY = process.env.TOKKO_API_KEY;
const BASE_URL = "https://www.tokkobroker.com/api/v1/property/";

export async function GET() {
  let page = 1;
  let total = 0;
  let keepGoing = true;

  while (keepGoing) {
    const res = await fetch(
      `${BASE_URL}?key=${API_KEY}&page=${page}&page_size=100&format=json`
    );

    const data = await res.json();

    if (!data.objects || data.objects.length === 0) {
      keepGoing = false;
      break;
    }

    total += data.objects.length;
    page++;
  }

  return NextResponse.json({
    total,
    pagesFetched: page - 1,
  });
}
