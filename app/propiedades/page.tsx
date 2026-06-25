import type { Metadata } from "next";
import { Suspense } from "react";
import PropertiesContainer from "@/app/components/PropertiesContainer";
import { pageMetadata } from "@/app/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Propiedades en venta y alquiler",
  description:
    "Busca casas, departamentos, terrenos, locales e inmuebles industriales en Campana, Zarate, Exaltacion de la Cruz y Corredor Norte.",
  path: "/propiedades",
  image: "/carousel/2.jpg",
});

function LoadingFallback() {
  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Cargando propiedades...</p>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingFallback />}>
        <PropertiesContainer />
      </Suspense>
    </main>
  );
}
