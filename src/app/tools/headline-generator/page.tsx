import { MiniToolGenerator } from "@/components/mini-tools/MiniToolGenerator";

export default function HeadlineGeneratorPage() {
  return (
    <MiniToolGenerator
      tool="headline"
      title="AI Headline Generator"
      description="Generate helpful, clear, Discover-safe English headlines for global readers."
      placeholder="Example: Best AI tools for students worldwide"
    />
  );
}
