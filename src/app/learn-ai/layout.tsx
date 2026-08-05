import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Practical AI Skills",
  description: "Short, practical AI learning paths for creators, students, careers, and small businesses.",
  alternates: { canonical: "/learn-ai" },
};

export default function LearnAiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
