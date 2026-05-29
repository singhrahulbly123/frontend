import { motion } from "framer-motion";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import type { Article, Category, WebStory } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { BreakingTicker } from "@/components/layout/BreakingTicker";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Compass, ArrowRight } from "lucide-react";
import PushNotificationButton from "@/components/push/PushNotificationButton";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

export const revalidate = 30;

async function getHomeData() {
    try {
        const [featured, articles, breaking, trending, stories, categories] = await Promise.all([
            apiFetch<{ data: Article[] }>("/articles/featured", { revalidate: 60 }),
            apiFetch<{ data: Article[] }>("/articles?per_page=12", { revalidate: 30 }),
            apiFetch<{ articles: { data: Article[] }; ticker: { id: number; headline: string }[] }>("/breaking", { revalidate: 15 }),
            apiFetch<{ data: Article[] }>("/trending", { revalidate: 60 }),
            apiFetch<{ data: WebStory[] }>("/web-stories", { revalidate: 120 }),
            apiFetch<{ data: Category[] }>("/categories", { revalidate: 120 }),
        ]);

        return {
            featured: featured.data,
            articles: articles.data,
            breaking,
            trending: trending.data,
            stories: stories.data,
            categories: categories.data,
        };
    } catch {
        return {
            featured: [],
            articles: [],
            breaking: { articles: { data: [] }, ticker: [] },
            trending: [],
            stories: [],
            categories: [],
        };
    }
}

export default async function HomePage() {
    const { featured, articles, breaking, trending, stories, categories } = await getHomeData();
    const hero = featured[0] ?? articles[0];
    const reels = stories.length ? stories : trending.slice(0, 8).map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        cover_image: article.featured_image ?? "",
        locale: article.locale,
        published_at: article.published_at,
    }));
    const categoryCards = categories.slice(0, 4);

    return (
        <>
            <BreakingTicker items={breaking.ticker ?? []} />

            <section className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div className="max-w-3xl">
                        <p className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-orange-400">
                            <Sparkles className="h-4 w-4" /> AI + Human Reviewed
                        </p>
                        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white md:text-6xl">
                            Global English <span className="text-gradient">AI News</span> for fast-moving readers
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
                            Trending global stories, AI summaries, shorts, and web stories in one premium mobile-first experience.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild>
                            <Link href="/news">View all news</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/web-stories">Web Stories</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
                    {hero && <ArticleCard article={hero} variant="hero" />}
                    {featured.slice(1, 5).map((a, i) => (
                        <ArticleCard key={a.id} article={a} index={i + 1} />
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">AI Utility Hub</p>
                        <h2 className="mt-2 text-3xl font-bold">Tools, prompts, and daily AI brief</h2>
                    </div>
                    <Link href="/daily-ai-brief" className="flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300">
                        Aaj ka AI brief <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                    <Link href="/ai-tools" className="glass-panel rounded-3xl border border-white/10 p-6 transition hover:-translate-y-1 hover:border-orange-400/40">
                        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Directory</p>
                        <h3 className="mt-3 text-2xl font-bold text-white">Best AI Tools</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-400">Global use cases, pricing, pros/cons, alternatives, and affiliate-ready reviews.</p>
                    </Link>
                    <Link href="/ai-tool-finder" className="glass-panel rounded-3xl border border-white/10 p-6 transition hover:-translate-y-1 hover:border-orange-400/40">
                        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Quiz</p>
                        <h3 className="mt-3 text-2xl font-bold text-white">AI Tool Finder</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-400">User role, goal, and budget ke basis par best AI tools recommend karta hai.</p>
                    </Link>
                    <Link href="/prompts" className="glass-panel rounded-3xl border border-white/10 p-6 transition hover:-translate-y-1 hover:border-orange-400/40">
                        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Copy-ready</p>
                        <h3 className="mt-3 text-2xl font-bold text-white">Prompt Library</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-400">YouTube, jobs, business, social media, and study prompts users can copy instantly.</p>
                    </Link>
                    <Link href="/daily-ai-brief" className="glass-panel rounded-3xl border border-white/10 p-6 transition hover:-translate-y-1 hover:border-orange-400/40">
                        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Daily habit</p>
                        <h3 className="mt-3 text-2xl font-bold text-white">30 Second AI Brief</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-400">Useful AI updates, India impact, tool of the day, and prompts in one shareable page.</p>
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10">
                <div className="mb-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Free Mini Tools</p>
                    <h2 className="mt-2 text-3xl font-bold">Create useful content faster</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        ["Headline Generator", "/tools/headline-generator", "Discover-safe English headlines."],
                        ["YouTube Title Generator", "/tools/youtube-title-generator", "Curiosity + clarity titles for creators."],
                        ["Instagram Caption Generator", "/tools/instagram-caption-generator", "Hooks, captions, CTA and hashtags."],
                        ["Resume Bullet Generator", "/tools/resume-bullet-generator", "ATS-friendly impact bullets."],
                    ].map(([title, href, desc]) => (
                        <Link key={href} href={href} className="glass-panel rounded-3xl border border-white/10 p-6 transition hover:-translate-y-1 hover:border-orange-400/40">
                            <h3 className="text-xl font-bold text-white">{title}</h3>
                            <p className="mt-3 text-sm leading-6 text-zinc-400">{desc}</p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10">
                <Link href="/compare" className="glass-panel block rounded-3xl border border-orange-500/20 bg-orange-500/5 p-8 transition hover:-translate-y-1 hover:border-orange-400/50">
                    <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Comparison Hub</p>
                    <h2 className="mt-3 text-3xl font-bold text-white">ChatGPT vs Gemini, Perplexity vs ChatGPT, and more</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">High-intent AI tool comparisons with winner, scorecard, best use cases, FAQs, and practical recommendations.</p>
                </Link>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10">
                <Link href="/learn-ai" className="glass-panel block rounded-3xl border border-white/10 p-8 transition hover:-translate-y-1 hover:border-orange-400/50">
                    <p className="text-sm uppercase tracking-[0.24em] text-orange-400">AI Learning</p>
                    <h2 className="mt-3 text-3xl font-bold text-white">English learning paths for prompts, tools, jobs, and business workflows</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Short practical lessons with action steps, built for repeat visits and skill-focused SEO traffic.</p>
                </Link>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10">
                <Link href="/ai-skills" className="glass-panel block rounded-3xl border border-white/10 p-8 transition hover:-translate-y-1 hover:border-orange-400/50">
                    <p className="text-sm uppercase tracking-[0.24em] text-orange-400">AI Jobs & Skills</p>
                    <h2 className="mt-3 text-3xl font-bold text-white">Beginner AI skills, project ideas, and job-ready roadmaps</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Evergreen English guides for students, job seekers, freelancers, and business users.</p>
                </Link>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">श्रेणियां</p>
                        <h2 className="mt-2 text-3xl font-bold">Explore by Category</h2>
                    </div>
                    <Link href="/categories" className="flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300">
                        Browse all categories <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {categoryCards.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="glass-panel group rounded-3xl border border-white/10 p-6 transition hover:-translate-y-1 hover:border-orange-400/40"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.24em] text-orange-400">{category.name}</p>
                                    <h3 className="mt-3 text-xl font-semibold text-white">{category.slug.replace(/-/g, " ")}</h3>
                                </div>
                                <Compass className="h-6 w-6 text-orange-400" />
                            </div>
                            <p className="mt-4 text-sm leading-6 text-zinc-400">Trending updates, local coverage, and premium AI summaries for this category.</p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Reels & Shorts</p>
                        <h2 className="mt-2 text-3xl font-bold">Watch AI-ready short form stories</h2>
                    </div>
                    <p className="text-sm text-zinc-400">Swipe horizontally for fast, snackable headlines.</p>
                </div>
                <div className="glass-panel overflow-hidden rounded-3xl border border-white/10 p-4">
                    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scroll-smooth">
                        {reels.slice(0, 8).map((story) => (
                            <Link
                                key={story.id}
                                href={`/web-stories/${story.slug}`}
                                className="snap-start shrink-0 w-[240px] rounded-3xl border border-white/10 bg-gradient-to-b from-orange-500/20 to-zinc-900 p-4 transition hover:-translate-y-1"
                            >
                                <div className="aspect-[9/16] overflow-hidden rounded-3xl bg-zinc-950/80 text-sm font-semibold text-orange-300">
                                    <div className="relative h-full">
                                        {story.cover_image ? (
                                            <Image
                                                src={story.cover_image}
                                                alt={story.title}
                                                fill
                                                className="object-cover"
                                                loader={({ src }: { src: string }) => src}
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">Reel</div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-xs text-white/90">Short-form story</div>
                                    </div>
                                </div>
                                <h3 className="mt-4 text-sm font-semibold text-white">{story.title}</h3>
                                <p className="mt-2 text-xs text-zinc-400">{story.published_at ? new Date(story.published_at).toLocaleDateString("hi-IN") : "AI generated"}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                    <Zap className="h-5 w-5 text-orange-400" /> AI Summary Cards
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.slice(0, 6).map((a, i) => (
                        <motion.div
                            key={a.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel rounded-3xl border border-white/10 p-6"
                        >
                            <p className="text-xs uppercase tracking-[0.2em] text-orange-400">AI Summary</p>
                            <h3 className="mt-3 text-lg font-semibold text-white">{a.title}</h3>
                            <p className="mt-3 text-sm leading-6 text-zinc-400 line-clamp-4">{a.ai_summary || a.excerpt}</p>
                            <Link href={`/news/${a.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 hover:text-orange-200">
                                पूरा पढ़ें <ArrowRight className="h-4 w-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {stories.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-10">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Web Stories</p>
                            <h2 className="mt-2 text-3xl font-bold">Immersive Story Feed</h2>
                        </div>
                        <Link href="/web-stories" className="text-sm font-semibold text-orange-400 hover:text-orange-300">
                            Browse all stories
                        </Link>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth">
                        {stories.map((s) => (
                            <Link
                                key={s.id}
                                href={`/web-stories/${s.slug}`}
                                className="snap-start shrink-0 w-[220px] rounded-3xl border border-white/10 bg-zinc-950/80 p-4 transition hover:-translate-y-1"
                            >
                                <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-orange-500/20 to-zinc-900" />
                                <p className="mt-4 text-sm font-semibold text-white line-clamp-2">{s.title}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="mx-auto max-w-7xl px-4 py-10">
                <h2 className="mb-4 text-xl font-bold">Viral & Trending</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {(trending.length ? trending : articles).slice(0, 8).map((a, i) => (
                        <ArticleCard key={a.id} article={a} index={i} />
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10">
                <div className="glass-panel rounded-3xl bg-gradient-to-r from-orange-500/10 to-transparent p-8 text-center md:p-12">
                    <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Daily Digest</p>
                    <h2 className="mt-4 text-3xl font-bold">Get the latest global AI headlines every morning</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400">Fast, premium, and discovery-ready news summaries with a mobile-first experience.</p>
                    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <div>
                            <Button className="w-full" size="lg" asChild>
                                <Link href="/push-preferences">Explore Topic Alerts</Link>
                            </Button>
                        </div>
                        <PushNotificationButton />
                    </div>
                    <div className="mx-auto mt-6 max-w-2xl text-left">
                        <NewsletterSignup segment="homepage_digest" />
                    </div>
                </div>
            </section>
        </>
      );
    }

