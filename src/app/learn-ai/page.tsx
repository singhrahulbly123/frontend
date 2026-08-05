import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

export const revalidate = 180;

type LearningPath = {
  id: number;
  title: string;
  slug: string;
  category: string;
  level: string;
  description?: string | null;
  outcomes?: string[];
  audience?: string[];
  duration_minutes?: number;
  lessons_count?: number;
};

async function getPaths() {
  try {
    const res = await apiFetch<{ data: LearningPath[] }>("/learning-paths?per_page=24", { revalidate: 180 });
    return res.data;
  } catch {
    return [];
  }
}

export default async function LearnAiPage() {
  const paths = await getPaths();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-10">
        <p className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-orange-400">
          <BookOpen className="h-4 w-4" /> AI Learning
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
          Learn AI with practical paths and action steps
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400">
          Prompt engineering, AI tools, jobs, creators, and business workflows. Short lessons built for repeat learning.
        </p>
      </section>

      {!paths.length && <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-zinc-300">Learning paths are temporarily unavailable.</div>}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paths.map((path) => (
          <Link key={path.id} href={`/learn-ai/${path.slug}`} className="glass-panel group rounded-3xl border border-white/10 p-6 transition hover:-translate-y-1 hover:border-orange-400/50">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-orange-400">
              <span>{path.category}</span>
              <span>/</span>
              <span>{path.level}</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">{path.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">{path.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(path.audience || []).slice(0, 3).map((item) => <span key={item} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">{item}</span>)}
            </div>
            <div className="mt-6 flex items-center justify-between gap-3 text-sm text-zinc-400">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {path.duration_minutes || 30} min</span>
              <span>{path.lessons_count || 0} lessons</span>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-orange-300">
              Start path <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-10">
        <NewsletterSignup segment="ai_learning" />
      </section>
    </main>
  );
}
