"use client";

import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Camera,
  ChevronDown,
  CircleHelp,
  FileText,
  Handshake,
  Megaphone,
  MessageSquareMore,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import "./tasar.css";

const processSteps = [
  {
    icon: Search,
    title: "Tasación estratégica",
    text: "Analizamos tu propiedad y el mercado para definir un valor competitivo, realista y defendible.",
  },
  {
    icon: Camera,
    title: "Preparación comercial",
    text: "Trabajamos la presentación del inmueble para mostrarlo con el mejor enfoque posible desde el inicio.",
  },
  {
    icon: Megaphone,
    title: "Difusión inteligente",
    text: "Publicamos en canales estratégicos y activamos acciones para darle visibilidad frente al público adecuado.",
  },
  {
    icon: Users,
    title: "Gestión de interesados",
    text: "Filtramos consultas, coordinamos visitas y hacemos seguimiento profesional de cada oportunidad.",
  },
  {
    icon: Handshake,
    title: "Negociación y cierre",
    text: "Te acompañamos en ofertas, contraofertas, documentación y cada instancia hasta concretar la operación.",
  },
];

const differentials = [
  {
    icon: BarChart3,
    title: "Tasación con criterio",
    text: "No trabajamos a ciegas ni inflamos valores para captar. Buscamos una estrategia real para vender mejor.",
  },
  {
    icon: MessageSquareMore,
    title: "Comunicación clara",
    text: "Mantenemos un seguimiento ordenado para que sepas qué está pasando en cada etapa del proceso.",
  },
  {
    icon: ShieldCheck,
    title: "Acompañamiento profesional",
    text: "Desde la primera reunión hasta el cierre, trabajamos con seriedad, método y atención personalizada.",
  },
  {
    icon: BadgeCheck,
    title: "Enfoque en resultados",
    text: "Cada propiedad necesita una estrategia comercial propia para mejorar su posicionamiento y acelerar la venta.",
  },
];

const faqs = [
  {
    question: "¿La tasación tiene costo?",
    answer:
      "No. La tasación es sin costo y sin compromiso. Buscamos darte una visión clara del valor de tu propiedad y orientarte sobre el mejor camino para venderla.",
  },
  {
    question: "¿Cómo determinan el valor de mi propiedad?",
    answer:
      "No nos basamos solo en precios publicados. Analizamos características del inmueble, ubicación, oferta comparable y comportamiento real del mercado.",
  },
  {
    question: "¿Cuánto tiempo tarda en venderse una propiedad?",
    answer:
      "Depende del precio, la demanda y la estrategia comercial. Una propiedad bien posicionada desde el inicio suele generar mejores consultas en menos tiempo.",
  },
  {
    question: "¿Tengo que firmar exclusividad?",
    answer:
      "No siempre. En algunos casos puede ser conveniente para trabajar una estrategia más sólida y ordenada. Lo evaluamos según cada propiedad y situación.",
  },
  {
    question: "¿Qué pasa si mi propiedad no se vende?",
    answer:
      "Hacemos seguimiento del rendimiento, analizamos consultas, visitas y feedback del mercado. Si hace falta, ajustamos estrategia, presentación o posicionamiento.",
  },
  {
    question: "¿Se ocupan de las consultas y visitas?",
    answer:
      "Sí. Nos encargamos de filtrar interesados, coordinar visitas y gestionar el contacto comercial para que vos no tengas que ocuparte de todo.",
  },
  {
    question: "¿Me acompañan hasta la firma?",
    answer:
      "Sí. Te acompañamos desde la tasación inicial hasta la firma, incluyendo negociación, coordinación y asistencia en la documentación.",
  },
  {
    question: "¿Puedo consultar aunque todavía no decidí vender?",
    answer:
      "Por supuesto. Podés solicitar asesoramiento y tasación para evaluar tu situación con información clara, sin compromiso.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-white/15">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base md:text-lg font-medium text-white">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-white/80 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-3xl text-sm md:text-base leading-relaxed text-white/75">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TasarVenderConCademaPage() {
  const [openFaq, setOpenFaq] = useState<number>(0);

  const scrollToForm = () => {
    const formSection = document.getElementById("formulario-contacto");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="bg-white text-neutral-900">
      {/* HERO */}
      <section
        className="relative flex min-h-[72vh] items-end overflow-hidden md:min-h-[82vh]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/carousel/2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-7xl px-5 pb-14 pt-28 md:px-8 md:pb-18 lg:px-12">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white/75">
                Tasar y vender con Cadema
              </p>

              <h1 className="max-w-2xl text-4xl font-semibold uppercase leading-[0.95] text-white md:text-6xl lg:text-7xl">
                Vendé tu propiedad con respaldo profesional
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85 md:text-lg">
                Tasamos, planificamos y acompañamos todo el proceso de venta con
                una estrategia clara, atención personalizada y seguimiento real.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c60c23] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#a80f22]"
                >
                  Solicitar tasación
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="#proceso"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  Conocer el proceso
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.18em] text-white/70 md:text-sm">
                <span>Tasación profesional</span>
                <span>Asesoramiento personalizado</span>
                <span>Conocimiento del mercado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-24">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#c60c23]">
              Una venta bien hecha empieza antes de publicar
            </p>
            <h2 className="max-w-2xl text-3xl font-semibold uppercase leading-tight text-neutral-900 md:text-5xl">
              Vender una propiedad no debería ser una improvisación
            </h2>
          </div>

          <div className="space-y-5 text-base leading-relaxed text-neutral-700">
            <p>
              Muchas veces una propiedad no se vende por falta de demanda, sino
              por una mala estrategia: precio incorrecto, presentación débil o
              poca llegada al comprador indicado.
            </p>
            <p>
              En Cadema trabajamos con un proceso claro, profesional y
              transparente para que sepas qué hacemos, por qué lo hacemos y cómo
              avanzamos en cada etapa.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" className="bg-[#f7f5f2]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-12 lg:py-24">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#c60c23]">
              Nuestro método de trabajo
            </p>
            <h2 className="text-3xl font-semibold uppercase leading-tight text-neutral-900 md:text-5xl">
              Así trabajamos para vender tu propiedad
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="group rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c60c23]/8 text-[#c60c23]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-neutral-400">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-neutral-900">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                    {step.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* DIFERENCIALES */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-12 lg:py-24">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#c60c23]">
              Por qué elegir Cadema
            </p>
            <h2 className="text-3xl font-semibold uppercase leading-tight text-neutral-900 md:text-5xl">
              Claridad, respaldo y una estrategia pensada para vender mejor
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {differentials.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[30px] border border-neutral-200 bg-[#faf9f7] p-7"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c60c23]/8 text-[#c60c23]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-xl font-semibold text-neutral-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FRASE / REFUERZO */}
      <section className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center md:px-8 lg:px-12 lg:py-24">
          <p className="mx-auto max-w-4xl text-3xl font-semibold uppercase leading-tight md:text-5xl">
            No se trata solo de vender. Se trata de hacerlo bien.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/70 md:text-lg">
            En Cadema entendemos que vender una propiedad es una decisión
            importante. Por eso trabajamos con método, seguimiento y atención
            personalizada en cada paso.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#1d1d1b] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-12 lg:py-24">
          <div className="mb-12 max-w-3xl">
            <div className="mb-4 flex items-center gap-3 text-[#ffffffcc]">
              <CircleHelp className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.24em]">
                Preguntas frecuentes
              </span>
            </div>

            <h2 className="text-3xl font-semibold uppercase leading-tight md:text-5xl">
              Información clara para tomar la decisión con confianza
            </h2>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 px-6 md:px-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onClick={() =>
                  setOpenFaq(openFaq === index ? -1 : index)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section
        id="formulario-contacto"
        className="bg-white scroll-mt-28 md:scroll-mt-32"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 lg:py-24">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#c60c23]">
              Solicitar tasación
            </p>

            <h2 className="text-3xl font-semibold uppercase leading-tight text-neutral-900 md:text-5xl">
              Conocé el valor real de tu propiedad
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-700">
              Completá el formulario y un asesor de Cadema se pondrá en contacto
              para ayudarte a evaluar tu propiedad y orientarte sobre el mejor
              camino para venderla.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Atención personalizada",
                "Respuesta rápida",
                "Esperamos tu consulta",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c60c23]/8 text-[#c60c23]">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-neutral-800 md:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-neutral-200 bg-[#faf9f7] p-4 md:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c60c23]/8 text-[#c60c23]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  Formulario de contacto
                </p>
                <p className="text-xs text-neutral-500">
                  Integración desde Ventux
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-dashed border-neutral-300 bg-white p-6">
              <p className="text-sm leading-relaxed text-neutral-600">
                Reemplazá este bloque por el embed de Ventux.
              </p>

              <div className="mt-4 rounded-2xl bg-neutral-100 p-4 text-xs text-neutral-500">
                {"<!-- Pegá acá el script o iframe de Ventux -->"}
              </div>

              <div className="mt-4 rounded-2xl bg-neutral-950 px-4 py-3 text-sm text-white">
                Ejemplo: formulario integrado para solicitar tasación o iniciar
                proceso de venta.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}