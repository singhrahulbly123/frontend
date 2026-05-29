"use client";

import { useState } from "react";
import SpeechReader from "@/components/audio/SpeechReader";

type Props = { articleId: number; articleSlug: string; initialSummary?: string | null };

export default function AiSummaryBox({ articleId, articleSlug, initialSummary }: Props) {
  const [summary, setSummary] = useState<string | null>(initialSummary ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ai/articles/${articleId}/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${res.status}: ${text}`);
      }

      const data = await res.json() as { summary?: string | null };
      setSummary(data.summary ?? null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="mt-6 glass-panel rounded-2xl border-l-4 border-orange-500 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase text-orange-400">AI Summary</p>
        {!summary && (
          <button
            onClick={generate}
            disabled={loading}
            className="text-sm text-orange-400 hover:underline disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {summary ? (
        <>
          <p className="mt-2 text-zinc-300">{summary}</p>
          <div className="mt-4">
            <SpeechReader
              text={summary}
              title="30 सेकंड में सुनें"
              compact
              analyticsContext={{ articleId, articleSlug, mode: "summary" }}
            />
          </div>
        </>
      ) : (
        <p className="mt-2 text-zinc-400">No AI summary yet. Generate to create one.</p>
      )}
    </aside>
  );
}
