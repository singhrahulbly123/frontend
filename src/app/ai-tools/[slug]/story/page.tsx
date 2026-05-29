import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhatsAppShareCard } from "@/components/share/WhatsAppShareCard";

type StoryPage = {
  type?: string;
  title?: string;
  text?: string;
  items?: string[];
  badge?: string;
  cta_label?: string;
  cta_url?: string;
};

type ToolStory = {
  slug: string;
  title: string;
  pages: StoryPage[];
  source?: { slug?: string };
  seo?: { title?: string; description?: string; canonical_path?: string };
};

async function getToolStory(slug: string) {
  try {
    return await apiFetch<{ data: ToolStory }>(`/ai-tools/${slug}/web-story`, { revalidate: 300 });
  } catch {
    return null;
  }
}

export default async function ToolStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getToolStory(slug);

  if (!res) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold">Tool story not found yet</h1>
        <Link href="/ai-tools" className="mt-6 inline-flex text-orange-300">Back to AI tools</Link>
      </main>
    );
  }

  const story = res.data;
  const shareText = `${story.title}\n\nSwipe through pricing, use cases, pros, cons, and alternatives.\n\n${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/ai-tools/${slug}/story`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.seo?.title || story.title,
    description: story.seo?.description,
    mainEntityOfPage: story.seo?.canonical_path || `/ai-tools/${slug}/story`,
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd data={schema} />
      <p className="text-sm uppercase tracking-[0.24em] text-orange-400">AI Tool Web Story</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-extrabold text-white md:text-6xl">{story.title}</h1>
      {story.seo?.description && <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">{story.seo.description}</p>}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {story.pages.map((page, index) => (
          <article key={`${page.type}-${index}`} className="flex aspect-[9/16] flex-col justify-between rounded-3xl border border-white/10 bg-zinc-950 p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">{index + 1}</span>
              {page.badge && <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">{page.badge}</span>}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-orange-400">{page.type || "slide"}</p>
              <h2 className="mt-3 text-2xl font-bold text-white">{page.title}</h2>
              {page.text && <p className="mt-4 text-sm leading-6 text-zinc-300">{page.text}</p>}
              {(page.items || []).length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  {(page.items || []).map((item) => <li key={item}>- {item}</li>)}
                </ul>
              )}
              {page.cta_url && (
                <Link href={page.cta_url} className="mt-5 inline-flex rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
                  {page.cta_label || "Open"}
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>
      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_360px]">
        <Link href={`/ai-tools/${slug}`} className="inline-flex w-fit rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white">
          Read full tool review
        </Link>
        <WhatsAppShareCard title="Share this tool story" text={shareText} />
      </div>
    </main>
  );
}
