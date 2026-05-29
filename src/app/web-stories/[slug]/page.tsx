import Link from "next/link";
import { apiFetch } from "@/lib/api";

type StoryPage = {
  type?: string;
  title?: string;
  text?: string;
  items?: string[];
};

type WebStory = {
  title: string;
  slug: string;
  pages?: StoryPage[];
};

async function getStory(slug: string) {
  try {
    return await apiFetch<{ data: WebStory }>(`/web-stories/${slug}`, { revalidate: 120 });
  } catch {
    return null;
  }
}

export default async function WebStoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getStory(slug);

  if (!res) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold">Story not found yet</h1>
        <Link href="/web-stories" className="mt-6 inline-flex text-orange-300">Back to stories</Link>
      </main>
    );
  }

  const story = res.data;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Web Story</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-extrabold text-white md:text-6xl">{story.title}</h1>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {(story.pages || []).map((page, index) => (
          <article key={`${page.title}-${index}`} className="flex aspect-[9/16] flex-col justify-between rounded-3xl border border-white/10 bg-zinc-950 p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">{index + 1}</span>
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
          </article>
        ))}
      </section>
    </main>
  );
}
