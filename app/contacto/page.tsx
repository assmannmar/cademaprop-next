import "./contacto.css";

type Office = {
  name: string;
  address: string;
  phone: string;
  whatsapp?: string;
  email: string;
  instagram: string;
  mapEmbedUrl: string;
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
  },
];

export default function ContactoPage() {
  return (
    <main className="contact-page">
      {/* HERO */}
      <section
        className="contact-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.42), rgba(0,0,0,0.42)), url('/carousel/2.jpg')",
        }}
      >
        <div className="contact-hero__content container-cadema">
          <h1 className="contact-hero__title">Contacto</h1>
        </div>
      </section>

      {/* SUCURSALES */}
      <section className="contact-offices-section">
        <div className="container-cadema">
          <div className="section-heading">
            <span className="section-heading__kicker">Nuestras oficinas</span>
            <h2>Elegí la sucursal más cercana</h2>
            <p>
              Contamos con distintos puntos de atención para brindarte una
              atención cercana, profesional y personalizada.
            </p>
          </div>

          <div className="offices-grid">
            {offices.map((office) => (
              <article className="office-card" key={office.name}>
                <div className="office-card__top">
                  <h3>{office.name}</h3>

                  <div className="office-info-list">
                    <div className="office-info-item">
                      <span className="office-info-item__label">Dirección</span>
                      <p>{office.address}</p>
                    </div>

                    <div className="office-info-item">
                      <span className="office-info-item__label">Teléfono</span>
                      <a href={`tel:${office.phone.replace(/\s/g, "")}`}>
                        {office.phone}
                      </a>
                    </div>

                    {office.whatsapp && (
                      <div className="office-info-item">
                        <span className="office-info-item__label">WhatsApp</span>
                        <a
                          href={`https://wa.me/${office.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {office.whatsapp}
                        </a>
                      </div>
                    )}

                    <div className="office-info-item">
                      <span className="office-info-item__label">Email</span>
                      <a href={`mailto:${office.email}`}>{office.email}</a>
                    </div>

                    <div className="office-info-item">
                      <span className="office-info-item__label">Instagram</span>
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

      {/* FORMULARIO */}
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

              <ul className="contact-form-benefits">
                <li>Atención personalizada</li>
                <li>Respuesta clara y profesional</li>
                <li>Asesoramiento comercial y técnico</li>
              </ul>
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
                    <label htmlFor="subject">Motivo de consulta</label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Contanos brevemente el motivo"
                    />
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
    </main>
  );
}