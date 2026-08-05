import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, ExternalLink, HelpCircle, IndianRupee, ShieldCheck, Star, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";
import { WhatsAppShareCard } from "@/components/share/WhatsAppShareCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolShareText } from "@/lib/share";
import { ToolAffiliateCta } from "@/components/affiliates/ToolAffiliateCta";
import { ToolTrustPanel } from "@/components/differentiators/ToolTrustPanel";
import { absoluteUrl } from "@/lib/site";

type AiTool = {
  id: number;
  name: string;
  slug: string;
  category: string;
  tagline?: string | null;
  description?: string | null;
  website_url?: string | null;
  affiliate_url?: string | null;
  pricing?: string | null;
  best_for?: string[];
  pros?: string[];
  cons?: string[];
  alternatives?: string[];
  use_cases?: string[];
  faqs?: { question?: string; answer?: string }[];
  seo_title?: string | null;
  seo_description?: string | null;
  source_urls?: string[];
  reviewed_at?: string | null;
  rating?: number | null;
  trust_score?: number;
  trust_breakdown?: Record<string, number>;
  opportunity_score?: number;
  opportunity_summary?: string | null;
  audience_roles?: string[];
};

async function getTool(slug: string) {
  try {
    return await apiFetch<{ data: AiTool; related: AiTool[] }>(`/ai-tools/${slug}`, { revalidate: 300 });
  } catch {
    return null;
  }
}

function externalUrl(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const response = await getTool(slug);

  if (!response) {
    return { title: "AI tool not found", robots: { index: false, follow: true } };
  }

  const tool = response.data;
  const title = tool.seo_title || `${tool.name} review, pricing, pros and cons`;
  const description = tool.seo_description || tool.tagline || tool.description || `Practical review of ${tool.name}.`;
  const path = `/ai-tools/${tool.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function AiToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getTool(slug);

  if (!res) {
    notFound();
  }

  const tool = res.data;
  const link = externalUrl(tool.affiliate_url) || externalUrl(tool.website_url);
  const shareText = buildToolShareText({ ...tool, path: `/ai-tools/${tool.slug}` });
  const validFaqs = (tool.faqs || []).filter((faq) => faq.question && faq.answer);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        applicationCategory: tool.category,
        description: tool.seo_description || tool.description || tool.tagline,
        url: absoluteUrl(`/ai-tools/${tool.slug}`),
        ...(externalUrl(tool.website_url) ? { sameAs: externalUrl(tool.website_url) } : {}),
      },
      ...(validFaqs.length ? [{
        "@type": "FAQPage",
        mainEntity: validFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }] : []),
    ],
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={schema} />
      <p className="text-sm uppercase tracking-[0.24em] text-orange-400">{tool.category}</p>
      <h1 className="mt-3 text-4xl font-extrabold text-white md:text-6xl">{tool.name}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">{tool.tagline}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <article className="glass-panel rounded-3xl border border-white/10 p-6">
          <div className="flex flex-wrap gap-3 text-sm">
            {tool.rating != null && (
              <span className="rounded-full bg-orange-500/10 px-4 py-2 text-orange-200">Rating {tool.rating}/5</span>
            )}
            <span className="rounded-full bg-zinc-800 px-4 py-2 text-zinc-200">{tool.pricing || "Pricing varies"}</span>
            {tool.reviewed_at ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-700"><ShieldCheck className="h-4 w-4" /> Human reviewed</span> : null}
          </div>
          <p className="mt-6 whitespace-pre-line text-sm leading-7 text-zinc-300">{tool.description}</p>
          <SourceBlock sources={tool.source_urls || []} reviewedAt={tool.reviewed_at} />
          <ToolTrustPanel
            trustScore={tool.trust_score}
            trustBreakdown={tool.trust_breakdown}
            opportunityScore={tool.opportunity_score}
            opportunitySummary={tool.opportunity_summary}
          />
          <PricingBlock pricing={tool.pricing} link={link} />
          <Section title="Use cases" items={tool.use_cases || []} icon="check" />
          <Section title="Best for" items={tool.best_for || []} icon="check" />
          <Section title="Pros" items={tool.pros || []} icon="check" />
          <Section title="Cons" items={tool.cons || []} icon="x" />
          <Section title="Alternatives" items={tool.alternatives || []} icon="star" />
          <FaqBlock faqs={tool.faqs || []} />
        </article>

        <aside className="h-fit rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6">
          <h2 className="text-xl font-bold">Use this tool</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300">Open the official page, compare pricing, and test it with English prompts before buying a paid plan.</p>
          <div className="mt-5">
            <BookmarkButton type="tool" item={tool} />
          </div>
          {link && (
            <ToolAffiliateCta toolId={tool.id} toolName={tool.name} href={link} />
          )}
          <Link href="/prompts" className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-200">
            Get prompts for this
          </Link>
          <Link href={`/ai-tools/${tool.slug}/story`} className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-200">
            View web story
          </Link>
          <div className="mt-6">
            <WhatsAppShareCard title={`Share ${tool.name}`} text={shareText} />
          </div>
        </aside>
      </div>
    </main>
  );
}

function SourceBlock({ sources, reviewedAt }: { sources: string[]; reviewedAt?: string | null }) {
  const validSources = sources.map((source) => externalUrl(source)).filter((source): source is string => Boolean(source));
  if (!validSources.length && !reviewedAt) return null;
  return (
    <section className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
      <h2 className="flex items-center gap-2 text-base font-bold text-emerald-900"><ShieldCheck className="h-5 w-5" /> Editorial verification</h2>
      {reviewedAt ? <p className="mt-2 text-xs text-emerald-800">Last human review: {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(reviewedAt))}</p> : null}
      {validSources.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {validSources.map((source, index) => <a key={source} href={source} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800">Source {index + 1} <ExternalLink className="h-3.5 w-3.5" /></a>)}
        </div>
      ) : null}
    </section>
  );
}

function PricingBlock({ pricing, link }: { pricing?: string | null; link?: string | null }) {
  return (
    <section className="mt-8 rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-white"><IndianRupee className="h-5 w-5 text-orange-400" /> Pricing</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-300">{pricing || "Pricing can change. Check the official page before upgrading."}</p>
      {link && <a href={link} target="_blank" rel="nofollow sponsored noopener noreferrer" className="mt-4 inline-flex text-sm font-semibold text-orange-300">Check latest pricing</a>}
    </section>
  );
}

function FaqBlock({ faqs }: { faqs: { question?: string; answer?: string }[] }) {
  if (!faqs.length) return null;
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-white">FAQs</h2>
      <div className="mt-4 grid gap-3">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <h3 className="flex gap-2 font-semibold text-white"><HelpCircle className="h-4 w-4 text-orange-400" /> {faq.question}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Section({ title, items, icon }: { title: string; items: string[]; icon: "check" | "x" | "star" }) {
  if (!items.length) return null;
  const Icon = icon === "x" ? XCircle : icon === "star" ? Star : CheckCircle2;
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-300">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
