export default function FactCheckPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="glass-panel rounded-3xl border border-white/10 bg-zinc-950/80 p-10">
        <h1 className="text-4xl font-bold text-white">Fact Check</h1>
        <p className="mt-6 text-zinc-400 leading-8">
          Global AI News maintains a dedicated fact-check workflow. We evaluate claims with multiple sources, identify misinformation, and surface evidence for every article.
        </p>
        <div className="mt-10 space-y-6 text-zinc-300">
          <div>
            <h2 className="text-2xl font-semibold text-white">Verification Process</h2>
            <p className="mt-3">Each article is reviewed for accuracy before publishing. Articles marked “fact checked” have verified claims and confirmed sources.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Plagiarism and AI Quality</h2>
            <p className="mt-3">We run content through our AI quality engine to detect plagiarism, hallucinations, and spam risks.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Corrections and Updates</h2>
            <p className="mt-3">Corrections are published openly. Updated stories include clear timestamps and editorial notes where applicable.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Sources</h2>
            <p className="mt-3">Whenever possible, we link to original reporting, official statements, and public documents.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
