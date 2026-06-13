type ApiEndpoint =
  | "properties"
  | "developments"
  | "reviews"
  | "instagram"
  | "instagramIndustrias"
  | "simulatorCalculate";

const nextApiPaths: Record<ApiEndpoint, string> = {
  properties: "/api/properties",
  developments: "/api/developments",
  reviews: "/api/reviews",
  instagram: "/api/instagram",
  instagramIndustrias: "/api/instagram-industrias",
  simulatorCalculate: "/api/simulador/calcular",
};

const phpApiPaths: Record<ApiEndpoint, string> = {
  properties: "/api/properties.php",
  developments: "/api/developments.php",
  reviews: "/api/reviews.php",
  instagram: "/api/instagram.php",
  instagramIndustrias: "/api/instagram-industrias.php",
  simulatorCalculate: "/api/simulador-calcular.php",
};

export function apiUrl(endpoint: ApiEndpoint) {
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
  const usePhpApi = process.env.NEXT_PUBLIC_API_TARGET === "php";
  const path = usePhpApi ? phpApiPaths[endpoint] : nextApiPaths[endpoint];

  return `${baseUrl}${path}`;
}
