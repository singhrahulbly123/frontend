import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Lesson = { id: number; title: string; slug: string; summary?: string | null; duration_minutes?: number; sort_order?: number };
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
  lessons?: Lesson[];
};

async function getPath(slug: string) {
  try {
    return await apiFetch<{ data: LearningPath }>(`/learning-paths/${slug}`, { revalidate: 180 });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPath(slug);
  if (!res) return { title: "Learning path not found", robots: { index: false, follow: true } };
  return { title: res.data.title, description: res.data.description || `Practical ${res.data.category} learning path for ${res.data.level} learners.`, alternates: { canonical: `/learn-ai/${res.data.slug}` } };
}

export default async function LearningPathPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getPath(slug);

  if (!res) {
    notFound();
  }

  const path = res.data;
  const firstLesson = path.lessons?.[0];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm uppercase tracking-[0.24em] text-orange-400">{path.category} / {path.level}</p>
      <h1 className="mt-3 max-w-5xl text-4xl font-extrabold leading-tight text-white md:text-6xl">{path.title}</h1>
      <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-300">{path.description}</p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-zinc-800 px-4 py-2 text-zinc-200"><Clock className="mr-1 inline h-4 w-4" /> {path.duration_minutes || 30} min</span>
        {(path.audience || []).map((item) => <span key={item} className="rounded-full bg-orange-500/10 px-4 py-2 text-orange-200">{item}</span>)}
      </div>
      {firstLesson && (
        <Link href={`/learn-ai/${path.slug}/${firstLesson.slug}`} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white">
          Start first lesson <ArrowRight className="h-4 w-4" />
        </Link>
      )}

      {(path.outcomes || []).length > 0 && (
        <section className="mt-10 rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">What you will learn</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(path.outcomes || []).map((outcome) => (
              <div key={outcome} className="flex gap-3 rounded-2xl border border-white/10 bg-zinc-900 p-4 text-sm text-zinc-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" /> {outcome}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Lessons</h2>
        <div className="mt-4 grid gap-3">
          {(path.lessons || []).map((lesson, index) => (
            <Link key={lesson.id} href={`/learn-ai/${path.slug}/${lesson.slug}`} className="rounded-2xl border border-white/10 bg-zinc-950 p-5 transition hover:border-orange-400/50">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-400">Lesson {index + 1}</p>
              <h3 className="mt-2 text-xl font-bold text-white">{lesson.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{lesson.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
