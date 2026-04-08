import Link from 'next/link';
import Image from "next/image";

const socialLinks = [
  {
    name: "Facebook",
    icon: "/logos/rrss/facebook.png",
    url: "https://www.facebook.com/cademabienesraices",
  },
  {
    name: "Instagram Cadema",
    icon: "/logos/rrss/instagram.png",
    url: "https://www.instagram.com/cademabienesraices",
  },
  {
    name: "Instagram Cadema Industrias",
    icon: "/logos/rrss/instagram.png",
    url: "https://www.instagram.com/cademaindustrias",
    highlight: true,
  },
  {
    name: "LinkedIn",
    icon: "/logos/rrss/linkedin.png",
    url: "https://www.linkedin.com/company/cademabienesraices",
  },
  {
    name: "TikTok",
    icon: "/logos/rrss/tiktok.png",
    url: "https://www.tiktok.com/@cademabienesraices",
  },
  {
    name: "Blog",
    icon: "/logos/rrss/wordpress.png",
    url: "https://cademaprop.com.ar/blog",
  },
];

const offices = [
  {
    name: "Campana",
    address: "Av Varela 420, Campana",
    mapsUrl: "https://maps.app.goo.gl/Qj1sZve3ELwJ8niWA.",
    phone: "+54 9 3489 368518",
    whatsappUrl: "https://wa.me/5493489368518",
    hours: "Lun-Vie 10 a 18hs",
  },
  {
    name: "Zárate",
    address: "Av Gallesio 55, Zárate",
    mapsUrl: "https://maps.app.goo.gl/YtUpnjzds6qvJinLA",
    phone: "+54 9 3487 624830",
    whatsappUrl: "https://wa.me/5493487624830",
    hours: "Lun-Vie 10 a 18hs",
  },
  {
    name: "Industrias",
    address: "Parque Industrial Ruta 6 - Autovia 6 km180",
    mapsUrl: "https://maps.app.goo.gl/5m4Ag1wm4Tsod2qC8",
    phone: "+54 9 3489 517998",
    whatsappUrl: "https://wa.me/5493489517998",
    hours: "-",
  },
];

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
            <h4 className="text-lg font-semibold mb-4 uppercase tracking-wider">
              Contacto
            </h4>

            <div className="space-y-4 text-sm">
              {offices.map((office) => (
                <div key={office.name} className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                    {office.name}
                  </p>

                  <div className="flex items-center justify-center md:justify-start gap-2 text-white/80 hover:text-white transition-colors">
                    <span className="text-[#ff4444] shrink-0">📍</span>
                    <a
                      href={office.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#ff4444] transition-colors"
                    >
                      {office.address}
                    </a>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-2 text-white/80 hover:text-white transition-colors">
                    <span className="text-[#ff4444] shrink-0">📱</span>
                    <a
                      href={office.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#ff4444] transition-colors"
                    >
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-white/60 text-[12px]">
                    <span className="text-[#ff4444]">🕒</span>
                    <span>{office.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Redes Sociales y AFIP */}
          <div className="text-white text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4 uppercase tracking-wider">Seguinos</h4>
            
            {/* Redes Sociales */}
            <div className="flex flex-wrap justify-center md:justify-end gap-3 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                    ${social.highlight 
                      ? "bg-[white] hover:bg-[#ff4444]" 
                      : "bg-white hover:bg-[#ff4444]"}
                  `}
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={38}
                    height={38}
                    className="object-contain"
                  />
                </a>
              ))}
            </div>

            {/* AFIP Dataweb */}
            <div className="flex justify-center md:justify-end">
              <a href="http://qr.afip.gob.ar/?qr=82JvChoulzyyUkU3O2T0pA,," target="_blank" rel="noopener">
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