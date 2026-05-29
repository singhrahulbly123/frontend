"use client";

import type { ReactNode } from "react";
import { AdSlot } from "@/components/ads/AdSlot";

interface ArticleBodyWithAdsProps {
  html: string;
  adSlotKeys?: string[];
}

export function ArticleBodyWithAds({ html, adSlotKeys = ["article_inline_1", "article_inline_2"] }: ArticleBodyWithAdsProps) {
  const paragraphs = html.split(/<\/p>/i);

  if (!html.trim()) {
    return null;
  }

  return (
    <div className="prose prose-invert prose-lg max-w-none space-y-8">
      {paragraphs.flatMap((segment, index) => {
        const isLast = index === paragraphs.length - 1;
        const content = segment.trim() ? segment + (isLast ? "" : "</p>") : "";
        const nodes = [] as ReactNode[];

        if (content) {
          nodes.push(
            <div key={`paragraph-${index}`} dangerouslySetInnerHTML={{ __html: content }} />
          );
        }

        const insertPositions = [1, 3];
        const slotIndex = insertPositions.indexOf(index);

        if (!isLast && slotIndex !== -1 && adSlotKeys[slotIndex]) {
          nodes.push(
            <AdSlot
              key={`inline-ad-${index}`}
              slotKey={adSlotKeys[slotIndex]}
              pageType="article"
              className="my-10"
              lazy
            />
          );
        }

        return nodes;
      })}
    </div>
  );
}
