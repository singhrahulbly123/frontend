import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/content/PolicyPage";

export const metadata: Metadata = {
  title: "About Pulsevian",
  description: "Why Pulsevian builds practical AI tools and workflows for people in India.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PolicyPage title="About Pulsevian" intro="Pulsevian helps Indian creators, students, job seekers, freelancers, and small businesses use AI for practical outcomes—not hype.">
      <section><h2>What we publish</h2><p>We publish free mini tools, step-by-step workflows, tool reviews, comparisons, prompts, and short learning paths. Our goal is to make each page useful enough to complete a real task.</p></section>
      <section><h2>How we work</h2><p>AI may help with research, drafting, translation, and formatting. Content marked as human-reviewed has been checked by an editor. We separate editorial recommendations from sponsored or affiliate links.</p></section>
      <section><h2>Our standard</h2><p>We avoid invented ratings, fake testimonials, and unsupported claims. Pricing and product features can change, so readers should verify purchase decisions on the official provider website.</p></section>
      <p>See our <Link href="/editorial-policy">editorial policy</Link>, <Link href="/transparency">transparency statement</Link>, and <Link href="/contact">contact page</Link>.</p>
    </PolicyPage>
  );
}
