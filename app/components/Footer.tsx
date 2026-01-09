import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer_one home1 relative overflow-hidden bg-[#44444E] pt-[60px] pb-[20px]">
      {/* Capa de fondo con logo y overlay (replicando tu CSS inline) */}
      <div 
        className="absolute inset-0 z-0 opacity-85"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('/logos/logo-circle-red.png')",
          backgroundAttachment: 'fixed',
          backgroundSize: '30%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap pb-[90px]">
          {/* Logo Principal */}
          <div className="w-full sm:w-5/12 md:w-2/12 lg:w-2/12 px-4 mb-8 md:mb-0">
            <div className="footer_contact_widget">
              <div className="logo text-center">
                <img 
                  src="/logos/logo.png" 
                  alt="Cadema Logo" 
                  className="max-w-[150px] mx-auto h-auto"
                />
              </div>
            </div>
          </div>

          {/* Espaciado (replicando el ml30 y las columnas del original) */}
          <div className="hidden md:block md:w-1/12"></div>

          {/* Columna de Contacto */}
          <div className="w-full sm:w-7/12 md:w-4/12 lg:w-4/12 px-4">
            <div className="footer_contact_widget text-white">
              <h4 className="text-[1.2rem] font-semibold mb-5 uppercase tracking-wider">Contactanos</h4>
              <ul className="list-none p-0 space-y-3">
                <li className="flex items-start gap-3 opacity-80">
                  <span className="text-[#ff4444]">📍</span>
                  <a 
                    target="_blank" 
                    rel="noopener noreferrer"
                    href="https://www.google.com.ar/maps/place/Inmobiliaria+Cadema+S.A./..."
                    className="hover:text-[#ff4444] transition-colors"
                  >
                    Av Varela 420, Campana, Argentina
                  </a>
                </li>
                <li className="flex items-center gap-3 opacity-80">
                  <span className="text-[#ff4444]">📱</span>
                  <a 
                    target="_blank" 
                    href="https://wa.me/5493489368518"
                    className="hover:text-[#ff4444] transition-colors"
                  >
                    +54 9 3489 36-8518
                  </a>
                </li>
                <li className="flex items-center gap-3 opacity-80">
                  <span className="text-[#ff4444]">✉️</span>
                  <a 
                    href="mailto:ventas@cademaprop.com.ar"
                    className="hover:text-[#ff4444] transition-colors"
                  >
                    ventas@cademaprop.com.ar
                  </a>
                </li>
                <li className="pt-2 font-medium">Horarios:</li>
                <li className="opacity-80 ml-7">Oficina: 10 a 18 hs.</li>
                <li className="opacity-80 ml-7">Cita previa: 9 a 19 hs.</li>
              </ul>
            </div>

            {/* Redes Sociales */}
            <div className="footer_social_widget mt-5">
              <ul className="flex gap-4 list-none p-0">
                {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((social) => (
                  <li key={social}>
                    <a 
                      href="#" 
                      target="_blank" 
                      className="text-white text-[1.2rem] hover:text-[#ff4444] transition-colors"
                    >
                      <i className={`fa-brands fa-${social === 'youtube' ? 'youtube' : social}`}></i>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* AFIP Dataweb */}
            <div className="mt-[10px]">
              <a href="http://qr.afip.gob.ar/..." target="_F960AFIPInfo">
                <img src="/images/DATAWEB.jpg" width="50" alt="Data Fiscal" className="hover:opacity-80 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-t border-white/10 my-10" />

        {/* Bottom Footer */}
        <div className="pt-[10px] pb-[30px]">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-4/12 text-center md:text-left">
              <div className="copyright-widget">
                <p className="text-white/60 text-sm">
                  Copyright © {new Date().getFullYear()} Cadema Bienes Raices
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-4/12 flex justify-center my-4 md:my-0">
              <div className="footer_logo_widget">
                <div className="bg-white/5 p-2 rounded-full backdrop-blur-sm">
                  <img 
                    src="/logos/logo-circle-red.png" 
                    alt="Logo Circular" 
                    className="w-[60px] h-auto"
                  />
                </div>
              </div>
            </div>
            
            <div className="hidden md:block md:w-4/12"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}