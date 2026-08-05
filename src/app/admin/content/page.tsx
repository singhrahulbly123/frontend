import type { Metadata } from "next";
import { ContentDashboard } from "@/components/admin/ContentDashboard";

export const metadata: Metadata = {
  title: "Content Studio",
  description: "Manage Pulsevian AI tools and daily briefs.",
  robots: { index: false, follow: false },
};

export default function AdminContentPage() {
  return <ContentDashboard />;
}
