import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-red-600">LOGO CHICO</h3>
            <p className="text-gray-400">TEXTO</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">Inicio</Link></li>
              <li><Link href="/propiedades" className="text-gray-400 hover:text-white transition">Propiedades</Link></li>
              <li><Link href="/emprendimientos" className="text-gray-400 hover:text-white transition">Emprendimientos</Link></li>
              <li><Link href="/quienes-somos" className="text-gray-400 hover:text-white transition">Quiénes Somos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📞 +54 11 1234-5678</li>
              <li>📧 info@cademaprop.com</li>
              <li>📍 Campana, Buenos Aires</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Redes Sociales</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white text-2xl transition">📘</a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl transition">📷</a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl transition">🐦</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2025 Cadema Prop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}