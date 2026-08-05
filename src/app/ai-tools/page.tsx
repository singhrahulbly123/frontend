import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { WhatsAppShareCard } from "@/components/share/WhatsAppShareCard";
import { buildToolShareText } from "@/lib/share";
import { AdSlot } from "@/components/ads/AdSlot";

export const revalidate = 120;

type AiTool = {
  id: number;
  name: string;
  slug: string;
  category: string;
  tagline?: string | null;
  description?: string | null;
  pricing?: string | null;
  best_for?: string[];
  rating?: number;
};

async function getTools() {
  try {
    const res = await apiFetch<{ data: AiTool[] }>("/ai-tools?per_page=48", { revalidate: 120 });
    return res.data;
  } catch {
    return [];
  }
}

export default async function AiToolsPage() {
  const tools = await getTools();
  const categories = Array.from(new Set(tools.map((tool) => tool.category)));

  return (
    <main className="page-shell py-7 sm:py-10">
      <section className="relative mb-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-[0_26px_70px_-40px_rgba(15,23,42,0.3)] sm:mb-10 sm:p-9 lg:p-11">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-orange-200/35 blur-3xl" />
        <p className="eyebrow relative">AI Tools Directory</p>
        <h1 className="relative mt-4 max-w-4xl text-4xl font-black leading-[1.06] text-white sm:text-5xl md:text-6xl">
          Best AI tools for creators, students, jobs, and business
        </h1>
        <p className="relative mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
          Practical AI tools with India-focused use cases, pricing, pros, cons, and alternatives. Ratings appear only when supporting data is available.
        </p>
      </section>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <span key={category} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-300 shadow-sm">{category}</span>
        ))}
      </div>

      <AdSlot slotKey="ai_tools_top" pageType="utility" estimatedHeight="120px" className="mb-8" />

      {!tools.length && (
        <div className="premium-card p-6 text-zinc-300 sm:p-8">
          Tool directory is temporarily unavailable. Please try again shortly.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <article key={tool.id} className="premium-card group p-5 hover:-translate-y-1 sm:p-6">
            <Link href={`/ai-tools/${tool.slug}`} className="block">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-400">{tool.category}</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">{tool.name}</h2>
                </div>
                {tool.rating != null && (
                  <div className="flex items-center gap-1 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-sm font-bold text-orange-700">
                    <Star className="h-4 w-4 fill-orange-400 text-orange-400" /> {tool.rating}
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm font-medium text-zinc-200">{tool.tagline}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">{tool.description}</p>
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <BookmarkButton type="tool" item={tool} />
              <WhatsAppShareCard
                compact
                text={buildToolShareText({ ...tool, path: `/ai-tools/${tool.slug}` })}
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {(tool.best_for || []).slice(0, 3).map((item) => (
                <span key={item} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">{item}</span>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-orange-300">
              <Link href={`/ai-tools/${tool.slug}`} className="inline-flex items-center gap-2">
                View review <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
