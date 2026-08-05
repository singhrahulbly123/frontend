"use client";

import { useMemo, useState } from "react";
import { Copy, Wand2 } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";

type MiniToolGeneratorProps = {
  tool: "headline" | "youtube-title" | "instagram-caption" | "resume-bullets";
  title: string;
  description: string;
  placeholder: string;
  contextLabel?: string;
};

const defaults = {
  headline: "AI tools for students worldwide",
  "youtube-title": "How to use ChatGPT to earn online",
  "instagram-caption": "New AI tool launch for creators",
  "resume-bullets": "Managed social media campaigns and improved engagement",
};

export function MiniToolGenerator({ tool, title, description, placeholder, contextLabel = "Extra context" }: MiniToolGeneratorProps) {
  const [topic, setTopic] = useState(defaults[tool]);
  const [tone, setTone] = useState("practical");
  const [audience, setAudience] = useState("Indian creators and professionals");
  const [language, setLanguage] = useState("Hinglish");
  const [context, setContext] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [source, setSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const shareText = useMemo(() => {
    const first = items[0] || topic;
    return `${title} result: ${first}`;
  }, [items, title, topic]);

  async function generate() {
    setLoading(true);
    setItems([]);
    setTips([]);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.pulsevian.com/api/v1"}/mini-tools/${tool}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ topic, tone, audience, context, language }),
      });
      if (!res.ok) throw new Error("Generator failed");
      const data = await res.json();
      setItems(data.items || []);
      setTips(data.tips || []);
      setSource(data.source || "template");
    } catch {
      setItems(["Generator unavailable. Please try again."]);
    } finally {
      setLoading(false);
    }
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(null), 1400);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-blue-50 p-6 shadow-[0_24px_70px_-38px_rgba(194,65,12,0.3)] sm:p-9 md:p-10">
        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-orange-200/40 blur-3xl" />
        <p className="eyebrow relative">
          <Wand2 className="h-4 w-4" /> Free AI Mini Tool
        </p>
        <h1 className="relative mt-4 max-w-4xl text-4xl font-black leading-[1.08] text-white sm:text-5xl md:text-6xl">{title}</h1>
        <p className="relative mt-5 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">{description}</p>
      </section>

      <AdSlot slotKey="utility_top" pageType="utility" estimatedHeight="120px" className="mt-8" />

      <section className="mt-6 grid items-start gap-6 sm:mt-8 lg:grid-cols-[minmax(320px,380px)_1fr]">
        <div className="premium-card h-fit p-5 sm:p-6 lg:sticky lg:top-24">
          <label className="block text-sm font-semibold text-zinc-300">
            Topic or input
            <textarea value={topic} onChange={(event) => setTopic(event.target.value)} rows={4} placeholder={placeholder} className="mt-2 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white" />
          </label>
          <label className="mt-4 block text-sm font-semibold text-zinc-300">
            Tone
            <input value={tone} onChange={(event) => setTone(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white" />
          </label>
          <label className="mt-4 block text-sm font-semibold text-zinc-300">
            Audience
            <input value={audience} onChange={(event) => setAudience(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white" />
          </label>
          <label className="mt-4 block text-sm font-semibold text-zinc-300">
            Language
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white">
              <option value="Hinglish">Hinglish</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </select>
          </label>
          <label className="mt-4 block text-sm font-semibold text-zinc-300">
            {contextLabel}
            <textarea value={context} onChange={(event) => setContext(event.target.value)} rows={3} className="mt-2 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white" />
          </label>
          <button onClick={generate} disabled={loading || !topic.trim()} className="mt-6 min-h-12 w-full rounded-xl bg-orange-500 px-5 py-3 font-bold text-white shadow-[0_10px_24px_rgba(194,65,12,0.2)] disabled:opacity-50">
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Results</h2>
              <p className="mt-1 text-sm text-zinc-500">{source ? `Generated via ${source}` : "Generate to see results"}</p>
            </div>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              Share
            </a>
          </div>
          <div className="grid gap-3">
            {items.length ? items.map((item) => (
              <div key={item} className="premium-card p-5 sm:p-6">
                <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">{item}</p>
                <button onClick={() => copy(item)} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100">
                  <Copy className="h-4 w-4" /> {copied === item ? "Copied" : "Copy"}
                </button>
              </div>
            )) : (
              <div className="premium-card p-6 text-sm leading-6 text-zinc-400 sm:p-8">Enter your topic and generate copy-ready ideas.</div>
            )}
          </div>
          <AdSlot slotKey="utility_results" pageType="utility" estimatedHeight="180px" className="mt-6" />
          {tips.length > 0 && (
            <div className="mt-6 rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6">
              <h3 className="font-bold text-orange-100">Tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                {tips.map((tip) => <li key={tip}>- {tip}</li>)}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
