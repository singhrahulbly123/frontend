import { MiniToolGenerator } from "@/components/mini-tools/MiniToolGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Free Instagram Caption Generator", description: "Generate hooks, captions, CTAs, and hashtags in English, Hindi, or Hinglish.", alternates: { canonical: "/tools/instagram-caption-generator" } };

export default function InstagramCaptionGeneratorPage() {
  return (
    <MiniToolGenerator
      tool="instagram-caption"
      title="Instagram Caption Generator"
      description="Generate captions, hooks, CTAs, and relevant hashtags in English, Hindi, or Hinglish."
      placeholder="Example: New AI tool launch for creators"
    />
  );
}
