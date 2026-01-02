"use client";

import { useEffect, useRef } from 'react';

export default function VentuxForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Evitar cargas múltiples
    if (scriptLoadedRef.current) return;
    
    // Verificar entorno del navegador
    if (typeof window === 'undefined') return;
    
    const container = containerRef.current;
    if (!container) return;

    // Limpiar contenido previo
    container.innerHTML = '';

    // Crear el iframe con los datos exactos del código original
    const iframe = document.createElement('iframe');
    iframe.src = "https://link.ventux.io/widget/form/M9ZdL9KPgNEykJWnmM3e";
    // Ajustado a height 619px según tu código original
    iframe.style.cssText = "display:block;width:100%;height:610px;border:none;border-radius:3px";
    iframe.id = "inline-OWI77RP94NZkMNa4BIaz";
    
    // Configuración de Layout Inline
    iframe.setAttribute('data-layout', JSON.stringify({
      id: 'INLINE'
    }));
    
    // Atributos de comportamiento
    iframe.setAttribute('data-trigger-type', 'alwaysShow');
    iframe.setAttribute('data-trigger-value', '');
    iframe.setAttribute('data-activation-type', 'alwaysActivated');
    iframe.setAttribute('data-activation-value', '');
    iframe.setAttribute('data-deactivation-type', 'neverDeactivate');
    iframe.setAttribute('data-deactivation-value', '');
    iframe.setAttribute('data-form-name', 'Form Landing - Campo Alto');
    iframe.setAttribute('data-height', '619');
    iframe.setAttribute('data-layout-iframe-id', 'inline-OWI77RP94NZkMNa4BIaz');
    iframe.setAttribute('data-form-id', 'OWI77RP94NZkMNa4BIaz');
    iframe.title = "Form Landing - Campo Alto";

    // Guardar referencia para limpieza
    iframeRef.current = iframe;
    
    // Insertar iframe
    container.appendChild(iframe);

    // Cargar el script de Ventux si no existe
    if (!document.querySelector('script[src*="form_embed.js"]')) {
      const script = document.createElement('script');
      script.src = "https://link.ventux.io/js/form_embed.js";
      script.async = true;
      
      script.onload = () => {
        scriptLoadedRef.current = true;
      };

      script.onerror = () => {
        console.error('Error loading Ventux script');
      };

      document.body.appendChild(script);
    } else {
      scriptLoadedRef.current = true;
    }

    // Función de limpieza al desmontar el componente
    return () => {
      const currentIframe = iframeRef.current;
      const currentContainer = containerRef.current;
      
      if (currentIframe && currentContainer) {
        try {
          if (currentContainer.contains(currentIframe)) {
            currentContainer.removeChild(currentIframe);
          }
        } catch (error) {
          console.debug('Iframe cleanup handled');
        }
      }
      iframeRef.current = null;
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="ventux-form-container w-full min-h-[619px] bg-transparent"
      style={{ minHeight: '619px' }}
    />
  );
}