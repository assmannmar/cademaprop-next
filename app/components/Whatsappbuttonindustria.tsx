'use client';

import { useState } from 'react';

export default function WhatsAppButtonIndustria() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Botón flotante de WhatsApp - Posición mejorada */}
      <a
        href="https://api.whatsapp.com/send/?phone=5493489517998&text=Hola%20Cadema%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20propiedades%20industriales"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 z-40 transition-all duration-300 hover:scale-110"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fondo pulsante */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-pulse opacity-0 hover:opacity-100" />
        
        {/* Botón principal */}
        <div className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all ${
          isHovered ? 'bg-[#1eae5f]' : 'bg-[#25D366]'
        }`}>
          <svg
            className="w-7 h-7 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.9 1.175c-1.53.807-2.935 1.978-4.03 3.368C2.725 10.008 2 11.76 2 13.59c0 1.789.424 3.551 1.226 5.122L2.096 22l5.73-1.504C10.12 21.54 11.827 22 13.59 22c4.866 0 8.83-3.964 8.83-8.83 0-2.36-.848-4.583-2.403-6.32-1.555-1.738-3.778-2.587-6.027-2.587z" />
          </svg>
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-white text-[#141414] px-4 py-2 rounded-lg shadow-xl whitespace-nowrap text-sm font-medium">
            +54 9 3489 517-998
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent" />
          </div>
        )}
      </a>

      {/* Badge de disponibilidad (opcional) */}
      <div className="fixed bottom-36 right-6 z-40 animate-bounce">
        <div className="bg-[#25D366] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          En línea
        </div>
      </div>
    </>
  );
}