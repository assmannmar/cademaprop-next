export default async function handler(req, res) {
  try {
    let page = 1;
    let allProps = [];
    let keepGoing = true;

    while (keepGoing) {
      const url = `https://www.tokkobroker.com/api/v1/property/?format=json&lang=es_ar&key=TU_API_KEY&page=${page}`;

      const response = await fetch(url);
      if (!response.ok) {
        return res.status(response.status).json({ error: "Error al obtener datos de Tokko" });
      }

      const data = await response.json();

      // Acá vienen las propiedades de esta página
      const props = data.objects || [];

      allProps = [...allProps, ...props];

      // Si no hay más páginas, cortamos
      if (!data.meta || !data.meta.next) {
        keepGoing = false;
      } else {
        page++;
      }
    }

    return res.status(200).json({ properties: allProps });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno" });
  }
}
