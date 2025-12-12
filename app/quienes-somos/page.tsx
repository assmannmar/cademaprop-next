"use client";

import Link from 'next/link';
import VentuxForm from '@/app/components/VentuxForm';

export default function QuienesSomosPage() {
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
      description: 'Equipo altamente capacitado con más de 25 años de experiencia en el sector.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Innovación',
      description: 'Utilizamos las últimas tecnologías para brindar el mejor servicio.'
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

  const equipo = [
    { nombre: 'Juan Pérez', cargo: 'Director General', imagen: '/team/rolo.png' },
    { nombre: 'María González', cargo: 'Director General', imagen: '/team/aldo.png' },
    { nombre: 'Carlos Rodríguez', cargo: 'Director General', imagen: '/team/carlos.png' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 -mt-[70px] pt-[70px]">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow-lg">
            Quiénes Somos
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">
            Más de 25 años construyendo confianza y ayudando a familias a encontrar su hogar ideal
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Fundada en 1998, Cadema Prop nació con la visión de transformar la experiencia inmobiliaria en Argentina. Lo que comenzó como una pequeña oficina en Campana, hoy se ha convertido en una de las inmobiliarias más reconocidas de la región.
                </p>
                <p>
                  A lo largo de estos más de 25 años, hemos acompañado a miles de familias en uno de los momentos más importantes de sus vidas: encontrar su hogar. Nuestro compromiso con la excelencia y el servicio personalizado nos ha permitido crecer y consolidarnos en el mercado.
                </p>
                <p>
                  Hoy, contamos con un equipo de profesionales altamente capacitados, tecnología de punta y una cartera diversificada que incluye propiedades residenciales, comerciales e industriales.
                </p>
              </div>
            </div>
            <div className="relative h-96 lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/about-history.jpg"
                alt="Historia Cadema Prop"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada una de nuestras acciones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-gray-100"
              >
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6 mx-auto">
                  {valor.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  {valor.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {valor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Cadema en Números</h2>
            <p className="text-xl text-white/90">
              Nuestra trayectoria habla por sí sola
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold mb-3">25+</div>
              <p className="text-xl text-white/90">Años de experiencia</p>
            </div>
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold mb-3">500+</div>
              <p className="text-xl text-white/90">Propiedades</p>
            </div>
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold mb-3">2000+</div>
              <p className="text-xl text-white/90">Clientes satisfechos</p>
            </div>
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-bold mb-3">15</div>
              <p className="text-xl text-white/90">Agentes expertos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestro Equipo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Profesionales comprometidos con tu éxito
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipo.map((miembro, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <div className="relative h-72 bg-gray-200">
                  <img
                    src={miembro.imagen}
                    alt={miembro.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="20"%3E${miembro.nombre.split(' ')[0]}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {miembro.nombre}
                  </h3>
                  <p className="text-red-600 font-semibold">{miembro.cargo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
            <p className="text-xl text-gray-600">
              Soluciones integrales para todas tus necesidades inmobiliarias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Compra y Venta',
                description: 'Te acompañamos en todo el proceso de compra o venta de tu propiedad.',
                icon: '🏠'
              },
              {
                title: 'Alquileres',
                description: 'Gestión completa de alquileres con garantía y seguimiento.',
                icon: '🔑'
              },
              {
                title: 'Tasaciones',
                description: 'Valuaciones profesionales con certificación oficial.',
                icon: '📊'
              },
              {
                title: 'Asesoramiento',
                description: 'Consultoría experta en inversiones inmobiliarias.',
                icon: '💼'
              },
              {
                title: 'Administración',
                description: 'Gestión integral de propiedades y consorcios.',
                icon: '📋'
              },
              {
                title: 'Desarrollos',
                description: 'Emprendimientos inmobiliarios llave en mano.',
                icon: '🏗️'
              }
            ].map((servicio, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="text-5xl mb-4">{servicio.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {servicio.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {servicio.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Hablamos?</h2>
              <p className="text-xl text-gray-600">
                Estamos listos para ayudarte en lo que necesites
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Teléfono</h3>
                    <p className="text-gray-600">+54 11 1234-5678</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@cademaprop.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Formulario de Contacto
              </h3>
              <VentuxForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Empecemos a trabajar juntos
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Dejá que nuestra experiencia y profesionalismo trabajen para vos
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/propiedades"
              className="px-8 py-4 bg-white text-red-600 hover:bg-gray-100 font-bold rounded-lg shadow-xl transition transform hover:scale-105"
            >
              Ver Propiedades
            </Link>
            <Link
              href="/contacto"
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-red-600 text-white font-bold rounded-lg shadow-xl transition transform hover:scale-105"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}