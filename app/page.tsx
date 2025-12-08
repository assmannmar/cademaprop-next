"use client";

import { useEffect, useState } from "react";

export default function PropiedadesPage() {
  const [props, setProps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        setProps(data?.objects || []);
      } catch (e) {
        console.error("Error cargando propiedades:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Cargando propiedades...</p>;

  return (
    <div>
      <h1>Propiedades ({props.length})</h1>
      <ul>
        {props.map((p: any) => (
          <li key={p.id}>{p.address}</li>
        ))}
      </ul>
    </div>
  );
}
