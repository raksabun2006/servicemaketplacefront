import type { Metadata, Viewport } from "next";
import { Kantumruy_Pro, Noto_Sans_Khmer } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AppShell } from "@/components/layout/AppShell";

const kantumruyPro = Kantumruy_Pro({
  variable: "--font-kantumruy",
  subsets: ["khmer", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSansKhmer = Noto_Sans_Khmer({
  variable: "--font-khmer",
  subsets: ["khmer"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

import { siteConfig } from "@/lib/seo";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ខ្មែរ សេវា (Khmer Service) | ស្វែងរកជាង និងសេវាកម្មនៅកម្ពុជា",
    template: "%s | ខ្មែរ សេវា - Khmer Service",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "ខ្មែរ សេវា (Khmer Service)", url: siteConfig.url }],
  creator: "ខ្មែរ សេវា (Khmer Service)",
  publisher: "ខ្មែរ សេវា (Khmer Service)",
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "km-KH": siteConfig.url,
      "en-US": siteConfig.url,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "ខ្មែរ សេវា (Khmer Service) | ស្វែងរកជាង និងសេវាកម្មនៅកម្ពុជា",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "ខ្មែរ សេវា (Khmer Service)",
    locale: siteConfig.locale,
    alternateLocale: [siteConfig.alternateLocale],
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/logo.png`,
        width: 1200,
        height: 630,
        alt: "ខ្មែរ សេវា - Khmer Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ខ្មែរ សេវា (Khmer Service) | ស្វែងរកជាង និងសេវាកម្មនៅកម្ពុជា",
    description: siteConfig.description,
    images: [`${siteConfig.url}/logo.png`],
    creator: siteConfig.twitterHandle,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="km"
      className={`${kantumruyPro.variable} ${notoSansKhmer.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        <LanguageProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
