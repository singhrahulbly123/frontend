import Image from "next/image";
import { apiFetch } from "@/lib/api";
import type { Article } from "@/types";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleBodyWithAds } from "@/components/ads/ArticleBodyWithAds";
import AffiliateCta from "@/components/affiliates/AffiliateCta";
import { ArticleCard } from "@/components/articles/ArticleCard";
import ShareActions from "@/components/articles/ShareActions";
import DiscoverTracker from "@/components/analytics/DiscoverTracker";
import { Shield, Sparkles, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import AiSummaryBox from "@/components/ai/AiSummaryBox";
import { ScorePanel } from "@/components/differentiators/ScorePanel";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const { data } = await apiFetch<{ data: Article }>(`/articles/${slug}`, { revalidate: 60 });
    const image = data.seo?.og_image || data.discover_thumbnail || data.featured_image_optimized || data.featured_image;
    return {
      title: data.seo?.meta_title || data.title,
      description: data.seo?.meta_description || data.excerpt,
      alternates: { canonical: `/news/${slug}` },
      openGraph: image
        ? {
            images: [
              {
                url: image,
                width: 1200,
                height: 675,
              },
            ],
          }
        : undefined,
    };
  } catch {
    return { title: "Article" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article: Article;
  let related: Article[] = [];
  let schema: object = {};

  try {
    const res = await apiFetch<{ data: Article; related: Article[] }>(`/articles/${slug}`, { revalidate: 60 });
    article = res.data;
    related = res.related ?? [];
    const schemaRes = await apiFetch<{ schema: object }>(`/seo/schema/${slug}`, { revalidate: 300 });
    schema = schemaRes.schema;
  } catch {
    notFound();
  }

  return (
    <article className="mx-auto max-w-7xl px-4 py-8">
      <JsonLd data={schema} />
      <DiscoverTracker articleId={article.id} articleSlug={article.slug} />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10">
        <section className="space-y-10">
          <div className="glass-panel rounded-[2.5rem] border border-white/10 bg-zinc-950/80 p-8 shadow-2xl shadow-orange-500/10">
            {article.category && (
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-400">{article.category.name}</span>
            )}
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">
              {article.title}
            </h1>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Published</p>
                <p className="mt-2 font-semibold text-white">{formatDate(article.published_at)}</p>
                {article.updated_at && article.updated_at !== article.published_at && (
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-green-300">Updated {formatDate(article.updated_at)}</p>
                )}
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Reading</p>
                <p className="mt-2 font-semibold text-white">{article.reading_time_minutes ?? 2} min</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Verified</p>
                <p className="mt-2 flex items-center gap-2 font-semibold text-white">
                  {article.human_reviewed ? "Human reviewed" : "AI assisted"}
                  {article.human_reviewed ? <Shield className="h-4 w-4 text-green-400" /> : <Sparkles className="h-4 w-4 text-orange-400" />}
                </p>
              </div>
              {article.fact_checked && (
                <div className="rounded-3xl bg-emerald-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Fact checked</p>
                  <p className="mt-2 text-sm font-semibold text-white">This story has been reviewed for accuracy.</p>
                </div>
              )}
            </div>

            {(article.featured_image_optimized || article.featured_image) && (
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 shadow-xl shadow-black/30">
                <Image
                  src={article.featured_image_optimized ?? article.featured_image ?? ''}
                  alt={article.title}
                  width={1200}
                  height={700}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags?.slice(0, 6).map((tag) => (
                <span key={tag} className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
                  {tag}
                </span>
              ))}
            </div>
            {article.content_quality && (
              <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold text-white">Content quality</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-zinc-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Quality score</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{article.content_quality.seo_score ?? 0}</p>
                  </div>
                  <div className="rounded-3xl bg-zinc-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Plagiarism risk</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{article.content_quality.plagiarism_score ?? 0}%</p>
                  </div>
                  <div className="rounded-3xl bg-zinc-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Hallucination risk</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{article.content_quality.hallucination_risk ?? 0}%</p>
                  </div>
                  <div className="rounded-3xl bg-zinc-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Spam risk</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{article.content_quality.spam_score ?? 0}%</p>
                  </div>
                </div>
                {Array.isArray(article.content_quality.fact_checks) && article.content_quality.fact_checks.length > 0 && (
                  <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-900/80 p-4">
                    <h3 className="text-sm font-semibold text-white">Fact check notes</h3>
                    <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                      {article.content_quality.fact_checks.map((fact, index) => (
                        <li key={index}>{typeof fact === 'string' ? fact : JSON.stringify(fact)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>

          <AiSummaryBox articleId={article.id} articleSlug={article.slug} initialSummary={article.ai_summary} />

          <div className="grid gap-4 md:grid-cols-2">
            <ScorePanel
              title="India Impact Score"
              score={article.india_impact_score}
              summary={article.india_impact_summary}
              tone="orange"
            />
            <ScorePanel
              title="AI Opportunity Score"
              score={article.ai_opportunity_score}
              summary={article.ai_opportunity_summary}
              tone="emerald"
            />
          </div>

          <AdSlot slotKey="article_top" pageType="article" className="my-10" />

          {article.affiliate_links && article.affiliate_links.length > 0 && (
            <AffiliateCta links={article.affiliate_links} articleId={article.id} articleSlug={article.slug} />
          )}

          <div className="mt-8">
            <ArticleBodyWithAds html={article.body ?? ""} />
          </div>

          <AdSlot slotKey="article_bottom" pageType="article" className="my-10" />

          {article.faqs && article.faqs.length > 0 && (
            <section className="glass-panel rounded-3xl border border-white/10 bg-zinc-950/80 p-8">
              <h2 className="text-2xl font-bold">FAQs</h2>
              <div className="mt-6 space-y-4">
                {article.faqs.map((faq) => (
                  <details key={faq.question} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <summary className="cursor-pointer font-semibold text-white">{faq.question}</summary>
                    <p className="mt-3 text-zinc-400">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Related</p>
                  <h2 className="text-2xl font-bold">Related Stories</h2>
                </div>
                <span className="text-sm text-zinc-500">Swipe the latest</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((a, i) => (
                  <ArticleCard key={a.id} article={a} index={i} />
                ))}
              </div>
            </section>
          )}
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <ShareActions title={article.title} slug={slug} />

            <div className="glass-panel rounded-3xl border border-white/10 bg-zinc-950/80 p-6">
              <h3 className="text-sm uppercase tracking-[0.24em] text-orange-400">Quick facts</h3>
              <div className="mt-4 space-y-4 text-sm text-zinc-300">
                {article.author && (
                  <div className="rounded-3xl bg-white/5 p-4">
                    <p className="text-zinc-400">Author</p>
                    <p className="mt-2 font-semibold text-white">{article.author.name}</p>
                    {article.author.designation && <p className="mt-1 text-xs text-zinc-500">{article.author.designation}</p>}
                  </div>
                )}
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-zinc-400">Category</p>
                  <p className="mt-2 font-semibold text-white">{article.category?.name ?? "General"}</p>
                </div>
                {article.content_quality && (
                  <div className="rounded-3xl bg-white/5 p-4">
                    <p className="text-zinc-400">Quality score</p>
                    <p className="mt-2 font-semibold text-white">{article.content_quality.seo_score ?? 0}</p>
                  </div>
                )}
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-zinc-400">Sources</p>
                  {article.sources && article.sources.length > 0 ? (
                    <ol className="mt-2 space-y-2 text-xs leading-6 text-zinc-400">
                      {article.sources.slice(0, 3).map((source) => (
                        <li key={source.url}>
                          <a href={source.url} target="_blank" rel="noreferrer" className="text-orange-300 hover:underline">
                            {source.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-2 text-zinc-500">No external sources available.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl border border-white/10 bg-zinc-950/80 p-6">
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-orange-400">
                <BookOpen className="h-4 w-4" />
                Article toolkit
              </div>
              <p className="mt-4 text-sm leading-7 text-zinc-400">Save now, share later, or use AI summary to capture the story quickly.</p>
            </div>

            <AdSlot slotKey="article_sidebar" pageType="article" className="mt-6" />
          </div>
        </aside>
      </div>
    </article>
  );
}
