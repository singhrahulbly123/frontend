import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { WhatsAppShareCard } from "@/components/share/WhatsAppShareCard";
import { buildDailyBriefShareText } from "@/lib/share";

type DailyBrief = {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  key_updates?: string[];
  prompts?: string[];
  impact_india?: string | null;
  published_at?: string | null;
};

async function getBrief(slug: string) {
  try {
    return await apiFetch<{ data: DailyBrief }>(`/daily-briefs/${slug}`, { revalidate: 300 });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await getBrief(slug);
  if (!res) return { title: "Daily brief not found", robots: { index: false, follow: true } };
  return { title: res.data.title, description: res.data.summary || "Pulsevian daily AI brief with practical updates and India impact.", alternates: { canonical: `/daily-ai-brief/${res.data.slug}` } };
}

export default async function DailyBriefDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getBrief(slug);

  if (!res) {
    notFound();
  }

  const brief = res.data;
  const shareText = buildDailyBriefShareText({ ...brief, path: `/daily-ai-brief/${brief.slug}` });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Daily AI Brief</p>
      <h1 className="mt-3 text-4xl font-extrabold text-white md:text-6xl">{brief.title}</h1>
      <p className="mt-5 text-sm leading-7 text-zinc-300">{brief.summary}</p>

      <section className="mt-8 space-y-3">
        {(brief.key_updates || []).map((item, index) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">
            <span className="mr-3 text-orange-300">{index + 1}.</span>{item}
          </div>
        ))}
      </section>

      {brief.impact_india && (
        <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">India impact</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-300">{brief.impact_india}</p>
        </section>
      )}

      <div className="mt-8">
        <WhatsAppShareCard title="Share this brief" text={shareText} />
      </div>
    </main>
  );
}
