import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/content/PolicyPage";

export const metadata: Metadata = { title: "Fact-checking Standard", description: "How Pulsevian verifies claims and handles corrections.", alternates: { canonical: "/fact-check" } };

export default function FactCheckPage() {
  return (
    <PolicyPage title="Fact-checking Standard" intro="A fact-checked label is reserved for content whose important factual claims and cited sources have been reviewed. It is not applied automatically to every page.">
      <section><h2>Verification process</h2><p>Editors should identify checkable claims, compare them with primary or authoritative sources, verify dates and context, and flag uncertainty rather than guess.</p></section>
      <section><h2>AI-generated claims</h2><p>AI output is not treated as a source. Quotes, statistics, ratings, pricing, and product capabilities require independent support before publication.</p></section>
      <section><h2>Corrections and updates</h2><p>New information may require an update even when the original report was accurate. Report a possible error through our <Link href="/contact">contact page</Link>.</p></section>
    </PolicyPage>
  );
}
