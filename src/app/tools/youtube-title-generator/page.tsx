import { MiniToolGenerator } from "@/components/mini-tools/MiniToolGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Free YouTube Title Generator", description: "Generate clear, curiosity-led YouTube titles in English, Hindi, or Hinglish.", alternates: { canonical: "/tools/youtube-title-generator" } };

export default function YoutubeTitleGeneratorPage() {
  return (
    <MiniToolGenerator
      tool="youtube-title"
      title="YouTube Title Generator"
      description="Generate YouTube titles in English, Hindi, or Hinglish with curiosity and clarity, without misleading clickbait."
      placeholder="Example: How to use ChatGPT to earn online"
    />
  );
}
