import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "អ្នកផ្តល់សេវាកម្ម និងជាងជំនាញនៅកម្ពុជា | ខ្មែរ សេវា",
  description:
    "ស្វែងរកជាងជំនាញ និងអ្នកផ្តល់សេវាកម្មដែលមានបទពិសោធន៍នៅកម្ពុជា។ ជាងម៉ាស៊ីនត្រជាក់ ជាងកុំព្យូទ័រ ជាងភ្លើង ជាងទឹក និងជាងជួសជុលទូទាំងរាជធានីខេត្ត។",
  path: "/providers",
  keywords: [
    "អ្នកផ្តល់សេវាកម្ម",
    "ជាងជួសជុល",
    "ស្វែងរកជាង",
    "រកជាង",
    "ជាងនៅជិតខ្ញុំ",
    "service provider Cambodia",
    "handyman Cambodia",
  ],
});

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
