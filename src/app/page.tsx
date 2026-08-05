import Image from "next/image";
import { apiFetch } from "@/lib/api";
import type { Article, Category, WebStory } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { BreakingTicker } from "@/components/layout/BreakingTicker";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, BellRing, Bot, CalendarDays, CheckCircle2, Compass, LibraryBig, Mail, Sparkles, Workflow, Zap } from "lucide-react";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import type { Metadata } from "next";
import { SITE_DESCRIPTION } from "@/lib/site";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { mergeWithFallbackStories } from "@/lib/story-content";

export const metadata: Metadata = {
    title: "Practical AI Tools and Workflows for India",
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
};

export const revalidate = 30;

type HomeDailyBrief = {
    id: number;
    title: string;
    slug: string;
    summary?: string | null;
    key_updates?: string[];
    impact_india?: string | null;
    tool_of_day?: { name?: string; url?: string; reason?: string } | null;
    cta_label?: string | null;
    cta_url?: string | null;
    published_at?: string | null;
};

async function getHomeData() {
    const [featured, articles, breaking, trending, stories, categories, dailyBrief] = await Promise.all([
        apiFetch<{ data: Article[] }>("/articles/featured", { revalidate: 60 }).catch(() => ({ data: [] })),
        apiFetch<{ data: Article[] }>("/articles?per_page=12", { revalidate: 30 }).catch(() => ({ data: [] })),
        apiFetch<{ articles: { data: Article[] }; ticker: { id: number; headline: string }[] }>("/breaking", { revalidate: 15 })
            .catch(() => ({ articles: { data: [] }, ticker: [] })),
        apiFetch<{ data: Article[] }>("/trending", { revalidate: 60 }).catch(() => ({ data: [] })),
        apiFetch<{ data: WebStory[] }>("/web-stories", { revalidate: 120 }).catch(() => ({ data: [] })),
        apiFetch<{ data: Category[] }>("/categories", { revalidate: 120 }).catch(() => ({ data: [] })),
        apiFetch<{ data: HomeDailyBrief }>("/daily-briefs/latest", { revalidate: 60 }).catch(() => ({ data: null })),
    ]);

    return {
        featured: featured.data,
        articles: articles.data,
        breaking,
        trending: trending.data,
        stories: mergeWithFallbackStories(stories.data),
        categories: categories.data,
        dailyBrief: dailyBrief.data,
    };
}

export default async function HomePage() {
    const { featured, articles, breaking, trending, stories, categories, dailyBrief } = await getHomeData();
    const hero = featured[0] ?? articles[0];
    const reels = stories.length ? stories.map((story) => ({ ...story, href: `/web-stories/${story.slug}` })) : trending.slice(0, 8).map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        cover_image: article.featured_image ?? "",
        locale: article.locale,
        published_at: article.published_at,
        href: `/news/${article.slug}`,
    }));
    const categoryCards = categories.slice(0, 4);
    const digestUpdates = dailyBrief?.key_updates?.slice(0, 3) ?? [
        "One practical AI workflow selected for creators and professionals.",
        "A useful tool recommendation with clear use cases and limitations.",
        "India-focused takeaways you can apply in work, study, or business.",
    ];
    const digestHref = dailyBrief ? `/daily-ai-brief/${dailyBrief.slug}` : "/daily-ai-brief";
    const digestDate = dailyBrief?.published_at
        ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dailyBrief.published_at))
        : "Updated daily";

    return (
        <>
            <BreakingTicker items={breaking.ticker ?? []} />

            <section className="page-shell pt-5 sm:pt-8 lg:pt-10">
                <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/86 px-5 py-8 shadow-[0_30px_90px_-46px_rgba(15,23,42,0.38)] backdrop-blur-xl sm:px-8 sm:py-10 lg:rounded-[2.25rem] lg:px-12 lg:py-14">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl" />
                    <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />
                    <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
                        <div>
                            <p className="eyebrow">
                                <Sparkles className="h-4 w-4" /> AI + Human Reviewed
                            </p>
                            <h1 className="mt-5 max-w-4xl text-[clamp(2.35rem,7vw,4.8rem)] font-black leading-[1.02] tracking-[-0.055em]">
                                Practical <span className="text-gradient">AI tools & workflows</span> for India
                            </h1>
                            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-lg sm:leading-8">
                                Free tools, tested workflows, honest comparisons, and short learning guides for Indian creators, students, job seekers, and small businesses.
                            </p>
                            <div className="mt-7 grid gap-3 min-[420px]:flex min-[420px]:flex-wrap">
                                <Button size="lg" asChild>
                                    <Link href="/ai-tools">Explore AI tools <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/ai-tool-finder">Find the right tool</Link>
                                </Button>
                            </div>
                            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 sm:text-sm">
                                <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-emerald-600" /> Honest reviews</span>
                                <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-emerald-600" /> India-focused</span>
                                <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-emerald-600" /> Free resources</span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="dark-surface soft-grid rounded-[1.5rem] border border-slate-800 bg-slate-950 p-4 shadow-[0_28px_65px_-30px_rgba(15,23,42,0.65)] sm:p-5">
                                <div className="mb-4 flex items-center justify-between px-1">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300">Start here</p>
                                        <p className="mt-1 text-sm font-bold text-white">Your practical AI workspace</p>
                                    </div>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-950/20"><Bot className="h-5 w-5" /></span>
                                </div>
                                <div className="grid gap-2.5">
                                    {([
                                        ["Find an AI tool", "Matched to your goal & budget", "/ai-tool-finder", Compass],
                                        ["Use a ready prompt", "Copy, customize, get results", "/prompts", LibraryBig],
                                        ["Follow a workflow", "Step-by-step practical guides", "/learn-ai", Workflow],
                                    ] as const).map(([label, detail, href, Icon]) => (
                                        <Link key={href as string} href={href as string} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-3.5 hover:border-orange-300/40 hover:bg-white/12">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange-300">
                                                <Icon className="h-5 w-5" />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-bold text-white">{label as string}</span>
                                                <span className="mt-0.5 block truncate text-xs text-slate-300">{detail as string}</span>
                                            </span>
                                            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-300" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -left-3 hidden rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-xl sm:block">
                                <p className="text-xs font-bold text-slate-900">Built for real outcomes</p>
                                <p className="mt-0.5 text-[11px] text-slate-500">Create · Learn · Compare</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-3 md:grid-rows-2">
                    {hero && <ArticleCard article={hero} variant="hero" />}
                    {featured.slice(1, 5).map((a, i) => (
                        <ArticleCard key={a.id} article={a} index={i + 1} />
                    ))}
                </div>
            </section>

            <section className="page-shell section-space">
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="eyebrow">AI Utility Hub</p>
                        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Tools, prompts, and daily AI brief</h2>
                    </div>
                    <Link href="/daily-ai-brief" className="flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300">
                        Aaj ka AI brief <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Link href="/ai-tools" className="premium-card group p-6 hover:-translate-y-1">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-700"><Bot className="h-5 w-5" /></span>
                        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Directory</p>
                        <h3 className="mt-3 text-2xl font-bold text-white">Best AI Tools</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-400">Practical use cases, pricing, pros and cons, alternatives, and clearly disclosed recommendations.</p>
                    </Link>
                    <Link href="/ai-tool-finder" className="premium-card group p-6 hover:-translate-y-1">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Compass className="h-5 w-5" /></span>
                        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Smart quiz</p>
                        <h3 className="mt-3 text-2xl font-bold text-white">AI Tool Finder</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-400">User role, goal, and budget ke basis par best AI tools recommend karta hai.</p>
                    </Link>
                    <Link href="/prompts" className="premium-card group p-6 hover:-translate-y-1">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><LibraryBig className="h-5 w-5" /></span>
                        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Copy-ready</p>
                        <h3 className="mt-3 text-2xl font-bold text-white">Prompt Library</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-400">YouTube, jobs, business, social media, and study prompts users can copy instantly.</p>
                    </Link>
                    <Link href="/daily-ai-brief" className="premium-card group p-6 hover:-translate-y-1">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Zap className="h-5 w-5" /></span>
                        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Daily habit</p>
                        <h3 className="mt-3 text-2xl font-bold text-white">30 Second AI Brief</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-400">Useful AI updates, India impact, tool of the day, and prompts in one shareable page.</p>
                    </Link>
                </div>
            </section>

            <section className="page-shell pb-12 sm:pb-16">
                <div className="mb-6">
                    <p className="eyebrow">Free Mini Tools</p>
                    <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Create useful content faster</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        ["Headline Generator", "/tools/headline-generator", "Discover-safe English headlines."],
                        ["YouTube Title Generator", "/tools/youtube-title-generator", "Curiosity + clarity titles for creators."],
                        ["Instagram Caption Generator", "/tools/instagram-caption-generator", "Hooks, captions, CTA and hashtags."],
                        ["Resume Bullet Generator", "/tools/resume-bullet-generator", "ATS-friendly impact bullets."],
                    ].map(([title, href, desc]) => (
                        <Link key={href} href={href} className="premium-card group flex min-h-48 flex-col p-6 hover:-translate-y-1">
                            <span className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700"><Sparkles className="h-5 w-5" /></span>
                            <h3 className="text-xl font-bold text-white">{title}</h3>
                            <p className="mt-3 text-sm leading-6 text-zinc-400">{desc}</p>
                            <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-orange-700">Open tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="page-shell pb-12 sm:pb-16">
                <div className="grid gap-4 lg:grid-cols-3">
                    {[
                        ["Comparison Hub", "ChatGPT vs Gemini and more", "Scorecards, winners and practical recommendations for high-intent decisions.", "/compare"],
                        ["AI Learning", "Build useful AI workflows", "Short lessons and action steps for prompts, tools, jobs and business.", "/learn-ai"],
                        ["AI Jobs & Skills", "Become job-ready with AI", "Beginner skills, portfolio projects and practical career roadmaps.", "/ai-skills"],
                    ].map(([label, title, description, href], index) => (
                        <Link key={href} href={href} className={`premium-card group relative overflow-hidden p-7 hover:-translate-y-1 ${index === 0 ? "border-orange-200 bg-orange-50/75" : ""}`}>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">{label}</p>
                            <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">{title}</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-orange-700">Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="page-shell pb-12 sm:pb-16">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="eyebrow">Categories</p>
                        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Explore by Category</h2>
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
                            className="premium-card group p-6 hover:-translate-y-1"
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

            <section className="page-shell pb-12 sm:pb-16">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Reels & Shorts</p>
                        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Watch AI-ready short form stories</h2>
                    </div>
                    <p className="text-sm text-zinc-400">Swipe horizontally for fast, snackable headlines.</p>
                </div>
                <div className="glass-panel overflow-hidden rounded-3xl border border-white/10 p-4">
                    <div className="swipe-scroll flex gap-4 overflow-x-auto pb-4 scroll-smooth">
                        {reels.slice(0, 8).map((story) => (
                            <Link
                                key={story.id}
                                href={story.href}
                                className="snap-start w-[78vw] max-w-[240px] shrink-0 rounded-3xl border border-white/10 bg-gradient-to-b from-orange-500/20 to-zinc-900 p-4 transition hover:-translate-y-1"
                            >
                                <div className="aspect-[9/16] overflow-hidden rounded-3xl bg-zinc-950/80 text-sm font-semibold text-orange-300">
                                    <div className="relative h-full">
                                        {story.cover_image ? (
                                            <Image
                                                src={story.cover_image}
                                                alt={story.title}
                                                fill
                                                className="object-cover"
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

            <section className="page-shell pb-12 sm:pb-16">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                    <Zap className="h-5 w-5 text-orange-400" /> AI Summary Cards
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.slice(0, 6).map((a, i) => (
                        <MotionReveal
                            key={a.id}
                            delay={i * 0.05}
                            className="glass-panel rounded-3xl border border-white/10 p-6"
                        >
                            <p className="text-xs uppercase tracking-[0.2em] text-orange-400">AI Summary</p>
                            <h3 className="mt-3 text-lg font-semibold text-white">{a.title}</h3>
                            <p className="mt-3 text-sm leading-6 text-zinc-400 line-clamp-4">{a.ai_summary || a.excerpt}</p>
                            <Link href={`/news/${a.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 hover:text-orange-200">
                                Read full article <ArrowRight className="h-4 w-4" />
                            </Link>
                        </MotionReveal>
                    ))}
                </div>
            </section>

            {stories.length > 0 && (
                <section className="page-shell pb-12 sm:pb-16">
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
                                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500/20 to-zinc-900">
                                    {s.cover_image ? <Image src={s.cover_image} alt="" fill className="object-cover" unoptimized /> : null}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                </div>
                                <p className="mt-4 text-sm font-semibold text-white line-clamp-2">{s.title}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="page-shell pb-12 sm:pb-16">
                <h2 className="mb-4 text-xl font-bold">Viral & Trending</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {(trending.length ? trending : articles).slice(0, 8).map((a, i) => (
                        <ArticleCard key={a.id} article={a} index={i} />
                    ))}
                </div>
            </section>

            <section id="daily-digest" className="page-shell pb-10 sm:pb-16">
                <div className="dark-surface relative overflow-hidden rounded-[1.75rem] bg-slate-950 p-5 shadow-[0_32px_85px_-38px_rgba(15,23,42,0.7)] sm:p-8 lg:rounded-[2rem] lg:p-10">
                    <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
                    <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="relative grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="eyebrow text-orange-300"><Sparkles className="h-4 w-4" /> Daily Digest</p>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-semibold text-slate-300">
                                    <CalendarDays className="h-3.5 w-3.5" /> {digestDate}
                                </span>
                            </div>
                            <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                                {dailyBrief?.title || "Useful AI updates, without the noise"}
                            </h2>
                            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                {dailyBrief?.summary || "Human-reviewed AI news, practical workflows, one useful tool, and ready-to-use prompts in a short daily brief."}
                            </p>

                            <div className="mt-6 grid gap-3">
                                {digestUpdates.map((update) => (
                                    <div key={update} className="flex gap-3 rounded-2xl border border-white/10 bg-white/6 p-3.5 text-sm leading-6 text-slate-300">
                                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                                        <span>{update}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-7 flex flex-col gap-3 min-[440px]:flex-row">
                                <Button size="lg" asChild>
                                    <Link href={digestHref}>Read today&apos;s brief <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                                <Link href="/push-preferences" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 px-5 text-sm font-bold text-white hover:bg-white/12">
                                    <BellRing className="h-4 w-4" /> Choose alerts
                                </Link>
                            </div>
                        </div>

                        <aside className="light-surface rounded-[1.5rem] border border-white/10 bg-white p-4 shadow-2xl shadow-black/20 sm:p-6">
                            <div className="mb-5 flex items-start gap-3 px-1">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-700"><Mail className="h-5 w-5" /></span>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">5-minute advantage</p>
                                    <h3 className="mt-1 text-xl font-extrabold text-slate-950">Start your day AI-ready</h3>
                                </div>
                            </div>
                            {dailyBrief?.tool_of_day?.name ? (
                                <Link href={dailyBrief.tool_of_day.url || "/ai-tools"} className="mb-4 block rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">Tool of the day</p>
                                    <p className="mt-2 font-extrabold text-slate-950">{dailyBrief.tool_of_day.name}</p>
                                    {dailyBrief.tool_of_day.reason ? <p className="mt-1 text-xs leading-5 text-slate-600">{dailyBrief.tool_of_day.reason}</p> : null}
                                </Link>
                            ) : null}
                            <NewsletterSignup segment="homepage_digest" />
                            <p className="mt-3 text-center text-[11px] text-slate-500">No spam. Practical updates only. Unsubscribe anytime.</p>
                        </aside>
                    </div>
                </div>
            </section>
        </>
      );
    }

