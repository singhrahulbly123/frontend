import type { Metadata } from "next";
import { PolicyPage } from "@/components/content/PolicyPage";

export const metadata: Metadata = { title: "Terms of Use", description: "Terms governing the use of Pulsevian content and AI tools.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <PolicyPage eyebrow="Last updated: 5 August 2026" title="Terms of Use" intro="By using Pulsevian, you agree to use the site lawfully and accept these terms.">
      <section><h2>Information, not professional advice</h2><p>Content and AI-generated outputs are for general informational and productivity purposes. They are not legal, medical, financial, hiring, or other professional advice. Verify important decisions independently.</p></section>
      <section><h2>Acceptable use</h2><p>Do not abuse, overload, scrape at a harmful rate, bypass security, submit unlawful material, or use the service to infringe another person&apos;s rights. We may limit access to protect users and infrastructure.</p></section>
      <section><h2>Accuracy and third-party services</h2><p>AI outputs can be incomplete or wrong, and third-party pricing and features can change. Links to external services do not make Pulsevian responsible for those services.</p></section>
      <section><h2>Intellectual property</h2><p>Pulsevian branding, original articles, and site design are protected by applicable law. You retain responsibility for the inputs you submit and must have the right to use them.</p></section>
      <section><h2>Availability and liability</h2><p>The service is provided on an as-available basis. To the extent permitted by law, Pulsevian is not liable for indirect losses arising from reliance on content, AI output, or third-party services.</p></section>
    </PolicyPage>
  );
}
