import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">

      {/* HERO */}
      <section className="flex flex-col items-center text-center py-24 px-6 bg-[url('/hero.jpg')] bg-cover bg-center bg-no-repeat bg-black/40 bg-blend-multiply">
        <h1 className="text-4xl md:text-5xl font-bold text-white max-w-2xl">
          Encontrá tu próximo hogar con comodidad y precisión
        </h1>

        <p className="text-white/90 mt-4 max-w-xl">
          Buscá propiedades por ubicación, tipo, precio y mucho más.
        </p>

        {/* BUSCADOR SIMPLE */}
        <div className="mt-8 w-full max-w-lg bg-white rounded-xl shadow-lg p-4 flex gap-2">
          <input
            type="text"
            placeholder="Buscar por ubicación…"
            className="flex-1 px-4 py-2 rounded-md border border-gray-300"
          />
          <Link
            href="/propiedades"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Buscar
          </Link>
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
