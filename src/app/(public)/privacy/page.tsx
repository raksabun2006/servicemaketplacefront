import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from "lucide-react";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "គោលការណ៍ឯកជនភាព (Privacy Policy) | ខ្មែរ សេវា",
  description:
    "គោលការណ៍ឯកជនភាព និងការការពារទិន្នន័យផ្ទាល់ខ្លួនរបស់អ្នកប្រើប្រាស់នៅលើថ្នាល ខ្មែរ សេវា (Khmer Service)។",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ត្រឡប់ទៅទំព័រដើម</span>
          </Link>
        </div>

        {/* Header */}
        <header className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            គោលការណ៍ឯកជនភាព
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            កាលបរិច្ឆេទធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖ ខែមីនា ឆ្នាំ ២០២៦
          </p>
        </header>

        {/* Content Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              ១. សេចក្តីផ្តើម
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              ខ្មែរ សេវា (Khmer Service) ផ្តល់ការយកចិត្តទុកដាក់ខ្ពស់បំផុតចំពោះឯកជនភាព និងសុវត្ថិភាពព័ត៌មានផ្ទាល់ខ្លួនរបស់អតិថិជន និងអ្នកផ្តល់សេវាទាំងអស់។ គោលការណ៍នេះពិពណ៌នាអំពីរបៀបដែលយើងប្រមូល ប្រើប្រាស់ និងការពារព័ត៌មានរបស់អ្នក។
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              ២. ព័ត៌មានដែលយើងប្រមូល
            </h2>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600 pl-2">
              <li>
                <strong>ព័ត៌មានគណនី៖</strong> ឈ្មោះ លេខទូរស័ព្ទ អាសយដ្ឋានអ៊ីមែល និងរូបភាពប្រវត្តិរូប។
              </li>
              <li>
                <strong>ព័ត៌មានអ្នកផ្តល់សេវា៖</strong> ឯកសារបញ្ជាក់អត្តសញ្ញាណ ជំនាញវិជ្ជាជីវៈ និងទីតាំងផ្តល់សេវា។
              </li>
              <li>
                <strong>ព័ត៌មានសំណើសេវាកម្ម៖</strong> ទីតាំងជាក់ស្តែង ការពិពណ៌នាអំពីបញ្ហាជួសជុល និងរូបភាពពាក់ព័ន្ធ។
              </li>
              <li>
                <strong>ទិន្នន័យបច្ចេកវិទ្យា៖</strong> អាសយដ្ឋាន IP ប្រភេទឧបករណ៍ប្រើប្រាស់ និងខូឃីស៍ (Cookies) សម្រាប់បង្កើនប្រសិទ្ធភាពបទពិសោធន៍។
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              ៣. គោលបំណងនៃការប្រើប្រាស់ព័ត៌មាន
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              យើងប្រើប្រាស់ព័ត៌មានរបស់អ្នកក្នុងគោលបំណងផ្គូផ្គងអ្នកស្វែងរកសេវាកម្មជាមួយជាងជំនាញ សម្រួលការទំនាក់ទំនង និងការកក់សេវា ការទូទាត់ប្រាក់ និងការលើកកម្ពស់គុណភាពសេវាកម្មនៅលើប្រព័ន្ធ។
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              ៤. ការការពារ និងសុវត្ថិភាពទិន្នន័យ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              យើងអនុវត្តវិធានការសុវត្ថិភាពបច្ចេកទេស និងស្តង់ដារអន្តរជាតិដើម្បីការពារទិន្នន័យរបស់អ្នកពីការចូលប្រើប្រាស់ដោយគ្មានការអនុញ្ញាត ការបាត់បង់ ឬការកែប្រែដោយខុសច្បាប់។
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              ៥. ទំនាក់ទំនងសម្រាប់សំណួរឯកជនភាព
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              ប្រសិនបើលោកអ្នកមានសំណួរ ឬកង្វល់អំពីគោលការណ៍ឯកជនភាពនេះ សូមទំនាក់ទំនងមកកាន់ក្រុមការងារគាំទ្ររបស់យើងតាមរយៈអ៊ីមែល support@serviceplatform.kh ឬទូរស័ព្ទ +855 87 955 888។
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
