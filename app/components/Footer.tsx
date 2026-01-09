import Link from 'next/link';
// Nota: Para los iconos flaticon/fontawesome del original, 
// asegúrate de tener las librerías cargadas en tu _app.js o layout.
// Si prefieres usar Lucide (más moderno), sustituye los <span> por los componentes.

export default function Footer() {
  return (
    <section className="footer_one home1 bg-[#1d293e] pt-20" style={{ fontFamily: 'Cerebri Sans, sans-serif' }}>
      <div className="container pb-24"> {/* Equivale a pb90 */}
        <div className="flex flex-wrap -mx-4">
          
          {/* Logo Principal (Columna de 2/12 según tu código) */}
          <div className="w-full sm:w-5/12 md:w-2/12 lg:w-2/12 px-4 mb-8">
            <div className="footer_contact_widget">
              <div className="logo text-center md:text-left">
                <img src="/logos/logo.png" alt="Cadema Logo" className="mx-auto md:mx-0" />
              </div>
            </div>
          </div>

          {/* Espaciadores para mantener la estructura original */}
          <div className="hidden md:block md:w-3/12 lg:w-3/12 px-4"></div>
          <div className="hidden lg:block lg:w-2/12 px-4"></div>

          {/* Columna de Contacto y Redes (Columna de 4/12) */}
          <div className="w-full sm:w-7/12 md:w-4/12 lg:w-4/12 px-4">
            <div className="footer_contact_widget">
              <h4 className="text-white text-[18px] font-semibold mb-6">Contactanos</h4>
              <ul className="list-unstyled space-y-3">
                <li className="text-white flex items-start gap-3">
                  <span className="flaticon-map text-[#c60c23]"></span>
                  <a target="_blank" rel="noopener noreferrer" 
                     href="https://www.google.com.ar/maps/..." 
                     className="hover:text-[#c60c23] transition-colors">
                    Av Varela 420, Campana, Argentina
                  </a>
                </li>
                <li className="text-white flex items-center gap-3">
                  <span className="flaticon-phone text-[#c60c23]"></span>
                  <a target="_blank" rel="noopener noreferrer" 
                     href="https://wa.me/5493489368518" 
                     className="hover:text-[#c60c23] transition-colors">
                    +54 9 3489 36-8518
                  </a>
                </li>
                <li className="text-white flex items-center gap-3">
                  <span className="flaticon-mail-inbox-app text-[#c60c23]"></span>
                  <a target="_blank" rel="noopener noreferrer" 
                     href="mailto:ventas@cademaprop.com.ar" 
                     className="hover:text-[#c60c23] transition-colors">
                    ventas@cademaprop.com.ar
                  </a>
                </li>
                <li className="text-white mt-4 font-medium italic">Horarios:</li>
                <li className="text-gray-400 text-sm pl-7">Oficina: 10 a 18 hs.</li>
                <li className="text-gray-400 text-sm pl-7">Cita previa: 9 a 19 hs.</li>
              </ul>
            </div>

            {/* Redes Sociales - Basado en .footer_social_widget del CSS */}
            <div className="footer_social_widget mt-8">
              <ul className="flex flex-wrap gap-4 mb-0">
                <li className="list-inline-item">
                  <a target="_blank" title="Facebook Cadema" href="https://facebook.com/..." 
                     className="text-white hover:text-[#c60c23] transition-all">
                    <i className="fa fa-facebook"></i>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a target="_blank" title="Instagram Cadema" href="https://instagram.com/..." 
                     className="text-white hover:text-[#c60c23] transition-all">
                    <i className="fa fa-instagram"></i>
                  </a>
                </li>
                {/* Repetir para Twitter, LinkedIn, Youtube siguiendo el patrón */}
              </ul>
            </div>

            {/* Data Fiscal AFIP */}
            <div className="mt-6">
              <a href="http://qr.afip.gob.ar/..." target="_F960AFIPInfo">
                <img src="/images/DATAWEB.jpg" width="50" alt="Data Fiscal" className="hover:opacity-80 transition" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-700" />

      {/* Copyright y Logo Circular */}
      <div className="container pt-4 pb-8">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-4/12">
            <div className="copyright-widget text-center md:text-left mt-2 text-gray-400 text-sm">
              <p>Copyright © {new Date().getFullYear()} Cadema Bienes Raices</p>
            </div>
          </div>
          <div className="w-full md:w-4/12 flex justify-center py-4 md:py-0">
            <div className="footer_logo_widget">
              <div className="wrapper bg-white p-1 rounded-full w-[65px] h-[65px] flex items-center justify-center">
                <img src="/logos/logo-circle-red.png" alt="Logo Circle" className="w-[60px]" />
              </div>
            </div>
          </div>
          <div className="hidden md:block md:w-4/12"></div>
        </div>
      </div>
    </section>
  );
}