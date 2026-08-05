import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, HelpCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

type SkillGuide = {
  title: string;
  category: string;
  career_stage: string;
  summary?: string | null;
  body?: string | null;
  skills?: string[];
  tools?: string[];
  projects?: string[];
  roadmap?: string[];
  faqs?: { question?: string; answer?: string }[];
};

async function getGuide(slug: string) {
  try {
    return await apiFetch<{ data: SkillGuide }>(`/ai-skills/${slug}`, { revalidate: 180 });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await getGuide(slug);
  if (!res) return { title: "Skill guide not found", robots: { index: false, follow: true } };
  return { title: res.data.title, description: res.data.summary || `Practical ${res.data.category} skill guide and project roadmap.`, alternates: { canonical: `/ai-skills/${slug}` } };
}

export default async function AiSkillGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getGuide(slug);

  if (!res) {
    notFound();
  }

  const guide = res.data;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm uppercase tracking-[0.24em] text-orange-400">{guide.category} / {guide.career_stage}</p>
      <h1 className="mt-3 text-4xl font-extrabold text-white md:text-6xl">{guide.title}</h1>
      <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-300">{guide.summary}</p>
      {guide.body && <article className="mt-8 whitespace-pre-line rounded-3xl border border-white/10 bg-zinc-950 p-6 text-sm leading-8 text-zinc-200">{guide.body}</article>}
      <Grid title="Skills to learn" items={guide.skills || []} />
      <Grid title="Tools to practice" items={guide.tools || []} />
      <Grid title="Portfolio projects" items={guide.projects || []} />
      <Grid title="Roadmap" items={guide.roadmap || []} numbered />
      {(guide.faqs || []).length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold">FAQs</h2>
          <div className="mt-4 grid gap-3">
            {(guide.faqs || []).map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
                <h3 className="flex gap-2 font-semibold text-white"><HelpCircle className="h-4 w-4 text-orange-400" /> {faq.question}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Grid({ title, items, numbered = false }: { title: string; items: string[]; numbered?: boolean }) {
  if (!items.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-300">
            {numbered ? <span className="text-orange-300">{index + 1}.</span> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />}
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
