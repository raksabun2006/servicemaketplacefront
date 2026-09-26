import { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "ស្វែងរកសេវាកម្ម និងដំណឹងជួសជុល | ខ្មែរ សេវា",
  description:
    "ស្វែងរក និងស្នើសុំសេវាកម្មជួសជុលគេហដ្ឋាន ម៉ាស៊ីនត្រជាក់ កុំព្យូទ័រ អគ្គិសនី ទឹក សម្អាត និងសេវាកម្មផ្សេងៗនៅកម្ពុជា។ ភ្ជាប់ទំនាក់ទំនងជាមួយជាងជំនាញឆាប់រហ័ស។",
  path: "/services",
  keywords: [
    "សេវាកម្ម",
    "សេវាកម្មជួសជុល",
    "ស្វែងរកជាង",
    "រកជាង",
    "សេវាកម្មនៅកម្ពុជា",
    "home services Cambodia",
    "repair service Cambodia",
  ],
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
