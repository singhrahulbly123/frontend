"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, BadgeCheck, Flame } from "lucide-react";
import type { Article } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  article: Article;
  variant?: "default" | "hero" | "compact";
  index?: number;
}

export function ArticleCard({ article, variant = "default", index = 0 }: Props) {
  const isHero = variant === "hero";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`group glass-panel overflow-hidden rounded-3xl border border-slate-200/80 transition duration-300 hover:-translate-y-1 hover:border-orange-200 ${
        isHero ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <Link href={`/news/${article.slug}`} className="block h-full">
        <div className={`relative overflow-hidden bg-slate-100 ${isHero ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[16/10]"}`}>
          {(article.featured_image_optimized || article.featured_image) ? (
            <Image
              src={article.featured_image_optimized ?? article.featured_image ?? ""}
              alt={article.title ?? "article image"}
              fill
              unoptimized
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes={isHero ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 via-white to-blue-50 text-4xl font-black text-orange-300">
              AI
            </div>
          )}
          {article.is_breaking && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold uppercase">
              <Flame className="h-3 w-3" /> Breaking
            </span>
          )}
        </div>
        <div className={isHero ? "p-5 sm:p-7" : "p-5"}>
          {article.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">{article.category.name}</span>
          )}
          <h3 className={`mt-2 font-extrabold leading-snug text-zinc-50 transition group-hover:text-orange-800 ${isHero ? "text-2xl sm:text-3xl" : "text-lg"}`}>
            {article.title}
          </h3>
          {(article.ai_summary || article.excerpt) && (
            <p className={`mt-2 line-clamp-2 text-zinc-400 ${isHero ? "text-base" : "text-sm"}`}>
              {article.ai_summary || article.excerpt}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-500">
            {article.author && (
              <span className="flex items-center gap-1 text-orange-300">
                {article.author.name}
                {article.author.is_verified && <BadgeCheck className="h-3.5 w-3.5 text-blue-400" />}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {article.reading_time_minutes} min
            </span>
            <span>{formatDate(article.published_at)}</span>
            {article.is_fresh && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-emerald-300">Fresh</span>
            )}
            {article.discover_ready && (
              <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-blue-300">Discover-ready</span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
