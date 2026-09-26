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
  title: "ថ្នាលបរិវត្តកម្មឌីជីថលសហគ្រាស | Enterprises Go Digital (EGD)",
  description: "ថ្នាលបរិវត្តកម្មឌីជីថលសហគ្រាស (Enterprises Go Digital - EGD) ជំរុញការចាប់យកឌីជីថលរបស់សហគ្រាសគ្រប់កម្រិត និងគ្រប់វិស័យ ដើម្បីពង្រឹងប្រសិទ្ធភាព និងចីរភាពអាជីវកម្ម។",
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
