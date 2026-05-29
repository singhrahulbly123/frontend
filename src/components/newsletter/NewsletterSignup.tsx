"use client";

import { useState } from "react";

export function NewsletterSignup({ segment = "daily_ai_brief" }: { segment?: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function subscribe() {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.pulsevian.com/api/v1"}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, segment, interests: ["ai_news", "tools", "learning"] }),
      });
      if (!res.ok) throw new Error("Subscribe failed");
      setEmail("");
      setMessage("Subscribed. Daily AI brief aapko milta rahega.");
    } catch {
      setError("Subscribe nahi ho paya. Email check karke retry karein.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6">
      <h3 className="text-xl font-bold text-white">Daily AI Digest</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-300">AI news, tools, prompts, aur learning links ek short email me.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="email@example.com" className="min-w-0 flex-1 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white" />
        <button onClick={subscribe} disabled={loading || !email} className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  );
}
