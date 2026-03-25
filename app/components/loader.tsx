// app/components/loader.tsx

export default function FullScreenLoader() { // <--- El "export default" es CLAVE
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 font-bold uppercase tracking-widest animate-pulse">
        Cargando...
      </p>
    </div>
  );
}