"use client";

import Link from "next/link";
import { Menu, Moon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const mainNav = [
  { href: "/", label: "Home" },
  { href: "/category/world", label: "World" },
  { href: "/category/tech", label: "Technology" },
  { href: "/category/finance", label: "Finance" },
  { href: "/daily-ai-brief", label: "Daily Brief" },
];

const resourceNav = [
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/for-you", label: "For You" },
  { href: "/ai-tool-finder", label: "Tool Finder" },
  { href: "/tools/headline-generator", label: "Free Tools" },
  { href: "/compare", label: "Compare" },
  { href: "/learn-ai", label: "Learn AI" },
  { href: "/ai-skills", label: "AI Skills" },
  { href: "/prompts", label: "Prompts" },
  { href: "/saved", label: "Saved" },
  { href: "/push-preferences", label: "Alerts" },
  { href: "/voice-brief", label: "Voice Brief" },
  { href: "/web-stories", label: "Web Stories" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/5">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto flex max-w-9xl items-center justify-between gap-4 px-4 py-3"
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-sm font-black text-white">
            AI
          </span>
          <div>
            <p className="text-gradient text-lg font-bold leading-none">Global AI News</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">English Global Coverage</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-zinc-300 transition hover:text-orange-400">
              {item.label}
            </Link>
          ))}
          
          <div className="group relative">
            <button className="flex items-center gap-1 text-sm text-zinc-300 transition hover:text-orange-400">
              Tools & Resources
              <svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute left-0 top-full hidden pt-4 group-hover:block">
              <div className="flex w-48 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-xl backdrop-blur-xl">
                {resourceNav.map((item) => (
                  <Link key={item.href} href={item.href} className="px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-orange-400">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <motion.div className="flex items-center gap-2">
          <Link href="/search">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" aria-label="Theme">
            <Moon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            <Menu className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 px-4 py-3 md:hidden"
          >
            {[...mainNav, ...resourceNav].map((item) => (
              <Link key={item.href} href={item.href} className="block py-2 text-sm text-zinc-300" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
