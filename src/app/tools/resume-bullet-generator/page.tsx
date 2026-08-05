import { MiniToolGenerator } from "@/components/mini-tools/MiniToolGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Free AI Resume Bullet Generator", description: "Turn basic experience into clear, ATS-friendly, impact-led resume bullets.", alternates: { canonical: "/tools/resume-bullet-generator" } };

export default function ResumeBulletGeneratorPage() {
  return (
    <MiniToolGenerator
      tool="resume-bullets"
      title="Resume Bullet Generator"
      description="Boring resume points ko ATS-friendly, action-led, impact-focused bullets me convert karein."
      placeholder="Example: Managed social media campaigns and improved engagement"
      contextLabel="Role, numbers, or achievements"
    />
  );
}
