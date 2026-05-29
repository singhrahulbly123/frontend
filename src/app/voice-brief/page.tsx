import { apiFetch } from "@/lib/api";
import SpeechReader from "@/components/audio/SpeechReader";
import Link from "next/link";

type VoiceBrief = {
  title: string;
  slug: string;
  script: string;
  audio_url?: string | null;
  duration_seconds?: number;
  published_at?: string | null;
};

async function getVoiceBrief() {
  try {
    const res = await apiFetch<{ data: VoiceBrief }>("/daily-briefs/latest/voice", { revalidate: 60 });
    return res.data;
  } catch {
    return null;
  }
}

export default async function VoiceBriefPage() {
  const brief = await getVoiceBrief();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm uppercase tracking-[0.24em] text-orange-400">English Voice Brief</p>
      <h1 className="mt-3 text-4xl font-extrabold text-white md:text-6xl">Listen to today&apos;s AI brief</h1>
      <p className="mt-5 text-sm leading-7 text-zinc-400">
        Global AI updates in a short English audio format. Browser voice playback works even without paid TTS.
      </p>

      {!brief ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-sm text-zinc-400">
          Voice brief is not available yet.
        </div>
      ) : (
        <section className="mt-8 space-y-6">
          <div className="rounded-3xl border border-orange-500/20 bg-orange-500/5 p-6">
            <h2 className="text-2xl font-bold text-white">{brief.title}</h2>
            <p className="mt-3 text-sm text-zinc-400">Estimated duration: {brief.duration_seconds ?? 60} seconds</p>
            {brief.audio_url ? (
              <audio controls src={brief.audio_url} className="mt-5 w-full" />
            ) : (
              <SpeechReader
                title="Play voice brief"
                description="Uses the best available English voice on this browser."
                text={brief.script}
              />
            )}
          </div>
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-xl font-bold text-white">Transcript</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-300">{brief.script}</p>
          </div>
          <Link href={`/daily-ai-brief/${brief.slug}`} className="inline-flex rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-200">
            Open full brief
          </Link>
        </section>
      )}
    </main>
  );
}
