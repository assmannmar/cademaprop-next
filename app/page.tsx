
import Link from 'next/link';


export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">

      {/* TEXTO PRINCIPAL */}
      <section className="flex flex-col items-center text-center py-24 px-6 bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat bg-black/40 bg-blend-multiply">
        <h1 className="text-4xl md:text-5xl font-bold text-white max-w-2xl">
          Texto H1
        </h1>

        <p className="text-white/90 mt-4 max-w-xl">
          Texto p
        </p>

        {/* BOTONES PRINCIPALES */}
        <div className="w-full flex justify-center mt-10">
          <div className="grid grid-cols-2 gap-4">
              <a href="/propiedades" className="px-6 py-3 bg-white shadow-md rounded-lg border hover:shadow-lg transition text-center text-lg font-semibold">Comprar</a>

              <a href="/propiedades" className="px-6 py-3 bg-white shadow-md rounded-lg border hover:shadow-lg transition text-center text-lg font-semibold">Vender</a>

              <a href="/propiedades" className="px-6 py-3 bg-white shadow-md rounded-lg border hover:shadow-lg transition text-center text-lg font-semibold">Residencial</a>

              <a href="https://cademaprop.com.ar/parque-industrial/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones/" className="px-6 py-3 bg-white shadow-md rounded-lg border hover:shadow-lg transition text-center text-lg font-semibold">Industrial</a>

            </div>
          </div>
        <img src="/down-arrow.svg" alt="Scroll Down" className="mt-12 h-6 w-6 animate-bounce" />

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
