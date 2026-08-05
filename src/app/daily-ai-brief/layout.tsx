import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily AI Brief",
  description: "A concise daily brief with useful AI updates, tools, and practical takeaways for India.",
  alternates: { canonical: "/daily-ai-brief" },
};

export default function DailyAiBriefLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
