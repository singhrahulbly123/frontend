"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy } from "lucide-react";
import { absoluteUrl } from "@/lib/site";

interface Props {
  title: string;
  slug: string;
}

export default function ShareActions({ title, slug }: Props) {
  const [status, setStatus] = useState<string | null>(null);

  const shareUrl = absoluteUrl(`/news/${slug}`);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus("Link copied to clipboard!");
      window.setTimeout(() => setStatus(null), 2500);
    } catch {
      setStatus("Copy failed.");
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      copyLink();
      return;
    }

    try {
      await navigator.share({
        title,
        url: shareUrl,
      });
      setStatus("Shared successfully.");
    } catch (error: unknown) {
      if ((error as { name?: string })?.name !== "AbortError") {
        setStatus("Share failed.");
      }
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/10 bg-zinc-950/80 p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Share this story</p>
      <h3 className="mt-3 text-xl font-semibold text-white">Spread the word</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">Use quick share actions for mobile and web discovery.</p>

      <div className="mt-6 flex flex-col gap-3">
        <Button onClick={handleShare} className="w-full" variant="outline">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
        <Button onClick={copyLink} className="w-full" variant="ghost">
          <Copy className="mr-2 h-4 w-4" /> Copy link
        </Button>
      </div>

      {status && <p className="mt-4 text-sm text-zinc-300">{status}</p>}
    </div>
  );
}
