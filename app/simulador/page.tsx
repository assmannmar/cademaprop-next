// El usuario ingresa dos valores: anticipo disponible y cuota mensual máxima. 
// Al hacer click en "Simular", se hace un POST a /api/simulador/calcular con esos datos en el body como JSON.
// Los resultados se agrupan con agruparPorBarrio(), que por cada barrio solo muestra la opción más barata (menor anticipo), evitando mostrar múltiples lotes del mismo barrio.

// la api recibe el POST, luego hace un fetch interno a su propio endpoint /api/simulador para obtener todos los lotes disponibles, y los pasa a la función calcularOpciones().

// la fuente de datos es app/simulador/logica/getLotes.ts

// la logica de filtrado está en app/simulador/logica/simulador.ts
// filtra lotes donde el anticipo del lote sea <= al anticipo del usuario y la cuota sea <= a la cuota máxima, y luego ordena por anticipo ascendente.
"use client";

import { useState } from "react";

type Opcion = {
  barrio: string;
  anticipo: number;
  cuota: number;
};

function agruparPorBarrio(opciones: any[]) {
  const mapa: Record<string, any> = {};

  opciones.forEach((op) => {
    if (!mapa[op.barrio] || op.anticipo < mapa[op.barrio].anticipo) {
      mapa[op.barrio] = op;
    }
  });

  return Object.values(mapa);
}

const LANDINGS: Record<string, string> = {
  "Campo Alto": "/emprendimientos/campo-alto",
  "La Amelia": "/emprendimientos/amelia",
  "Islas Barrios Náuticos": "/emprendimientos/islas-barrios-nauticos",
  "Justina": "/emprendimientos/justina",
  "Paseo Gavazzi": "/emprendimientos/paseo-gavazzi",
  "Puerta del Sol": "/emprendimientos/puerta-del-sol",
};


export default function SimuladorPage() {
  const [anticipo, setAnticipo] = useState("");
  const [cuota, setCuota] = useState("");
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function calcular() {
    setLoading(true);
    setError("");
    setResultado(null);

    try {
      const res = await fetch("/api/simulador/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anticipo: Number(anticipo),
          cuota: Number(cuota),
        }),
      });

      if (!res.ok) {
        throw new Error("Error al calcular");
      }

      const data = await res.json();
      setResultado(data);
    } catch (err) {
      setError("No se pudo calcular la simulación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <section className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Simulador de inversión
        </h1>

        {/* Inputs */}
        <div className="space-y-4 mb-6">
          <input
            type="number"
            placeholder="Anticipo disponible (USD)"
            value={anticipo}
            onChange={(e) => setAnticipo(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />

          <input
            type="number"
            placeholder="Cuota mensual máxima (USD)"
            value={cuota}
            onChange={(e) => setCuota(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>

        {/* Botón */}
        <button
          onClick={calcular}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:opacity-90"
        >
          {loading ? "Calculando..." : "Simular"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-600 mt-4">{error}</p>
        )}

        {/* Resultado */}
        {resultado?.opciones?.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">
              Opciones disponibles para vos
            </h2>

            {agruparPorBarrio(resultado.opciones).map((opcion: any, index) => (

              

              <div
                key={index}
                className="p-4 border rounded bg-gray-50"
              >
                <p><strong>Barrio:</strong> {opcion.barrio}</p>
                <p><strong>Anticipo:</strong> USD {opcion.anticipo}</p>
                <p><strong>Cuota:</strong> USD {opcion.cuota}</p>

                {LANDINGS[opcion.barrio] && (
                  <a
                    href={LANDINGS[opcion.barrio]}
                    className="inline-block mt-3 text-center w-full border border-black py-2 rounded hover:bg-black hover:text-white transition"
                  >
                    Más información
                  </a>
                )}
              </div>
            ))}
          </div>
        )}



        {resultado && resultado.totalOpciones === 0 && (
          <p className="mt-6">
            No encontramos opciones con esos valores 😕
          </p>
        )}
      </section>
    </main>
  );
}
