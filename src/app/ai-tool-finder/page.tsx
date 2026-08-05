"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";

type ToolResult = {
  tool: {
    id: number;
    name: string;
    slug: string;
    category: string;
    tagline?: string | null;
    pricing?: string | null;
    best_for?: string[];
  };
  score: number;
  reasons: string[];
};

const audiences = ["creator", "student", "job seeker", "business", "developer", "marketer"];
const goals = ["content", "research", "resume", "design", "video", "coding", "marketing"];
const budgets = ["free", "paid"];

export default function AiToolFinderPage() {
  const [audience, setAudience] = useState("creator");
  const [goal, setGoal] = useState("content");
  const [budget, setBudget] = useState("free");
  const [results, setResults] = useState<ToolResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const shareText = useMemo(() => {
    const top = results[0]?.tool.name || "AI tool";
    return `Best AI tool for me: ${top}. Try the AI tool finder:`;
  }, [results]);

  async function findTools() {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.pulsevian.com/api/v1"}/ai-tools/finder`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ audience, goal, budget }),
      });
      if (!res.ok) throw new Error("Finder failed");
      const data = await res.json();
      setResults(data.recommendations || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-3xl border border-orange-500/20 bg-orange-500/5 p-8 md:p-10">
        <p className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-orange-300">
          <Wand2 className="h-4 w-4" /> AI Tool Finder
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
          Find the best AI tool for your work in 30 seconds
        </h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-300">
          Choose your role, goal, and budget. Get practical recommendations with reasons, not a random list.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="h-fit rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <Picker title="I am a" value={audience} values={audiences} onChange={setAudience} />
          <Picker title="I want to do" value={goal} values={goals} onChange={setGoal} />
          <Picker title="Budget" value={budget} values={budgets} onChange={setBudget} />
          <button onClick={findTools} disabled={loading} className="mt-6 w-full rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white disabled:opacity-50">
            {loading ? "Finding..." : "Find my tools"}
          </button>
          <Link href="/ai-tools" className="mt-3 inline-flex w-full justify-center rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200">
            Browse all tools
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Recommended tools</h2>
              <p className="mt-1 text-sm text-zinc-400">{searched ? `For ${audience} / ${goal} / ${budget}` : "Choose your needs to get recommendations"}</p>
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200"
            >
              Share on WhatsApp
            </a>
          </div>

          {searched && !loading && results.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 text-sm text-zinc-300">No verified match is available yet. Try a broader goal or budget.</div>
          )}
          {results.map((result, index) => (
            <article key={`${result.tool.slug}-${index}`} className="glass-panel rounded-3xl border border-white/10 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-400">{result.tool.category}</p>
                  <h3 className="mt-3 text-2xl font-bold text-white">{index + 1}. {result.tool.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{result.tool.tagline}</p>
                </div>
                <div className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-200">{result.score}/100</div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {(result.tool.best_for || []).map((item) => <span key={item} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">{item}</span>)}
              </div>
              <div className="mt-5 grid gap-2">
                {result.reasons.map((reason) => (
                  <div key={reason} className="flex gap-2 text-sm text-zinc-300">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" /> {reason}
                  </div>
                ))}
              </div>
              <Link href={`/ai-tools/${result.tool.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100">
                View tool review <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Picker({ title, value, values, onChange }: { title: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="mb-2 text-sm font-semibold text-zinc-300">{title}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((item) => (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={value === item ? "rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white" : "rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300"}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
