"use client";

import { useEffect } from "react";

export default function StaticDocumentNavigation() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_TARGET !== "php") return;

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
      const nextPath = url.pathname.replace(/\/$/, "") || "/";
      const isOnlyHashChange =
        currentPath === nextPath &&
        window.location.search === url.search &&
        window.location.hash !== url.hash;

      if (isOnlyHashChange) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      window.location.assign(url.href);
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null;
}
