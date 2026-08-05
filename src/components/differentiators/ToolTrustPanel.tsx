type TrustBreakdown = Record<string, number>;

export function ToolTrustPanel({
  trustScore,
  opportunityScore,
  opportunitySummary,
  trustBreakdown,
}: {
  trustScore?: number;
  opportunityScore?: number;
  opportunitySummary?: string | null;
  trustBreakdown?: TrustBreakdown | null;
}) {
  const rows = Object.entries(trustBreakdown ?? {});
  if (trustScore == null && opportunityScore == null && !opportunitySummary && rows.length === 0) return null;

  return (
    <section className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {trustScore != null && <div>
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Tool Trust Score</p>
          <p className="mt-3 text-4xl font-extrabold text-white">{trustScore}/100</p>
        </div>}
        {opportunityScore != null && <div>
          <p className="text-sm uppercase tracking-[0.2em] text-orange-300">AI Opportunity Score</p>
          <p className="mt-3 text-4xl font-extrabold text-white">{opportunityScore}/100</p>
        </div>}
      </div>
      {opportunitySummary && <p className="mt-5 text-sm leading-7 text-zinc-300">{opportunitySummary}</p>}
      {rows.length > 0 && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="capitalize text-zinc-300">{label.replace(/_/g, " ")}</span>
                <span className="font-semibold text-emerald-300">{value}/100</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
