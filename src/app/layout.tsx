import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "សេវាខ្មែរ - ទីផ្សារសេវាកម្មកម្ពុជា | Khmer Service Marketplace",
  description: "ស្វែងរកអ្នកផ្តល់សេវាដែលអ្នកអាចទុកចិត្តបាន បង្ហោះបញ្ហារបស់អ្នក និងស្វែងរកអ្នកផ្តល់សេវានៅជិតអ្នក។",
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
