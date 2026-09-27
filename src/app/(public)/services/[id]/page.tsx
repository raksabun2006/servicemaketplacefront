import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { slugToCategory, generateSeoMetadata, siteConfig } from "@/lib/seo";
import { CategoryLandingView } from "@/components/services/CategoryLandingView";
import { ServiceDetailClient } from "@/components/services/ServiceDetailClient";
import { serviceRequestApi } from "@/lib/api/service-request.api";
import { fileApi } from "@/lib/api/file.api";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // 1. Check if ID matches a known Service Category Slug (e.g. ac-repair, plumbing, electrical)
  const categorySeo = slugToCategory(id);
  if (categorySeo) {
    const categoryOgImage = `/api/og?title=${encodeURIComponent(categorySeo.khmerTitle)}&category=${encodeURIComponent(categorySeo.englishTitle)}`;
    return generateSeoMetadata({
      title: categorySeo.metaTitle,
      description: categorySeo.metaDescription,
      path: `/services/${categorySeo.slug}`,
      keywords: categorySeo.keywords,
      image: categoryOgImage,
    });
  }

  // 2. Otherwise it's a specific customer service request UUID
  try {
    const request = await serviceRequestApi.getById(id);
    if (!request) {
      return generateSeoMetadata({
        title: "រកមិនឃើញសំណើសេវាកម្ម",
        noIndex: true,
      });
    }

    // Only index explicitly OPEN public requests to prevent indexing expired or private requests (Rule #8)
    const isIndexable = request.status === "OPEN";

    // Extract uploaded photo if available
    const rawImages = (
      request.imageUrls && request.imageUrls.length > 0
        ? request.imageUrls
        : ((request as unknown as { imageFileIds?: string[] })?.imageFileIds || [])
    ).filter(Boolean);

    let ogImage: string;
    if (rawImages.length > 0) {
      ogImage = fileApi.getFileUrl(rawImages[0]);
    } else {
      const budgetStr = request.budgetMax
        ? `$${request.budgetMax}`
        : request.budgetMin
        ? `$${request.budgetMin}`
        : "";
      const searchParams = new URLSearchParams({
        title: request.title,
        category: request.category || "សេវាកម្ម",
        city: request.district ? `${request.district}, ${request.city || "Phnom Penh"}` : (request.city || "Phnom Penh"),
      });
      if (budgetStr) searchParams.set("budget", budgetStr);
      if (request.urgent) searchParams.set("urgent", "true");
      ogImage = `/api/og?${searchParams.toString()}`;
    }

    return generateSeoMetadata({
      title: `${request.title} | ${request.city || "កម្ពុជា"}`,
      description: request.description
        ? request.description.slice(0, 160)
        : `ស្វែងរកជាងជំនាញសម្រាប់ ${request.title} នៅ ${request.city || "កម្ពុជា"}។`,
      path: `/services/${id}`,
      image: ogImage,
      noIndex: !isIndexable,
    });
  } catch {
    return generateSeoMetadata({
      title: "សំណើសេវាកម្ម | ខ្មែរ សេវា",
      noIndex: true,
    });
  }
}

export default async function ServiceRoutePage({ params }: Props) {
  const { id } = await params;

  // 1. Check if this is a Category SEO Page
  const categorySeo = slugToCategory(id);
  if (categorySeo) {
    return <CategoryLandingView seoData={categorySeo} />;
  }

  // 2. Otherwise render the Service Request Detail Client
  return <ServiceDetailClient id={id} />;
}
