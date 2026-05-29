import { MiniToolGenerator } from "@/components/mini-tools/MiniToolGenerator";

export default function YoutubeTitleGeneratorPage() {
  return (
    <MiniToolGenerator
      tool="youtube-title"
      title="YouTube Title Generator"
      description="Generate English YouTube titles with curiosity and clarity, without misleading clickbait."
      placeholder="Example: How to use ChatGPT to earn online"
    />
  );
}
