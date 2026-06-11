"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Componentes de Iconos SVG 
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.262c.001-5.45 4.436-9.884 9.889-9.884a9.84 9.84 0 0 1 6.988 2.899 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.886 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.946L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
);

// const ChevronDownIcon = () => (
//   <svg className="w-4 h-4 ml-1 inline-block transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//   </svg>
// );

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      
      // 1. Handle background color change
      setScrolled(currentY > 50);

      // 2. Handle show/hide logic
      if (currentY > lastY.current && currentY > 100) {
        // Scrolling Down - hide and close mobile menu
        setVisible(false);
        setMobileMenuOpen(false);
      } else {
        // Scrolling Up - show
        setVisible(true);
      }
      
      lastY.current = currentY;
    };

    // Use passive: true for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  // Close submenus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenSubmenu(null);
    };
    
    if (openSubmenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openSubmenu]);

  const navLinks = [
    { name: "NOSOTROS", href: "/nosotros" },
    { 
      name: "PROPIEDADES",
      href: "/propiedades",
      submenu : 
      [
        { 
          name: "Residenciales",
          href: "/propiedades",
          items: [
            { name: "Casas", href: "/propiedades?tipo=house" },
            { name: "Departamentos", href: "/propiedades?tipo=apartment" },
            { name: "Terrenos", href: "/propiedades?tipo=land" },
          ] 
        },
        {
          name: "Industriales",
          href: "/propiedades?division=Industria",
          items: [
            {name: "Nave Industrial", href: "/propiedades?tipo=Industrial+Ship"},
            {name: "Terreno Industrial", href: "/propiedades?tipo=Terreno+industrial"},
          ]
        },
        // { name: "Simulador", href: "/simulador"},
        { name: "Tasar/Vender", href: "/tasar-vender" },
      ] 
    },
    { 
      name: "EMPRENDIMIENTOS", 
      href: "/emprendimientos",
      submenu:
      [
        { name: "Residencial", href: "/emprendimientos?div=residencial"},
        { name: "Industrial", href: "/emprendimientos?div=industrial"},
        // { name: "Simulador", href: "/simulador"},
      ]
    },
    { name: "INDUSTRIA", href: "/industrias" },
    { name: "CONTACTO", href: "/contacto" },
    { name: "BLOG", href: "/blog" },
    { name: "SINOR", href: "https://sinor.com.ar/" },
  ];

  const linkClass = `nav-item inline-flex items-center h-11 px-3 py-2 transition-colors duration-200 font-bold leading-none ${
    scrolled ? "text-gray-800 hover:text-blue-600" : "text-white hover:text-gray-300"
  }`;

  const handleDesktopMenuClick = (e: React.MouseEvent, link: typeof navLinks[0], hasSubmenu: boolean) => {
    if (hasSubmenu) {
      if (openSubmenu === link.name) {
        // Segundo click: ya está abierto → navegar
        setOpenSubmenu(null);
        // La navegación ocurre naturalmente porque no hacemos preventDefault
      } else {
        // Primer click: abrir submenú
        e.preventDefault();
        e.stopPropagation();
        setOpenSubmenu(link.name);
      }
    }
  };

  const handleMobileMenuClick = (linkName: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      setOpenMobileSubmenu(openMobileSubmenu === linkName ? null : linkName);
    } else {
      setMobileMenuOpen(false);
    }
  };

return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 transform
          ${visible ? "translate-y-0" : "-translate-y-full"} 
          ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2" : "bg-transparent py-5"}`}
      >
        {/* Cambiamos justify-between por una estructura más sólida */}
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* LOGO - Se mantiene a la izquierda */}
          <Link href="/" className="flex-shrink-0">
            <img 
              src="/logos/logo.png" 
              alt="Logo" 
              className={`h-auto w-full max-w-[130px] transition-all duration-300 md:max-w-[170px] ${
                scrolled ? "" : "drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
              }`}
            />
          </Link>

          {/* MENU DESKTOP */}
                    {/* MENU DESKTOP */}
          <div className="hidden lg:flex items-center ml-auto space-x-1">
            {navLinks.map((link) => {
              const hasSubmenu = link.submenu && link.submenu.length > 0;

              const desktopLinkClass = `nav-item inline-flex items-center justify-center h-11 px-3 py-2 transition-colors duration-200 font-bold leading-none ${
                scrolled ? "text-gray-800 hover:text-blue-600" : "text-white hover:text-gray-300"
              }`;

              return (
                <div key={link.name} className="relative flex items-center">
                  {hasSubmenu ? (
                    <>
                      <Link
                        href={link.href}
                        onClick={(e) => handleDesktopMenuClick(e, link, !!hasSubmenu)}
                        className={`${desktopLinkClass} cursor-pointer`}
                      >
                        <span>{link.name}</span>
                      </Link>

                      {/* Submenu Desktop */}
                      {openSubmenu === link.name && (
                        <div
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-fade-in z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {link.submenu?.map((sublink) => {
                            const hasSubSubmenu = sublink.items && sublink.items.length > 0;

                            return (
                              <div key={sublink.name} className="relative group/sub">
                                {hasSubSubmenu ? (
                                  <>
                                    <Link
                                      href={sublink.href}
                                      className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 cursor-pointer font-semibold transition-colors"
                                      onClick={() => setOpenSubmenu(null)}
                                    >
                                      {sublink.name}
                                      <span className="text-[10px]">▶</span>
                                    </Link>

                                    <div className="absolute left-full top-0 ml-0 w-48 bg-white shadow-xl border border-gray-100 py-2 hidden group-hover/sub:block animate-fade-in">
                                      {sublink.items?.map((item) => (
                                        <Link
                                          key={item.name}
                                          href={item.href}
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 font-medium"
                                          onClick={() => setOpenSubmenu(null)}
                                        >
                                          {item.name}
                                        </Link>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <Link
                                    href={sublink.href}
                                    className="block px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors font-semibold"
                                    onClick={() => setOpenSubmenu(null)}
                                  >
                                    {sublink.name}
                                  </Link>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href={link.href} className={desktopLinkClass}>
                      <span>{link.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}

            {/* Redes sociales como parte del mismo grupo de space-x */}
            <a
              href="https://instagram.com/cademabienesraices"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://wa.me/5493489368518"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
              aria-label="WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>

          {/* HAMBURGER - Solo aparece en móvil */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden ml-auto text-3xl z-50 ${
              mobileMenuOpen || scrolled ? "text-gray-800" : "text-white"
            }`}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-40 bg-white flex flex-col transition-transform duration-500 ease-in-out lg:hidden ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col items-center justify-start h-full pt-24 pb-10 space-y-2 text-xl font-semibold text-gray-800 overflow-y-auto px-6">
          {navLinks.map((link) => {
            const hasSubmenu = link.submenu && link.submenu.length > 0;
            const isSubmenuOpen = openMobileSubmenu === link.name;

            return (
              <div key={link.name} className="w-full flex flex-col items-center">
                {hasSubmenu ? (
                  <>
                    {/* Botón que abre el submenú en móvil */}
                    <button
                      onClick={() => setOpenMobileSubmenu(isSubmenuOpen ? null : link.name)}
                      className="w-full text-center py-4 flex items-center justify-center gap-2 border-b border-gray-50"
                    >
                      {link.name}
                      <svg 
                        className={`w-5 h-5 transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`} 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Contenedor del Submenú Móvil */}
                    <div className={`w-full bg-gray-50 overflow-hidden transition-all duration-300 ${
                      isSubmenuOpen ? 'max-h-[1000px] opacity-100 py-2' : 'max-h-0 opacity-0'
                    }`}>
                      {link.submenu?.map((sublink) => {
                        const hasSubSubmenu = sublink.items && sublink.items.length > 0;
                        
                        return (
                          <div key={sublink.name} className="w-full">
                            {hasSubSubmenu ? (
                              <div className="flex flex-col">
                                <span className="block w-full text-center py-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                                  {sublink.name}
                                </span>
                                {sublink.items?.map((item) => (
                                  <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-center py-3 text-lg text-gray-600 hover:text-red-600 border-b border-gray-100/50"
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <Link
                                href={sublink.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-center py-3 text-lg text-gray-600 hover:text-red-600"
                              >
                                {sublink.name}
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <Link 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-4 border-b border-gray-50"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            );
          })}

          {/* Redes Sociales en Móvil */}
          <div className="flex space-x-12 pt-10 mt-4 border-t w-full justify-center border-gray-100">
            <a href="https://instagram.com/cademabienesraices" target="_blank" className="text-pink-600 transform scale-150">
              <InstagramIcon />
            </a>
            <a href="https://wa.me/5493489368518" target="_blank" className="text-green-500 transform scale-150">
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
