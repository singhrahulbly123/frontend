import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { apiFetch } from "@/lib/api";

export const revalidate = 180;

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
};

const starter: AiComparison[] = [
  {
    id: 1,
    title: "ChatGPT vs Gemini: which AI assistant is better?",
    slug: "chatgpt-vs-gemini-global-users",
    category: "AI Assistants",
    tool_a: "ChatGPT",
    tool_b: "Gemini",
    winner: "ChatGPT for writing, Gemini for Google ecosystem",
    summary: "ChatGPT is strong for writing and prompt control, while Gemini is useful for Google ecosystem and multimodal tasks.",
    best_for: ["Students", "Creators", "Research"],
  },
];

async function getComparisons() {
  try {
    const res = await apiFetch<{ data: AiComparison[] }>("/comparisons?per_page=48", { revalidate: 180 });
    return res.data.length ? res.data : starter;
  } catch {
    return starter;
  }
}

export default async function ComparePage() {
  const comparisons = await getComparisons();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-10">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">AI Comparisons</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
          Compare AI tools before spending time or money
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400">
          Practical comparison pages for global users: pricing, best use case, winner, pros/cons, and FAQs.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {comparisons.map((item) => (
          <Link key={item.id} href={`/compare/${item.slug}`} className="glass-panel group rounded-3xl border border-white/10 p-6 transition hover:-translate-y-1 hover:border-orange-400/50">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-400">{item.category}</p>
            <h2 className="mt-3 text-2xl font-bold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{item.summary}</p>
            {item.winner && (
              <div className="mt-5 flex gap-2 rounded-2xl bg-orange-500/10 p-3 text-sm text-orange-100">
                <Trophy className="h-4 w-4 shrink-0" /> Winner: {item.winner}
              </div>
            )}
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-orange-300">
              Read comparison <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
