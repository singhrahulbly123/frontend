'use client';

import { useEffect, useRef } from 'react';

type ViewEvent = {
  slot: string;
  visibleStart?: number;
  visibleEnd?: number;
  durationMs?: number;
  pathname: string;
  timestamp: number;
  viewport: { w: number; h: number };
};

export default function ViewabilityTracker({ flushInterval = 10000 }: { flushInterval?: number }) {
  const bufferRef = useRef<ViewEvent[]>([]);
  const activeMap = useRef<Map<Element, { slot: string; start?: number }>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    function onIntersect(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        const el = entry.target as Element;
        const slot = el.getAttribute('data-ad-slot') || el.getAttribute('data-ad-client') || 'unknown';
        const now = Date.now();
        const active = activeMap.current.get(el) || { slot };
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          // became visible
          active.start = active.start || now;
          activeMap.current.set(el, active);
        } else {
          // became not visible
          if (active.start) {
            const duration = now - active.start;
            bufferRef.current.push({
              slot: active.slot,
              visibleStart: active.start,
              visibleEnd: now,
              durationMs: duration,
              pathname: location.pathname,
              timestamp: now,
              viewport: { w: window.innerWidth, h: window.innerHeight },
            });
            activeMap.current.delete(el);
          }
        }
      });
    }

    observerRef.current = new IntersectionObserver(onIntersect, { threshold: [0, 0.25, 0.5, 0.75, 1] });

    function observeAll() {
      document.querySelectorAll('[data-ad-slot]').forEach((el) => observerRef.current?.observe(el as Element));
    }

    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });
    observeAll();

    const timer = window.setInterval(async () => {
      if (bufferRef.current.length === 0) return;
      const payload = bufferRef.current.splice(0, bufferRef.current.length);
      try {
        await fetch('/api/viewability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events: payload }),
        });
      } catch {}
    }, flushInterval) as unknown as number;

    function onUnload() {
      if (bufferRef.current.length) {
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/viewability', JSON.stringify({ events: bufferRef.current }));
        }
      }
    }

    window.addEventListener('beforeunload', onUnload);

    return () => {
      mo.disconnect();
      observerRef.current?.disconnect();
      window.clearInterval(timer);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [flushInterval]);

  return null;
}
