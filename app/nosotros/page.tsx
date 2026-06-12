"use client";

import ContactoSection from "@/app/components/contacto/ContactoSection";
import {
  NosotrosIntro,
  NosotrosServicesSection,
  NosotrosStatsSection,
  NosotrosValuesSection,
} from "@/app/components/nosotros/NosotrosSections";
import "./nosotros.css";

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

        <NosotrosIntro />
        <NosotrosValuesSection />
        <NosotrosStatsSection />
        <NosotrosServicesSection />

        <ContactoSection
          showHero={false}
          title="Hablemos"
          subtitle="Nuestro equipo está para ayudarte."
        />
      </main>
    </>
  );
}
