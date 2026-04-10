"use client";

import { useEffect, useRef } from 'react';

export default function VentuxForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    if (typeof window === 'undefined') return;
    
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src = "https://link.ventux.io/widget/form/ucy1LfDZBfGuZJOStMqg";
    iframe.style.cssText = "display:block;width:100%;height:560px;border:none;border-radius:3px";
    iframe.id = "inline-ucy1LfDZBfGuZJOStMqg";
    
    iframe.setAttribute('data-layout', JSON.stringify({ id: 'INLINE' }));
    iframe.setAttribute('data-trigger-type', 'alwaysShow');
    iframe.setAttribute('data-trigger-value', '');
    iframe.setAttribute('data-activation-type', 'alwaysActivated');
    iframe.setAttribute('data-activation-value', '');
    iframe.setAttribute('data-deactivation-type', 'neverDeactivate');
    iframe.setAttribute('data-deactivation-value', '');
    iframe.setAttribute('data-form-name', 'Form Web General');
    iframe.setAttribute('data-height', '560');
    iframe.setAttribute('data-layout-iframe-id', 'inline-ucy1LfDZBfGuZJOStMqg');
    iframe.setAttribute('data-form-id', 'ucy1LfDZBfGuZJOStMqg');
    iframe.title = "Form Web General";

    iframeRef.current = iframe;
    container.appendChild(iframe);

    if (!document.querySelector('script[src*="form_embed.js"]')) {
      const script = document.createElement('script');
      script.src = "https://link.ventux.io/js/form_embed.js";
      script.async = true;
      script.onload = () => { scriptLoadedRef.current = true; };
      script.onerror = () => { console.error('Error loading Ventux script'); };
      document.body.appendChild(script);
    } else {
      scriptLoadedRef.current = true;
    }

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
      className="ventux-form-container w-full min-h-[560px] bg-transparent"
      style={{ minHeight: '560px' }}
    />
  );
}