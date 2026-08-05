import Link from "next/link";
import { Copy, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { PromptCopyButton } from "@/components/prompts/PromptCopyButton";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { WhatsAppShareCard } from "@/components/share/WhatsAppShareCard";
import { buildPromptShareText } from "@/lib/share";
import { AdSlot } from "@/components/ads/AdSlot";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "AI Prompt Library for Work, Study and Content", description: "Copy-ready English, Hindi, and Hinglish prompts for creators, students, job seekers, and small businesses.", alternates: { canonical: "/prompts" } };

export const revalidate = 120;

type PromptTemplate = {
  id: number;
  title: string;
  slug: string;
  category: string;
  audience?: string | null;
  language?: string | null;
  use_case?: string | null;
  prompt: string;
  tags?: string[];
  copy_count?: number;
};

async function getPrompts() {
  try {
    const res = await apiFetch<{ data: PromptTemplate[] }>("/prompts?per_page=48", { revalidate: 120 });
    return res.data;
  } catch {
    return [];
  }
}

export default async function PromptsPage() {
  const prompts = await getPrompts();
  const categories = Array.from(new Set(prompts.map((prompt) => prompt.category)));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-10">
        <p className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-orange-400">
          <Sparkles className="h-4 w-4" /> Prompt Library
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
          Copy-ready AI prompts for Indian creators, students, jobs, and business
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400">
          Practical prompts that users can copy, share, and use instantly. This is your repeat-traffic utility layer.
        </p>
      </section>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <span key={category} className="rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">{category}</span>
        ))}
      </div>

      <AdSlot slotKey="prompts_top" pageType="utility" estimatedHeight="120px" className="mb-8" />

      {!prompts.length && <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-zinc-300">Prompts are temporarily unavailable.</div>}
      <section className="grid gap-4 lg:grid-cols-2">
        {prompts.map((item) => (
          <article key={item.id} className="glass-panel rounded-3xl border border-white/10 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-400">{item.category} / {item.audience || "All"}</p>
                <h2 className="mt-3 text-2xl font-bold text-white">{item.title}</h2>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                <Copy className="h-3 w-3" /> {item.copy_count ?? 0}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{item.use_case}</p>
            <pre className="mt-5 max-h-48 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm leading-6 text-zinc-200">{item.prompt}</pre>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PromptCopyButton prompt={item.prompt} id={item.id} />
              <BookmarkButton type="prompt" item={item} />
              <WhatsAppShareCard
                compact
                text={buildPromptShareText({ ...item, path: `/prompts/${item.slug}` })}
              />
              <Link href={`/prompts/${item.slug}`} className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200">Open</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
