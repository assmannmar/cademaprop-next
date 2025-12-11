import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";
 
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">

      {/* HEADER CON BOTONES */}
      <header className="w-full bg-white py-6 shadow-md flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/propiedades" className="px-6 py-3 bg-white shadow-md rounded-lg border hover:shadow-lg transition text-center text-lg font-semibold">
            Comprar
          </a>

          <a href="/propiedades" className="px-6 py-3 bg-white shadow-md rounded-lg border hover:shadow-lg transition text-center text-lg font-semibold">
            Vender
          </a>

          <a href="/propiedades" className="px-6 py-3 bg-white shadow-md rounded-lg border hover:shadow-lg transition text-center text-lg font-semibold">
            Residencial
          </a>

          <a
            href="https://cademaprop.com.ar/parque-industrial/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones/"
            className="px-6 py-3 bg-white shadow-md rounded-lg border hover:shadow-lg transition text-center text-lg font-semibold"
          >
            Industrial
          </a>
        </div>
      </header>

      {/* CARRUSEL PRINCIPAL (ESTILO REMAX) */}
      <section className="relative w-full h-[450px] overflow-hidden z-0">
        <HeroCarousel />
      </section>

      {/* TEXTO CENTRAL */}
      <section className="flex flex-col items-center text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl">
          Texto H1
        </h1>

        <p className="text-gray-700 mt-4 max-w-xl">
          Texto p
        </p>
      </section>

      {/* BLOQUES / FEATURES */}
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
