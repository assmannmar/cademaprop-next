// C:\Users\assma\Documents\GitHub\cademaprop-next\app\page.tsx
import { notFound } from 'next/navigation';

interface Property {
  id: number;
  // Define otros campos esenciales que uses de Tokko
  address: string;
  price?: number;
  operation_type?: { name: string };
  property_type?: { name: string };
}

// ---------------------------------------------
// FUNCIÓN ROBUSTA DE OBTENCIÓN DE DATOS
// ---------------------------------------------

async function getPropiedades(): Promise<Property[]> {
    
    // Llama a tu propia API interna
    const res = await fetch(`${process.env.VERCEL_URL}/api/properties`, { 
        // Usamos cache 'no-store' para asegurar que el build siempre haga una nueva llamada a Tokko
        cache: 'no-store' 
    });

    // 1. VERIFICACIÓN CRUCIAL: Si el status NO es 200, manejamos el error.
    if (!res.ok) {
        let errorData = null;
        try {
            // Intentamos leer el JSON de error que generó tu route.ts
            errorData = await res.json(); 
        } catch (e) {
            // Si falla, la respuesta no fue JSON. Capturamos el error aquí.
            console.error("Respuesta de API interna no fue JSON:", res.status);
            // Esto evita el 'Unexpected end of JSON input' que veías en el build
        }

        console.error("Falló la obtención de datos de propiedades:", errorData);
        
        // Si el build falla, podemos devolver un array vacío para que la página renderice 
        // una vista de "No hay propiedades" en lugar de fallar el despliegue.
        return []; 
    }

    // 2. Si la respuesta es OK (200)
    try {
        const data = await res.json();
        
        // Tokko devuelve un array de propiedades en la clave 'objects'
        return data.objects || [];
    } catch (e) {
        console.error("Error al parsear el JSON de propiedades exitoso:", e);
        // Si Tokko devuelve 200 pero el JSON está roto
        return [];
    }
}

// ---------------------------------------------
// COMPONENTE PRINCIPAL
// ---------------------------------------------

export default async function HomePage() {
  
  // La llamada a la función se ejecuta durante el build (prerendering)
  const propiedades = await getPropiedades(); 

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">
        Bienvenido a Cadema Prop
      </h1>
      
      {propiedades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {propiedades.map((prop) => (
            <div key={prop.id} className="p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{prop.address}</h2>
              <p>Tipo: {prop.property_type?.name || 'N/A'}</p>
              <p>Operación: {prop.operation_type?.name || 'N/A'}</p>
              <p className="font-bold">Precio: ${prop.price?.toLocaleString() || 'Consultar'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl text-red-500">
          No se pudieron cargar las propiedades o no hay datos disponibles.
        </p>
      )}
      
      <p className="mt-12 text-sm text-gray-500">
        Datos cargados (Límite: 10). Total de propiedades: {propiedades.length}
      </p>
    </main>
  );
}