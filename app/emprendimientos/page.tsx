"use client";

import { useState, useEffect, useMemo, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import "./emprendimientos.css";
import FullScreenLoader from "../components/loader";
import { apiUrl } from "@/lib/api";
// --- 1. DICCIONARIOS Y TRADUCCIONES ---

const TIPOLOGIAS_MAP: Record<string, string> = {
  apartment: "Departamento",
  house: "Casa",
  land: "Terreno",
  building: "Edificio",
  industrial: "Parque Industrial",
  "private neighborhood": "Barrio Cerrado",
  local: "Local Comercial",
  office: "Oficina",
  "industrial condo": "Condominio Industrial",
};

const ESTADOS_MAP: Record<number, string> = {
  1: "En Pozo",
  2: "En Construcción",
  3: "Próxima Entrega",
  4: "Finalizado",
  5: "Suspendido",
  6: "A Estrenar",
};

const translateType = (type: string | undefined) => {
  if (!type) return "Emprendimiento";
  return TIPOLOGIAS_MAP[type.toLowerCase()] || type;
};

const matchesDivision = (emp: Development, division: string) => {
  if (division === "industrial") return emp.is_industrial === true;
  if (division === "residencial") return emp.is_industrial !== true;
  return true;
};

// Shuffle para mostrar los emprendimientos destacados en un orden diferente cada vez, pero siempre el mismo para cada usuario gracias a la semilla fija por sesión

const sessionSeed = Math.floor(Math.random() * 1_000_000);

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 4294967296;
  };
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}


const stripHtml = (html?: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
};

// --- 2. INTERFACES ---

interface DevelopmentPhoto {
  image: string;
  is_front_cover?: boolean;
}

interface Development {
  id: number;
  name?: string;
  publication_title?: string;
  photos?: DevelopmentPhoto[];
  type?: { name: string };
  location?: { name: string; short_location?: string };
  description?: string;
  web_url?: string;
  construction_status?: number;
  construction_date?: string;
  is_industrial?: boolean;
}

interface HeroItem {
  id: number;
  zona: string;
  titulo: string;
  texto: string;
  imagen: string;
  link: string;
  isExternal: boolean;
}

// --- 3. COMPONENTE DE CONTENIDO ---

function EmprendimientosContent() {
  const [emprendimientos, setEmprendimientos] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [initialHeroDivision] = useState(searchParams.get("div") || "all");

  // Filtros
  const [filterLoc, setFilterLoc] = useState(searchParams.get("loc") || "all");
  const [filterType, setFilterType] = useState(searchParams.get("type") || "all");
  const [filterDivision, setFilterDivision] = useState(searchParams.get("div") || "all");

  // Hero / carrusel
  const [activeIndex, setActiveIndex] = useState(0);
  const [showingLayer, setShowingLayer] = useState<"a" | "b">("a");
  const [bgA, setBgA] = useState("");
  const [bgB, setBgB] = useState("");
  const [isAnimatingText, setIsAnimatingText] = useState(true);

  const railRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<number | null>(null);

  // Función para actualizar URL
  const updateUrl = (newFilters: { loc?: string; type?: string; div?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newFilters.loc !== undefined) {
      newFilters.loc === "all" ? params.delete("loc") : params.set("loc", newFilters.loc);
    }
    if (newFilters.type !== undefined) {
      newFilters.type === "all" ? params.delete("type") : params.set("type", newFilters.type);
    }
    if (newFilters.div !== undefined) {
      newFilters.div === "all" ? params.delete("div") : params.set("div", newFilters.div);
    }

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleLocChange = (val: string) => {
    setFilterLoc(val);
    updateUrl({ loc: val });
  };

  const handleTypeChange = (val: string) => {
    setFilterType(val);
    updateUrl({ type: val });
  };

  const handleDivChange = (val: string) => {
    setFilterDivision(val);
    updateUrl({ div: val });
  };

  const clearFilters = () => {
    setFilterLoc("all");
    setFilterType("all");
    setFilterDivision("all");
    router.push(pathname, { scroll: false });
  };

  useEffect(() => {
    const fetchEmprendimientos = async () => {
      try {
        const response = await fetch(apiUrl("developments"));
        const data = await response.json();
        setEmprendimientos(data.objects || []);
      } catch (err) {
        console.error("Error cargando desarrollos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmprendimientos();
  }, []);

  const filteredItems = useMemo(() => {
    const filtered = emprendimientos.filter((emp) => {
      const matchLoc = filterLoc === "all" || emp.location?.name === filterLoc;
      const matchType = filterType === "all" || emp.type?.name === filterType;
      const matchDiv = matchesDivision(emp, filterDivision);
      return matchLoc && matchType && matchDiv;
    });
    const filterHash = [...`${filterLoc}-${filterType}-${filterDivision}`]
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return seededShuffle(filtered, sessionSeed + filterHash);
  }, [emprendimientos, filterLoc, filterType, filterDivision]);

  const uniqueLocations = Array.from(
    new Set(emprendimientos.map((e) => e.location?.name).filter(Boolean))
  );

  const uniqueTypes = Array.from(
    new Set(emprendimientos.map((e) => e.type?.name).filter(Boolean))
  );

  const heroItems = useMemo<HeroItem[]>(() => {
    const withPhotos = emprendimientos.filter(
      (emp) => emp.photos?.length && matchesDivision(emp, initialHeroDivision)
    );
    const shuffled = seededShuffle(withPhotos, sessionSeed);
    const count = Math.max(6, Math.min(10, shuffled.length));
    return shuffled.slice(0, count).map((emp) => {
        const coverImage =
          emp.photos?.find((p) => p.is_front_cover)?.image ||
          emp.photos?.[0]?.image ||
          "/placeholder.jpg";

        const description = stripHtml(emp.description);

        return {
          id: emp.id,
          zona: emp.location?.name || "Ubicación",
          titulo: emp.name || emp.publication_title || "Emprendimiento",
          texto:
            description.slice(0, 220) ||
            "Descubrí este emprendimiento y conocé más detalles de su propuesta, ubicación y características.",
          imagen: coverImage,
          link: emp.web_url || `/emprendimientos/${emp.id}`,
          isExternal: Boolean(emp.web_url),
        };
      });
  }, [emprendimientos, initialHeroDivision]);

  const activeHeroItem = heroItems[activeIndex];

  useEffect(() => {
    if (!heroItems.length) return;

    setActiveIndex(0);
    setBgA(heroItems[0].imagen);
    setBgB(heroItems[0].imagen);
    setShowingLayer("a");
    setIsAnimatingText(true);
  }, [heroItems]);

  const clearAutoplay = () => {
    if (autoplayRef.current !== null) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const startAutoplay = () => {
    if (heroItems.length <= 1) return;

    clearAutoplay();

    autoplayRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroItems.length);
    }, 5000);
  };

  const resetAutoplay = () => {
    clearAutoplay();
    startAutoplay();
  };

  const goTo = (index: number) => {
    if (!heroItems.length) return;
    const nextIndex = (index + heroItems.length) % heroItems.length;
    setActiveIndex(nextIndex);
  };

  const goNext = () => {
    goTo(activeIndex + 1);
    resetAutoplay();
  };

  const goPrev = () => {
    goTo(activeIndex - 1);
    resetAutoplay();
  };

  useEffect(() => {
    if (!heroItems.length) return;
    if (!heroItems[activeIndex]) return;

    const nextImage = heroItems[activeIndex].imagen;

    if (showingLayer === "a") {
      setBgB(nextImage);
      requestAnimationFrame(() => {
        setShowingLayer("b");
      });
    } else {
      setBgA(nextImage);
      requestAnimationFrame(() => {
        setShowingLayer("a");
      });
    }

    setIsAnimatingText(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimatingText(true);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    startAutoplay();

    return () => {
      clearAutoplay();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroItems.length]);

  useEffect(() => {
  const updateRailPosition = () => {
    const rail = railRef.current;
    const wrap = wrapRef.current;
    if (!rail || !wrap) return;

    const cards = rail.querySelectorAll<HTMLElement>(".emprendimientos-card");
    const activeCard = cards[activeIndex];
    if (!activeCard) return;

    const wrapWidth = wrap.offsetWidth;
    const cardLeft = activeCard.offsetLeft;
    const cardWidth = activeCard.offsetWidth;

    const targetX = cardLeft - (wrapWidth / 2) + (cardWidth / 2);

    rail.style.transform = `translate3d(${-targetX}px, 0, 0)`;
  };

  updateRailPosition();
  window.addEventListener("resize", updateRailPosition);

  return () => {
    window.removeEventListener("resize", updateRailPosition);
  };
}, [activeIndex, heroItems.length]);

  return (
    <>
    {loading && <FullScreenLoader />}
    
    <div className={`transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="min-h-screen bg-slate-50 -mt-[70px] pt-[70px]">
        {!!activeHeroItem && (
          <section className="emprendimientos-hero" id="emprendimientosHero">
            <div
              className={`emprendimientos-hero__bg ${showingLayer === "a" ? "active" : ""}`}
              style={{ backgroundImage: `url("${bgA}")` }}
            />
            <div
              className={`emprendimientos-hero__bg ${showingLayer === "b" ? "active" : ""}`}
              style={{ backgroundImage: `url("${bgB}")` }}
            />
            <div className="emprendimientos-hero__overlay" />

            <div className="emprendimientos-hero__content">
              <div
                className={`emprendimientos-hero__info ${
                  isAnimatingText ? "hero-copy-anim" : ""
                }`}
              >
                <div className="emprendimientos-hero__zona">{activeHeroItem.zona}</div>

                <h1 className="emprendimientos-hero__titulo">{activeHeroItem.titulo}</h1>

                <p className="emprendimientos-hero__texto">{activeHeroItem.texto}...</p>

                {activeHeroItem.isExternal ? (
                  <Link
                    className="emprendimientos-hero__btn"
                    href={activeHeroItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="hero__btn-text">Ir a la ficha</span>
                    <span className="hero__btn-arrow">→</span>
                  </Link>
                ) : (
                  <Link className="emprendimientos-hero__btn" href={activeHeroItem.link}>
                    <span className="hero__btn-text">Ir a la ficha</span>
                    <span className="hero__btn-arrow">→</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="emprendimientos-hero__rail-wrap" ref={wrapRef}>
              <div className="emprendimientos-hero__rail" ref={railRef}>
                {heroItems.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`emprendimientos-card ${
                      index === activeIndex ? "is-active" : ""
                    }`}
                    onClick={() => {
                      goTo(index);
                      resetAutoplay();
                    }}
                    aria-label={`Ver emprendimiento ${item.titulo}`}
                  >
                    <img src={item.imagen} alt={item.titulo} />
                    <div className="emprendimientos-card__info">
                      <div className="emprendimientos-card__lugar">{item.zona}</div>
                      <h3 className="emprendimientos-card__titulo">{item.titulo}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="emprendimientos-hero__controls">
              <button
                type="button"
                className="emprendimientos-hero__arrow"
                onClick={goPrev}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                type="button"
                className="emprendimientos-hero__arrow"
                onClick={goNext}
                aria-label="Siguiente"
              >
                ›
              </button>
            </div>
          </section>
        )}

        <div className="container mx-auto px-4 py-12">
          <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 -mt-20 relative z-20 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  División
                </label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-red-500 font-bold text-gray-700 outline-none"
                  value={filterDivision}
                  onChange={(e) => handleDivChange(e.target.value)}
                >
                  <option value="all">Todas</option>
                  <option value="residencial">Residencial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Ubicación
                </label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 font-bold outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
                  value={filterLoc}
                  onChange={(e) => handleLocChange(e.target.value)}
                >
                  <option value="all">Todas</option>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc!}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Tipología
                </label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 font-bold outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
                  value={filterType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  <option value="all">Todas</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type!}>
                      {translateType(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1 bg-red-600 text-white p-3 rounded-xl text-center shadow-lg">
                  <span className="text-xl font-black block leading-none">{filteredItems.length}</span>
                  <span className="text-[9px] uppercase font-bold tracking-tighter">
                    Resultados
                  </span>
                </div>

                {(filterLoc !== "all" ||
                  filterType !== "all" ||
                  filterDivision !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {loading ? (
              <div className="text-center py-20 animate-pulse text-gray-400 font-bold uppercase tracking-widest">
                Cargando Emprendimientos...
              </div>
            ) : (
              filteredItems.map((emp) => {
                const coverImage =
                  emp.photos?.find((p) => p.is_front_cover)?.image ||
                  emp.photos?.[0]?.image;

                const deliveryDate = emp.construction_date
                  ? new Date(emp.construction_date).toLocaleDateString("es-AR", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Consulte fecha";

                return (
                  <div
                    key={emp.id}
                    className="group flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 h-auto md:h-[450px]"
                  >
                    <div className="md:w-[40%] h-72 md:h-auto relative overflow-hidden shrink-0">
                      <img
                        src={coverImage || "/placeholder.jpg"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={emp.name || "Emprendimiento"}
                      />
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-xl">
                          {translateType(emp.type?.name)}
                        </span>
                      </div>
                    </div>

                    <div className="md:w-[60%] p-8 md:p-12 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-red-600 mb-3 font-bold text-xs uppercase tracking-widest">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                          {emp.location?.name}
                        </div>

                        <div className="mb-6">
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                            {emp.name}
                          </p>
                          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                            { emp.name || emp.publication_title }
                          </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-[9px] uppercase font-black text-gray-400 mb-1">
                              Estado
                            </p>
                            <p className="font-bold text-gray-700 text-sm">
                              {emp.construction_status
                                ? ESTADOS_MAP[emp.construction_status]
                                : "A estrenar"}
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-[9px] uppercase font-black text-gray-400 mb-1">
                              Entrega
                            </p>
                            <p className="font-bold text-gray-700 text-sm capitalize">
                              {deliveryDate}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                        {emp.web_url ? (
                          <Link
                            href={emp.web_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-red-600 transition-all shadow-lg text-xs uppercase tracking-widest"
                          >
                            Visitar Web del Proyecto
                          </Link>
                        ) : (
                          <Link
                            href={`/emprendimientos/${emp.id}`}
                            className="px-8 py-4 bg-gray-200 text-gray-700 font-black rounded-xl hover:bg-gray-300 transition-all text-xs uppercase tracking-widest"
                          >
                            Ver Detalles
                          </Link>
                        )}

                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-gray-300 uppercase">
                            Referencia
                          </span>
                          <span className="text-sm font-bold text-gray-400 italic">
                            ID {emp.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

// --- 4. EXPORTACIÓN CON SUSPENSE ---

export default function EmprendimientosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-gray-400 font-bold animate-pulse uppercase tracking-widest">
            Cargando...
          </div>
        </div>
      }
    >
      <EmprendimientosContent />
    </Suspense>
  );
}
