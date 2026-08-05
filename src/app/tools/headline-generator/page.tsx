import { MiniToolGenerator } from "@/components/mini-tools/MiniToolGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Free AI Headline Generator", description: "Generate clear, non-clickbait headlines in English, Hindi, or Hinglish.", alternates: { canonical: "/tools/headline-generator" } };

export default function HeadlineGeneratorPage() {
  return (
    <MiniToolGenerator
      tool="headline"
      title="AI Headline Generator"
      description="Generate helpful, clear, Discover-safe headlines in English, Hindi, or Hinglish."
      placeholder="Example: Best AI tools for Indian students"
    />
  );
}
