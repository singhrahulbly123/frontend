import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Voice Brief",
  description: "Listen to a short, practical AI briefing from Pulsevian.",
  alternates: { canonical: "/voice-brief" },
};

export default function VoiceBriefLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
