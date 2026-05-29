"use client";

import { useMemo, useState } from "react";
import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/share";

type WhatsAppShareCardProps = {
  title?: string;
  text: string;
  compact?: boolean;
};

export function WhatsAppShareCard({ title = "Share card", text, compact = false }: WhatsAppShareCardProps) {
  const [copied, setCopied] = useState(false);
  const whatsappUrl = useMemo(() => buildWhatsAppUrl(text), [text]);

  async function copyText() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function nativeShare() {
    if (!navigator.share) {
      await copyText();
      return;
    }

    try {
      await navigator.share({ text });
    } catch (error: unknown) {
      if ((error as { name?: string })?.name !== "AbortError") {
        await copyText();
      }
    }
  }

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <button
          type="button"
          onClick={copyText}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
      <p className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-emerald-300">
        <MessageCircle className="h-4 w-4" /> WhatsApp Share Card
      </p>
      <h2 className="mt-3 text-xl font-bold text-white">{title}</h2>
      <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm leading-6 text-zinc-200">{text}</pre>
      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
        >
          <MessageCircle className="h-4 w-4" /> Share on WhatsApp
        </a>
        <button
          type="button"
          onClick={copyText}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy text"}
        </button>
        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>
    </section>
  );
}
