"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";

type ToolAffiliateCtaProps = {
  toolId: number;
  toolName: string;
  href: string;
  label?: string;
};

export function ToolAffiliateCta({ toolId, toolName, href, label = "Visit tool" }: ToolAffiliateCtaProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      await apiFetch("/analytics/event", {
        method: "POST",
        body: JSON.stringify({
          event_type: "ai_tool_cta_click",
          trackable_type: "App\\Models\\AiTool",
          trackable_id: toolId,
          metadata: {
            tool_name: toolName,
            destination_url: href,
            placement: "tool_detail_sidebar",
            source_type: "ai_tool",
            source_id: toolId,
          },
        }),
      });
    } catch {
      // keep outbound navigation working when analytics is unavailable
    } finally {
      window.location.href = href;
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
    >
      {loading ? "Opening..." : label} <ArrowRight className="h-4 w-4" />
    </button>
  );
}
