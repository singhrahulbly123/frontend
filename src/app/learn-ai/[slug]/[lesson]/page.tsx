import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Lesson = {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  action_steps?: string[];
  resources?: string[];
};
type LearningPath = { title: string; slug: string };

async function getLesson(pathSlug: string, lessonSlug: string) {
  try {
    return await apiFetch<{ data: Lesson; path: LearningPath; next?: Lesson | null }>(`/learning-paths/${pathSlug}/lessons/${lessonSlug}`, { revalidate: 180 });
  } catch {
    return null;
  }
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lesson: string }> }) {
  const { slug, lesson } = await params;
  const res = await getLesson(slug, lesson);

  if (!res) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold">Lesson not found yet</h1>
        <Link href="/learn-ai" className="mt-6 inline-flex text-orange-300">Back to learning</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href={`/learn-ai/${res.path.slug}`} className="text-sm text-orange-300">{res.path.title}</Link>
      <h1 className="mt-3 text-4xl font-extrabold text-white md:text-6xl">{res.data.title}</h1>
      <p className="mt-5 text-sm leading-7 text-zinc-400">{res.data.summary}</p>

      <article className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-6">
        <div className="prose prose-invert max-w-none whitespace-pre-line text-sm leading-8 text-zinc-200">{res.data.content}</div>
      </article>

      {(res.data.action_steps || []).length > 0 && (
        <section className="mt-8 rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6">
          <h2 className="text-2xl font-bold">Action steps</h2>
          <div className="mt-4 grid gap-3">
            {(res.data.action_steps || []).map((step) => (
              <div key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" /> {step}
              </div>
            ))}
          </div>
        </section>
      )}

      {res.next && (
        <Link href={`/learn-ai/${res.path.slug}/${res.next.slug}`} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white">
          Next lesson <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </main>
  );
}
