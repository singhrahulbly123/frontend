import type { Metadata } from "next";
import { PolicyPage } from "@/components/content/PolicyPage";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Pulsevian collects, uses, and protects visitor information.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <PolicyPage eyebrow="Last updated: 5 August 2026" title="Privacy Policy" intro="This policy explains the information Pulsevian may process when you browse the site, subscribe, save content, or use an AI-powered tool.">
      <section><h2>Information we process</h2><ul><li>Email address and preferences when you subscribe.</li><li>Tool inputs you submit to generate an output.</li><li>Basic technical and usage data such as page views, referrer, browser information, and a privacy-protected IP hash.</li><li>Bookmarks or preferences stored locally in your browser.</li></ul></section>
      <section><h2>How we use it</h2><p>We use this information to deliver requested features, prevent abuse, measure performance, improve content, and communicate with subscribers. Tool inputs may be sent to an AI service provider solely to produce the requested output; do not submit confidential or sensitive personal data.</p></section>
      <section><h2>Advertising and affiliate links</h2><p>If advertising or affiliate services are enabled, their providers may use cookies or similar technologies under their own privacy policies. Affiliate clicks may be measured so we can attribute commissions.</p></section>
      <section><h2>Retention and choices</h2><p>We retain data only as long as needed for the stated purpose, security, or legal requirements. You can clear browser storage, disable non-essential cookies, or contact us to request access, correction, or deletion where applicable.</p></section>
      <section><h2>Security and changes</h2><p>No online service can guarantee absolute security. We use reasonable safeguards and will update this page when our practices materially change.</p></section>
    </PolicyPage>
  );
}
