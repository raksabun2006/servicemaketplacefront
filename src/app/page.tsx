import type { Metadata } from "next";
import { generateSeoMetadata, generateWebSiteJsonLd, generateOrganizationJsonLd, siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = generateSeoMetadata({
  title: `${siteConfig.khmerName} | ស្វែងរកជាង និងសេវាកម្មនៅកម្ពុជា`,
  description:
    "ស្វែងរកជាង និងអ្នកផ្តល់សេវាកម្មដែលមានបទពិសោធន៍នៅកម្ពុជា។ ស្វែងរកសេវាជួសជុលម៉ាស៊ីនត្រជាក់ កុំព្យូទ័រ អគ្គិសនី ទឹក សម្អាត និងសេវាកម្មផ្សេងៗបានយ៉ាងងាយស្រួល។",
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
