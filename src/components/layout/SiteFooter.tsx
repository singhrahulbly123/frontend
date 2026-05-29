import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-gradient">Global AI News</p>
          <p className="mt-2 text-sm text-zinc-500">
            AI-native global English media built for Discover, SEO, and trusted journalism.
          </p>
        </div>
        <div>
          <p className="font-semibold text-zinc-300">Trust</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-500">
            <li><Link href="/editorial-policy">Editorial Policy</Link></li>
            <li><Link href="/fact-check">Fact Check</Link></li>
            <li><Link href="/transparency">Transparency</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-zinc-300">Categories</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-500">
            <li><Link href="/category/world">World</Link></li>
            <li><Link href="/category/tech">Technology</Link></li>
            <li><Link href="/category/finance">Finance</Link></li>
            <li><Link href="/category/ai-tools">AI Tools</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-zinc-300">Newsletter</p>
          <p className="mt-2 text-sm text-zinc-500">Daily AI-curated global English headlines.</p>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-zinc-600">&copy; {new Date().getFullYear()} Global AI News. Human-reviewed AI content.</p>
    </footer>
  );
}
