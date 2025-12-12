"use client";

import { useEffect, useRef } from 'react';

export default function VentuxForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Prevenir múltiples cargas del script
    if (scriptLoadedRef.current) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Crear el iframe
    const iframe = document.createElement('iframe');
    iframe.src = "https://link.ventux.io/widget/form/OWI77RP94NZkMNa4BIaz";
    iframe.style.cssText = "display:none;width:100%;height:100%;border:none;border-radius:3px";
    iframe.id = "polite-slide-in-right-OWI77RP94NZkMNa4BIaz";
    iframe.setAttribute('data-layout', JSON.stringify({
      id: 'POLITE_SLIDE_IN',
      minimizedTitle: '',
      isLeftAligned: false,
      isRightAligned: true,
      allowMinimize: false
    }));
    iframe.setAttribute('data-trigger-type', 'alwaysShow');
    iframe.setAttribute('data-trigger-value', '');
    iframe.setAttribute('data-activation-type', 'alwaysActivated');
    iframe.setAttribute('data-activation-value', '');
    iframe.setAttribute('data-deactivation-type', 'neverDeactivate');
    iframe.setAttribute('data-deactivation-value', '');
    iframe.setAttribute('data-form-name', 'Form Web Inmueble');
    iframe.setAttribute('data-height', '531');
    iframe.setAttribute('data-layout-iframe-id', 'polite-slide-in-right-OWI77RP94NZkMNa4BIaz');
    iframe.setAttribute('data-form-id', 'OWI77RP94NZkMNa4BIaz');
    iframe.title = "Form Web Inmueble";

    // Agregar el iframe al contenedor
    container.appendChild(iframe);

    // Cargar el script de Ventux
    const script = document.createElement('script');
    script.src = "https://link.ventux.io/js/form_embed.js";
    script.async = true;
    
    script.onload = () => {
      scriptLoadedRef.current = true;
    };

    script.onerror = () => {
      console.error('Error al cargar el script de Ventux');
    };

    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (container.contains(iframe)) {
        container.removeChild(iframe);
      }
      // No remover el script ya que puede ser usado por otros formularios
    };
  }, []);

  return <div ref={containerRef} className="ventux-form-container" />;
}