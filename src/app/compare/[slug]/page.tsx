import Link from "next/link";
import { ArrowRight, CheckCircle2, HelpCircle, Trophy } from "lucide-react";
import { apiFetch } from "@/lib/api";

type ScoreRow = { label?: string; a?: string; b?: string };
type Faq = { question?: string; answer?: string };

type AiComparison = {
  id: number;
  title: string;
  slug: string;
  category: string;
  tool_a: string;
  tool_b: string;
  summary?: string | null;
  winner?: string | null;
  best_for?: string[];
  scorecard?: ScoreRow[];
  pros_cons?: string[];
  faqs?: Faq[];
  cta_label?: string | null;
  cta_url?: string | null;
};

async function getComparison(slug: string) {
  try {
    return await apiFetch<{ data: AiComparison; related: AiComparison[] }>(`/comparisons/${slug}`, { revalidate: 300 });
  } catch {
    return null;
  }
}

export default async function CompareDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getComparison(slug);

  if (!res) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold">Comparison not found yet</h1>
        <Link href="/compare" className="mt-6 inline-flex text-orange-300">Back to comparisons</Link>
      </main>
    );
  }

  const item = res.data;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm uppercase tracking-[0.24em] text-orange-400">{item.category}</p>
      <h1 className="mt-3 max-w-5xl text-4xl font-extrabold leading-tight text-white md:text-6xl">{item.title}</h1>
      <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-300">{item.summary}</p>

      {item.winner && (
        <section className="mt-8 rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6">
          <p className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-orange-300"><Trophy className="h-4 w-4" /> Quick winner</p>
          <h2 className="mt-3 text-2xl font-bold text-white">{item.winner}</h2>
        </section>
      )}

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">{item.tool_a}</h2>
          <p className="mt-3 text-sm text-zinc-400">Best when you need writing, ideation, structured prompts, and flexible AI workflows.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">{item.tool_b}</h2>
          <p className="mt-3 text-sm text-zinc-400">Best when you need ecosystem integration, research support, or a different AI model style.</p>
        </div>
      </section>

      {(item.scorecard || []).length > 0 && (
        <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">Scorecard</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-3 bg-zinc-900 text-sm font-semibold text-zinc-200">
              <div className="p-3">Factor</div>
              <div className="p-3">{item.tool_a}</div>
              <div className="p-3">{item.tool_b}</div>
            </div>
            {(item.scorecard || []).map((row) => (
              <div key={`${row.label}-${row.a}-${row.b}`} className="grid grid-cols-3 border-t border-white/10 text-sm text-zinc-300">
                <div className="p-3">{row.label}</div>
                <div className="p-3">{row.a}</div>
                <div className="p-3">{row.b}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(item.best_for || []).length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold">Best for</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(item.best_for || []).map((best) => (
              <div key={best} className="flex gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" /> {best}
              </div>
            ))}
          </div>
        </section>
      )}

      {(item.pros_cons || []).length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold">Practical notes</h2>
          <div className="mt-4 grid gap-3">
            {(item.pros_cons || []).map((note) => (
              <div key={note} className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">{note}</div>
            ))}
          </div>
        </section>
      )}

      {(item.faqs || []).length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold">FAQs</h2>
          <div className="mt-4 grid gap-3">
            {(item.faqs || []).map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
                <h3 className="flex gap-2 font-semibold text-white"><HelpCircle className="h-4 w-4 text-orange-400" /> {faq.question}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {item.cta_url && (
        <Link href={item.cta_url} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white">
          {item.cta_label || "Explore tools"} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </main>
  );
}
