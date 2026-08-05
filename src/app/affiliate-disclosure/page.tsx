import type { Metadata } from "next";
import { PolicyPage } from "@/components/content/PolicyPage";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How Pulsevian discloses and handles affiliate relationships.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <PolicyPage title="Affiliate Disclosure" intro="Some Pulsevian links may be affiliate links. If you purchase through one, we may earn a commission at no additional cost to you.">
      <section><h2>How affiliate links are shown</h2><p>Affiliate buttons and links use clear labels where practical and include sponsored link attributes for search engines. A commission does not guarantee positive coverage or a higher ranking.</p></section>
      <section><h2>How we evaluate tools</h2><p>Recommendations consider usefulness, limitations, pricing, audience fit, and available evidence. We do not display an invented review count or a default star rating when supporting data is unavailable.</p></section>
      <section><h2>Your responsibility</h2><p>Check the provider&apos;s current terms, price, refund policy, privacy policy, and suitability before purchasing. Product availability and commission arrangements may change.</p></section>
    </PolicyPage>
  );
}
