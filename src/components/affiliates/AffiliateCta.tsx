"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { AffiliateLink } from "@/types";

interface AffiliateCtaProps {
  links: AffiliateLink[];
  articleId?: number;
  articleSlug?: string;
  placement?: string;
}

export default function AffiliateCta({ links, articleId, articleSlug, placement = "article_recommendation" }: AffiliateCtaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  const primaryLink = useMemo(
    () =>
      [...links].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0],
    [links]
  );

  useEffect(() => {
    if (!ref.current || hasTrackedImpression || !primaryLink) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          apiFetch("/analytics/event", {
            method: "POST",
            body: JSON.stringify({
              event_type: "affiliate_cta_impression",
              trackable_type: "App\\Models\\AffiliateLink",
              trackable_id: primaryLink.id,
              metadata: { slug: primaryLink.slug, placement, article_id: articleId, article_slug: articleSlug },
            }),
          }).catch(() => {
            // ignore impression failures
          });
          setHasTrackedImpression(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [articleId, articleSlug, hasTrackedImpression, placement, primaryLink]);

  if (!primaryLink) {
    return null;
  }

  const handleClick = async () => {
    if (!primaryLink) return;

    setIsLoading(true);

    try {
      const result = await apiFetch<{ redirect: string }>(`/affiliate/${primaryLink.slug}/click`, {
        method: "POST",
        body: JSON.stringify({
          placement,
          article_id: articleId,
          article_slug: articleSlug,
          source_type: "article",
          source_id: articleId,
        }),
      });

      await apiFetch("/analytics/event", {
        method: "POST",
        body: JSON.stringify({
          event_type: "affiliate_cta_click",
          trackable_type: "App\\Models\\AffiliateLink",
          trackable_id: primaryLink.id,
          metadata: { slug: primaryLink.slug, placement, article_id: articleId, article_slug: articleSlug },
        }),
      });

      window.location.href = result.redirect;
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div ref={ref} className="glass-panel rounded-3xl border border-white/10 bg-zinc-950/90 p-6 shadow-xl shadow-black/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Sponsored recommendation</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">{primaryLink.name}</h2>
          {primaryLink.description && (
            <p className="mt-2 text-zinc-400">{primaryLink.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Redirecting..." : "Explore offer"}
        </button>
      </div>
      {Boolean(primaryLink.comparison_data) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Why this offer</p>
            <p className="mt-2 text-sm text-zinc-300">Best savings for this article topic.</p>
          </div>
          <div className="rounded-3xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Trusted partner</p>
            <p className="mt-2 text-sm text-zinc-300">Verified partner link with transparent tracking.</p>
          </div>
        </div>
      )}
    </div>
  );
}
