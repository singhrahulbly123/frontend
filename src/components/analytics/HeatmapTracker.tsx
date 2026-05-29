'use client';

import { useEffect, useRef } from 'react';

type ClickEvent = {
  x: number;
  y: number;
  selector: string;
  pathname: string;
  timestamp: number;
  viewport: { w: number; h: number };
};

function buildSelector(el: Element | null) {
  if (!el) return '';
  const parts: string[] = [];
  let node: Element | null = el;
  let depth = 0;
  while (node && depth < 4) {
    let part = node.tagName.toLowerCase();
    if (node.id) part += `#${node.id}`;
    else if (node.className && typeof node.className === 'string') {
      const cls = node.className.split(' ').filter(Boolean)[0];
      if (cls) part += `.${cls}`;
    }
    parts.push(part);
    node = node.parentElement;
    depth++;
  }
  return parts.join('>');
}

export default function HeatmapTracker({ batchSize = 20, flushInterval = 10000 }: { batchSize?: number; flushInterval?: number }) {
  const bufferRef = useRef<ClickEvent[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const viewport = { w: window.innerWidth, h: window.innerHeight };
      const ev: ClickEvent = {
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
        selector: buildSelector(target),
        pathname: location.pathname,
        timestamp: Date.now(),
        viewport,
      };
      bufferRef.current.push(ev);
      if (bufferRef.current.length >= batchSize) flush();
    }

    async function flush() {
      if (bufferRef.current.length === 0) return;
      const payload = bufferRef.current.splice(0, bufferRef.current.length);
      try {
        await fetch('/api/heatmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events: payload }),
        });
      } catch {
        // ignore network errors; they'll be dropped
      }
    }

    function onUnload() {
      if (bufferRef.current.length) {
        // best-effort sync send
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/heatmap', JSON.stringify({ events: bufferRef.current }));
        }
      }
    }

    document.addEventListener('click', onClick, true);
    window.addEventListener('beforeunload', onUnload);

    timerRef.current = window.setInterval(() => {
      if (bufferRef.current.length) flush();
    }, flushInterval) as unknown as number;

    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('beforeunload', onUnload);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [batchSize, flushInterval]);

  return null;
}
