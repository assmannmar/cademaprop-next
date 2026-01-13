"use client";

import React, { useState, useEffect } from 'react';

const InversionSimulador = () => {
  const [barrios, setBarrios] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [casiResultados, setCasiResultados] = useState([]);
  const [inputs, setInputs] = useState({ entrega: '', cuota: '' });
  const [showResultMsg, setShowResultMsg] = useState(false);

  useEffect(() => {
    const requestURL = 'https://sheets.googleapis.com/v4/spreadsheets/1JccKm0EWTyvkknmrX_mrtw77u4n70m2mxq6utESUqh0/values/Proyectos!A:H?key=AIzaSyDXojymTF-wu2xKAauPgMvLu76lVydaCUM';
    
    fetch(requestURL)
      .then(res => res.json())
      .then(data => {
        if (data?.values) {
          const mapped = data.values.slice(1).map(fila => ({
            nombre: fila[0] || 'Sin nombre',
            tipo: fila[1] || '',
            superficie: parseInt(fila[2]) || 0,
            entrega_minima: parseFloat(fila[3]) || 0,
            cuota_mensual_estim: parseFloat(fila[4]) || 0,
            cuotas_maximas: parseInt(fila[5]) || 0,
            imagen: fila[6]?.includes('/file/d/') 
              ? `https://drive.google.com/thumbnail?id=${fila[6].match(/\/file\/d\/([^/]+)\//)[1]}&sz=w1000` 
              : fila[6],
            link: fila[7] || '#'
          }));
          setBarrios(mapped);
        }
      });
  }, []);

  const formatMiles = (num) => num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '';

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const rawValue = value.replace(/\D/g, '');
    setInputs(prev => ({ ...prev, [id]: formatMiles(rawValue) }));
  };

  const handleSimular = (e) => {
    e.preventDefault();
    const eNum = parseFloat(inputs.entrega.replace(/\./g, '')) || 0;
    const cNum = parseFloat(inputs.cuota.replace(/\./g, '')) || 0;

    const exactos = barrios.filter(b => b.entrega_minima <= eNum && b.cuota_mensual_estim <= cNum);
    const cercanos = barrios.filter(b => 
      b.entrega_minima <= eNum * 1.3 && b.cuota_mensual_estim <= cNum * 1.3 && !exactos.includes(b)
    );

    setResultados(exactos);
    setCasiResultados(cercanos);
    setShowResultMsg(true);
  };

  return (
    <div className="page-container">
      <section className="simulador-wrapper">
        <h1 className="title">SIMULÁ TU INVERSIÓN</h1>
        <p className="subtitle">Ingresá el monto inicial y la cuota mensual ideal para vos.</p>

        <form className="simulador-form" onSubmit={handleSimular}>
          <div className="input-group">
            <label>Monto disponible (USD)</label>
            <div className="input-field">
              <span>U$S</span>
              <input type="text" id="entrega" value={inputs.entrega} onChange={handleInputChange} placeholder="0" required />
            </div>
          </div>

          <div className="input-group">
            <label>Cuota mensual (USD)</label>
            <div className="input-field">
              <span>U$S</span>
              <input type="text" id="cuota" value={inputs.cuota} onChange={handleInputChange} placeholder="0" required />
            </div>
          </div>

          <button type="submit" className="btn-submit">BUSCAR PROYECTO</button>
        </form>

        <div className="results-container">
          {showResultMsg && resultados.length === 0 && casiResultados.length === 0 && (
            <p className="no-results">No encontramos proyectos con esos montos, intentá con valores un poco más altos.</p>
          )}

          {resultados.length > 0 && <h2 className="section-title">Ideal para tu presupuesto</h2>}
          <div className="grid">
            {resultados.map((b, i) => <Card b={b} key={i} format={formatMiles} />)}
          </div>

          {casiResultados.length > 0 && <h2 className="section-title mt-40">Opciones cercanas</h2>}
          <div className="grid">
            {casiResultados.map((b, i) => <Card b={b} key={i} format={formatMiles} />)}
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-container {
          padding-top: 100px; /* EVITA LA SUPERPOSICIÓN CON EL NAVBAR */
          min-height: 100vh;
          background-color: #f8f9fa;
          font-family: sans-serif;
          color: #333;
        }
        .simulador-wrapper {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        .title { text-align: center; font-size: 2rem; font-weight: 800; margin-bottom: 10px; color: #111; }
        .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
        
        .simulador-form {
          background: #fff;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .input-group label { display: block; font-weight: 600; margin-bottom: 8px; font-size: 0.9rem; }
        .input-field {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 0 15px;
        }
        .input-field span { color: #999; font-weight: bold; }
        .input-field input {
          border: none;
          padding: 12px;
          width: 100%;
          outline: none;
          font-size: 1rem;
        }
        .btn-submit {
          background: #c20c25;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }
        .btn-submit:hover { background: #8e0a1c; }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .section-title { font-size: 1.4rem; margin-top: 40px; border-left: 4px solid #c20c25; padding-left: 15px; }
        .mt-40 { margin-top: 40px; }
        .no-results { text-align: center; padding: 40px; color: #666; }
      `}</style>
    </div>
  );
};

const Card = ({ b, format }) => (
  <div className="card">
    <div className="img-wrapper">
      <img src={b.imagen} alt={b.nombre} />
    </div>
    <div className="card-content">
      <h3>{b.nombre}</h3>
      <p className="type">{b.tipo}</p>
      <div className="details">
        <p><strong>Anticipo:</strong> U$S {format(b.entrega_minima)}</p>
        <p><strong>Cuotas:</strong> {b.cuotas_maximas} x U$S {format(b.cuota_mensual_estim)}</p>
      </div>
      <a href={b.link} target="_blank" className="btn-info">MÁS INFORMACIÓN</a>
    </div>
    <style jsx>{`
      .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: transform 0.2s; }
      .card:hover { transform: translateY(-5px); }
      .img-wrapper { height: 180px; overflow: hidden; }
      .img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
      .card-content { padding: 20px; }
      .card-content h3 { margin: 0 0 5px 0; font-size: 1.2rem; }
      .type { color: #888; font-size: 0.85rem; margin-bottom: 15px; }
      .details p { margin: 5px 0; font-size: 0.95rem; }
      .btn-info {
        display: block;
        text-align: center;
        background: #f0f0f0;
        color: #333;
        text-decoration: none;
        padding: 10px;
        margin-top: 15px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.85rem;
      }
      .btn-info:hover { background: #e0e0e0; }
    `}</style>
  </div>
);

export default InversionSimulador;