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
    phone: "011 52633031",
    whatsapp: "+54 9 3489 36-8518",
    email: "info@cademaprop.com.ar",
    instagram: "@cademabienesraices",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3027.9099475284183!2d-58.96005257404506!3d-34.16455470453288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bb723638fc8f43%3A0x2c96856a436e54b9!2sCadema%20Bienes%20Ra%C3%ADces!5e0!3m2!1ses-419!2sar!4v1775625611984!5m2!1ses-419!2sar",
    image: "img/oficinas/oficina-campana.jpg",
  },
  {
    name: "Oficina Zárate",
    address: "Av Gallesio 55, Zárate",
    phone: "011 52633031",
    whatsapp: "+54 9 3487 624830",
    email: "info@cademaprop.com.ar",
    instagram: "@cademabienesraices",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9619.81480238391!2d-59.0334292948396!3d-34.10479426596738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bb0bef987e78a9%3A0xcac78c420fff659b!2sCadema%20Bienes%20Ra%C3%ADces%20-%20Oficina%20Z%C3%A1rate!5e0!3m2!1ses-419!2sar!4v1775625556347!5m2!1ses-419!2sar",
    image: "img/oficinas/oficina-zarate.jpg",
  },
  {
    name: "Oficina Industrias",
    address: "Dirección de ejemplo, Campana, Buenos Aires, Argentina",
    phone: "011 52633031",
    whatsapp: "+54 9 3489 517998",
    email: "industrias@cademaprop.com.ar",
    instagram: "@cademaindustrias",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d76736.29718934897!2d-59.02578471843406!3d-34.34833905062533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bb7b0016940f27%3A0xd0d1ffdf59487e32!2sOficina%20Cadema%20Industrias%20en%20Parque%20Industrial%20Ruta%206!5e0!3m2!1ses-419!2sar!4v1775625650857!5m2!1ses-419!2sar",
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