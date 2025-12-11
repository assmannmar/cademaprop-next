import Link from "next/link";

// Componente simulado del carrusel para demo
const HeroCarousel = () => (
  <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse">
    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
      Hero Carousel
    </div>
  </div>
);

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* SECCIÓN DEL CARRUSEL CON HEADER SUPERPUESTO */}
      <section className="relative w-full h-[450px]">
        {/* CARRUSEL DE FONDO */}
        <div className="absolute inset-0 z-0">
          <HeroCarousel />
        </div>

        {/* HEADER FLOTANDO ENCIMA DEL CARRUSEL */}
        <header className="absolute top-0 left-0 w-full py-6 z-20 flex justify-center bg-white/70 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-4 px-4">
            <a 
              href="/propiedades" 
              className="px-6 py-3 bg-white shadow-md rounded-lg border hover:shadow-lg transition text-center text-lg font-semibold hover:bg-gray-50"
            >
              Comprar
            </a>

            <a 
              href="/propiedades" 
              className="px-6 py-3 bg-white shadow-md rounded-lg border hover:shadow-lg transition text-center text-lg font-semibold hover:bg-gray-50"
            >
              Vender
            </a>

            <a 
              href="/propiedades" 
              className="px-6 py-3 bg-white shadow-md rounded-lg border hover:shadow-lg transition text-center text-lg font-semibold hover:bg-gray-50"
            >
              Residencial
            </a>

            <a
              href="https://cademaprop.com.ar/parque-industrial/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones/"
              className="px-6 py-3 bg-white shadow-md rounded-lg border hover:shadow-lg transition text-center text-lg font-semibold hover:bg-gray-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              Industrial
            </a>
          </div>
        </header>
      </section>

      {/* CONTENIDO RESTANTE */}
      <section className="flex flex-col items-center text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl">
          Encontrá tu propiedad ideal
        </h1>

        <p className="text-gray-700 mt-4 max-w-xl">
          Explorá nuestra selección de propiedades residenciales e industriales con las mejores ubicaciones y precios del mercado.
        </p>
      </section>

      <section className="py-20 grid grid-cols-1 md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto">
        <div className="bg-white shadow-md p-8 rounded-xl text-center hover:shadow-xl transition">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold">Filtros avanzados</h3>
          <p className="text-gray-600 mt-2">
            Combiná ubicación, precio, tipo, dormitorios, cochera y más.
          </p>
        </div>

        <div className="bg-white shadow-md p-8 rounded-xl text-center hover:shadow-xl transition">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold">Resultados en tarjetas</h3>
          <p className="text-gray-600 mt-2">
            Mostrá todas las propiedades con fotos, precio y detalles claves.
          </p>
        </div>

        <div className="bg-white shadow-md p-8 rounded-xl text-center hover:shadow-xl transition">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-semibold">Ficha individual</h3>
          <p className="text-gray-600 mt-2">
            Accedé a la ficha completa de cada inmueble.
          </p>
        </div>
      </section>

    </main>
  );
}