"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";

interface AdSlotProps {
  slotKey: string;
  pageType?: "article" | "utility" | "homepage" | "listing";
  lazy?: boolean;
  estimatedHeight?: string;
  label?: string;
  className?: string;
}

interface AdPlacementResponse {
  slot_key: string;
  page_type: string;
  ad_format: string;
  reserved_width?: number | null;
  reserved_height?: number | null;
  revenue_channel?: string | null;
  ad_code?: string | null;
  lazy_load: boolean;
}

export function AdSlot({ slotKey, pageType, lazy = true, estimatedHeight = "90px", label = "Sponsored content", className }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [placement, setPlacement] = useState<AdPlacementResponse | null>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  useEffect(() => {
    if (!lazy || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [lazy]);

  useEffect(() => {
    const loadPlacement = async () => {
      try {
        const params = new URLSearchParams({ slot_key: slotKey });
        if (pageType) params.set("page_type", pageType);

        const response = await apiFetch<{ data: AdPlacementResponse[] }>(
          `/ads/placements?${params.toString()}`
        );

        const placement = response.data?.[0];
        if (placement) {
          setPlacement(placement);
        }
      } catch {
        // no-op, keep placeholder intact
      }
    };

    loadPlacement();
  }, [pageType, slotKey]);

  useEffect(() => {
    if (!isVisible || hasTrackedImpression) return;

    const trackImpression = async () => {
      try {
        await apiFetch("/analytics/event", {
          method: "POST",
          body: JSON.stringify({
            event_type: "ad_impression",
            metadata: {
              slot_key: slotKey,
              page_type: pageType,
              revenue_channel: placement?.revenue_channel ?? "adsense",
            },
          }),
        });
      } catch {
        // ignore failures
      }
    };

    trackImpression();
    setHasTrackedImpression(true);
  }, [hasTrackedImpression, isVisible, pageType, placement?.revenue_channel, slotKey]);

  const handleClick = async () => {
    try {
      await apiFetch("/analytics/event", {
        method: "POST",
        body: JSON.stringify({
          event_type: "ad_click",
          metadata: {
            slot_key: slotKey,
            page_type: pageType,
            revenue_channel: placement?.revenue_channel ?? "adsense",
          },
        }),
      });
    } catch {
      // ignore click tracking failures
    }
  };

  const reservedWidth = placement?.reserved_width ?? null;
  const reservedHeight = placement?.reserved_height ?? null;
  const aspectRatio = reservedWidth && reservedHeight ? `${reservedWidth} / ${reservedHeight}` : undefined;

  return (
    <div
      ref={ref}
      data-ad-slot={slotKey}
      data-ad-page-type={pageType}
      onClick={handleClick}
      className={`overflow-hidden rounded-lg border border-dashed border-white/10 bg-zinc-950/80 px-4 py-6 transition-all duration-300 ease-out ${className ?? ""}`}
      aria-label={`Advertisement ${slotKey}`}
      style={{ minHeight: reservedHeight ? `${reservedHeight}px` : estimatedHeight, aspectRatio }}
    >
      {isVisible ? (
        placement?.ad_code ? (
          <div className="flex h-full w-full items-center justify-center" dangerouslySetInnerHTML={{ __html: placement.ad_code }} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-zinc-400">
            <span className="font-semibold text-white">{label}</span>
            <span>Loading the most relevant ad for this article.</span>
          </div>
        )
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-zinc-500">
          <span className="font-semibold">Ad reserved</span>
          <span>Loading when visible to preserve page stability.</span>
        </div>
      )}
    </div>
  );
}
