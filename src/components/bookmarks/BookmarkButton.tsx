"use client";

import { useEffect, useState } from "react";
import { BookmarkMinus, BookmarkPlus } from "lucide-react";
import { BookmarkType, SavedPrompt, SavedTool, isBookmarked, saveBookmark, removeBookmark } from "@/lib/bookmarks";

export function BookmarkButton({
  type,
  item,
}: {
  type: BookmarkType;
  item: SavedTool | SavedPrompt;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(type, item.id));
  }, [type, item.id]);

  function toggleBookmark() {
    if (saved) {
      removeBookmark(type, item.id);
      setSaved(false);
      return;
    }

    saveBookmark(type, item);
    setSaved(true);
  }

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
        saved
          ? "bg-emerald-500 text-white hover:bg-emerald-400"
          : "border border-white/10 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
      }`}
    >
      {saved ? <BookmarkMinus className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
