import Link from "next/link";
import type { Article, Author } from "@/types";
import { apiFetch } from "@/lib/api";
import { ArrowRight, CheckCircle, ExternalLink } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const res = await apiFetch<{ data: Author }>(`/authors/${slug}`, { revalidate: 120 });
    return {
      title: `${res.data.display_name} | Author Profile`,
      description: res.data.bio || "Verified Global AI News author profile.",
    };
  } catch {
    return { title: "Author" };
  }
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const res = await apiFetch<{ data: Author; articles: Article[] }>(`/authors/${slug}`, { revalidate: 120 });
  const author = res.data;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="glass-panel rounded-3xl border border-white/10 bg-zinc-950/80 p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Author Profile</p>
            <h1 className="mt-4 text-4xl font-bold text-white">{author.display_name}</h1>
            <p className="mt-4 text-zinc-400 leading-8">{author.bio}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
              {author.designation && <span>{author.designation}</span>}
              {author.is_verified && (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
                  <CheckCircle className="h-4 w-4" /> Verified author
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {author.social_links?.twitter && (
              <Link href={author.social_links.twitter} className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-orange-300 transition hover:border-orange-400" target="_blank">
                <ExternalLink className="h-4 w-4" /> Twitter
              </Link>
            )}
            {author.social_links?.linkedin && (
              <Link href={author.social_links.linkedin} className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-orange-300 transition hover:border-orange-400" target="_blank">
                <ExternalLink className="h-4 w-4" /> LinkedIn
              </Link>
            )}
          </div>
        </div>

        {Array.isArray(author.expertise_topics) && author.expertise_topics.length > 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-zinc-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Expertise</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {author.expertise_topics.map((topic) => (
                <span key={topic} className="rounded-full bg-orange-500/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-orange-300">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
          <div className="mt-6 grid gap-4">
            {res.articles.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 transition hover:border-orange-400">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4 text-sm text-zinc-400">
                    <span>{article.category?.name || "General"}</span>
                    <span>{article.published_at ? new Date(article.published_at).toLocaleDateString("hi-IN") : "AI generated"}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{article.title}</h3>
                  <p className="text-sm text-zinc-400 line-clamp-2">{article.ai_summary || article.excerpt}</p>
                  <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
                    Read story <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
