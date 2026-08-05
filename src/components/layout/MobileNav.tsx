"use client";

import Link from "next/link";
import { Home, Flame, Search, BookOpen, UserRoundCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/trending", icon: Flame, label: "Trending" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/for-you", icon: UserRoundCheck, label: "For You" },
  { href: "/web-stories", icon: BookOpen, label: "Stories" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/92 shadow-[0_-14px_40px_rgba(15,23,42,0.09)] backdrop-blur-2xl md:hidden" aria-label="Quick navigation">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[calc(0.4rem+env(safe-area-inset-bottom))] pt-1.5">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex min-h-12 min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-semibold",
              pathname === href ? "bg-orange-50 text-orange-800" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            {pathname === href ? <span className="absolute top-0 h-0.5 w-5 rounded-full bg-orange-700" /> : null}
            <Icon className="h-[19px] w-[19px]" strokeWidth={pathname === href ? 2.4 : 1.9} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
