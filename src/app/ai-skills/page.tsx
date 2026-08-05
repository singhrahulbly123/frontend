import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "AI Skills and Career Roadmaps", description: "Practical AI skill guides, portfolio projects, and career roadmaps for Indian learners and professionals.", alternates: { canonical: "/ai-skills" } };

export const revalidate = 180;

type SkillGuide = {
  id: number;
  title: string;
  slug: string;
  category: string;
  career_stage: string;
  summary?: string | null;
  skills?: string[];
  tools?: string[];
};

async function getGuides() {
  try {
    const res = await apiFetch<{ data: SkillGuide[] }>("/ai-skills?per_page=24", { revalidate: 180 });
    return res.data;
  } catch {
    return [];
  }
}

export default async function AiSkillsPage() {
  const guides = await getGuides();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-10">
        <p className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-orange-400"><BriefcaseBusiness className="h-4 w-4" /> AI Jobs & Skills</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">AI skills, job paths, and projects for Indian users</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400">Beginner-friendly guides for AI jobs, freelancing, creator workflows, and business automation.</p>
      </section>

      {!guides.length && <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-zinc-300">Skill guides are temporarily unavailable.</div>}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link key={guide.id} href={`/ai-skills/${guide.slug}`} className="glass-panel group rounded-3xl border border-white/10 p-6 transition hover:-translate-y-1 hover:border-orange-400/50">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-400">{guide.category} / {guide.career_stage}</p>
            <h2 className="mt-3 text-2xl font-bold text-white">{guide.title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{guide.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {(guide.skills || []).slice(0, 3).map((skill) => <span key={skill} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">{skill}</span>)}
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-orange-300">Open guide <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
          </Link>
        ))}
      </section>
    </main>
  );
}
