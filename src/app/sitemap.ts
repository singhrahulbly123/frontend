import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

type PublicItem = {
  slug: string;
  updated_at?: string | null;
  published_at?: string | null;
};

type PublicResponse = {
  data?: PublicItem[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.pulsevian.com/api/v1";

const staticPages: Array<{
  path: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
}> = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/ai-tools", priority: 0.9, changeFrequency: "daily" },
  { path: "/ai-tool-finder", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools/headline-generator", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools/youtube-title-generator", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools/instagram-caption-generator", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools/resume-bullet-generator", priority: 0.9, changeFrequency: "weekly" },
  { path: "/compare", priority: 0.8, changeFrequency: "weekly" },
  { path: "/prompts", priority: 0.8, changeFrequency: "weekly" },
  { path: "/learn-ai", priority: 0.8, changeFrequency: "weekly" },
  { path: "/ai-skills", priority: 0.8, changeFrequency: "weekly" },
  { path: "/daily-ai-brief", priority: 0.8, changeFrequency: "daily" },
  { path: "/news", priority: 0.7, changeFrequency: "daily" },
  { path: "/categories", priority: 0.6, changeFrequency: "weekly" },
  { path: "/web-stories", priority: 0.6, changeFrequency: "weekly" },
  { path: "/about", priority: 0.4, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.3, changeFrequency: "yearly" },
  { path: "/editorial-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/fact-check", priority: 0.3, changeFrequency: "yearly" },
  { path: "/transparency", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/affiliate-disclosure", priority: 0.2, changeFrequency: "yearly" },
];

async function fetchItems(path: string): Promise<PublicItem[]> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];
    const payload = (await response.json()) as PublicResponse;
    return Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}

function dynamicEntries(items: PublicItem[], prefix: string, priority: number): MetadataRoute.Sitemap {
  return items
    .filter((item) => Boolean(item.slug))
    .map((item) => ({
      url: `${SITE_URL}${prefix}/${item.slug}`,
      lastModified: item.updated_at || item.published_at || new Date(),
      changeFrequency: "weekly" as const,
      priority,
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, tools, prompts, comparisons, paths, skills, stories, briefs, categories] = await Promise.all([
    fetchItems("/articles?per_page=50"),
    fetchItems("/ai-tools?per_page=50"),
    fetchItems("/prompts?per_page=50"),
    fetchItems("/comparisons?per_page=50"),
    fetchItems("/learning-paths?per_page=50"),
    fetchItems("/ai-skills?per_page=50"),
    fetchItems("/web-stories"),
    fetchItems("/daily-briefs?per_page=50"),
    fetchItems("/categories"),
  ]);

  return [
    ...staticPages.map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...dynamicEntries(articles, "/news", 0.8),
    ...dynamicEntries(tools, "/ai-tools", 0.8),
    ...dynamicEntries(prompts, "/prompts", 0.7),
    ...dynamicEntries(comparisons, "/compare", 0.7),
    ...dynamicEntries(paths, "/learn-ai", 0.7),
    ...dynamicEntries(skills, "/ai-skills", 0.7),
    ...dynamicEntries(stories, "/web-stories", 0.6),
    ...dynamicEntries(briefs, "/daily-ai-brief", 0.6),
    ...dynamicEntries(categories, "/category", 0.5),
  ];
}
