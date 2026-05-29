"use client";

import Link from "next/link";
import { Home, Flame, Search, BookOpen, UserRoundCheck } from "lucide-react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    links.forEach((link) => {
      router.prefetch(link.href);
    });
  }, [router]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]",
              pathname === href ? "text-orange-400" : "text-zinc-500"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
