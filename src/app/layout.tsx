import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileNav } from "@/components/layout/MobileNav";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pulsevian: Practical AI Tools and Workflows for India",
    template: "%s | Pulsevian",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: "Pulsevian: Practical AI Tools and Workflows for India",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulsevian: Practical AI Tools and Workflows for India",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
    other: [
      { rel: "mask-icon", url: "/pulsevian-logo.svg", color: "#f97316" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f8fb",
  width: "device-width",
  initialScale: 1,
};

const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className="light-theme font-sans antialiased pb-20 md:pb-0">
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
        <main>{children}</main>
        <SiteFooter />
        <MobileNav />
      </body>
    </html>
  );
}
