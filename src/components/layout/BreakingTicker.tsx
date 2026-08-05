"use client";

import { motion } from "framer-motion";

interface TickerItem {
  id: number;
  headline: string;
}

export function BreakingTicker({ items }: { items: TickerItem[] }) {
  if (!items.length) return null;

  const doubled = [...items, ...items];

  return (
    <div className="border-b border-red-200 bg-red-50 py-2">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4">
        <span className="shrink-0 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase">Live</span>
        <div className="flex animate-ticker gap-8 whitespace-nowrap">
          {doubled.map((item, i) => (
            <motion.span key={`${item.id}-${i}`} className="text-sm font-medium text-red-800">
              {item.headline}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
