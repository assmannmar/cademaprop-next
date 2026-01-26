"use client";

import { useState } from "react";

type Opcion = {
  barrio: string;
  lote: string;
  anticipo: number;
  cuota: number;
  cuotas: number;
  precioTotal: number;
};

export default function SimuladorPage() {
  const [anticipo, setAnticipo] = useState("");
  const [cuota, setCuota] = useState("");
  const [resultado, setResultado] = useState<Opcion[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function simular() {
    setLoading(true);

    const res = await fetch("/api/simulador/opciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anticipo: Number(anticipo),
        cuota: Number(cuota),
      }),
    });

    const data = await res.json();
    setResultado(data.opciones || []);
    setLoading(false);
  }

  return (
    <div>
      <h1>Simulador</h1>

      <input
        placeholder="Anticipo"
        value={anticipo}
        onChange={(e) => setAnticipo(e.target.value)}
      />

      <input
        placeholder="Cuota máxima"
        value={cuota}
        onChange={(e) => setCuota(e.target.value)}
      />

      <button onClick={simular} disabled={loading}>
        Simular
      </button>

      {resultado && (
        <ul>
          {resultado.map((op, i) => (
            <li key={i}>
              {op.barrio} – Lote {op.lote} – ${op.cuota}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
