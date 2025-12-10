import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">

      {/* HERO */}
      <section className="flex flex-col items-center text-center py-24 px-6 bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat bg-black/40 bg-blend-multiply">
        <h1 className="text-4xl md:text-5xl font-bold text-white max-w-2xl">
          Texto H1
        </h1>

        <p className="text-white/90 mt-4 max-w-xl">
          Texto p
        </p>

        {/* BUSCADOR SIMPLE */}
        <div className="mt-8 w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg p-3 flex gap-3 justify-center">
          <a
            href="/propiedades" className="bg-white shadow-md p-3 rounded-lg text-center border border-gray-200 hover:shadow-lg transition cursor-pointer min-w-[120px]">
            <span className="text-lg font-semibold text-gray-800">Comprar</span>
          </a>
          <a
            href="/propiedades" className="bg-white shadow-md p-3 rounded-lg text-center border border-gray-200 hover:shadow-lg transition cursor-pointer min-w-[120px]">
            <span className="text-lg font-semibold text-gray-800">Vender</span>
          </a>
          <a
            href="/propiedades" className="bg-white shadow-md p-3 rounded-lg text-center border border-gray-200 hover:shadow-lg transition cursor-pointer min-w-[120px]">
            <span className="text-lg font-semibold text-gray-800">Residencial</span>
          </a>
          <a
            href="https://cademaprop.com.ar/parque-industrial/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones/" className="bg-white shadow-md p-3 rounded-lg text-center border border-gray-200 hover:shadow-lg transition cursor-pointer min-w-[120px]">
            <span className="text-lg font-semibold text-gray-800">Industria</span>
          </a>
        </div>

      </section>

      {/* BLOQUES */}
      <section className="py-20 grid grid-cols-1 md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto">
        
        <div className="bg-white shadow-md p-8 rounded-xl text-center">
          <h3 className="text-xl font-semibold">Filtros avanzados</h3>
          <p className="text-gray-600 mt-2">
            Combiná ubicación, precio, tipo, dormitorios, cochera y más.
          </p>
        </div>

        <div className="bg-white shadow-md p-8 rounded-xl text-center">
          <h3 className="text-xl font-semibold">Resultados en tarjetas</h3>
          <p className="text-gray-600 mt-2">
            Mostrá todas las propiedades con fotos, precio y detalles claves.
          </p>
        </div>

        <div className="bg-white shadow-md p-8 rounded-xl text-center">
          <h3 className="text-xl font-semibold">Ficha individual</h3>
          <p className="text-gray-600 mt-2">
            Accedé a la ficha completa de cada inmueble.
          </p>
        </div>

      </section>

    </main>
  );
}
