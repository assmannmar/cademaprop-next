"use client";
import { useState } from "react";

export default function SimuladorPage() {
  const [anticipo, setAnticipo] = useState("");
  const [cuota, setCuota] = useState("");
  const [resultado, setResultado] = useState<any>(null);

  async function calcular() {
    const res = await fetch("/api/simulador/calcular", {
      method: "POST",
      body: JSON.stringify({
        anticipo: Number(anticipo),
        cuota: Number(cuota)
      })
    });

    const data = await res.json();
    setResultado(data);
  }
 
  return (
    <div>
      <h1>Simulador de inversión</h1>

      <input placeholder="Anticipo" onChange={e => setAnticipo(e.target.value)} />
      <input placeholder="Cuota mensual" onChange={e => setCuota(e.target.value)} />

      <button onClick={calcular}>Simular</button>

      {resultado?.mejorOpcion && (
        <div>
          <h2>Mejor opción</h2>
          <p>{resultado.mejorOpcion.barrio}</p>
          <p>Lote {resultado.mejorOpcion.lote}</p>
          <p>Anticipo: USD {resultado.mejorOpcion.anticipo}</p>
          <p>Cuota: USD {resultado.mejorOpcion.cuota}</p>
        </div>
      )}
    </div>
  );
}
