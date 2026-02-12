"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import PropertiesContainer from "@/app/components/PropertiesContainer";

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
    <main className="pt-20 min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingFallback />}>
        <PropertiesContainer />
      </Suspense>
    </main>
  );
}