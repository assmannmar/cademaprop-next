"use client";
import React, { useState, useEffect } from 'react';

const InversionSimulador = () => {
  const [barrios, setBarrios] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [casiResultados, setCasiResultados] = useState([]);
  const [inputs, setInputs] = useState({ entrega: '', cuota: '' });
  const [showResultMsg, setShowResultMsg] = useState(false);

  // Carga de datos inicial desde Google Sheets
  useEffect(() => {
    const requestURL = 'https://sheets.googleapis.com/v4/spreadsheets/1JccKm0EWTyvkknmrX_mrtw77u4n70m2mxq6utESUqh0/values/Proyectos!A:H?key=AIzaSyDXojymTF-wu2xKAauPgMvLu76lVydaCUM';
    
    fetch(requestURL)
      .then(response => response.json())
      .then(data => {
        if (data && data.values) {
          const filas = data.values.slice(1);
          const mappedBarrios = filas.map(fila => {
            let imagenRaw = fila[6] || '';
            let imagenFinal = imagenRaw;
            const match = imagenRaw.match(/\/file\/d\/([^/]+)\//);
            if (match) {
              imagenFinal = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
            }
            return {
              nombre: fila[0] || 'Sin nombre',
              tipo: fila[1] || '',
              superficie: parseInt(fila[2]) || 0,
              entrega_minima: parseFloat(fila[3]) || 0,
              cuota_mensual_estim: parseFloat(fila[4]) || 0,
              cuotas_maximas: parseInt(fila[5]) || 0,
              imagen: imagenFinal,
              link: fila[7] || '#'
            };
          });
          setBarrios(mappedBarrios);
        }
      })
      .catch(err => console.error("Error cargando datos:", err));
  }, []);

  // Formateador de miles
  const formatMiles = (num) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Solo números
    const rawValue = value.replace(/\D/g, '');
    setInputs(prev => ({ ...prev, [id]: formatMiles(rawValue) }));
  };

  const handleSimular = (e) => {
    e.preventDefault();
    const entregaNum = parseFloat(inputs.entrega.replace(/\./g, '')) || 0;
    const cuotaNum = parseFloat(inputs.cuota.replace(/\./g, '')) || 0;

    const res = barrios.filter(b => b.entrega_minima <= entregaNum && b.cuota_mensual_estim <= cuotaNum);
    const casi = barrios.filter(b => 
      b.entrega_minima <= entregaNum * 1.3 && 
      b.cuota_mensual_estim <= cuotaNum * 1.3 && 
      !res.includes(b)
    );

    setResultados(res);
    setCasiResultados(casi);
    setShowResultMsg(true);
  };

  const CardProyecto = ({ b }) => (
    <div className="col-md-6 mb-4 animate-up">
      <div className="card shadow-sm h-100">
        <img src={b.imagen} className="card-img-top" alt={b.nombre} style={{ height: '200px', objectFit: 'cover' }} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title font-weight-bold">{b.nombre}</h5>
          <p className="card-text mb-1">{b.tipo}</p>
          <p className="card-text mb-1">
            {b.nombre === "Paseo Gavazzi" ? "1, 2, 3 y 4 ambientes" : `Superficie: ${formatMiles(b.superficie)} m²`}
          </p>
          <p className="card-text mb-1 text-danger font-weight-bold">Anticipo: U$S {formatMiles(b.entrega_minima)}</p>
          <p className="card-text">Hasta {b.cuotas_maximas} cuotas de U$S {formatMiles(b.cuota_mensual_estim)}</p>
          <a href={b.link} className="btn btn-primary mt-auto w-100" target="_blank" rel="noreferrer" style={{ backgroundColor: '#c20c25', border: 'none' }}>
            MÁS INFORMACIÓN
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <main className="py-5" style={{ backgroundColor: '#f9f9f9', fontFamily: 'sans-serif' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 className="text-center mb-4 font-weight-bold">SIMULA TU INVERSIÓN</h1>
        <p className="text-center">Ingresá el monto que dispones para la entrega inicial y la cuota mensual que te resulte más cómoda.</p>

        <form onSubmit={handleSimular} className="card p-4 shadow-sm mb-5 border-0" style={{ borderRadius: '1rem' }}>
          <div className="mb-3">
            <label className="form-label">¿Con qué monto contás? (USD):</label>
            <div className="input-group">
              <span className="input-group-text">US$</span>
              <input 
                type="text" 
                id="entrega"
                className="form-control" 
                value={inputs.entrega} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">¿Qué monto podés pagar por mes? (USD):</label>
            <div className="input-group">
              <span className="input-group-text">US$</span>
              <input 
                type="text" 
                id="cuota"
                className="form-control" 
                value={inputs.cuota} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 font-weight-bold" style={{ backgroundColor: '#c20c25', border: 'none', padding: '12px' }}>
            BUSCÁ TU PROYECTO
          </button>
        </form>

        <section id="resultados">
          {showResultMsg && resultados.length === 0 && casiResultados.length === 0 && (
            <div className="alert alert-warning text-center">No se encontraron proyectos que coincidan con tu presupuesto.</div>
          )}

          {resultados.length > 0 && (
            <>
              <h4 className="mb-3">Proyectos que se ajustan a vos</h4>
              <div className="row">
                {resultados.map((b, i) => <CardProyecto key={i} b={b} />)}
              </div>
            </>
          )}

          {casiResultados.length > 0 && (
            <>
              <h4 className="mt-5 mb-3">Proyectos muy cerca de tu presupuesto</h4>
              <div className="row">
                {casiResultados.map((b, i) => <CardProyecto key={i} b={b} />)}
              </div>
            </>
          )}
        </section>

        <h2 className="text-center mt-5 mb-4">Conocé todos nuestros proyectos</h2>
        {/* Aquí iría el componente Carousel si decides usar una librería como Swiper o react-bootstrap */}
      </div>
      
      <style jsx>{`
        .animate-up {
          animation: fadeInUp 0.8s ease forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
};

export default InversionSimulador;