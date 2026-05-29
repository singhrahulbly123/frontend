"use client";

import { useState } from "react";

export function PromptCopyButton({ prompt, id }: { prompt: string; id?: number }) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.pulsevian.com/api/v1"}/prompts/${id}/copy`, {
        method: "POST",
        headers: { Accept: "application/json" },
      }).catch(() => {});
    }
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button onClick={copyPrompt} className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
      {copied ? "Copied" : "Copy prompt"}
    </button>
  );
}
