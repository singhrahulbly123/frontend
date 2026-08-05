import { SITE_NAME, SITE_URL } from "@/lib/site";

function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function compactLines(lines: Array<string | null | undefined>) {
  return lines.filter(Boolean).join("\n");
}

function excerpt(value: string | null | undefined, maxLength = 220) {
  if (!value) return null;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 3)}...` : normalized;
}

export function buildWhatsAppUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function buildToolShareText(tool: {
  name: string;
  category: string;
  tagline?: string | null;
  pricing?: string | null;
  rating?: number | null;
  path: string;
}) {
  return compactLines([
    `AI Tool: ${tool.name}`,
    `Category: ${tool.category}`,
    tool.tagline ? `Use: ${tool.tagline}` : null,
    tool.pricing ? `Pricing: ${tool.pricing}` : null,
    tool.rating ? `Rating: ${tool.rating}/5` : null,
    `Read review: ${absoluteUrl(tool.path)}`,
    SITE_NAME,
  ]);
}

export function buildPromptShareText(prompt: {
  title: string;
  category: string;
  audience?: string | null;
  use_case?: string | null;
  prompt: string;
  path: string;
}) {
  return compactLines([
    `AI Prompt: ${prompt.title}`,
    `Category: ${prompt.category}${prompt.audience ? ` / ${prompt.audience}` : ""}`,
    prompt.use_case ? `Use case: ${prompt.use_case}` : null,
    "Prompt:",
    excerpt(prompt.prompt, 260),
    `Open prompt: ${absoluteUrl(prompt.path)}`,
    SITE_NAME,
  ]);
}

export function buildDailyBriefShareText(brief: {
  title: string;
  summary?: string | null;
  key_updates?: string[];
  impact_india?: string | null;
  path: string;
}) {
  const updates = (brief.key_updates || [])
    .slice(0, 3)
    .map((item, index) => `${index + 1}. ${excerpt(item, 120)}`);

  return compactLines([
    `Daily AI Brief: ${brief.title}`,
    brief.summary ? excerpt(brief.summary, 180) : null,
    updates.length ? "Top updates:" : null,
    ...updates,
    brief.impact_india ? `India impact: ${excerpt(brief.impact_india, 180)}` : null,
    `Read full brief: ${absoluteUrl(brief.path)}`,
    SITE_NAME,
  ]);
}
