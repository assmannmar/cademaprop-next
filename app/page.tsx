import HeroCarousel from "./components/HeroCarousel";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="w-full mt-24 flex flex-col items-center px-4">

      {/* BOTONES */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
        <Link
          href="/comprar"
          className="p-6 bg-white shadow-lg rounded-xl text-center border hover:scale-105 transition"
        >
          <span className="text-lg font-semibold">Comprar</span>
        </Link>

        <Link
          href="/vender"
          className="p-6 bg-white shadow-lg rounded-xl text-center border hover:scale-105 transition"
        >
          <span className="text-lg font-semibold">Vender</span>
        </Link>

        <Link
          href="/residencial"
          className="p-6 bg-white shadow-lg rounded-xl text-center border hover:scale-105 transition"
        >
          <span className="text-lg font-semibold">Residencial</span>
        </Link>

        <Link
          href="/industrial"
          className="p-6 bg-white shadow-lg rounded-xl text-center border hover:scale-105 transition"
        >
          <span className="text-lg font-semibold">Industrial</span>
        </Link>
      </div>

      {/* CARROUSEL */}
      <div className="w-full max-w-5xl">
        <HeroCarousel />
      </div>

    </main>
  );
}
