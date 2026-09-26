import type { Metadata } from "next";
import { generateSeoMetadata, generateWebSiteJsonLd, generateOrganizationJsonLd, siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = generateSeoMetadata({
  title: "ខ្មែរ សេវា (Khmer Service) | ស្វែងរកជាង និងសេវាកម្មនៅកម្ពុជា",
  description:
    "ខ្មែរ សេវា (Khmer Service) — ថ្នាលសេវាកម្មឈានមុខគេនៅកម្ពុជា សម្រាប់ស្វែងរកជាង និងអ្នកផ្តល់សេវាកម្ម។ ជួសជុលម៉ាស៊ីនត្រជាក់ ជាងភ្លើង ជាងទឹក ជាងកុំព្យូទ័រ សេវាសម្អាត និងជាងជំនាញជាច្រើនទៀត។",
  path: "/",
});

export default function HomePage() {
  const webSiteJsonLd = generateWebSiteJsonLd();
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <JsonLd data={webSiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <HomeClient />
    </>
  );
}
