"use client";

import FullScreenLoader from '@/app/components/loader';
import { useState } from "react";
import { apiUrl } from "@/lib/api";

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

const WA_NUMERO = "5493489368518"; 

const WA_MENSAJES: Record<string, (op: any) => string> = {
  "Campo Alto": (op) =>
    `Hola! Vi el simulador y me interesa Campo Alto. Anticipo: USD ${op.anticipo}, cuota: USD ${op.cuota}. ¿Me podés dar más info?`,
  "La Amelia": (op) =>
    `Hola! Vi el simulador y me interesa La Amelia. Anticipo: USD ${op.anticipo}, cuota: USD ${op.cuota}. ¿Me podés dar más info?`,
  "Islas Barrios Náuticos": (op) =>
    `Hola! Vi el simulador y me interesa Islas Barrios Náuticos. Anticipo: USD ${op.anticipo}, cuota: USD ${op.cuota}. ¿Me podés dar más info?`,
  "Justina": (op) =>
    `Hola! Vi el simulador y me interesa Justina. Anticipo: USD ${op.anticipo}, cuota: USD ${op.cuota}. ¿Me podés dar más info?`,
  "Puerta del Sol": (op) =>
    `Hola! Vi el simulador y me interesa Puerta del Sol. Anticipo: USD ${op.anticipo}, cuota: USD ${op.cuota}. ¿Me podés dar más info?`,
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
      const res = await fetch(apiUrl("simulatorCalculate"), {
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
    <>
      {loading && <FullScreenLoader />}
      <main className="min-h-screen bg-gray-50 pt-[120px] pb-12">
        <section className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Simulador de inversión</h1>

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
          {error && <p className="text-red-600 mt-4">{error}</p>}

          {/* Resultados */}
          {resultado?.opciones?.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">
                Opciones disponibles para vos
              </h2>

              {agruparPorBarrio(resultado.opciones).map((opcion: any, index: number) => (
                <div key={index} className="p-4 border rounded bg-gray-50">
                  <p><strong>Barrio:</strong> {opcion.barrio}</p>
                  <p><strong>Anticipo:</strong> USD {opcion.anticipo}</p>
                  <p><strong>Cuota:</strong> USD {opcion.cuota}</p>

                  <div className="flex gap-2 mt-3">
                    {LANDINGS[opcion.barrio] && (
                      <a
                        href={LANDINGS[opcion.barrio]}
                        className="flex-1 text-center border border-black py-2 rounded hover:bg-black hover:text-white transition text-sm"
                      >
                        Visitar sitio
                      </a>
                    )}

                    {WA_MENSAJES[opcion.barrio] && (
                      <a
                        href={`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(WA_MENSAJES[opcion.barrio](opcion))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center border border-green-600 text-green-600 py-2 rounded hover:bg-green-600 hover:text-white transition text-sm"
                      >
                        💬 Enviar mensaje
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {resultado && resultado.totalOpciones === 0 && (
            <p className="mt-6">No encontramos opciones con esos valores 😕</p>
          )}
        </section>
      </main>
    </>
  );
}
