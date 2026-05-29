export type BookmarkType = "tool" | "prompt";

export type SavedTool = {
  id: number;
  name: string;
  slug: string;
  category: string;
  tagline?: string | null;
  pricing?: string | null;
};

export type SavedPrompt = {
  id: number;
  title: string;
  slug: string;
  category: string;
  audience?: string | null;
  use_case?: string | null;
  prompt: string;
};

export type BookmarkData = {
  tools: SavedTool[];
  prompts: SavedPrompt[];
};

const STORAGE_KEY = "aihindinews_saved_bookmarks_v1";

function parseBookmarks(value: string | null): BookmarkData {
  if (!value) {
    return { tools: [], prompts: [] };
  }

  try {
    const parsed = JSON.parse(value) as BookmarkData;
    return {
      tools: Array.isArray(parsed.tools) ? parsed.tools : [],
      prompts: Array.isArray(parsed.prompts) ? parsed.prompts : [],
    };
  } catch {
    return { tools: [], prompts: [] };
  }
}

export function getSavedBookmarks(): BookmarkData {
  if (typeof window === "undefined") return { tools: [], prompts: [] };
  return parseBookmarks(window.localStorage.getItem(STORAGE_KEY));
}

function storeSavedBookmarks(bookmarks: BookmarkData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function isBookmarked(type: BookmarkType, id: number): boolean {
  const bookmarks = getSavedBookmarks();
  const items = type === "tool" ? bookmarks.tools : bookmarks.prompts;
  return items.some((item) => item.id === id);
}

export function saveBookmark(type: BookmarkType, item: SavedTool | SavedPrompt): void {
  const bookmarks = getSavedBookmarks();

  if (type === "tool") {
    const tools = bookmarks.tools.filter((tool) => tool.id !== item.id);
    tools.unshift(item as SavedTool);
    storeSavedBookmarks({ ...bookmarks, tools });
  } else {
    const prompts = bookmarks.prompts.filter((prompt) => prompt.id !== item.id);
    prompts.unshift(item as SavedPrompt);
    storeSavedBookmarks({ ...bookmarks, prompts });
  }
}

export function removeBookmark(type: BookmarkType, id: number): void {
  const bookmarks = getSavedBookmarks();

  if (type === "tool") {
    storeSavedBookmarks({ ...bookmarks, tools: bookmarks.tools.filter((tool) => tool.id !== id) });
  } else {
    storeSavedBookmarks({ ...bookmarks, prompts: bookmarks.prompts.filter((prompt) => prompt.id !== id) });
  }
}

export function clearBookmarks(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
