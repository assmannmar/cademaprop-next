'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  EmprendimientosIndustrialesCarousel,
  LogosCarousel,
  PropiedadesIndustrialesCarousel,
} from '@/app/components/IndustriasCarousels';
import { apiUrl } from '@/lib/api';

interface Property {
  id: number;
  publication_title?: string;
  photos?: Array<{ image: string }>;
  type?: { name: string };
  location?: { name: string };
  operations?: Array<{
    operation_type: string;
    prices?: Array<{ price: number; currency: string }>;
  }>;
  custom_tags?: Array<{ name: string; group_name?: string }>;
  development?: { type?: { name: string } };
  is_starred_on_web?: boolean;
}

interface Development {
  id: number;
  name?: string;
  publication_title?: string;
  photos?: Array<{ image: string }>;
  location?: { name: string };
  type?: { name: string };
  description?: string;
  web_url?: string;
}

interface AccordionItem {
  q: string;
  a: string;
}

const problemItems: AccordionItem[] = [
  {
    q: 'Falta de tiempo para pensar en un cambio',
    a: 'Muchas empresas están pensando hoy en alternativas para su localización, pero indagar sobre las distintas opciones, analizar pros y contras de cada una de ellas, valores de referencia, superficies disponibles, beneficios fiscales, entre otros ítems, insume una enorme cantidad de tiempo y esfuerzo.',
  },
  {
    q: 'Pocos espacios industriales disponibles',
    a: 'El sector logístico busca constantemente espacios disponibles para montar nuevos puntos de distribución. Hoy el mercado de alquileres logísticos se encuentra saturado, con pocas opciones en zonas adecuadas, lo que complejiza su búsqueda.',
  },
  {
    q: 'Zonas antes industriales, ahora residenciales',
    a: 'Numerosas pymes del AMBA se localizaron en zonas despobladas, pero hoy se han convertido en áreas eminentemente residenciales, con accesos, calles y servicios que no fueron planificados para la industria.',
  },
  {
    q: 'Multas, cortes de calles, problemas con vecinos',
    a: 'Esto genera conflictividad con los vecinos, importantes erogaciones en tasas y multas, y altos costos operativos.',
  },
];

const workItems = [
  {
    title: 'Conocimiento',
    text: 'Coordinamos visitas a zonas industriales, parques y centros logísticos para conocer la diversidad de opciones. En base a ello, confeccionamos un relevamiento constante de datos: valores, superficies disponibles, servicios instalados y beneficios impositivos, entre otros puntos.',
  },
  {
    title: 'Relaciones',
    text: 'Tenemos contacto fluido con representantes de parques industriales, inversores y constructores. Además, somos miembros de CIALI, formando parte de una red de búsquedas e intereses que se enriquece día a día con colegas del sector.',
  },
  {
    title: 'Comercial',
    text: 'Contamos con una variada carpeta de opciones, enfocadas en zonas norte y oeste del AMBA, tanto respecto de tierra en parques o zonas industriales como de naves en venta y alquiler.',
  },
];

const empresasRadicadas = [
  { id: 'seventeen', name: 'Seventeen SRL' },
  { id: 'adn', name: 'ADN Logística' },
  { id: 'loginter', name: 'Loginter' },
  { id: 'plexo', name: 'Plexo' },
  { id: 'grupo-l', name: 'Grupo L' },
  { id: 'urbano', name: 'Urbano Express' },
  { id: 'polar', name: 'Polar' },
  { id: 'transfarmaco', name: 'Transfarmaco' },
];

const empresasInstituciones = [
  { id: 'ciali', name: 'CIALI' },
  { id: 'parque-ruta-6', name: 'Parque Industrial Ruta 6' },
  { id: 'los-libertadores', name: 'Parque Industrial Los Libertadores' },
  { id: 'clip', name: 'Centro Logístico Industrial Planificado Zárate' },
  { id: 'campana', name: 'Parque Industrial Campana' },
  { id: 'plaza-pilar', name: 'Plaza Industrial Pilar' },
  { id: 'plaza-escobar', name: 'Plaza Industrial Escobar' },
  { id: 'desarrolladores', name: 'Desarrolladores industriales' },
];

const faqItems: AccordionItem[] = [
  {
    q: '¿En qué zonas trabajan?',
    a: 'Nos especializamos en zona norte del GBA: Zárate, Campana, Escobar y Pilar. También podemos realizar búsquedas en otras zonas como Cañuelas, Buen Ayre, Tigre y otros corredores industriales.',
  },
  {
    q: '¿Qué tipo de información necesitan?',
    a: 'Te vamos a pedir las características de tu empresa, si es industria o logística, qué tipo de operación querés realizar, tipo de producto que fabricás o almacenás, superficie requerida, potencia, accesos y plazos.',
  },
  {
    q: '¿En qué se diferencian de una inmobiliaria tradicional?',
    a: 'La inmobiliaria tradicional se basa en la venta de un producto puntual. Nuestro trabajo, en cambio, se enfoca en la consultoría: entendemos tus necesidades y buscamos las mejores alternativas de acuerdo a tus requerimientos.',
  },
  {
    q: '¿El servicio es más oneroso que el de una inmobiliaria tradicional?',
    a: 'No. Los honorarios que percibe CADEMA son similares a los de cualquier inmobiliaria tradicional. Al cerrar la operación solamente vas a abonar el porcentaje habitual por la compra o alquiler del terreno o la nave.',
  },
  {
    q: 'Si CADEMA realiza la búsqueda, ¿estoy obligado a realizar la operación con ustedes?',
    a: 'No estás obligado, pero confiamos en que vamos a ser quienes te presentemos las mejores alternativas para tu proyecto.',
  },
  {
    q: '¿Cuánto cuesta alquilar una nave industrial en Zona Norte?',
    a: 'El valor depende de ubicación, categoría del parque, estado de la nave, superficie, servicios y condiciones contractuales. Lo importante es comparar opciones reales y vigentes antes de definir.',
  },
  {
    q: '¿Qué diferencia hay entre las categorías 1, 2 y 3?',
    a: 'La categoría define qué actividades se pueden radicar. Categoría 1 admite industrias inocuas, categoría 2 actividades incómodas y categoría 3 actividades de mayor complejidad. Verificarlo antes de avanzar es clave.',
  },
  {
    q: '¿Conviene comprar un lote o alquilar una nave?',
    a: 'Depende del horizonte, el capital disponible y la urgencia operativa. Comprar lote puede ser más eficiente para proyectos de largo plazo; alquilar una nave permite entrar en operación más rápido.',
  },
  {
    q: '¿Tienen propiedades fuera de parques industriales?',
    a: 'Sí. También trabajamos con naves y galpones independientes en zonas industriales tradicionales, evaluando habilitación, accesos, costos operativos y compatibilidad con la actividad.',
  },
  {
    q: '¿Qué beneficios fiscales ofrecen los parques industriales?',
    a: 'Varían según jurisdicción y proyecto. Algunos parques ofrecen exenciones o beneficios en tasas e impuestos. Presentamos esa información dentro del análisis comparativo de cada alternativa.',
  },
  {
    q: '¿Cómo cobran sus honorarios?',
    a: 'Los honorarios son los habituales del sector inmobiliario industrial y se abonan al cierre de la operación. No hay costo adicional por la búsqueda ni por las visitas.',
  },
];

const team = [
  {
    name: 'Rolando Cafferatta',
    role: 'Director General',
    image: '/team/3.png',
  },
  {
    name: 'Alejandro Torres Hotton',
    role: 'Coordinador',
    image: '/team/1.png',
  },
  {
    name: 'Hernán González',
    role: 'Gerente Comercial',
    image: '/team/2.png',
  },
];

function AccordionList({ items }: { items: AccordionItem[] }) {
  return (
    <div className="divide-y divide-[#d8d1c4] border-y border-[#d8d1c4]">
      {items.map((item, index) => (
        <details key={item.q} className="group" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left">
            <span className="text-lg font-semibold text-[#141414]">{item.q}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d8d1c4] text-xl text-[#b8252c] transition group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="max-w-4xl pb-6 text-base leading-relaxed text-[#5f5a53]">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}

export default function IndustriasPage() {
  const [propiedadesIndustriales, setPropiedadesIndustriales] = useState<Property[]>([]);
  const [emprendimientosIndustriales, setEmprendimientosIndustriales] = useState<Development[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scriptId = 'ventux-form-embed';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://link.ventux.io/js/form_embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const load = async () => {
      try {
        const [propRes, devRes] = await Promise.allSettled([
          fetch(
            `${apiUrl('properties')}?${new URLSearchParams({
              division: 'Industria',
              limit: '12',
              page: '1',
            }).toString()}`
          ),
          fetch(apiUrl('developments')),
        ]);

        if (propRes.status === 'fulfilled' && propRes.value.ok) {
          const propData = await propRes.value.json();
          setPropiedadesIndustriales(propData.objects || []);
        }

        if (devRes.status === 'fulfilled' && devRes.value.ok) {
          const devData = await devRes.value.json();
          const industriales =
            devData.objects?.filter(
              (d: Development) =>
                d.type?.name?.toLowerCase().includes('industrial') ||
                d.description?.toLowerCase().includes('industrial')
            ) || [];
          setEmprendimientosIndustriales(industriales.slice(0, 12));
        }
      } catch (err) {
        console.error('Error cargando datos industriales:', err);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="bg-white text-neutral-900">
      <section
        className="relative flex min-h-[72vh] scroll-mt-24 items-end overflow-hidden border-b border-neutral-200 md:min-h-[82vh]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.48)), url('/industrial-banner.jpg')",
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="relative z-10 w-full">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-28 md:px-8 md:pb-18 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
            <div>
              <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-[#b8252c]" />
                <span className="font-mono text-xs uppercase tracking-widest text-white/80">
                  Líderes en Zona Norte
                </span>
              </div>

              <p className="mb-4 text-xl font-semibold uppercase tracking-[0.18em] text-white/85">
                Sabemos de Inmuebles, Sabemos de Industria.
              </p>

              <h1 className="max-w-4xl text-4xl font-semibold uppercase leading-[0.98] text-white md:text-6xl lg:text-7xl">
                Contamos con el mejor lugar para radicar tu empresa
              </h1>

              <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-white/88 md:text-lg">
                <p>
                  Brindamos un servicio de gestión inteligente en la búsqueda del terreno o la
                  nave mas conveniente para el crecimiento de tu empresa.
                </p>
                <p>
                  Como agentes inmobiliarios, nos enfocamos en conocer tus inquietudes y
                  necesidades, y en base a ello encontrar la localización que mejor se adapte a
                  tu proyecto.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#formulario"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c60c23] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#a80f22]"
                >
                  Contacta a un agente con experiencia <span>→</span>
                </a>
                <a
                  href="#problemas"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  Ver cómo ayudamos
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 content-end gap-4 lg:pb-2">
              {[
                ['60+', 'Años de trayectoria'],
                ['Zona Norte', 'AMBA y Provincia de Buenos Aires'],
                ['CIALI', 'Socios del consejo inmobiliario logístico e industrial'],
                ['0%', 'Sin costo adicional de búsqueda'],
              ].map(([number, label]) => (
                <div
                  key={number}
                  className="rounded-[18px] border border-white/15 bg-white/12 p-5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-md"
                >
                  <div className="mb-2 text-2xl font-semibold md:text-4xl">{number}</div>
                  <p className="text-sm leading-relaxed text-white/75">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="problemas" className="scroll-mt-24 border-b border-[#d8d1c4] bg-[#f5f3f0] py-20">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-12 max-w-4xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#6b6660]">
              01 · Diagnóstico
            </span>
            <h2 className="mt-4 text-3xl font-semibold uppercase leading-tight text-neutral-900 md:text-5xl">
              ¿Tu empresa enfrenta estos problemas?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[#6b6660]">
              ¿Necesitás expandir tu empresa? ¿Buscás dónde localizarte?
            </p>
          </div>
          <AccordionList items={problemItems} />
        </div>
      </section>

      <section id="como" className="scroll-mt-24 border-b border-[#d8d1c4] py-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#6b6660]">
                02 · Cómo trabajamos
              </span>
              <h2 className="mt-4 text-3xl font-semibold uppercase leading-tight text-neutral-900 md:text-5xl">
                Somos los representantes de la empresa que busca donde radicarse
              </h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-[#4f4a44] md:text-lg">
              <p>
                Situada en Campana, Pcia. de Buenos Aires, la Inmobiliaria CADEMA lleva más de
                50 años de impecable trayectoria en el mercado local. Su fuerte participación en
                el Real Estate industrial llevó naturalmente a CADEMA SA a desarrollar la
                División Industrias, posicionándose como una consultora integral inmobiliaria de
                referencia en la región.
              </p>
              <p>
                Dividimos nuestro trabajo en tres ejes temáticos, en permanente actualización y
                crecimiento.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {workItems.map((item, index) => (
              <div key={item.title} className="border-t border-[#b8252c] pt-6">
                <div className="mb-5 font-mono text-xs font-semibold uppercase tracking-widest text-[#b8252c]">
                  Eje {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-[#141414]">{item.title}</h3>
                <p className="text-base leading-relaxed text-[#5f5a53]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="propiedades" className="scroll-mt-24 border-b border-[#d8d1c4] py-20">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-16">
            <span className="mb-6 block font-mono text-xs uppercase tracking-widest text-[#6b6660]">
              03 · Propiedades disponibles
            </span>
            <h2 className="mb-4 text-3xl font-semibold uppercase leading-tight text-neutral-900 md:text-5xl">
              Naves, lotes y fracciones industriales
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-[#6b6660]">
              Opciones reales dentro y fuera de parques industriales, con análisis de
              zonificación, superficies disponibles, valores, servicios y condiciones para
              radicar tu empresa.
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-[#b8252c]" />
            </div>
          ) : propiedadesIndustriales.length > 0 ? (
            <PropiedadesIndustrialesCarousel propiedades={propiedadesIndustriales} />
          ) : (
            <p className="text-center text-gray-500">
              No hay propiedades industriales disponibles en este momento
            </p>
          )}

          <div className="mt-12 flex justify-center">
            <Link href="/propiedades?division=Industria" className="btn-split btn-split-bottom btn-split-wide">
              <span className="btn-text">Ver todas las propiedades</span>
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="parques" className="scroll-mt-24 border-b border-[#d8d1c4] bg-[#1a1a1a] py-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-16">
            <span className="mb-6 block font-mono text-xs uppercase tracking-widest text-[#8a8a8a]">
              04 · Parques que representamos
            </span>
            <h2 className="mb-6 text-3xl font-semibold uppercase leading-tight text-white md:text-5xl">
              Acceso directo a los principales parques industriales de Zona Norte
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-[#b0b0b0]">
              Relación de trabajo con desarrolladores, cuerpos directivos y administradores.
              Información actualizada de superficies disponibles, valores y beneficios.
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-[#b8252c]" />
            </div>
          ) : emprendimientosIndustriales.length > 0 ? (
            <EmprendimientosIndustrialesCarousel emprendimientos={emprendimientosIndustriales} />
          ) : (
            <p className="text-center text-gray-500">
              No hay emprendimientos industriales disponibles en este momento
            </p>
          )}

          <div className="mt-12 flex justify-center">
            <Link href="/emprendimientos?div=industrial" className="btn-split btn-split-bottom btn-split-wide">
              <span className="btn-text">Ver todos los emprendimientos</span>
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="casos" className="scroll-mt-24 border-b border-[#d8d1c4] bg-[#ebe6dd] py-20">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#6b6660]">
                05 · Casos
              </span>
              <h2 className="mt-3 text-3xl font-medium leading-tight text-[#141414] md:text-5xl">
                Historia de éxito: Seventeen SRL
              </h2>
            </div>

            <article className="rounded-lg border border-[#d8d1c4] bg-white p-8">
              <div className="space-y-5 text-base leading-relaxed text-[#4f4a44]">
                <p>
                  Seventeen SRL es una empresa dedicada a la fabricación de cortinas y
                  accesorios, radicada en la localidad de Munro. Su historia es similar a la de
                  muchas pymes de la Argentina: comenzó en una vivienda, con un único operario y
                  fundador. Con los años, el negocio creció y la empresa necesitó más espacio.
                </p>
                <p>
                  A comienzos de 2023 se encontraban sin lugar donde expandirse, con
                  dificultades operativas y poco espacio en sus depósitos. Se comunicaron con
                  CADEMA y nos plantearon la posibilidad de mudarse a un parque industrial.
                  Coordinamos una entrevista en su planta de Munro para conocer mejor su
                  actividad, necesidades e inquietudes.
                </p>
                <p>
                  Luego de visitas y reuniones, la empresa decidió comprar un terreno en el
                  Parque Industrial Ruta 6, donde hoy está terminando de construir una nave a
                  estrenar, pensada para sus gustos y necesidades.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-4 border-t border-[#d8d1c4] pt-6 sm:grid-cols-3">
                <div>
                  <div className="mb-1 font-mono text-xs uppercase tracking-widest text-[#6b6660]">
                    Empresa
                  </div>
                  <div className="font-semibold text-[#141414]">Seventeen SRL</div>
                </div>
                <div>
                  <div className="mb-1 font-mono text-xs uppercase tracking-widest text-[#6b6660]">
                    Operación
                  </div>
                  <div className="font-semibold text-[#141414]">Compra de terreno</div>
                </div>
                <div>
                  <div className="mb-1 font-mono text-xs uppercase tracking-widest text-[#6b6660]">
                    Ubicación
                  </div>
                  <div className="font-semibold text-[#141414]">Parque Industrial Ruta 6</div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="empresas" className="scroll-mt-24 border-b border-[#d8d1c4] py-20">
        <div className="mx-auto max-w-7xl space-y-20 px-8">
          <LogosCarousel
            logos={empresasRadicadas}
            title="06 · Empresas que radicamos"
            subtitle="Empresas que confiaron en Cadema Industrias"
          />
          <LogosCarousel
            logos={empresasInstituciones}
            title="06 · Empresas e instituciones con las que trabajamos"
            subtitle="Una red activa para encontrar mejores oportunidades"
          />
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-b border-[#d8d1c4] py-20">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-12 max-w-4xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#6b6660]">
              07 · Preguntas frecuentes
            </span>
            <h2 className="mt-3 text-4xl font-medium leading-tight text-[#141414]">
              Todo lo que conviene saber antes de radicar tu empresa
            </h2>
          </div>
          <AccordionList items={faqItems} />
        </div>
      </section>

      <section className="border-b border-[#d8d1c4] bg-[#C63137] py-20 text-white">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <span className="mb-6 block font-mono text-xs uppercase tracking-widest text-white/80">
                08 · Agendemos una reunión
              </span>
              <h2 className="mb-6 text-4xl font-semibold uppercase leading-tight md:text-6xl">
                Encontremos juntos la opción ideal para tu Empresa
              </h2>
              <div className="space-y-3 text-lg leading-relaxed text-white/90">
                <p>Conocemos el Mercado del Corredor Norte-Oeste.</p>
                <p>Somos socios del Consejo Inmobiliario Argentino Logístico e Industrial (CIALI).</p>
                <p>Poseemos alianzas con los principales parques industriales de la región.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <a
                href="#formulario"
                className="inline-flex items-center justify-center rounded-lg bg-white px-7 py-3 font-semibold uppercase tracking-[0.08em] text-[#C63137] transition hover:bg-gray-100"
              >
                Agendar una reunión
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=5493489517998"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-7 py-3 font-semibold text-white transition hover:bg-white hover:text-[#C63137]"
              >
                WhatsApp directo
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d8d1c4] bg-[#f5f3f0] py-20">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#6b6660]">
              Nuestro Equipo
            </span>
            <h2 className="mt-3 text-4xl font-medium leading-tight text-[#141414]">
              Especialistas en real estate industrial y logístico
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {team.map((person) => (
              <article key={person.name} className="text-center">
                <div className="mx-auto mb-6 h-64 w-64 max-w-full overflow-hidden rounded-full bg-white">
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={256}
                    height={256}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-[#141414]">{person.name}</h3>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#6b6660]">
                  {person.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="formulario" className="scroll-mt-24 border-b border-[#d8d1c4] bg-[#f4f1ec] py-20">
        <div className="mx-auto max-w-6xl px-8">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[#6b6660]">
              Consúltenos
            </span>
            <h2 className="mt-3 text-4xl font-medium leading-tight text-[#141414]">
              Contanos qué necesita tu empresa
            </h2>
          </div>

          <div className="rounded-lg border border-[#d8d1c4] bg-white p-4 md:p-8">
            <iframe
              title="Formulario de consulta industrias"
              width="100%"
              height="620"
              frameBorder="0"
              style={{ border: 0 }}
              src="https://link.ventux.io/widget/form/GWRG5jg8hqV4zcVjh6f1"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </main>
  );
}
