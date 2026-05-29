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

const starterTools: AiTool[] = [
  { id: 1, name: "ChatGPT", slug: "chatgpt", category: "AI Writing", tagline: "All-round AI assistant for students, creators, and businesses.", description: "Useful for explainers, emails, scripts, coding help, and research summaries.", pricing: "Free + paid", best_for: ["Students", "Creators", "Business"], rating: 4.8 },
  { id: 2, name: "Perplexity", slug: "perplexity", category: "AI Search", tagline: "Research answers with cited sources.", description: "Strong tool for fast research, comparison, and source-backed summaries.", pricing: "Free + paid", best_for: ["Research", "News tracking"], rating: 4.7 },
  { id: 3, name: "Canva AI", slug: "canva-ai", category: "Design", tagline: "Simple AI design suite for reels, thumbnails, posters, and social creatives.", description: "Low-friction visual content creation for global creators.", pricing: "Free + paid", best_for: ["YouTubers", "Instagram"], rating: 4.6 },
];

async function getTools() {
  try {
    const res = await apiFetch<{ data: AiTool[] }>("/ai-tools?per_page=48", { revalidate: 120 });
    return res.data.length ? res.data : starterTools;
  } catch {
    return starterTools;
  }
}

export default async function AiToolsPage() {
  const tools = await getTools();
  const categories = Array.from(new Set(tools.map((tool) => tool.category)));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-10">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">AI Tools Directory</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
          Best AI tools for creators, students, jobs, and business
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400">
          Practical AI tools with global English use cases, pricing, pros, cons, and alternatives. Pick tools that actually save time or make money.
        </p>
      </section>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <span key={category} className="rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">{category}</span>
        ))}
      </div>

      <AdSlot slotKey="ai_tools_top" pageType="utility" estimatedHeight="120px" className="mb-8" />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <article key={tool.id} className="glass-panel rounded-3xl border border-white/10 p-6 transition hover:-translate-y-1 hover:border-orange-400/50">
            <Link href={`/ai-tools/${tool.slug}`} className="block">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-400">{tool.category}</p>
                  <h2 className="mt-3 text-2xl font-bold text-white">{tool.name}</h2>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-sm text-orange-200">
                  <Star className="h-4 w-4 fill-orange-400 text-orange-400" /> {tool.rating ?? 4.5}
                </div>
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
