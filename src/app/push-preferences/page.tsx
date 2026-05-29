import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import PushNotificationButton from "@/components/push/PushNotificationButton";

export default function PushPreferencesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <section className="rounded-3xl border border-orange-500/20 bg-orange-500/5 p-8 md:p-10">
        <p className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-orange-300">
          <Bell className="h-4 w-4" /> Push Digest Segments
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
          Choose the AI updates you actually want
        </h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-300">
          Topic-based push alerts for AI news, tools, learning, jobs, prompts, and daily brief.
        </p>
      </section>

      <section className="mt-8">
        <PushNotificationButton />
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-6">
        <h2 className="text-2xl font-bold">Recommended segments</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            ["Creators", "AI Tools, Prompts, Daily Brief"],
            ["Students", "AI Learning, AI Jobs, Daily Brief"],
            ["Business", "AI Tools, Trending, Daily Brief"],
            ["News readers", "Breaking, Trending, Global AI News"],
          ].map(([label, desc]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-zinc-900 p-4 text-sm text-zinc-300">
              <p className="font-semibold text-white">{label}</p>
              <p className="mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Link href="/daily-ai-brief" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white">
        Open Daily AI Brief <ArrowRight className="h-4 w-4" />
      </Link>
    </main>
  );
}
