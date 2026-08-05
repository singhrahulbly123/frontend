import Link from "next/link";
import { ArrowUpRight, BadgeCheck, BookOpenCheck, Globe2, Sparkles } from "lucide-react";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

const discoverLinks = [
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/ai-tool-finder", label: "AI Tool Finder" },
  { href: "/prompts", label: "Prompt Library" },
  { href: "/compare", label: "Tool Comparisons" },
  { href: "/web-stories", label: "Web Stories" },
];

const learningLinks = [
  { href: "/daily-ai-brief", label: "Daily AI Brief" },
  { href: "/learn-ai", label: "Learn AI" },
  { href: "/ai-skills", label: "AI Skills" },
  { href: "/categories", label: "Topics" },
  { href: "/for-you", label: "For You" },
];

const companyLinks = [
  { href: "/about", label: "About Pulsevian" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/fact-check", label: "Fact Check" },
  { href: "/transparency", label: "Transparency" },
  { href: "/contact", label: "Contact" },
];

function FooterLinks({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-300">{title}</p>
      <ul className="mt-5 space-y-3 text-sm text-slate-300">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="group inline-flex items-center gap-1.5 hover:text-white">
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="premium-footer dark-surface relative mt-16 overflow-hidden text-white sm:mt-24">
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-orange-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="page-shell relative py-8 sm:py-12">
        <section className="grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] shadow-[0_30px_90px_-42px_rgba(0,0,0,0.9)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-300">
              <Sparkles className="h-4 w-4" /> Your five-minute AI advantage
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight text-white sm:text-4xl">
              Useful AI workflows. Zero unnecessary noise.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Tool reviews, practical prompts, verified updates, and beginner-friendly guides for people building careers and businesses in India.
            </p>
            <div className="mt-6 flex flex-col gap-3 min-[430px]:flex-row">
              <Link href="/ai-tool-finder" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-orange-950/25 hover:bg-orange-500">
                Find my AI tool <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/daily-ai-brief" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-5 text-sm font-bold text-white hover:border-white/25 hover:bg-white/10">
                Read today&apos;s brief
              </Link>
            </div>
          </div>
          <div className="light-surface border-t border-white/10 bg-[#fffaf4] p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
            <NewsletterSignup segment="footer_digest" />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 sm:text-xs">
              <span>Practical</span><span>No spam</span><span>Unsubscribe anytime</span>
            </div>
          </div>
        </section>

        <section className="grid gap-10 py-12 sm:grid-cols-2 sm:py-14 lg:grid-cols-[1.35fr_0.75fr_0.75fr_0.75fr] lg:gap-12">
          <div className="max-w-md">
            <Link href="/" className="group inline-flex items-center gap-3" aria-label="Pulsevian home">
              <span className="brand-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-base font-black text-white shadow-[0_15px_38px_rgba(234,88,12,0.28)] transition group-hover:-rotate-3 group-hover:scale-105">P</span>
              <div>
                <p className="text-xl font-black tracking-tight text-white">Pulsevian</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">AI Workflows for India</p>
              </div>
            </Link>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Practical AI tools, honest comparisons, and repeatable workflows—written for real users, not algorithms alone.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-200"><BadgeCheck className="h-3.5 w-3.5" /> Human reviewed</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-300/15 bg-blue-300/10 px-3 py-2 text-xs font-bold text-blue-200"><BookOpenCheck className="h-3.5 w-3.5" /> Sources checked</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-300/15 bg-orange-300/10 px-3 py-2 text-xs font-bold text-orange-200"><Globe2 className="h-3.5 w-3.5" /> India focused</span>
            </div>
          </div>
          <FooterLinks title="Discover" links={discoverLinks} />
          <FooterLinks title="Learn" links={learningLinks} />
          <FooterLinks title="Company" links={companyLinks} />
        </section>

        <div className="flex flex-col gap-5 border-t border-white/10 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Pulsevian. AI-assisted, human-reviewed content.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/cookie-policy" className="hover:text-white">Cookies</Link>
            <Link href="/affiliate-disclosure" className="hover:text-white">Affiliate disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
