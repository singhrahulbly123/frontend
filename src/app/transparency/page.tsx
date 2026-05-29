export default function TransparencyPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="glass-panel rounded-3xl border border-white/10 bg-zinc-950/80 p-10">
        <h1 className="text-4xl font-bold text-white">Transparency</h1>
        <p className="mt-6 text-zinc-400 leading-8">
          We believe readers deserve clarity about how our news is produced. This page explains our AI, editorial, and content quality practices.
        </p>
        <div className="mt-10 space-y-6 text-zinc-300">
          <div>
            <h2 className="text-2xl font-semibold text-white">AI Use</h2>
            <p className="mt-3">AI helps with research, summarization, and drafting. Final publishing decisions are made by human editors.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Editorial Accountability</h2>
            <p className="mt-3">We disclose corrections, update history, and the human review status of each article.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Author Credentials</h2>
            <p className="mt-3">Authors are verified by our editorial team and their expertise is shown on their profile pages.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Source Transparency</h2>
            <p className="mt-3">We list source references in article metadata and encourage readers to review original reporting.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
