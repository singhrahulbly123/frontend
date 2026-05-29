"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

const TOPICS = [
  { value: "global", label: "Global AI News" },
  { value: "trending", label: "Trending Alerts" },
  { value: "breaking", label: "Breaking News" },
  { value: "ai_tools", label: "AI Tools" },
  { value: "ai_learning", label: "AI Learning" },
  { value: "ai_jobs", label: "AI Jobs" },
  { value: "daily_brief", label: "Daily Brief" },
  { value: "prompts", label: "Prompts" },
];

declare global {
  interface Window {
    OneSignal?: OneSignalSdk;
  }
}

type OneSignalSdk = {
  push: (callback: () => void | Promise<void>) => void;
  init: (options: Record<string, unknown>) => void;
  isPushNotificationsSupported: () => Promise<boolean>;
  isPushNotificationsEnabled: () => Promise<boolean>;
  showNativePrompt: () => Promise<void>;
  getUserId: () => Promise<string | null>;
  sendTags: (tags: Record<string, string>) => Promise<void>;
};

const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

export default function PushNotificationButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "subscribed" | "denied" | "unsupported">("idle");
  const [selectedTopics, setSelectedTopics] = useState(["global", "daily_brief"]);
  const [message, setMessage] = useState("");

  const isEnabled = useMemo(() => status === "subscribed", [status]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!ONE_SIGNAL_APP_ID) {
      setStatus("unsupported");
      setMessage("Push service is not configured.");
      return;
    }

    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      setMessage("Your browser does not support push notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      setStatus("subscribed");
    }
  }, []);

  const initializeOneSignal = () => {
    const oneSignal = typeof window !== "undefined" ? window.OneSignal : undefined;
    if (!oneSignal || !ONE_SIGNAL_APP_ID) return;

    oneSignal.push(() => {
      oneSignal.init({
        appId: ONE_SIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: { enable: false },
        welcomeNotification: { disable: true },
        promptOptions: {
          slidedown: { enabled: false },
        },
      });
    });
  };

  const subscribe = async () => {
    if (status === "unsupported") {
      setMessage("Your browser does not support push notifications.");
      return;
    }

    const oneSignal = typeof window !== "undefined" ? window.OneSignal : undefined;
    if (!ONE_SIGNAL_APP_ID || !oneSignal) {
      setStatus("unsupported");
      setMessage("Push service is not available.");
      return;
    }

    setStatus("loading");
    initializeOneSignal();

    oneSignal.push(async () => {
      try {
        const supported = await oneSignal.isPushNotificationsSupported();
        if (!supported) {
          setStatus("unsupported");
          setMessage("Push is not supported in this browser.");
          return;
        }

        const isPushEnabled = await oneSignal.isPushNotificationsEnabled();
        if (!isPushEnabled) {
          await oneSignal.showNativePrompt();
        }

        const enabledAfter = await oneSignal.isPushNotificationsEnabled();
        if (!enabledAfter) {
          setStatus("denied");
          setMessage("Notifications are blocked. Please allow notifications in your browser.");
          return;
        }

        const playerId = await oneSignal.getUserId();
        if (!playerId) {
          setStatus("denied");
          setMessage("Unable to register your device for push notifications.");
          return;
        }

        const tags = TOPICS.reduce<Record<string, string>>((carry, topic) => {
          carry[`topic_${topic.value}`] = selectedTopics.includes(topic.value) ? "true" : "false";
          return carry;
        }, {});

        await oneSignal.sendTags(tags);

        await apiFetch<{ subscribed: boolean }>("/push/subscribe", {
          method: "POST",
          body: JSON.stringify({
            player_id: playerId,
            topics: selectedTopics,
            locale: "en",
          }),
        });

        setStatus("subscribed");
        setMessage("You are subscribed to topic-based push alerts.");
      } catch (error) {
        console.error(error);
        setStatus("denied");
        setMessage("Subscription failed. Please try again.");
      }
    });
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/10 bg-zinc-950/80 p-6 text-left">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-orange-500/10 p-3 text-orange-300">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-orange-400">Push Alerts</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Get breaking headlines and trending alerts</h3>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-zinc-400">
        Subscribe to global news, trending alerts, or breaking stories and stay updated with global English AI coverage.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TOPICS.map((topic) => (
          <button
            key={topic.value}
            type="button"
            onClick={() => setSelectedTopics((prev) => prev.includes(topic.value) ? prev.filter((item) => item !== topic.value) : [...prev, topic.value])}
            className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${selectedTopics.includes(topic.value) ? "border-orange-400 bg-orange-500/10 text-orange-300" : "border-white/10 bg-white/5 text-zinc-300 hover:border-orange-400 hover:bg-white/10"}`}
          >
            <span className="font-semibold">{topic.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={subscribe} disabled={status === "loading" || status === "subscribed"}>
          {status === "subscribed" ? "Subscribed" : status === "loading" ? "Connecting..." : "Subscribe Now"}
        </Button>
        {isEnabled && (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            <CheckCircle className="h-4 w-4" /> Notifications enabled
          </span>
        )}
      </div>

      {message ? <p className="mt-4 text-sm text-zinc-400">{message}</p> : null}
    </div>
  );
}
