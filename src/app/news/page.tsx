import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import type { Article } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Latest Practical AI News",
  description: "Read human-reviewed AI updates, practical takeaways, and useful tool news from Pulsevian.",
  alternates: { canonical: "/news" },
};

async function getArticles() {
  try {
    const response = await apiFetch<{ data: Article[] }>("/articles?per_page=24", { revalidate: 60 });
    return response.data;
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-10 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Pulsevian News</p>
        <h1 className="mt-3 text-4xl font-extrabold text-white md:text-6xl">Latest practical AI updates</h1>
        <p className="mt-5 text-sm leading-7 text-zinc-400">
          Useful AI developments explained with practical context for creators, careers, students, and small businesses.
        </p>
      </header>

      {articles.length ? (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)}
        </section>
      ) : (
        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-zinc-400">
          No published articles are available yet. Explore the AI tools and practical workflows while we prepare reviewed updates.
        </section>
      )}
    </main>
  );
}
