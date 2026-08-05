"use client";

import Link from "next/link";
import { ChevronDown, Menu, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/", label: "Home" },
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/compare", label: "Compare" },
  { href: "/daily-ai-brief", label: "Daily Brief" },
];

const resourceNav = [
  { href: "/ai-tool-finder", label: "AI Tool Finder" },
  { href: "/tools/headline-generator", label: "Free AI Tools" },
  { href: "/prompts", label: "Prompt Library" },
  { href: "/learn-ai", label: "Learn AI" },
  { href: "/ai-skills", label: "AI Skills" },
  { href: "/for-you", label: "For You" },
  { href: "/saved", label: "Saved" },
  { href: "/web-stories", label: "Web Stories" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/75 bg-white/88 shadow-[0_10px_35px_rgba(15,23,42,0.055)] backdrop-blur-2xl">
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Pulsevian home">
          <span className="brand-gradient flex h-10 w-10 items-center justify-center rounded-[14px] text-sm font-black text-white shadow-[0_10px_24px_rgba(194,65,12,0.28)] transition group-hover:-rotate-3 group-hover:scale-105">
            P
          </span>
          <div>
            <p className="text-gradient text-[1.05rem] font-extrabold leading-none tracking-tight">Pulsevian</p>
            <p className="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 min-[360px]:block">AI Workflows for India</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                isActive(item.href) ? "bg-orange-50 text-orange-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              )}
            >
              {item.label}
            </Link>
          ))}

          <div className="relative">
            <button
              type="button"
              aria-expanded={resourcesOpen}
              aria-haspopup="menu"
              onClick={() => setResourcesOpen((value) => !value)}
              className="flex min-h-10 items-center gap-1 rounded-full px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            >
              Resources
              <ChevronDown className={cn("h-4 w-4 transition", resourcesOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {resourcesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  className="absolute right-0 top-[calc(100%+0.75rem)] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_65px_rgba(15,23,42,0.16)]"
                  role="menu"
                >
                  <div className="mb-1 flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">
                    <Sparkles className="h-3.5 w-3.5" /> Explore Pulsevian
                  </div>
                  {resourceNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setResourcesOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-800"
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link href="/search" aria-label="Search Pulsevian">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-[18px] w-[18px]" />
            </Button>
          </Link>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/tools/headline-generator">Try free tools</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-200 bg-white/98 px-4 py-4 shadow-inner lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-3">
              {[...mainNav, ...resourceNav].filter((item, index, list) => list.findIndex((candidate) => candidate.href === item.href) === index).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-12 items-center rounded-xl border px-3 py-2.5 text-sm font-semibold",
                    isActive(item.href)
                      ? "border-orange-200 bg-orange-50 text-orange-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
