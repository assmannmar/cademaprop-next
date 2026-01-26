"use client";

import { useState } from "react";

type Opcion = {
  barrio: string;
  lote: string;
  anticipo: number;
  cuota: number;
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
        {resultado?.mejorOpcion && (
          <div className="mt-8 p-4 border rounded bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">
              Mejor opción para vos
            </h2>

            <p><strong>Barrio:</strong> {resultado.mejorOpcion.barrio}</p>
            <p><strong>Lote:</strong> {resultado.mejorOpcion.lote}</p>
            <p><strong>Anticipo:</strong> USD {resultado.mejorOpcion.anticipo}</p>
            <p><strong>Cuota:</strong> USD {resultado.mejorOpcion.cuota}</p>
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
