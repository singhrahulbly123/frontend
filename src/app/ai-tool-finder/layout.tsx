import type { Metadata } from "next";

export const metadata: Metadata = { title: "Free AI Tool Finder", description: "Find AI tools matched to your role, goal, and budget.", alternates: { canonical: "/ai-tool-finder" } };

export default function AiToolFinderLayout({ children }: { children: React.ReactNode }) { return children; }
