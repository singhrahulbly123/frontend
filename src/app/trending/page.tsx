import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import type { Article } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Trending AI Updates",
  description: "Explore the AI updates and practical resources Pulsevian readers are using most.",
  alternates: { canonical: "/trending" },
};

async function getTrending() {
  try {
    return (await apiFetch<{ data: Article[] }>("/trending?locale=en", { revalidate: 60 })).data;
  } catch {
    return [];
  }
}

export default async function TrendingPage() {
  const articles = await getTrending();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-10 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Trending</p>
        <h1 className="mt-3 text-4xl font-extrabold text-white md:text-6xl">What readers are exploring now</h1>
        <p className="mt-5 text-sm leading-7 text-zinc-400">Popular AI updates ranked by genuine reader activity.</p>
      </header>
      {articles.length ? (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)}
        </section>
      ) : (
        <p className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-zinc-400">Trending data is not available yet.</p>
      )}
    </main>
  );
}
