import type { Metadata } from "next";
import { Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Article } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";

export const metadata: Metadata = {
  title: "Search Pulsevian",
  description: "Search Pulsevian AI updates and practical resources.",
  robots: { index: false, follow: true },
};

async function searchArticles(query: string) {
  if (query.trim().length < 2) return [];
  try {
    return (await apiFetch<{ data: Article[] }>(`/search?q=${encodeURIComponent(query.trim())}`, { revalidate: 0 })).data;
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const articles = await searchArticles(q);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Search</p>
        <h1 className="mt-3 text-4xl font-extrabold text-white md:text-6xl">Find useful AI resources</h1>
        <form action="/search" method="get" className="mt-8 flex gap-3 rounded-3xl border border-white/10 bg-zinc-950 p-3">
          <label htmlFor="site-search" className="sr-only">Search Pulsevian</label>
          <input id="site-search" name="q" defaultValue={q} minLength={2} required placeholder="Search AI tools, news, or workflows" className="min-w-0 flex-1 bg-transparent px-3 text-white outline-none" />
          <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white"><Search className="h-4 w-4" /> Search</button>
        </form>
      </header>

      {q.trim().length >= 2 && (
        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold text-white">{articles.length ? `Results for “${q}”` : `No results for “${q}”`}</h2>
          {articles.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{articles.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)}</div>}
        </section>
      )}
    </main>
  );
}
