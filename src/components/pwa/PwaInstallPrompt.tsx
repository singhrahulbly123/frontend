"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
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
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (isStandaloneMode()) {
      setInstalled(true);
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setMessage("The app was installed successfully.");
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silent failure if service worker cannot register.
      });
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!promptEvent) {
      setMessage("Install prompt is not available yet.");
      return;
    }

    promptEvent.prompt();
    const choiceResult = await promptEvent.userChoice;
    if (choiceResult.outcome === "accepted") {
      setInstalled(true);
      setMessage("Thanks! Global AI News has been installed.");
    } else {
      setMessage("Install was dismissed.");
    }
  };

  if (installed) {
    return null;
  }

  return (
    <section className="mx-auto mb-6 max-w-6xl rounded-3xl border border-white/10 bg-zinc-950/80 p-6 text-center shadow-2xl shadow-orange-500/5">
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:text-left">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-orange-400">App Experience</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Install Global AI News for full mobile app UX</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Installable app mode, offline support, and faster swipe-first navigation across the site.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Button onClick={installApp} disabled={!promptEvent} className="w-full md:w-auto">
            <ArrowDown className="mr-2 h-4 w-4" /> Install App
          </Button>
          <span className="text-xs text-zinc-500">Tap the button and follow browser prompts.</span>
        </div>
      </div>
      {message ? <p className="mt-4 text-sm text-zinc-400">{message}</p> : null}
    </section>
  );
}
