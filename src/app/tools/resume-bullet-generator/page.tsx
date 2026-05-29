import { MiniToolGenerator } from "@/components/mini-tools/MiniToolGenerator";

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
