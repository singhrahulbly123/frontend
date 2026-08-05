import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/content/PolicyPage";

export const metadata: Metadata = { title: "Editorial Policy", description: "Pulsevian editorial, correction, sourcing, and AI-assistance standards.", alternates: { canonical: "/editorial-policy" } };

export default function EditorialPolicyPage() {
  return (
    <PolicyPage title="Editorial Policy" intro="Pulsevian aims to publish practical, accurate, and clearly labelled AI resources. This policy explains the standard we expect before content is presented as reviewed or fact-checked.">
      <section><h2>Human review labels</h2><p>AI may assist with research, drafting, translation, or formatting. We only describe a page as human-reviewed when an editor has checked its core claims, links, clarity, and disclosures.</p></section>
      <section><h2>Sources and testing</h2><p>For factual claims we prefer official documentation, primary sources, and direct product pages. A tool review must distinguish hands-on observations from vendor claims and should state when a feature was not independently tested.</p></section>
      <section><h2>Corrections</h2><p>Material errors should be corrected promptly. Where useful, the page should show an updated timestamp or correction note. Readers can report an error through the <Link href="/contact">contact page</Link>.</p></section>
      <section><h2>Commercial independence</h2><p>Sponsorship or affiliate compensation does not guarantee favourable coverage or placement. Commercial relationships must be disclosed.</p></section>
    </PolicyPage>
  );
}
