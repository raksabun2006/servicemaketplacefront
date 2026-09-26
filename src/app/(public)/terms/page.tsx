import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "លក្ខខណ្ឌប្រើប្រាស់ (Terms of Service) | ខ្មែរ សេវា",
  description:
    "លក្ខខណ្ឌនៃការប្រើប្រាស់ថ្នាលទីផ្សារសេវាកម្ម ខ្មែរ សេវា (Khmer Service) សម្រាប់អតិថិជន និងអ្នកផ្តល់សេវា។",
  path: "/terms",
});

export default function TermsPage() {
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
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            លក្ខខណ្ឌនៃការប្រើប្រាស់
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
              ១. ការទទួលយកលក្ខខណ្ឌ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              តាមរយៈការចូលប្រើប្រាស់ និងចុះឈ្មោះប្រើប្រាស់ថ្នាល ខ្មែរ សេវា (Khmer Service) លោកអ្នកយល់ព្រមគោរព និងអនុវត្តតាមលក្ខខណ្ឌនៃការប្រើប្រាស់ដែលមានចែងនៅទីនេះ។
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              ២. គណនី និងការទទួលខុសត្រូវ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              អ្នកប្រើប្រាស់ត្រូវធានាថាព័ត៌មានដែលបានផ្តល់ក្នុងពេលចុះឈ្មោះមានភាពត្រឹមត្រូវ និងទាន់សម័យ។ លោកអ្នកទទួលខុសត្រូវទាំងស្រុងចំពោះការរក្សាសម្ងាត់នៃពាក្យសម្ងាត់គណនីរបស់ខ្លួន។
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              ៣. តួនាទីរបស់ ខ្មែរ សេវា
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              ខ្មែរ សេវា គឺជាថ្នាលបច្ចេកវិទ្យាដែលជួយផ្គូផ្គង និងសម្រួលការទំនាក់ទំនងរវាងអតិថិជន និងអ្នកផ្តល់សេវាឯករាជ្យ។ កិច្ចព្រមព្រៀងសេវាកម្មជាក់ស្តែង តម្លៃ និងលក្ខខណ្ឌការងារ គឺជាកិច្ចព្រមព្រៀងរវាងអតិថិជន និងអ្នកផ្តល់សេវាដោយផ្ទាល់។
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              ៤. ស្តង់ដារសីលធម៌ និងការហាមឃាត់
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              អ្នកប្រើប្រាស់មិនត្រូវប្រើប្រាស់ថ្នាលសម្រាប់សកម្មភាពខុសច្បាប់ ការបោកប្រាស់ ការបង្ហោះព័ត៌មានមិនពិត ឬការរំខានដល់អ្នកប្រើប្រាស់ដទៃទៀតឡើយ។ យើងរក្សាសិទ្ធិក្នុងការផ្អាកគណនីដែលបំពានច្បាប់ និងបទបញ្ជាផ្ទៃក្នុង។
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              ៥. ការកែប្រែលក្ខខណ្ឌ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              ខ្មែរ សេវា រក្សាសិទ្ធិក្នុងការធ្វើបច្ចុប្បន្នភាពលក្ខខណ្ឌទាំងនេះនៅពេលសមស្រប។ ការបន្តប្រើប្រាស់ថ្នាលបន្ទាប់ពីការកែប្រែបញ្ជាក់ពីការយល់ព្រមរបស់អ្នកចំពោះលក្ខខណ្ឌថ្មី។
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
