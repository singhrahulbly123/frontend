import type { Metadata } from "next";
import { PolicyPage } from "@/components/content/PolicyPage";

export const metadata: Metadata = { title: "Cookie Policy", description: "How Pulsevian uses cookies and browser storage.", alternates: { canonical: "/cookie-policy" } };

export default function CookiePolicyPage() {
  return (
    <PolicyPage eyebrow="Last updated: 5 August 2026" title="Cookie Policy" intro="Pulsevian may use cookies and browser storage to operate features, remember preferences, measure performance, and support advertising when enabled.">
      <section><h2>Essential storage</h2><p>Authentication, security, saved items, notification choices, and similar features may require cookies or local browser storage.</p></section>
      <section><h2>Analytics and advertising</h2><p>Analytics helps us understand aggregate usage. Advertising providers may set their own identifiers only when those services are configured. Their policies govern their technologies.</p></section>
      <section><h2>Your controls</h2><p>You can delete or block cookies in your browser. Blocking essential storage may prevent some features from working. Where consent is legally required, non-essential technologies should not load before consent.</p></section>
    </PolicyPage>
  );
}
