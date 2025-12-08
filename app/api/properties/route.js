export async function GET(request) {
  const apiKey = process.env.TOKKO_API_KEY;

  const url = "https://www.tokkobroker.com/api/v1/property/?format=json&lang=es_ar";

  const res = await fetch(url + "&key=" + apiKey);
  const data = await res.json();

  return Response.json(data);
}
