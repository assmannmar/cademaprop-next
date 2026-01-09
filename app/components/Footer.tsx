import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black pt-12 pb-6">
      {/* Capa de fondo con logo y overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-85"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('/logos/logo-circle-red.png')",
          backgroundAttachment: 'fixed',
          backgroundSize: '50%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Contenido Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
          
          {/* Logo */}
          <div className="flex justify-center md:justify-start items-start">
            <img 
              src="/logos/logo.png" 
              alt="Cadema Logo" 
              className="max-w-[180px] h-auto"
            />
          </div>

          {/* Información de Contacto */}
          <div className="text-white text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-2 opacity-80 hover:opacity-100 transition">
                <span className="text-[#ff4444]">📍</span>
                <a 
                  target="_blank" 
                  rel="noopener noreferrer"
                  href="https://www.google.com.ar/maps/place/Inmobiliaria+Cadema+S.A./..."
                  className="hover:text-[#ff4444] transition-colors"
                >
                  Av Varela 420, Campana
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 opacity-80 hover:opacity-100 transition">
                <span className="text-[#ff4444]">📱</span>
                <a 
                  target="_blank" 
                  href="https://wa.me/5493489368518"
                  className="hover:text-[#ff4444] transition-colors"
                >
                  +54 9 3489 36-8518
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 opacity-80 hover:opacity-100 transition">
                <span className="text-[#ff4444]">✉️</span>
                <a 
                  href="mailto:ventas@cademaprop.com.ar"
                  className="hover:text-[#ff4444] transition-colors"
                >
                  ventas@cademaprop.com.ar
                </a>
              </li>
            </ul>

            {/* Horarios compactos */}
            <div className="mt-4 text-xs opacity-70">
              <p>Lun-Vie: 10-18hs | Cita previa: 9-19hs</p>
            </div>
          </div>

          {/* Redes Sociales y AFIP */}
          <div className="text-white text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4 uppercase tracking-wider">Seguinos</h4>
            
            {/* Redes Sociales */}
            <div className="flex justify-center md:justify-end gap-3 mb-4">
              {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  target="_blank" 
                  className="w-9 h-9 bg-white/10 hover:bg-[#ff4444] rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110"
                >
                  <i className={`fa-brands fa-${social === 'youtube' ? 'youtube' : social} text-sm`}></i>
                </a>
              ))}
            </div>

            {/* AFIP Dataweb */}
            <div className="flex justify-center md:justify-end">
              <a href="http://qr.afip.gob.ar/..." target="_F960AFIPInfo">
                <img 
                  src="/logos/DATAWEB.jpg" 
                  width="45" 
                  alt="Data Fiscal" 
                  className="hover:opacity-80 transition-opacity" 
                />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-t border-white/10 my-6" />

        {/* Bottom Footer - Compacto */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4">
          <p className="text-white/60 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Cadema Bienes Raíces. Todos los derechos reservados.
          </p>
          
          <div className="bg-white/5 p-1.5 rounded-full backdrop-blur-sm">
            <img 
              src="/logos/logo-circle-red.png" 
              alt="Logo Circular" 
              className="w-10 h-10"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}