export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-6">

      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-10">
        Encontrá lo que buscás
      </h1>

      {/* GRID de los 4 botones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">

        {/* COMPRAR */}
        <a
          href="https://comprar.tusubdominio.com"
          className="bg-white shadow-md p-8 rounded-xl text-center border border-gray-200 hover:shadow-lg transition cursor-pointer"
        >
          <span className="text-2xl font-semibold text-gray-800">Comprar</span>
        </a>

        {/* VENDER */}
        <a
          href="https://vender.tusubdominio.com"
          className="bg-white shadow-md p-8 rounded-xl text-center border border-gray-200 hover:shadow-lg transition cursor-pointer"
        >
          <span className="text-2xl font-semibold text-gray-800">Vender</span>
        </a>

        {/* RESIDENCIAL → BUSCADOR */}
        <a
          href="/propiedades"
          className="bg-white shadow-md p-8 rounded-xl text-center border border-gray-200 hover:shadow-lg transition cursor-pointer"
        >
          <span className="text-2xl font-semibold text-gray-800">Residencial</span>
        </a>

        {/* INDUSTRIAL */}
        <a
          href="https://industrial.tusubdominio.com"
          className="bg-white shadow-md p-8 rounded-xl text-center border border-gray-200 hover:shadow-lg transition cursor-pointer"
        >
          <span className="text-2xl font-semibold text-gray-800">Industrial</span>
        </a>

      </div>

    </main>
  );
}
