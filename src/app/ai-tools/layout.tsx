import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best AI Tools for India",
  description: "Discover practical AI tools for creators, students, job seekers, and small businesses, with honest use cases, pricing, pros, and cons.",
  alternates: { canonical: "/ai-tools" },
};

export default function AiToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
