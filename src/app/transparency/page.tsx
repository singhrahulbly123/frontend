import type { Metadata } from "next";
import { PolicyPage } from "@/components/content/PolicyPage";

export const metadata: Metadata = { title: "Transparency", description: "Pulsevian transparency on AI assistance, reviews, ratings, and commercial links.", alternates: { canonical: "/transparency" } };

export default function TransparencyPage() {
  return (
    <PolicyPage title="Transparency" intro="Readers should be able to understand what a page is based on, whether AI assisted it, and whether Pulsevian may earn money from a link.">
      <section><h2>AI assistance</h2><p>AI can support drafting, summarising, translation, or tool output. It does not replace evidence. Pages carrying a human-review or fact-check status should reflect an actual editorial action.</p></section>
      <section><h2>Ratings and scores</h2><p>We do not show a default star rating or invented review count. Internal opportunity or trust scores are editorial aids, not customer-review ratings, and should explain their criteria.</p></section>
      <section><h2>Affiliate and sponsored content</h2><p>Affiliate links may generate a commission. Sponsored placement must be labelled, and payment does not guarantee a positive conclusion.</p></section>
      <section><h2>Limitations</h2><p>AI products change quickly. Dates, version context, sources, and official links help readers judge whether a page is still current.</p></section>
    </PolicyPage>
  );
}
