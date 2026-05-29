import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileNav } from "@/components/layout/MobileNav";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import HeatmapTracker from "@/components/analytics/HeatmapTracker";
import ViewabilityTracker from "@/components/analytics/ViewabilityTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Global AI News",
    template: "%s | Global AI News",
  },
  description:
    "Global English AI news platform optimized for Google Discover, SEO, and trusted human-reviewed journalism.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Global AI News",
  },
  robots: { index: true, follow: true },
  alternates: {
    languages: {
      en: "/",
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/globe.svg",
    apple: "/globe.svg",
    other: [
      { rel: "mask-icon", url: "/globe.svg", color: "#f97316" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
};

const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} font-sans antialiased pb-20 md:pb-0`}>
        {oneSignalAppId ? (
          <Script
            src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
            strategy="afterInteractive"
          />
        ) : null}
        {adsenseClient ? (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        ) : null}
        <SiteHeader />
        <PwaInstallPrompt />
        <HeatmapTracker />
        <ViewabilityTracker />
        <main>{children}</main>
        <SiteFooter />
        <MobileNav />
      </body>
    </html>
  );
}
