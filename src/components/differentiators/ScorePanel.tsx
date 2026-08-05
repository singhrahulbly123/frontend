type ScorePanelProps = {
  title: string;
  score?: number | null;
  summary?: string | null;
  tone?: "orange" | "emerald" | "blue";
};

const toneClass = {
  orange: "border-orange-500/20 bg-orange-500/5 text-orange-300",
  emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
  blue: "border-blue-500/20 bg-blue-500/5 text-blue-300",
};

export function ScorePanel({ title, score, summary, tone = "orange" }: ScorePanelProps) {
  if (score == null) return null;
  const normalized = Math.max(0, Math.min(100, Number(score)));

  return (
    <section className={`rounded-2xl border p-5 ${toneClass[tone]}`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <span className="rounded-full bg-zinc-950 px-3 py-1 text-sm font-semibold">{normalized}/100</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-900">
        <div className="h-full rounded-full bg-current" style={{ width: `${normalized}%` }} />
      </div>
      {summary && <p className="mt-4 text-sm leading-6 text-zinc-300">{summary}</p>}
    </section>
  );
}
