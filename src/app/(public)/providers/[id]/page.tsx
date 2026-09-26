import { Metadata } from "next";
import { providerApi } from "@/lib/api/provider.api";
import {
  generateSeoMetadata,
  generateLocalBusinessJsonLd,
  siteConfig,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProviderDetailClient } from "@/components/providers/ProviderDetailClient";

interface ProviderPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProviderPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const provider = await providerApi.getById(id);
    if (!provider) {
      return generateSeoMetadata({
        title: "រកមិនឃើញអ្នកផ្តល់សេវា | ខ្មែរ សេវា",
        noIndex: true,
      });
    }

    const displayName = provider.businessName || provider.fullName || "អ្នកផ្តល់សេវា";
    const location = provider.serviceArea || provider.city || "កម្ពុជា";
    const title = `ជាង ${displayName} | ${location}`;
    const description = provider.bio
      ? provider.bio.slice(0, 160)
      : `ស្វែងរកព័ត៌មាន និងទាក់ទងជាង ${displayName} នៅ${location}។ សេវាកម្មជួសជុល និងថែទាំគេហដ្ឋានតាមរយៈ ខ្មែរ សេវា (Khmer Service)។`;

    return generateSeoMetadata({
      title,
      description,
      path: `/providers/${id}`,
      type: "profile",
      keywords: [
        displayName,
        location,
        "ជាងជំនាញ",
        "អ្នកផ្តល់សេវាកម្ម",
        "handyman Cambodia",
        "service provider Cambodia",
      ],
    });
  } catch {
    return generateSeoMetadata({
      title: "អ្នកផ្តល់សេវាកម្ម | ខ្មែរ សេវា",
      path: `/providers/${id}`,
      noIndex: true,
    });
  }
}

export default async function ProviderDetailPage({ params }: ProviderPageProps) {
  const { id } = await params;

  let provider = null;
  try {
    provider = await providerApi.getById(id);
  } catch {
    provider = null;
  }

  const displayName = provider?.businessName || provider?.fullName || "អ្នកផ្តល់សេវា";

  const breadcrumbItems = [
    { name: "អ្នកផ្តល់សេវា", url: "/providers" },
    { name: displayName, url: `/providers/${id}` },
  ];

  const localBusinessSchema = provider
    ? generateLocalBusinessJsonLd({
        name: displayName,
        description: provider.bio,
        url: `${siteConfig.url}/providers/${id}`,
        city: provider.city || provider.serviceArea,
        district: provider.district,
        ratingValue: provider.averageRating,
        reviewCount: provider.totalReviews,
      })
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={breadcrumbItems} />
      {localBusinessSchema && <JsonLd data={localBusinessSchema} />}
      <ProviderDetailClient id={id} />
    </div>
  );
}
