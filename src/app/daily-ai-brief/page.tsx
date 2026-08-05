import Link from "next/link";
import { ArrowRight, CalendarDays, ExternalLink, ShieldCheck, Zap } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { WhatsAppShareCard } from "@/components/share/WhatsAppShareCard";
import { buildDailyBriefShareText } from "@/lib/share";
import { AdSlot } from "@/components/ads/AdSlot";

export const revalidate = 60;

type DailyBrief = {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  key_updates?: string[];
  tool_of_day?: { name?: string; url?: string; reason?: string } | null;
  prompts?: string[];
  impact_india?: string | null;
  source_urls?: string[];
  reviewed_at?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  published_at?: string | null;
};

async function getBrief() {
  try {
    const res = await apiFetch<{ data: DailyBrief }>("/daily-briefs/latest", { revalidate: 60 });
    return res.data || null;
  } catch {
    return null;
  }
}

async function getBriefs() {
  try {
    const res = await apiFetch<{ data: DailyBrief[] }>("/daily-briefs?per_page=8", { revalidate: 120 });
    return res.data || [];
  } catch {
    return [];
  }
}

export default async function DailyAiBriefPage() {
  const [brief, briefs] = await Promise.all([getBrief(), getBriefs()]);
  if (!brief) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-extrabold text-white">Daily AI Brief</h1>
        <p className="mt-5 text-zinc-300">Today&apos;s verified brief is not available yet. Please check back shortly.</p>
        <div className="mt-8"><NewsletterSignup segment="daily_ai_brief" /></div>
      </main>
    );
  }
  const shareText = buildDailyBriefShareText({ ...brief, path: `/daily-ai-brief/${brief.slug}` });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-3xl border border-orange-500/20 bg-orange-500/5 p-8 md:p-10">
        <p className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-orange-300">
          <CalendarDays className="h-4 w-4" /> Daily AI Brief
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">{brief.title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-300">{brief.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          {brief.published_at ? <span>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(brief.published_at))}</span> : null}
          {brief.reviewed_at ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700"><ShieldCheck className="h-4 w-4" /> Human reviewed</span> : null}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <article className="glass-panel rounded-3xl border border-white/10 p-6">
          <h2 className="text-2xl font-bold">Key updates in 30 seconds</h2>
          <div className="mt-5 grid gap-3">
            {(brief.key_updates || []).map((item, index) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">{index + 1}</span>
                {item}
              </div>
            ))}
          </div>

          {(brief.source_urls || []).length > 0 && (
            <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-900"><ShieldCheck className="h-5 w-5" /> Sources checked by editor</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {(brief.source_urls || []).map((source, index) => (
                  <a key={source} href={source} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800">
                    Source {index + 1} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {brief.impact_india && (
            <section className="mt-8">
              <h2 className="text-2xl font-bold">India impact</h2>
              <p className="mt-4 rounded-2xl border border-white/10 bg-zinc-950 p-5 text-sm leading-7 text-zinc-300">{brief.impact_india}</p>
            </section>
          )}

          {(brief.prompts || []).length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-bold">Prompts of the day</h2>
              <div className="mt-4 grid gap-3">
                {(brief.prompts || []).map((prompt) => (
                  <pre key={prompt} className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm leading-6 text-zinc-200">{prompt}</pre>
                ))}
              </div>
            </section>
          )}
        </article>

        <aside className="space-y-6">
          <AdSlot slotKey="daily_brief_sidebar" pageType="utility" estimatedHeight="280px" />
          {brief.tool_of_day && (
            <div className="rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6">
              <p className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-orange-300"><Zap className="h-4 w-4" /> Tool of the day</p>
              <h2 className="mt-4 text-2xl font-bold">{brief.tool_of_day.name}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{brief.tool_of_day.reason}</p>
              {brief.tool_of_day.url && (
                <Link href={brief.tool_of_day.url} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                  Open tool <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
          {brief.cta_url && (
            <Link href={brief.cta_url} className="block rounded-3xl border border-white/10 bg-zinc-950 p-6 text-sm font-semibold text-orange-300">
              {brief.cta_label || "Explore more"} <ArrowRight className="ml-2 inline h-4 w-4" />
            </Link>
          )}
          <Link href="/voice-brief" className="block rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-sm font-semibold text-emerald-200">
            Listen to the voice brief <ArrowRight className="ml-2 inline h-4 w-4" />
          </Link>
          <WhatsAppShareCard title="Share today's brief" text={shareText} />
        </aside>
      </section>

      <section className="mt-10">
        <NewsletterSignup segment="daily_ai_brief" />
      </section>

      {briefs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Previous briefs</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {briefs.map((item) => (
              <Link key={item.id} href={`/daily-ai-brief/${item.slug}`} className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-300 hover:border-orange-400/50">
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
