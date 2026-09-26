import type { Metadata, Viewport } from "next";
import { Kantumruy_Pro, Noto_Sans_Khmer, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AppShell } from "@/components/layout/AppShell";

const kantumruyPro = Kantumruy_Pro({
  variable: "--font-kantumruy",
  subsets: ["khmer"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSansKhmer = Noto_Sans_Khmer({
  variable: "--font-khmer",
  subsets: ["khmer"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

import { siteConfig } from "@/lib/seo";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ខ្មែរ សេវា | វេទិកាស្វែងរកជាង និងសេវាកម្មនៅកម្ពុជា",
    template: "%s | ខ្មែរ សេវា - Khmer Service",
  },
  description:
    "ខ្មែរ សេវា (Khmer Service) គឺជាវេទិកាសម្រាប់ស្វែងរក និងភ្ជាប់អ្នកប្រើប្រាស់ជាមួយជាង និងអ្នកផ្តល់សេវាកម្មដែលមានជំនាញនៅកម្ពុជា។ ជួសជុលម៉ាស៊ីនត្រជាក់ កុំព្យូទ័រ អគ្គិសនី ទឹក សម្អាត និងសេវាកម្មជាច្រើនទៀត។",
  keywords: siteConfig.keywords,
  authors: [{ name: "ខ្មែរ សេវា", url: siteConfig.url }],
  creator: "ខ្មែរ សេវា",
  publisher: "ខ្មែរ សេវា",
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
    title: "ខ្មែរ សេវា | វេទិកាស្វែងរកជាង និងសេវាកម្មនៅកម្ពុជា",
    description:
      "ខ្មែរ សេវា (Khmer Service) គឺជាវេទិកាសម្រាប់ស្វែងរក និងភ្ជាប់អ្នកប្រើប្រាស់ជាមួយជាង និងអ្នកផ្តល់សេវាកម្មដែលមានជំនាញនៅកម្ពុជា។ ជួសជុលម៉ាស៊ីនត្រជាក់ កុំព្យូទ័រ អគ្គិសនី ទឹក សម្អាត និងសេវាកម្មជាច្រើនទៀត។",
    url: siteConfig.url,
    siteName: "ខ្មែរ សេវា (Khmer Service)",
    locale: siteConfig.locale,
    alternateLocale: [siteConfig.alternateLocale],
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/logo.png`,
        width: 800,
        height: 800,
        alt: "ខ្មែរ សេវា - Khmer Service",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ខ្មែរ សេវា | វេទិកាស្វែងរកជាង និងសេវាកម្មនៅកម្ពុជា",
    description:
      "ខ្មែរ សេវា (Khmer Service) គឺជាវេទិកាសម្រាប់ស្វែងរក និងភ្ជាប់អ្នកប្រើប្រាស់ជាមួយជាង និងអ្នកផ្តល់សេវាកម្មដែលមានជំនាញនៅកម្ពុជា។",
    images: [`${siteConfig.url}/logo.png`],
    creator: siteConfig.twitterHandle,
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
      className={`${kantumruyPro.variable} ${notoSansKhmer.variable} ${inter.variable} h-full antialiased`}
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
