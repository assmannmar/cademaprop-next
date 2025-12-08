export default async function PropertiesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`);
  const data = await res.json();

  return (
    <div>
      <h1>Propiedades</h1>

      {data.objects?.map((prop) => (
        <div key={prop.id} style={{border:"1px solid #ccc", margin:"10px", padding:"10px"}}>
          <h2>{prop.title}</h2>
          <p>Precio: {prop.operations?.[0]?.prices?.[0]?.price} {prop.operations?.[0]?.prices?.[0]?.currency}</p>
        </div>
      ))}
    </div>
  );
}
