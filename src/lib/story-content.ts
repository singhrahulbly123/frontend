export type StorySlide = {
  type?: string;
  title?: string;
  text?: string;
  items?: string[];
  image?: string | null;
};

export type PulsevianWebStory = {
  id: number;
  title: string;
  slug: string;
  cover_image: string;
  locale: string;
  summary: string;
  seo_description: string;
  published_at: string;
  reviewed_at: string;
  source_urls: string[];
  pages: StorySlide[];
};

const cover = "/images/ai-story-cover.webp";

export const FALLBACK_WEB_STORIES: PulsevianWebStory[] = [
  {
    id: -101,
    title: "AI News Quick Guide: Update ko 5 minute me kaise verify karein",
    slug: "ai-news-quick-guide",
    cover_image: cover,
    locale: "hi-IN",
    summary: "AI news ko blindly share karne ke bajay source, date, real user impact aur limitations check karne ka practical workflow.",
    seo_description: "AI news verification guide in Hindi: official source, publish date, India impact, limitations and action steps ko 5 minute me check karein.",
    published_at: "2026-08-05T09:00:00.000Z",
    reviewed_at: "2026-08-05T09:00:00.000Z",
    source_urls: [
      "https://openai.com/news/",
      "https://blog.google/technology/ai/",
      "https://www.anthropic.com/news",
    ],
    pages: [
      {
        type: "start",
        title: "Har AI update important nahi hoti",
        text: "Pehle samjhein: product launch hai, feature update hai, research claim hai, ya sirf social-media speculation?",
        image: cover,
      },
      {
        type: "source check",
        title: "Step 1: Original source kholo",
        text: "Company newsroom, official documentation, research paper ya regulator notice ko primary source maanein—reposted screenshot ko nahi.",
        image: cover,
      },
      {
        type: "freshness",
        title: "Step 2: Date aur availability dekho",
        items: ["Announcement date", "India me availability", "Free ya paid access", "Beta, preview ya public release"],
        image: cover,
      },
      {
        type: "user value",
        title: "Step 3: User ke liye kya badla?",
        text: "Feature ka naam repeat na karein. Batayein ki student, creator, job seeker ya business owner ka kaunsa task faster ya easier hoga.",
        image: cover,
      },
      {
        type: "limitations",
        title: "Step 4: Limitation bhi likhein",
        items: ["Accuracy risk", "Privacy consideration", "Usage limit", "Language or region limitation"],
        image: cover,
      },
      {
        type: "workflow",
        title: "5-minute verification workflow",
        items: ["Official page read karein", "Do key claims note karein", "Ek limitation identify karein", "India impact likhein", "Source link save karein"],
        image: cover,
      },
      {
        type: "avoid",
        title: "Ye 3 mistakes avoid karein",
        items: ["‘Game changer’ jaise unsupported claims", "Old screenshot ko new update batana", "Source link ke bina publish karna"],
        image: cover,
      },
      {
        type: "next step",
        title: "AI news ko action me badlein",
        text: "Daily Brief me verified update padhein, phir relevant tool profile se use cases, pros, cons aur alternatives compare karein.",
        image: cover,
      },
    ],
  },
];

export function fallbackStory(slug: string) {
  return FALLBACK_WEB_STORIES.find((story) => story.slug === slug) ?? null;
}

export function mergeWithFallbackStories<T extends { slug: string }>(stories: T[]) {
  const existing = new Set(stories.map((story) => story.slug));
  return [...stories, ...FALLBACK_WEB_STORIES.filter((story) => !existing.has(story.slug))];
}
