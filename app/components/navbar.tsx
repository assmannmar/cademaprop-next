"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Componentes de Iconos SVG 
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
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
    { name: "NOSOTROS", href: "/quienes-somos" },
    { 
      name: "PROPIEDADES",
      href: "/propiedades",
      submenu : 
      [
        { 
          name: "Residenciales",
          href: "#",
          items: [
            { name: "Casas", href: "/propiedades?tipo=house" },
            { name: "Departamentos", href: "/propiedades?tipo=apartment" },
            { name: "Terrenos", href: "/propiedades?tipo=land" },
          ] 
        },
        {
          name: "Industriales",
          href: "#",
          items: [
            {name: "Nave Industrial", href: "/propiedades?tipo=Industrial+Ship"},
            {name: "Terreno Industrial", href: "/propiedades?tipo=Terreno+industrial"},
          ]
        },
        { name: "Simulador", href: "/simulador"},
        { name: "Tasar/Vender", href: "/vender" },
      ] 
    },
    { 
      name: "EMPRENDIMIENTOS", 
      href: "/emprendimientos",
      submenu:
      [
        { name: "Residencial", href: "/emprendimientos?div=residencial"},
        { name: "Industrial", href: "/emprendimientos?div=industrial"},
        { name: "Simulador", href: "/simulador"},
      ]
    },
    { name: "INDUSTRIA", href: "https://cademaprop.com.ar/parque-industrial/centro-logistico-consultor-inmobiliario-empresas-venta-alquiler-fracciones-galpones/" },
    { name: "CONTACTO", href: "/contacto" },
    { name: "BLOG", href: "/blog" },
    { name: "SINOR", href: "https://sinor.com.ar/" },
  ];

  const linkClass = `nav-item px-3 py-2 transition-colors duration-200 font-bold ${
    scrolled ? "text-gray-800 hover:text-blue-600" : "text-white hover:text-gray-300"
  }`;

  const handleDesktopMenuClick = (e: React.MouseEvent, linkName: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      e.preventDefault();
      e.stopPropagation();
      setOpenSubmenu(openSubmenu === linkName ? null : linkName);
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
              className="h-auto w-full max-w-[140px] md:max-w-[180px] transition-all duration-300" 
            />
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden lg:flex items-center ml-auto space-x-1">
            {navLinks.map((link) => {
              const hasSubmenu = link.submenu && link.submenu.length > 0;
              
              return (
                <div key={link.name} className="relative">
                  {hasSubmenu ? (
                    <>
                      <button
                        onClick={(e) => handleDesktopMenuClick(e, link.name, hasSubmenu)}
                        className={`${linkClass} flex items-center cursor-pointer`}
                      >
                        {link.name}
                        <span className={`transition-transform duration-200 ${openSubmenu === link.name ? 'rotate-180' : ''}`}>
                          {/* <ChevronDownIcon /> */}
                        </span>
                      </button>
                      
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
                                    {/* Elemento que dispara el sub-sub-menú */}
                                    <div className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 cursor-pointer font-semibold transition-colors">
                                      {sublink.name}
                                      <span className="text-[10px]">▶</span>
                                    </div>

                                    {/* EL SUB-SUB-MENÚ (Aparece al hacer hover en group/sub) */}
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
                    <Link href={link.href} className={linkClass}>
                      {link.name}
                    </Link>
                  )}
                </div>
              );
            })}
            
            {/* Redes sociales como parte del mismo grupo de space-x */}
            <a href="https://instagram.com/cademabienesraices" target="_blank" className={linkClass} aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://wa.me/5493489517993" target="_blank" className={linkClass} aria-label="WhatsApp">
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
            <a href="https://wa.me/5493489517993" target="_blank" className="text-green-500 transform scale-150">
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}