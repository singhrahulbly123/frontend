import type { Metadata } from "next";
import { PolicyPage } from "@/components/content/PolicyPage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Pulsevian",
  description: "Contact Pulsevian for support, corrections, partnerships, and editorial questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PolicyPage title="Contact us" intro="For support, corrections, privacy requests, partnerships, or editorial questions, email our team.">
      <section><h2>Email</h2><p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p></section>
      <section><h2>Corrections</h2><p>Please include the page URL, the statement you believe is incorrect, and a reliable source supporting the correction. We review clear correction requests as quickly as possible.</p></section>
      <section><h2>Business enquiries</h2><p>Clearly label sponsorship or partnership enquiries. Payment never guarantees a positive review or editorial ranking.</p></section>
    </PolicyPage>
  );
}
