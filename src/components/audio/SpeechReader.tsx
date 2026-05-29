"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";

type AnalyticsContext = {
  articleId: number;
  articleSlug: string;
  mode: "summary" | "article";
};

type Props = {
  text: string;
  title?: string;
  description?: string;
  compact?: boolean;
  className?: string;
  analyticsContext?: AnalyticsContext;
};

const speedOptions = [1, 1.25, 1.5] as const;

const normalizeSpeechText = (input: string): string =>
  input
    .replace(/<[^>]*>/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?])/g, "$1")
    .replace(/([.,!?])([^\s])/g, "$1 $2")
    .trim();

const chooseEnglishVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  if (!voices.length) return null;

  const candidates = ["en-US", "en-GB", "english", "google us english", "microsoft english", "us", "uk"];
  for (const candidate of candidates) {
    const match = voices.find((voice) => {
      const name = voice.name?.toLowerCase() ?? "";
      const lang = voice.lang?.toLowerCase() ?? "";
      return name.includes(candidate.toLowerCase()) || lang.includes(candidate.toLowerCase());
    });
    if (match) return match;
  }

  return voices.find((voice) => voice.lang?.toLowerCase().startsWith("en")) ?? voices[0];
};

export default function SpeechReader({
  text,
  title,
  description,
  compact = false,
  className = "",
  analyticsContext,
}: Props) {
  const [status, setStatus] = useState<"idle" | "playing" | "paused" | "unsupported" | "error">("idle");
  const [rate, setRate] = useState<number>(1);
  const [message, setMessage] = useState<string | null>(null);
  const [voiceName, setVoiceName] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [supported, setSupported] = useState(true);
  const speechUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const cleanedText = useMemo(() => normalizeSpeechText(text), [text]);
  const hasText = cleanedText.length > 0;

  const trackEvent = useCallback(
    async (action: string) => {
      if (!analyticsContext) return;
      try {
        await apiFetch("/analytics/event", {
          method: "POST",
          body: JSON.stringify({
            event_type: "article_audio",
            trackable_type: "App\\Models\\Article",
            trackable_id: analyticsContext.articleId,
            metadata: {
              action,
              mode: analyticsContext.mode,
              article_slug: analyticsContext.articleSlug,
              speed: rate,
            },
          }),
        });
      } catch {
        // Ignore tracking failures.
      }
    },
    [analyticsContext, rate]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      setSupported(false);
      return;
    }

    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setSupported(false);
      return;
    }

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (!available.length) return;
      setVoices(available);
      setVoiceName(chooseEnglishVoice(available)?.name ?? null);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speechUtterance.current = null;
    setStatus("idle");
  }, []);

  const pauseSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis?.paused === false) {
      window.speechSynthesis.pause();
      setStatus("paused");
    }
  }, []);

  const resumeSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis?.paused === true) {
      window.speechSynthesis.resume();
      setStatus("playing");
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.hidden && status === "playing") {
        pauseSpeech();
        setMessage("Audio paused because the tab changed.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [pauseSpeech, status]);

  const speak = useCallback(
    (startText: string) => {
      if (!hasText) {
        setMessage("No readable content found to narrate.");
        return;
      }

      if (typeof window === "undefined" || !window.SpeechSynthesisUtterance) {
        setSupported(false);
        setMessage("Audio is not supported on this device.");
        return;
      }

      stopSpeech();
      setMessage(null);

      const utterance = new window.SpeechSynthesisUtterance(startText);
      utterance.rate = rate;
      utterance.lang = "en-US";

      const voice = voiceName ? voices.find((v) => v.name === voiceName) ?? chooseEnglishVoice(voices) : null;
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setStatus("playing");
        trackEvent("started");
      };
      utterance.onpause = () => setStatus("paused");
      utterance.onresume = () => setStatus("playing");
      utterance.onend = () => {
        setStatus("idle");
        speechUtterance.current = null;
      };
      utterance.onerror = (event) => {
        setStatus("error");
        setMessage(event.error || "Playback error occurred.");
      };

      speechUtterance.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [hasText, rate, stopSpeech, trackEvent, voiceName, voices]
  );

  const handlePrimaryClick = () => {
    if (!supported) return;
    if (!hasText) {
      setMessage("No content available to read.");
      return;
    }
    if (status === "paused") return resumeSpeech();
    if (status === "playing") return pauseSpeech();
    speak(cleanedText);
  };

  const buttonLabel = useMemo(() => {
    if (!supported) return "Audio unsupported";
    if (!hasText) return "No content";
    if (status === "playing") return "Pause";
    if (status === "paused") return "Resume";
    return title || "Listen";
  }, [supported, hasText, status, title]);

  const voiceLabel = voiceName || (voices.length ? voices[0].name : "Browser default voice");

  return (
    <div className={`rounded-3xl border border-white/10 bg-zinc-950/80 p-5 shadow-xl shadow-black/20 ${className}`}>
      {!compact && (
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
            {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
          </div>
          <div className="rounded-3xl bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            {voiceLabel}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handlePrimaryClick}
          disabled={!supported || !hasText}
          className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {buttonLabel}
        </button>

        {(status === "playing" || status === "paused") && (
          <button
            type="button"
            onClick={stopSpeech}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-orange-300 hover:text-orange-300"
          >
            Stop
          </button>
        )}

        {!compact && (
          <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
            <span className="text-xs uppercase tracking-[0.24em] text-zinc-400">Speed</span>
            {speedOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRate(option)}
                className={`rounded-full px-3 py-1 transition ${rate === option ? "bg-orange-500 text-white" : "bg-white/5 text-zinc-200 hover:bg-white/10"}`}
              >
                {option}x
              </button>
            ))}
          </div>
        )}
      </div>

      {message && <p className="mt-4 text-sm text-red-300">{message}</p>}
      {!compact && supported && hasText && (
        <p className="mt-4 text-sm text-zinc-400">This audio uses your browser&apos;s built-in English voice engine and works without any paid TTS service.</p>
      )}
    </div>
  );
}
