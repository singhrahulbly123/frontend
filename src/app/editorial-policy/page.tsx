import Link from "next/link";

export default function EditorialPolicyPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="glass-panel rounded-3xl border border-white/10 bg-zinc-950/80 p-10">
        <h1 className="text-4xl font-bold text-white">Editorial Policy</h1>
        <p className="mt-6 text-zinc-400 leading-8">
          Global AI News combines automated reporting with human review. Our editorial policy ensures that every story is verified, transparently sourced, and aligned with journalistic standards.
        </p>
        <div className="mt-10 space-y-6 text-zinc-300">
          <div>
            <h2 className="text-2xl font-semibold text-white">Human Review</h2>
            <p className="mt-3">All published stories are reviewed by human editors before they go live. This includes headline checks, source validation, and fact review.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Correction Policy</h2>
            <p className="mt-3">If we discover an error, we correct it promptly and clearly. Corrections are logged on the article page and in our transparency reports.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">AI Transparency</h2>
            <p className="mt-3">We label AI-assisted content and explain how our AI systems contribute to research, drafting, and summarization.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Source Reference Standards</h2>
            <p className="mt-3">We cite sources for every factual claim and prioritize authoritative English-language global publishers.</p>
          </div>
        </div>
        <div className="mt-10 text-sm text-zinc-500">
          <Link href="/transparency" className="text-orange-400 hover:text-orange-300">Read our transparency statement</Link>
        </div>
      </div>
    </section>
  );
}
