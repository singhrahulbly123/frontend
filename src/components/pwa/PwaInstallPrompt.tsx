"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PwaInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [readyToShow, setReadyToShow] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (isStandaloneMode()) {
      setInstalled(true);
      return;
    }

    let showTimer: number | undefined;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      showTimer = window.setTimeout(() => setReadyToShow(true), 8000);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setMessage("The app was installed successfully.");
    };

    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          // Silent failure if service worker cannot register.
        });
      } else {
        // A previously installed production worker can serve stale development
        // chunks and cause React hydration mismatches after local code changes.
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => void registration.unregister());
        }).catch(() => {
          // Development cleanup is best-effort only.
        });
      }
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      if (showTimer) window.clearTimeout(showTimer);
    };
  }, []);

  const installApp = async () => {
    if (!promptEvent) {
      setMessage("Install prompt is not available yet.");
      return;
    }

    promptEvent.prompt();
    const choiceResult = await promptEvent.userChoice;
    setPromptEvent(null);
    if (choiceResult.outcome === "accepted") {
      setInstalled(true);
      setMessage("Thanks! Pulsevian has been installed.");
    } else {
      setMessage("Install was dismissed.");
    }
  };

  if (installed || dismissed || !promptEvent || !readyToShow) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-20 right-3 z-40 flex items-center gap-1 rounded-full border border-orange-200 bg-white/95 p-1.5 shadow-xl shadow-slate-900/15 backdrop-blur-xl md:hidden">
        <button type="button" onClick={installApp} className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white">
          <Download className="h-4 w-4" /> Install
        </button>
        <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss install prompt" className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <X className="h-4 w-4" />
        </button>
      </div>

      <section className="fixed bottom-6 right-4 z-40 hidden w-full max-w-sm rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-2xl shadow-slate-900/15 backdrop-blur-xl md:block">
        <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss install prompt" className="absolute right-3 top-3 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <X className="h-4 w-4" />
        </button>
        <div className="pr-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Pulsevian app</p>
          <h2 className="mt-2 text-lg font-bold text-zinc-950">Faster access, even offline</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">Install the lightweight app for saved tools and quick navigation.</p>
        </div>
        <Button onClick={installApp} className="mt-4 w-full">
          <Download className="mr-2 h-4 w-4" /> Install app
        </Button>
        {message ? <p className="mt-4 text-sm text-zinc-400">{message}</p> : null}
      </section>
    </>
  );
}
