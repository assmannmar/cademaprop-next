'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function IndustriaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/industria');
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
      <div>
        <h1 className="mb-3 text-2xl font-bold text-gray-900">Redirigiendo a Industria</h1>
        <p className="mb-6 text-gray-600">Esta sección ahora se encuentra en una nueva dirección.</p>
        <Link href="/industria" className="font-semibold text-red-600 hover:text-red-700">
          Ir a Industria
        </Link>
      </div>
    </main>
  );
}
