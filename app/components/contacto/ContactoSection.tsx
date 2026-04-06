import "./contacto-section.css";
import {
  MapPin,
  Phone,
  Mail,
  HeartPlus,
  MessageCircleCheck,
} from "lucide-react";

type Office = {
  name: string;
  address: string;
  phone: string;
  whatsapp?: string;
  email: string;
  instagram: string;
  mapEmbedUrl: string;
  image: string;
};

const offices: Office[] = [
  {
    name: "Casa Central",
    address: "Av. Varela 420, Campana, Buenos Aires, Argentina",
    phone: "+54 9 3489 36-8518",
    whatsapp: "+54 9 3489 36-8518",
    email: "info@cademaprop.com.ar",
    instagram: "@cadema_bienesraices",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Av.%20Varela%20420%2C%20Campana%2C%20Buenos%20Aires&output=embed",
    image: "img/oficinas/oficina-campana.jpg",
  },
  {
    name: "Oficina Zárate",
    address: "Dirección de ejemplo, Zárate, Buenos Aires, Argentina",
    phone: "+54 9 3487 00-0000",
    whatsapp: "+54 9 3487 00-0000",
    email: "zarate@cademaprop.com.ar",
    instagram: "@cadema_bienesraices",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Z%C3%A1rate%2C%20Buenos%20Aires%2C%20Argentina&output=embed",
    image: "img/oficinas/oficina-zarate.jpg",
  },
  {
    name: "Oficina Industrias",
    address: "Dirección de ejemplo, Campana, Buenos Aires, Argentina",
    phone: "+54 9 3489 00-0000",
    whatsapp: "+54 9 3489 00-0000",
    email: "industrias@cademaprop.com.ar",
    instagram: "@cadema_bienesraices",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Campana%2C%20Buenos%20Aires%2C%20Argentina&output=embed",
    image: "img/oficinas/oficina-industria.jpg",
  },
];

type ContactoSectionProps = {
  showHero?: boolean;
  title?: string;
  subtitle?: string;
};

export default function ContactoSection({
  showHero = true,
  title = "Contacto",
  subtitle = "",
}: ContactoSectionProps) {
  return (
    <section className="contact-section">
      {showHero && (
        <section
          className="contact-hero"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/carousel/2.jpg')",
          }}
        >
          <div className="contact-hero__content container-cadema">
            <h1 className="contact-hero__title">{title}</h1>
            <p className="contact-hero__text">{subtitle}</p>
          </div>
        </section>
      )}

      <section className="contact-offices-section">
        <div className="container-cadema">
          <div className="section-heading">
            <span className="section-heading__kicker">Nuestras oficinas</span>
            <p>
              Contamos con distintos puntos de atención para brindarte una
              atención cercana, profesional y personalizada.
            </p>
          </div>

          <div className="offices-grid">
            {offices.map((office) => (
              <article className="office-card" key={office.name}>
                <div className="office-card__image-wrap">
                  <img
                    src={office.image}
                    alt={office.name}
                    className="office-card__image"
                  />
                </div>

                <div className="office-card__top">
                  <h3>{office.name}</h3>
                  <div className="office-card__divider" />

                  <div className="office-info-list">
                    <div className="office-info-row">
                      <MapPin size={18} strokeWidth={1.6} />
                      <span>{office.address}</span>
                    </div>

                    <div className="office-info-row">
                      <Phone size={18} strokeWidth={1.6} />
                      <a href={`tel:${office.phone.replace(/\s/g, "")}`}>
                        {office.phone}
                      </a>
                    </div>

                    {office.whatsapp && (
                      <div className="office-info-row">
                        <MessageCircleCheck size={18} strokeWidth={1.6} />
                        <a
                          href={`https://wa.me/${office.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {office.whatsapp}
                        </a>
                      </div>
                    )}

                    <div className="office-info-row">
                      <Mail size={18} strokeWidth={1.6} />
                      <a href={`mailto:${office.email}`}>{office.email}</a>
                    </div>

                    <div className="office-info-row">
                      <HeartPlus size={18} strokeWidth={1.6} />
                      <a
                        href="https://www.instagram.com/cadema_bienesraices/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {office.instagram}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="office-card__map">
                  <iframe
                    src={office.mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    title={`Mapa de ${office.name}`}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="container-cadema">
          <div className="contact-form-wrap">
            <div className="contact-form-copy">
              <span className="section-heading__kicker">Escribinos</span>
              <h2>Coordinemos tu consulta</h2>
              <p>
                Completá el formulario y nuestro equipo se pondrá en contacto a
                la brevedad para ayudarte según tu necesidad.
              </p>
            </div>

            <div className="contact-form-card">
              <form className="contact-form">
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name">Nombre y apellido</label>
                    <input id="name" type="text" placeholder="Tu nombre" />
                  </div>

                  <div className="form-field">
                    <label htmlFor="phone">Teléfono</label>
                    <input id="phone" type="tel" placeholder="Tu teléfono" />
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" placeholder="Tu email" />
                  </div>

                  <div className="form-field">
                    <label htmlFor="office">Sucursal de interés</label>
                    <select id="office" defaultValue="">
                      <option value="" disabled>
                        Seleccionar sucursal
                      </option>
                      {offices.map((office) => (
                        <option key={office.name} value={office.name}>
                          {office.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field form-field--full">
                    <label htmlFor="message">Mensaje</label>
                    <textarea
                      id="message"
                      rows={6}
                      placeholder="Escribí tu consulta"
                    />
                  </div>
                </div>

                <button type="submit" className="contact-submit-btn">
                  Enviar consulta
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}