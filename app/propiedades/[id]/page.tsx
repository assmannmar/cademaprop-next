'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import './propiedad.css';

interface Property {
  id: number;
  publication_title?: string;
  address?: string;
  fake_address?: string;
  description?: string;
  rich_description?: string;
  location?: {
    name: string;
    short_location?: string;
    full_location?: string;
  };
  geo_lat?: string;
  geo_long?: string;
  operations?: Array<{
    operation_type: string;
    prices?: Array<{
      price: number;
      currency: string;
      web_price?: boolean;
    }>;
  }>;
  type?: { name: string };
  development?: {
    type?: { name: string };
  };
  suite_amount?: number;
  room_amount?: number;
  bathroom_amount?: number;
  toilet_amount?: number;
  parking_lot_amount?: number;
  surface?: number;
  roofed_surface?: number;
  total_surface?: number;
  front_measure?: string;
  depth_measure?: string;
  age?: number;
  orientation?: string;
  disposition?: string;
  credit_eligible?: string;
  expenses?: number;
  photos?: Array<{
    image: string;
    original?: string;
    description?: string;
    is_blueprint?: boolean;
    is_front_cover?: boolean;
  }>;
  videos?: Array<{
    player_url: string;
    title?: string;
  }>;
  tags?: Array<{ name: string }>;
  custom_tags?: Array<{ name: string; group_name?: string }>;
  branch?: {
    name: string;
    phone?: string;
    phone_area?: string;
    email?: string;
    address?: string;
  };
}

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [currentUrl, setCurrentUrl] = useState('');
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, selectedImage, property]);

  const fetchProperty = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Error al cargar la propiedad');

      const data = await response.json();
      const foundProperty = data.objects.find((p: Property) => p.id === parseInt(id as string));

      if (!foundProperty) throw new Error('Propiedad no encontrada');

      setProperty(foundProperty);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const translateOperationType = (type: string) => {
    const translations: Record<string, string> = {
      Sale: 'Venta',
      Rental: 'Alquiler',
      'Temporary Rental': 'Alquiler Temporal',
    };
    return translations[type] || type;
  };

  const translatePropertyType = (type: string) => {
    const translations: Record<string, string> = {
      House: 'Casa',
      'Weekend House': 'Casa de Fin de Semana',
      Apartment: 'Departamento',
      Land: 'Terreno',
      Commercial: 'Comercial',
      Office: 'Oficina',
      Building: 'Edificio',
      PH: 'PH',
      'Industrial Ship': 'Nave Industrial',
    };
    return translations[type] || type;
  };

  const translateOrientation = (orientation: string) => {
    const translations: Record<string, string> = {
      North: 'Norte',
      South: 'Sur',
      East: 'Este',
      West: 'Oeste',
      Northeast: 'Noreste',
      Northwest: 'Noroeste',
      Southeast: 'Sudeste',
      Southwest: 'Sudoeste',
    };
    return translations[orientation] || orientation;
  };

  const translateCreditEligible = (credit: string) => {
    const translations: Record<string, string> = {
      Eligible: 'Sí',
      'Not specified': 'No',
      Yes: 'Sí',
      No: 'No',
    };
    return translations[credit] || credit;
  };

  const formatCurrency = (currency?: string) => {
    if (!currency) return 'U$S';
    if (currency.toUpperCase() === 'USD') return 'U$S';
    return currency;
  };

  const formatNumber = (value?: number | string, decimals = 0) => {
    if (value === undefined || value === null || value === '') return null;
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    return num.toLocaleString('es-AR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const photos = useMemo(
    () => property?.photos?.filter((p) => !p.is_blueprint) || [],
    [property]
  );

  const blueprints = useMemo(
    () => property?.photos?.filter((p) => p.is_blueprint) || [],
    [property]
  );

  const nextImage = () => {
    if (photos.length <= 1) return;
    setSelectedImage((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (photos.length <= 1) return;
    setSelectedImage((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (photos.length <= 1 || autoplayPaused || isFullscreen) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [photos.length, autoplayPaused, isFullscreen]);

  if (loading) {
    return (
      <div className="property-page-loading">
        <div className="property-page-loading__spinner" />
        <p>Cargando propiedad...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-page-error">
        <h1>Propiedad no encontrada</h1>
        <p>{error}</p>
        <Link href="/propiedades" className="property-page-error__button">
          Volver a Propiedades
        </Link>
      </div>
    );
  }

  const mainOperation = property.operations?.[0];
  const webPrice = mainOperation?.prices?.find((p) => p.web_price);
  const price = webPrice?.price || mainOperation?.prices?.[0]?.price;
  const currency = webPrice?.currency || mainOperation?.prices?.[0]?.currency || 'USD';
  const operationType = translateOperationType(mainOperation?.operation_type || '');

  const propertyType = translatePropertyType(
    property.development?.type?.name || property.type?.name || 'Propiedad'
  );

  const displayAddress = property.fake_address || property.address || 'Consultar ubicación';
  const totalRooms = (property.room_amount || 0) + (property.suite_amount || 0);

  const isCreditEligible =
    property.credit_eligible === 'Eligible' ||
    property.credit_eligible === 'Yes' ||
    property.tags?.some((tag) => tag.name.toLowerCase().includes('credit')) ||
    property.custom_tags?.some((tag) => tag.name.toLowerCase().includes('crédito'));

  const description = property.rich_description || property.description || null;
  const heroImage = photos[0]?.original || photos[0]?.image || '';
  const title =
    property.publication_title ||
    `${propertyType} en ${operationType}${property.location?.name ? ` - ${property.location.name}` : ''}`;

  const specs = [
    totalRooms > 0 ? { label: 'Amb', value: totalRooms } : null,
    property.bathroom_amount ? { label: 'Baños', value: property.bathroom_amount } : null,
    property.parking_lot_amount && property.parking_lot_amount > 0
      ? { label: 'Cochera', value: property.parking_lot_amount }
      : null,
    property.surface ? { label: 'Terreno', value: `${formatNumber(property.surface)} m²` } : null,
    property.roofed_surface
      ? { label: 'Cubiertos', value: `${formatNumber(property.roofed_surface)} m²` }
      : null,
    property.age !== undefined && property.age !== null
      ? { label: 'Antigüedad', value: `${property.age} años` }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string | number }>;

  const detailRows = [
    { label: 'ID del inmueble', value: property.id },
    { label: 'Tipo de inmueble', value: propertyType },
    { label: 'Tipo de operación', value: operationType || '-' },
    price ? { label: 'Precio', value: `${formatCurrency(currency)} ${formatNumber(price)}` } : null,
    property.roofed_surface
      ? { label: 'Superficie cubierta', value: `${formatNumber(property.roofed_surface)} m²` }
      : null,
    property.surface
      ? { label: 'Superficie terreno', value: `${formatNumber(property.surface)} m²` }
      : null,
    property.total_surface
      ? { label: 'Superficie total', value: `${formatNumber(property.total_surface)} m²` }
      : null,
    property.front_measure && parseFloat(property.front_measure) > 0
      ? { label: 'Frente', value: `${formatNumber(property.front_measure)} m` }
      : null,
    property.depth_measure && parseFloat(property.depth_measure) > 0
      ? { label: 'Fondo', value: `${formatNumber(property.depth_measure)} m` }
      : null,
    property.orientation
      ? { label: 'Orientación', value: translateOrientation(property.orientation) }
      : null,
    property.disposition ? { label: 'Disposición', value: property.disposition } : null,
    property.age !== undefined && property.age !== null
      ? { label: 'Antigüedad', value: `${property.age} años` }
      : null,
    property.credit_eligible
      ? { label: 'Apto crédito', value: translateCreditEligible(property.credit_eligible) }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string | number }>;

  return (
    <>
      <div className="property-page">
        <section className="property-hero">
          {heroImage && (
            <img
              src={heroImage}
              alt={title}
              className="property-hero__bg"
            />
          )}

          <div className="property-hero__overlay" />
          <div className="property-hero__gradient" />

          <div className="property-hero__inner container-property">
            <div className="property-hero__content">
              <div className="property-hero__badges">
                <span className="property-badge">
                  {propertyType} en {operationType}
                </span>

                {isCreditEligible && (
                  <span className="property-badge property-badge--credit">
                    Apto crédito
                  </span>
                )}
              </div>

              <h1 className="property-hero__title">{title}</h1>

              <div className="property-hero__location">
                <span className="property-hero__location-icon">⌖</span>
                <span>{displayAddress}</span>
              </div>

              {specs.length > 0 && (
                <div className="property-hero__specs">
                  {specs.map((item) => (
                    <div className="property-hero__spec" key={item.label}>
                      <span className="property-hero__spec-value">{item.value}</span>
                      <span className="property-hero__spec-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="property-hero__bottom">
                <div className="property-price-card">
                  <span className="property-price-card__label">Precio</span>
                  {price && price > 0 ? (
                    <strong className="property-price-card__value">
                      {formatCurrency(currency)} {formatNumber(price)}
                    </strong>
                  ) : (
                    <strong className="property-price-card__value">
                      Consultar precio
                    </strong>
                  )}
                </div>

                <a href="#consulta" className="property-hero__cta">
                  Consultar propiedad
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="property-gallery-wrap container-property">
          <div
            className="property-gallery"
            onMouseEnter={() => setAutoplayPaused(true)}
            onMouseLeave={() => setAutoplayPaused(false)}
          >
            <div className="property-gallery__header">
              <div>
                <span className="property-section-kicker">Galería</span>
                <h2 className="property-section-title">Recorré la propiedad</h2>
              </div>

              {photos.length > 1 && (
                <div className="property-gallery__nav">
                  <button onClick={prevImage} aria-label="Imagen anterior">
                    ‹
                  </button>
                  <button onClick={nextImage} aria-label="Imagen siguiente">
                    ›
                  </button>
                </div>
              )}
            </div>

            {photos.length > 0 && (
              <>
                <button
                  type="button"
                  className="property-gallery__main"
                  onClick={() => setIsFullscreen(true)}
                >
                  <img
                    src={photos[selectedImage]?.image}
                    alt={photos[selectedImage]?.description || title}
                  />
                  <span className="property-gallery__counter">
                    {selectedImage + 1} / {photos.length}
                  </span>
                </button>

                {photos.length > 1 && (
                  <div className="property-gallery__thumbs">
                    {photos.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`property-gallery__thumb ${
                          selectedImage === idx ? 'is-active' : ''
                        }`}
                        onClick={() => setSelectedImage(idx)}
                      >
                        <img src={photo.image} alt={`Miniatura ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="property-main container-property">
          <div className="property-main__grid">
            <div className="property-main__content">
              <div className="property-card">
                <div className="property-breadcrumb">
                  <Link href="/">Inicio</Link>
                  <span>/</span>
                  <Link href="/propiedades">Propiedades</Link>
                  <span>/</span>
                  <span>#{property.id}</span>
                </div>

                {description && (
                  <div className="property-block">
                    <h2 className="property-block__title">Descripción</h2>
                    <div
                      className="property-description"
                      dangerouslySetInnerHTML={{
                        __html: property.rich_description || description.replace(/\n/g, '<br />'),
                      }}
                    />
                  </div>
                )}

                <div className="property-features-box">
                  <h3 className="property-block__subtitle">Características</h3>

                  <div className="property-features-grid">
                    {detailRows.map((item) => (
                      <div className="property-feature-row" key={item.label}>
                        <span className="property-feature-row__label">{item.label}</span>
                        <span className="property-feature-row__value">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {property.tags && property.tags.length > 0 && (
                    <div className="property-tags">
                      {property.tags.map((tag, idx) => (
                        <span key={idx} className="property-tag">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {property.geo_lat && property.geo_long && (
                <div className="property-card">
                  <div className="property-block">
                    <h2 className="property-block__title">Ubicación</h2>
                    <div className="property-map">
                      <iframe
                        width="100%"
                        height="420"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps?q=${property.geo_lat},${property.geo_long}&z=15&output=embed`}
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              )}

              {blueprints.length > 0 && (
                <div className="property-card">
                  <div className="property-block">
                    <h2 className="property-block__title">Planos</h2>
                    <div className="property-blueprints">
                      {blueprints.map((blueprint, idx) => (
                        <img
                          key={idx}
                          src={blueprint.image}
                          alt={`Plano ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {property.videos && property.videos.length > 0 && (
                <div className="property-card">
                  <div className="property-block">
                    <h2 className="property-block__title">Videos</h2>
                    <div className="property-videos">
                      {property.videos.map((video, idx) => (
                        <iframe
                          key={idx}
                          src={video.player_url}
                          className="property-video-frame"
                          allowFullScreen
                          title={video.title || `Video ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <aside className="property-main__sidebar">
              <div className="property-contact-card" id="consulta">
                {isCreditEligible && (
                  <div className="property-contact-card__badge">
                    Apto crédito
                  </div>
                )}

                <div className="property-contact-card__price">
                  <span>Precio</span>
                  {price && price > 0 ? (
                    <strong>
                      {formatCurrency(currency)} {formatNumber(price)}
                    </strong>
                  ) : (
                    <strong>Consultar precio</strong>
                  )}
                </div>

                <div className="property-contact-card__form">
                  <h3>Dejanos tu consulta</h3>

                  <div className="property-contact-card__form-embed">
                    <div
                      id="polite-slide-in-right-OWI77RP94NZkMNa4BIaz"
                      className="ventux-container"
                      data-layout='{"id":"POLITE_SLIDE_IN","minimizedTitle":"","isLeftAligned":false,"isRightAligned":true,"allowMinimize":false}'
                      data-trigger-type="alwaysShow"
                      data-activation-type="alwaysActivated"
                      data-form-name={`Propiedad ${property.fake_address || property.id}`}
                      data-form-id="OWI77RP94NZkMNa4BIaz"
                      data-source={currentUrl}
                    />
                  </div>
                </div>

                {property.branch && (
                  <div className="property-contact-card__branch">
                    <h4>{property.branch.name}</h4>
                    {property.branch.address && <p>📍 {property.branch.address}</p>}
                    {property.branch.phone && (
                      <p>
                        📞 {property.branch.phone_area ? `(${property.branch.phone_area}) ` : ''}
                        {property.branch.phone}
                      </p>
                    )}
                    {property.branch.email && <p>✉️ {property.branch.email}</p>}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

        {isFullscreen && photos.length > 0 && (
          <div
            className="property-lightbox"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              className="property-lightbox__close"
              onClick={() => setIsFullscreen(false)}
              aria-label="Cerrar"
            >
              ×
            </button>

            <img
              src={photos[selectedImage]?.image}
              alt={photos[selectedImage]?.description || title}
              className="property-lightbox__image"
              onClick={(e) => e.stopPropagation()}
            />

            {photos.length > 1 && (
              <>
                <button
                  className="property-lightbox__nav property-lightbox__nav--prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>

                <button
                  className="property-lightbox__nav property-lightbox__nav--next"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Imagen siguiente"
                >
                  ›
                </button>
              </>
            )}

            <div className="property-lightbox__counter">
              {selectedImage + 1} / {photos.length}
            </div>
          </div>
        )}

        <Script
          src="https://link.ventux.io/js/form_embed.js"
          strategy="afterInteractive"
          onLoad={() => {
            // @ts-ignore
            if (window.initVentux) window.initVentux();
          }}
        />
      </div>
    </>
  );
}