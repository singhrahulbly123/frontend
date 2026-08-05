import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { Article, Category } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };
type CategoryResponse = { category: Category; articles: { data: Article[] } };

async function getCategory(slug: string) {
  try {
    return await apiFetch<CategoryResponse>(`/categories/${encodeURIComponent(slug)}`, { revalidate: 120 });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const response = await getCategory(slug);
  if (!response) return { title: "Category not found", robots: { index: false, follow: true } };
  return {
    title: `${response.category.name} AI Updates`,
    description: `Practical ${response.category.name} AI updates and resources from Pulsevian.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const response = await getCategory(slug);
  if (!response) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-10 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Category</p>
        <h1 className="mt-3 text-4xl font-extrabold text-white md:text-6xl">{response.category.name}</h1>
        <p className="mt-5 text-sm leading-7 text-zinc-400">Reviewed updates and practical resources for this topic.</p>
      </header>
      {response.articles.data.length ? (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {response.articles.data.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)}
        </section>
      ) : (
        <p className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-zinc-400">No reviewed articles are published in this category yet.</p>
      )}
    </main>
  );
}
