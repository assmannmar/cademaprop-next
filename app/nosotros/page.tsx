"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./nosotros.css";
import ContactoSection from "@/app/components/contacto/ContactoSection";

type StatItemProps = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

function CountUpStat({
  value,
  label,
  prefix = "",
  suffix = "",
  duration = 1200,
}: StatItemProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased =
        1 - Math.pow(1 - progress, 3); // easeOutCubic

      const currentValue = Math.floor(start + (value - start) * eased);
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [started, value, duration]);

  const formatted = count.toLocaleString("es-AR");

  return (
    <div className="nosotros-stat" ref={ref}>
      <div className="nosotros-stat-number">
        {prefix}
        {formatted}
        {suffix}
      </div>
      <div className="nosotros-stat-label">{label}</div>
    </div>
  );
}


const valores = [
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Confianza',
      description: 'Construimos relaciones duraderas basadas en la transparencia y honestidad.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      title: 'Profesionalismo',
      description: 'Respaldamos cada operación con más de 60 años de experiencia y conocimiento del mercado.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Innovación',
      description: 'Aplicamos tecnología y nuevas ideas para estar siempre un paso adelante'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
      ),
      title: 'Compromiso',
      description: 'Nos dedicamos a superar las expectativas de nuestros clientes.'
    }
  ];


type Service = {
  title: string;
  description: string;
  image: string;
  cta: string;
  href: string;
};

const services: Service[] = [
  {
    title: "Propuestas Comerciales",
    description:
      "Diseñamos estrategias de comercialización a medida para cada propiedad o desarrollo, priorizando posicionamiento, claridad y resultados.",
    image: "/nosotros/serv-1.jpg",
    cta: "Solicitar propuesta",
    href: "/contacto",
  },
  {
    title: "Informes de Mercado",
    description:
      "Analizamos contexto, oferta, demanda y valores de referencia para ayudarte a tomar decisiones comerciales con información real.",
    image: "/nosotros/serv-2.jpg",
    cta: "Consultar informe",
    href: "/contacto",
  },
  {
    title: "Tasaciones",
    description:
      "Realizamos tasaciones profesionales con criterio comercial, conocimiento territorial y enfoque estratégico para cada operación.",
    image: "/nosotros/serv-3.jpg",
    cta: "Pedir tasación",
    href: "/tasar-vender",
  },
  {
    title: "Visitas",
    description:
      "Coordinamos recorridos con asesoramiento personalizado, cuidando la experiencia del cliente y la correcta presentación del inmueble.",
    image: "/nosotros/serv-4.jpg",
    cta: "Agendar visita",
    href: "/contacto",
  },
  {
    title: "Marketing",
    description:
      "Potenciamos cada propiedad con contenido, pauta, difusión y recursos visuales pensados para destacar y acelerar oportunidades.",
    image: "/nosotros/serv-5.jpg",
    cta: "Ver cómo trabajamos",
    href: "/contacto",
  },
];

function ServicesAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="services-accordion">
      {services.map((service, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={service.title}
            className={`service-panel ${isActive ? "active" : ""}`}
            onClick={() => setActiveIndex(index)}
            role="button"
            tabIndex={0}
            aria-expanded={isActive}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveIndex(index);
              }
            }}
          >
            <div
              className="service-bg"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${service.image}')`,
              }}
            />

            <div className="service-overlay">
              <div className="service-top">
                <h3>{service.title}</h3>
              </div>

              <div className="service-content">
                <p>{service.description}</p>

                <Link
                  href={service.href}
                  className="service-cta"
                  onClick={(e) => e.stopPropagation()}
                >
                  {service.cta}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function NosotrosPage() {
  return (
    <>
      <main className="nosotros-page">
        <section
          className="nosotros-hero"
          style={{
            backgroundImage: "url('/nosotros/hero-nosotros.jpg')",
          }}
        >
          <div className="nosotros-hero-overlay" />

          <div className="nosotros-hero-inner">
            <h1>NOSOTROS</h1>
          </div>
        </section>

        <section className="nosotros-intro">
          <div className="nosotros-intro-wrap">
            <div className="nosotros-intro-image">
              <img src="/nosotros/cadema-oficina.jpg" alt="Cadema Bienes Raíces" />
            </div>

            <div className="nosotros-intro-card">
              <h2>¿Quiénes Somos?</h2>

              <p>
                En Cadema Bienes Raíces, nuestra prioridad es lograr una síntesis
                equilibrada entre las necesidades del comprador y los requerimientos
                del vendedor. Cada operación es una oportunidad para crear valor y
                satisfacción para las partes, construyendo hogares, impulsando
                inversiones y cumpliendo sueños.
              </p>

              <p>
                Nos destacamos por construir relaciones sólidas y duraderas,
                basadas en la transparencia, la confianza y la eficiencia.
              </p>

              <p>
                Con más de seis décadas de experiencia, nos enorgullece ser la
                empresa líder del mercado inmobiliario del Corredor Norte conformado 
                por las ciudades de Campana, Zárate y Exaltación de la Cruz.
                Especializados en venta de inmuebles y desarrollos urbanos e
                industriales, hemos marcado nuestro camino con dedicación y
                excelencia, combinando trayectoria con una búsqueda constante de
                innovación.
              </p>

              <p>Bienvenidos a Cadema Bienes Raíces.</p>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="nosotros-values">
          <div className="nosotros-values-container">
            <div className="nosotros-values-head">
              <h2>Nuestros Valores</h2>
              <p>
                Los principios que guían cada una de nuestras acciones.
              </p>
            </div>

            <div className="nosotros-values-grid">
              {valores.map((valor, idx) => (
                <article key={idx} className="nosotros-value-card">
                  <div className="nosotros-value-icon">
                    {valor.icon}
                  </div>

                  <h3>{valor.title}</h3>

                  <p>{valor.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>


        <section className="nosotros-stats-section">
          <div className="nosotros-stats">
            <CountUpStat value={500} label="PROPIEDADES VENDIDAS EL ÚLTIMO AÑO" prefix="+" />
            <CountUpStat value={2000} label="CONSULTAS MENSUALES GENERADAS" prefix="+" />
            <CountUpStat value={80000} label="CLIENTES EN CARTERA" prefix="+" />
            <CountUpStat value={20} label="DESARROLLOS EN CARTERA" prefix="+" />
          </div>
        </section>

        <section className="nosotros-services">
          <div className="nosotros-services-head">
            <h2>Servicios</h2>
            <p>
              Contamos con equipos especializados para brindar una experiencia
              inmobiliaria completa.
            </p>
          </div>

          <ServicesAccordion />
        </section>

        <ContactoSection
          showHero={false}
          title="Hablemos"
          subtitle="Nuestro equipo está para ayudarte."
        />
      </main>

    </>
  );
}