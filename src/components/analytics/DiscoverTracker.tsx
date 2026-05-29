"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function DiscoverTracker({ articleId, articleSlug }: { articleId: number; articleSlug: string }) {
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    if (tracked || typeof window === "undefined" || !articleId || !articleSlug) return;

    const params = new URLSearchParams(window.location.search);
    const isDiscover = params.get("utm_source")?.includes("discover") || params.get("source") === "discover";
    const referrer = document.referrer || "";
    const isGoogle = referrer.includes("google.com") || referrer.includes("news.google.com");

    const recordView = apiFetch(`/articles/${articleSlug}/view`, {
      method: "POST",
    }).catch(() => {
      // ignore view tracking failures
    });

    if (!isDiscover && !isGoogle) {
      recordView.then(() => setTracked(true));
      return;
    }

    Promise.allSettled([
      recordView,
      apiFetch("/analytics/event", {
        method: "POST",
        body: JSON.stringify({
          event_type: "discover_click",
          trackable_type: "App\\Models\\Article",
          trackable_id: articleId,
          metadata: { source: "discover", referrer },
        }),
      }),
    ]).finally(() => setTracked(true));
  }, [articleId, articleSlug, tracked]);

  return null;
}
