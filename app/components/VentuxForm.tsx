"use client";

import { useEffect, useRef } from 'react';

export default function VentuxForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Prevent multiple loads
    if (scriptLoadedRef.current) return;
    
    // Check for browser environment
    if (typeof window === 'undefined') return;
    
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing content to prevent conflicts
    container.innerHTML = '';

    // Create the iframe
    const iframe = document.createElement('iframe');
    iframe.src = "https://link.ventux.io/widget/form/OWI77RP94NZkMNa4BIaz";
    iframe.style.cssText = "display:block;width:100%;height:531px;border:none;border-radius:3px";
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

    // Store reference for cleanup
    iframeRef.current = iframe;
    
    // Append iframe
    container.appendChild(iframe);

    // Load Ventux script only if not already loaded
    if (!document.querySelector('script[src*="form_embed.js"]')) {
      const script = document.createElement('script');
      script.src = "https://link.ventux.io/js/form_embed.js";
      script.async = true;
      
      script.onload = () => {
        scriptLoadedRef.current = true;
        console.log('Ventux script loaded successfully');
      };

      script.onerror = () => {
        console.error('Error loading Ventux script');
      };

      document.body.appendChild(script);
    } else {
      scriptLoadedRef.current = true;
    }

    // Cleanup function
    return () => {
      const currentIframe = iframeRef.current;
      const currentContainer = containerRef.current;
      
      if (currentIframe && currentContainer) {
        try {
          // Check if iframe is still a child before removing
          if (currentContainer.contains(currentIframe)) {
            currentContainer.removeChild(currentIframe);
          }
        } catch (error) {
          // Silently handle if already removed
          console.debug('Iframe cleanup handled gracefully');
        }
      }
      
      iframeRef.current = null;
    };
  }, []); // Empty dependency array - run once

  return (
    <div 
      ref={containerRef} 
      className="ventux-form-container w-full min-h-[531px] bg-gray-50 rounded-lg"
      style={{ minHeight: '531px' }}
    />
  );
}