import type { ReactNode } from "react";

export function PolicyPage({ eyebrow = "Pulsevian", title, intro, children }: {
  eyebrow?: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <article className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 md:p-10">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">{title}</h1>
        <p className="mt-6 text-base leading-8 text-zinc-300">{intro}</p>
        <div className="mt-10 space-y-8 text-sm leading-7 text-zinc-300 [&_a]:text-orange-300 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </main>
  );
}
