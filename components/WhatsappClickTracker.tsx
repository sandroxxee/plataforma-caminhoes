"use client";

import { useEffect } from "react";

export function WhatsappClickTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[data-whatsapp-click]");
      if (!link) return;

      const payload = JSON.stringify({
        truckId: link.dataset.truckId || null,
        href: link.href,
        path: window.location.pathname,
        referrer: document.referrer || null,
        clickedAt: new Date().toISOString(),
      });

      try {
        navigator.sendBeacon?.("/api/track-whatsapp", new Blob([payload], { type: "application/json" }));
      } catch {
        fetch("/api/track-whatsapp", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => null);
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
