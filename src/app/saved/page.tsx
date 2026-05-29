"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { BookmarkData, clearBookmarks, getSavedBookmarks, removeBookmark } from "@/lib/bookmarks";

const emptyState = {
  tools: [],
  prompts: [],
};

export default function SavedItemsPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkData>(emptyState);

  useEffect(() => {
    setBookmarks(getSavedBookmarks());
  }, []);

  function handleRemove(type: "tool" | "prompt", id: number) {
    removeBookmark(type, id);
    setBookmarks(getSavedBookmarks());
  }

  function handleClear() {
    clearBookmarks();
    setBookmarks(emptyState);
  }

  const hasSavedItems = bookmarks.tools.length > 0 || bookmarks.prompts.length > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-zinc-950 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Saved</p>
          <h1 className="mt-3 text-4xl font-extrabold text-white">Your saved tools and prompts</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Bookmarked items are stored locally so you can reuse them quickly while browsing AI tools and prompt templates.
          </p>
        </div>
        {hasSavedItems && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800"
          >
            <X className="h-4 w-4" /> Clear saved items
          </button>
        )}
      </div>

      {!hasSavedItems ? (
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-10 text-center text-sm text-zinc-300">
          <p className="text-lg font-semibold text-white">No saved tools or prompts yet.</p>
          <p className="mt-3">Start saving useful tools and prompts from the AI Tools or Prompts pages.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/ai-tools" className="rounded-2xl border border-white/10 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-100 hover:bg-zinc-800">
              Browse tools
            </Link>
            <Link href="/prompts" className="rounded-2xl border border-white/10 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-100 hover:bg-zinc-800">
              Browse prompts
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {bookmarks.tools.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Tools</p>
                  <h2 className="text-2xl font-bold text-white">Saved AI tools</h2>
                </div>
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-300">{bookmarks.tools.length} items</span>
              </div>
              {bookmarks.tools.map((tool) => (
                <article key={tool.id} className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-orange-400">{tool.category}</p>
                      <h3 className="mt-2 text-xl font-semibold text-white">{tool.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{tool.tagline}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/ai-tools/${tool.slug}`} className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800">
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove("tool", tool.id)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-700"
                      >
                        <X className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {bookmarks.prompts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Prompts</p>
                  <h2 className="text-2xl font-bold text-white">Saved prompt templates</h2>
                </div>
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-300">{bookmarks.prompts.length} items</span>
              </div>
              {bookmarks.prompts.map((prompt) => (
                <article key={prompt.id} className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-orange-400">{prompt.category}</p>
                      <h3 className="mt-2 text-xl font-semibold text-white">{prompt.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{prompt.use_case}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/prompts/${prompt.slug}`} className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800">
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove("prompt", prompt.id)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-700"
                      >
                        <X className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      )}
    </main>
  );
}
