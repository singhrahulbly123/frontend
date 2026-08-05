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

export function AdSlot({ slotKey, pageType, lazy = true, estimatedHeight = "90px", className }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [placement, setPlacement] = useState<AdPlacementResponse | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  useEffect(() => {
    if (!lazy || !isLoaded || !ref.current) return;

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
  }, [isLoaded, lazy]);

  useEffect(() => {
    const loadPlacement = async () => {
      try {
        const params = new URLSearchParams({ slot_key: slotKey });
        if (pageType) params.set("page_type", pageType);

        const response = await apiFetch<{ data: AdPlacementResponse[] }>(
          `/ads/placements?${params.toString()}`
        );

        const placement = response.data?.[0];
        const isDemoPlacement = placement?.ad_code
          ? /loading the most relevant ad|ad reserved|sponsored story placement|helpful tools sponsor/i.test(placement.ad_code)
          : false;
        if (placement?.ad_code && !isDemoPlacement) {
          setPlacement(placement);
        }
      } catch {
        // Ads are optional; editorial content remains available if this request fails.
      } finally {
        setIsLoaded(true);
      }
    };

    loadPlacement();
  }, [pageType, slotKey]);

  useEffect(() => {
    if (!placement?.ad_code || !isVisible || hasTrackedImpression) return;

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
  }, [hasTrackedImpression, isVisible, pageType, placement?.ad_code, placement?.revenue_channel, slotKey]);

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

  if (!isLoaded || !placement?.ad_code) return null;

  const reservedWidth = placement.reserved_width ?? null;
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
        <div className="flex h-full w-full items-center justify-center" dangerouslySetInnerHTML={{ __html: placement.ad_code }} />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-zinc-500">
          <span className="font-semibold">Ad reserved</span>
          <span>Loading when visible to preserve page stability.</span>
        </div>
      )}
    </div>
  );
}
