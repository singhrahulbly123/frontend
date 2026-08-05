import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Category } from "@/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "AI Topics and Categories",
  description: "Browse Pulsevian AI tools, practical workflows, and reviewed updates by topic.",
  alternates: { canonical: "/categories" },
};

async function getCategories() {
  try {
    return (await apiFetch<{ data: Category[] }>("/categories", { revalidate: 300 })).data;
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-10 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Topics</p>
        <h1 className="mt-3 text-4xl font-extrabold text-white md:text-6xl">Explore Pulsevian by category</h1>
        <p className="mt-5 text-sm leading-7 text-zinc-400">Find useful AI updates and resources organized by topic.</p>
      </header>
      {categories.length ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="rounded-3xl border border-white/10 bg-zinc-950 p-6 transition hover:border-orange-400/50">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-400">Category</p>
              <h2 className="mt-3 text-2xl font-bold text-white">{category.name}</h2>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-300">View updates <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </section>
      ) : (
        <p className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-zinc-400">Categories are being reviewed and will appear here soon.</p>
      )}
    </main>
  );
}
