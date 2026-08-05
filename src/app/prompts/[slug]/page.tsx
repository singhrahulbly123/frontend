import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PromptCopyButton } from "@/components/prompts/PromptCopyButton";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { apiFetch } from "@/lib/api";
import { WhatsAppShareCard } from "@/components/share/WhatsAppShareCard";
import { buildPromptShareText } from "@/lib/share";

type PromptTemplate = {
  id: number;
  title: string;
  slug: string;
  category: string;
  audience?: string | null;
  language?: string | null;
  use_case?: string | null;
  prompt: string;
  tags?: string[];
};

async function getPrompt(slug: string) {
  try {
    return await apiFetch<{ data: PromptTemplate }>(`/prompts/${slug}`, { revalidate: 300 });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPrompt(slug);
  if (!res) return { title: "Prompt not found", robots: { index: false, follow: true } };
  const prompt = res.data;
  const description = prompt.use_case || `Copy-ready ${prompt.category} prompt for ${prompt.audience || "practical AI users"}.`;
  return { title: prompt.title, description, alternates: { canonical: `/prompts/${prompt.slug}` } };
}

export default async function PromptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getPrompt(slug);

  if (!res) {
    notFound();
  }

  const prompt = res.data;
  const shareText = buildPromptShareText({ ...prompt, path: `/prompts/${prompt.slug}` });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm uppercase tracking-[0.24em] text-orange-400">{prompt.category} / {prompt.audience || "All users"}</p>
      <h1 className="mt-3 text-4xl font-extrabold text-white md:text-6xl">{prompt.title}</h1>
      <p className="mt-5 text-sm leading-7 text-zinc-400">{prompt.use_case}</p>
      <pre className="mt-8 whitespace-pre-wrap rounded-3xl border border-white/10 bg-zinc-950 p-6 text-sm leading-7 text-zinc-100">{prompt.prompt}</pre>
      <div className="mt-6 flex flex-wrap gap-3">
        <PromptCopyButton prompt={prompt.prompt} id={prompt.id} />
        <BookmarkButton type="prompt" item={prompt} />
        <Link href="/prompts" className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200">More prompts</Link>
      </div>
      <div className="mt-8">
        <WhatsAppShareCard title={`Share ${prompt.title}`} text={shareText} />
      </div>
    </main>
  );
}
