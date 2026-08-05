import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { fallbackStory, type PulsevianWebStory } from "@/lib/story-content";

async function getStory(slug: string) {
  try {
    return await apiFetch<{ data: PulsevianWebStory }>(`/web-stories/${slug}`, { revalidate: 120 });
  } catch {
    const story = fallbackStory(slug);
    return story ? { data: story } : null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await getStory(slug);
  if (!res) return { title: "Web story not found", robots: { index: false, follow: true } };
  return { title: res.data.title, description: res.data.seo_description || `Read ${res.data.title} as a short, mobile-friendly Pulsevian web story.`, alternates: { canonical: `/web-stories/${res.data.slug}` } };
}

export default async function WebStoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getStory(slug);

  if (!res) {
    notFound();
  }

  const story = res.data;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="eyebrow">Web Story · Human reviewed</p>
      <h1 className="mt-4 max-w-5xl text-4xl font-black md:text-6xl">{story.title}</h1>
      {story.summary ? <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{story.summary}</p> : null}
      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(story.pages || []).map((page, index) => (
          <article key={`${page.title}-${index}`} className="dark-surface relative flex aspect-[9/16] overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-xl">
            {page.image || story.cover_image ? <Image src={page.image || story.cover_image} alt="" fill className="object-cover" unoptimized /> : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/15" />
            <div className="relative flex h-full w-full flex-col justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">{index + 1}</span>
              <div>
              <p className="text-xs uppercase tracking-[0.2em] text-orange-400">{page.type || "slide"}</p>
              <h2 className="mt-3 text-2xl font-bold text-white">{page.title}</h2>
              {page.text && <p className="mt-4 text-sm leading-6 text-zinc-300">{page.text}</p>}
              {(page.items || []).length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  {(page.items || []).map((item) => <li key={item}>- {item}</li>)}
                </ul>
              )}
              </div>
            </div>
          </article>
        ))}
      </section>
      {(story.source_urls || []).length ? <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-black">Primary sources to verify updates</h2><p className="mt-2 text-sm leading-6 text-slate-600">AI products fast change hote hain. Publish ya purchase decision se pehle official source kholkar current details check karein.</p><div className="mt-4 flex flex-wrap gap-2">{story.source_urls.map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer" className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-800">Official source {index + 1}</a>)}</div></section> : null}
    </main>
  );
}
