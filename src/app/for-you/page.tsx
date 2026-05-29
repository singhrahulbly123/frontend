import Link from "next/link";
import { BriefcaseBusiness, GraduationCap, Lightbulb, PenTool } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Article } from "@/types";

type Role = "student" | "creator" | "job_seeker" | "business";

type FeedTool = {
  id: number;
  name: string;
  slug: string;
  category: string;
  tagline?: string | null;
  trust_score?: number;
  opportunity_score?: number;
};

type FeedItem =
  | { type: "article"; score: number; item: Article }
  | { type: "tool"; score: number; item: FeedTool };

const roles: { id: Role; label: string; icon: typeof GraduationCap }[] = [
  { id: "creator", label: "Creator", icon: PenTool },
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "job_seeker", label: "Job seeker", icon: BriefcaseBusiness },
  { id: "business", label: "Business", icon: Lightbulb },
];

async function getFeed(role: Role) {
  try {
    return await apiFetch<{ role: Role; items: FeedItem[] }>(`/personalized-feed?role=${role}&limit=12`, { revalidate: 60 });
  } catch {
    return { role, items: [] };
  }
}

export default async function ForYouPage({ searchParams }: { searchParams: Promise<{ role?: Role }> }) {
  const params = await searchParams;
  const role = roles.some((item) => item.id === params.role) ? params.role! : "creator";
  const feed = await getFeed(role);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Personalized AI Feed</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
          AI updates and tools matched to your role
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400">
          Choose a role and get a ranked mix of news, tools, and opportunities.
        </p>
      </section>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {roles.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            href={`/for-you?role=${id}`}
            className={`rounded-2xl border p-4 transition ${role === id ? "border-orange-400 bg-orange-500/10 text-white" : "border-white/10 bg-zinc-950 text-zinc-300 hover:border-orange-400/50"}`}
          >
            <Icon className="h-5 w-5 text-orange-300" />
            <p className="mt-3 font-semibold">{label}</p>
          </Link>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        {feed.items.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-sm text-zinc-400">
            Feed data is not available yet.
          </div>
        )}
        {feed.items.map((entry) => {
          const href = entry.type === "article" ? `/news/${entry.item.slug}` : `/ai-tools/${entry.item.slug}`;
          const title = entry.type === "article" ? entry.item.title : entry.item.name;
          const description = entry.type === "article" ? entry.item.excerpt : entry.item.tagline;
          const score = entry.type === "article" ? entry.item.ai_opportunity_score : entry.item.opportunity_score;

          return (
            <Link key={`${entry.type}-${entry.item.id}`} href={href} className="rounded-3xl border border-white/10 bg-zinc-950 p-6 transition hover:border-orange-400/50">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                  {entry.type}
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-zinc-300">Match {entry.score}/100</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white">{title}</h2>
              {description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">{description}</p>}
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-300">
                <span className="rounded-full bg-zinc-800 px-3 py-1">Opportunity {score ?? 70}/100</span>
                {entry.type === "article" && <span className="rounded-full bg-zinc-800 px-3 py-1">India impact {entry.item.india_impact_score ?? 70}/100</span>}
                {entry.type === "tool" && <span className="rounded-full bg-zinc-800 px-3 py-1">Trust {entry.item.trust_score ?? 70}/100</span>}
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
