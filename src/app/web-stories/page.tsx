import Link from "next/link";
import Image from "next/image";
import { Play, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Metadata } from "next";
import { mergeWithFallbackStories } from "@/lib/story-content";

export const metadata: Metadata = { title: "AI Web Stories", description: "Short, mobile-friendly visual guides to AI tools, workflows, and practical updates.", alternates: { canonical: "/web-stories" } };

type WebStory = {
  id: number;
  title: string;
  slug: string;
  cover_image?: string | null;
  locale?: string;
  published_at?: string | null;
};

type ToolStory = {
  title: string;
  slug: string;
  pages?: unknown[];
  source?: { slug?: string };
  seo?: { description?: string | null };
};

async function getStories() {
  try {
    const res = await apiFetch<{ data: WebStory[] }>("/web-stories", { revalidate: 120 });
    return mergeWithFallbackStories(res.data);
  } catch {
    return mergeWithFallbackStories([]);
  }
}

async function getToolStories() {
  try {
    const res = await apiFetch<{ data: ToolStory[] }>("/ai-tools/web-stories?limit=12", { revalidate: 120 });
    return res.data;
  } catch {
    return [];
  }
}

export default async function WebStoriesPage() {
  const [stories, toolStories] = await Promise.all([getStories(), getToolStories()]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-10">
        <p className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-orange-400">
          <Sparkles className="h-4 w-4" /> Web Stories
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
          Short AI stories for tools, news, and daily briefs
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400">
          Swipe-style explainers designed for fast discovery traffic and social sharing.
        </p>
      </section>

      {toolStories.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-orange-400">AI Tools</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Tool review stories</h2>
            </div>
            <Link href="/ai-tools" className="text-sm font-semibold text-orange-300">Browse tools</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {toolStories.map((story) => (
              <Link key={story.slug} href={`/ai-tools/${story.source?.slug || story.slug.replace("tool-story-", "")}/story`} className="group flex aspect-[9/16] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-5 transition hover:border-orange-400/50">
                <div className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-200">Tool Story</div>
                <div>
                  <Play className="mb-4 h-8 w-8 text-orange-300" />
                  <h3 className="text-2xl font-bold text-white">{story.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">{story.seo?.description || "Swipe through pricing, use cases, pros, cons, and alternatives."}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {stories.length === 0 ? (
        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-sm leading-6 text-zinc-300">
          Published article web stories will appear here.
        </section>
      ) : (
        <>
        <h2 className="mb-4 text-2xl font-bold text-white">Published stories</h2>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((story) => (
            <Link key={story.slug} href={`/web-stories/${story.slug}`} className="dark-surface group relative aspect-[9/16] overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-xl transition hover:-translate-y-1 hover:border-orange-400/50">
              {story.cover_image ? <Image src={story.cover_image} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" unoptimized /> : null}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-200">Story</div>
                <div>
                  <Play className="mb-4 h-8 w-8 text-orange-300" />
                  <h2 className="text-2xl font-bold text-white">{story.title}</h2>
                  <p className="mt-3 text-sm text-zinc-400">{story.locale || "en"}</p>
                </div>
              </div>
            </Link>
          ))}
        </section>
        </>
      )}
    </main>
  );
}
