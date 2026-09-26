"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  Wrench,
  ShieldCheck,
  Heart,
  Sparkles,
  ChevronDown,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Briefcase,
  UserCheck,
} from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "តើខ្ញុំអាចស្វែងរក និងហៅជាងជួសជុលតាមរយៈ ខ្មែរ សេវា យ៉ាងដូចម្តេច?",
      a: "លោកអ្នកគ្រាន់តែចុចលើ «បង្ហោះបញ្ហា» ឬជ្រើសរើសប្រភេទសេវាកម្មដែលអ្នកត្រូវការ រួចបំពេញព័ត៌មានអំពីបញ្ហា និងទីតាំង។ ជាងជំនាញនៅជិតអ្នកនឹងផ្ញើតម្លៃ និងដំណោះស្រាយមកអ្នកភ្លាមៗ។",
    },
    {
      q: "តើការចុះឈ្មោះជាអ្នកផ្តល់សេវា ឬជាងជំនាញមានតម្លៃសេវាដែរឬទេ?",
      a: "ការចុះឈ្មោះបង្កើតគណនីជាអ្នកផ្តល់សេវាគឺឥតគិតថ្លៃ។ អ្នកអាចចុះឈ្មោះ បង្ហាញជំនាញ និងទទួលការងារពីអតិថិជនបានយ៉ាងងាយស្រួល។",
    },
    {
      q: "តើគុណភាព និងសុវត្ថិភាពត្រូវបានធានាដូចម្តេច?",
      a: "អ្នកផ្តល់សេវាទាំងអស់ត្រូវបានត្រួតពិនិត្យ និងផ្ទៀងផ្ទាត់អត្តសញ្ញាណប័ណ្ណយ៉ាងម៉ត់ចត់។ អតិថិជនក៏អាចពិនិត្យមើលការវាយតម្លៃ និងមតិកែលម្អពីអតិថិជនមុនៗមុនពេលសម្រេចចិត្តជ្រើសរើស។",
    },
    {
      q: "តើខ្ញុំអាចទាក់ទងក្រុមការងារគាំទ្របានតាមណា?",
      a: "លោកអ្នកអាចទាក់ទងមកកាន់យើងខ្ញុំតាមរយៈលេខទូរស័ព្ទ +855 87 955 888 ឬផ្ញើអ៊ីមែលមកកាន់ support@serviceplatform.kh។",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Intro Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
          <Wrench className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {t("about")} - ខ្មែរ សេវា
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          វេទិកាឌីជីថលទីផ្សារសេវាកម្មឈានមុខគេនៅកម្ពុជា សម្រាប់ជួយសម្រួលការស្វែងរក និងផ្តល់សេវាកម្មក្នុងគេហដ្ឋានប្រកបដោយទំនុកចិត្ត។
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-2 shadow-xs text-center">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">ទំនុកចិត្ត & សុវត្ថិភាព</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            អ្នកផ្តល់សេវាទាំងអស់ត្រូវបានត្រួតពិនិត្យ និងផ្ទៀងផ្ទាត់អត្តសញ្ញាណប័ណ្ណយ៉ាងត្រឹមត្រូវ។
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-2 shadow-xs text-center">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">រហ័ស & ងាយស្រួល</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            គ្រាន់តែបង្ហោះបញ្ហារបស់អ្នក នោះអ្នកផ្តល់សេវានៅជិតអ្នកនឹងផ្ញើសំណើតម្លៃមកអ្នកភ្លាមៗ។
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-2 shadow-xs text-center">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">គាំទ្រជាងខ្មែរ</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            បង្កើនឱកាសការងារ និងចំណូលបន្ថែមសម្រាប់ជាង និងអ្នកផ្តល់សេវាអាជីពក្នុងស្រុក។
          </p>
        </div>
      </div>

      {/* How it works section */}
      <section id="how-it-works" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6 scroll-mt-24">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">របៀបប្រើប្រាស់ ខ្មែរ សេវា</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            ដំណោះស្រាយងាយៗ ៣ ជំហាន ដើម្បីទទួលបានសេវាកម្មជួសជុលរហ័ស និងមានទំនុកចិត្ត
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              ១
            </div>
            <h3 className="text-sm font-bold text-slate-800">បង្ហោះបញ្ហា</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              បញ្ជាក់ប្រភេទសេវា ពិពណ៌នាអំពីបញ្ហាជួសជុល និងទីតាំងរបស់អ្នក។
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              ២
            </div>
            <h3 className="text-sm font-bold text-slate-800">ជ្រើសរើសជាងជំនាញ</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ប្រៀបធៀបតម្លៃ ការវាយតម្លៃ និងបទពិសោធន៍របស់ជាងដែលបានផ្ញើសំណើ។
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              ៣
            </div>
            <h3 className="text-sm font-bold text-slate-800">ជួសជុល & ទូទាត់</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ជាងចុះមកជួសជុលដល់ទីកន្លែង រួចទូទាត់ប្រាក់ និងផ្តល់ការវាយតម្លៃ។
            </p>
          </div>
        </div>
      </section>

      {/* Provider Guide Section */}
      <section id="provider" className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/20">
              <Briefcase className="w-3.5 h-3.5" /> សម្រាប់ជាង និងអ្នកផ្តល់សេវា
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">របៀបក្លាយជាអ្នកផ្តល់សេវា</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              បង្កើនអតិថិជន និងចំណូលរបស់អ្នកដោយចូលរួមជាដៃគូជាមួយ ខ្មែរ សេវា ដោយមិនគិតថ្លៃសេវាប្រចាំខែ។
            </p>
          </div>
          <Link
            href="/register?role=PROVIDER"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shrink-0"
          >
            ចុះឈ្មោះជាអ្នកផ្តល់សេវា
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-slate-300">ចុះឈ្មោះគណនី និងផ្ទៀងផ្ទាត់អត្តសញ្ញាណប័ណ្ណ</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-slate-300">បង្កើតប្រវត្តិរូប និងជ្រើសរើសជំនាញសេវាកម្ម</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-slate-300">ទទួលការងារ និងទាក់ទងអតិថិជនភ្លាមៗ</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6 scroll-mt-24">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" /> សំណួរ-ចម្លើយ
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            សំណួរដែលសួរញឹកញាប់ (FAQ)
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-slate-50 transition"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800 pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6 scroll-mt-24">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">ទំនាក់ទំនងយើងខ្ញុំ</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            ក្រុមការងារ ខ្មែរ សេវា រីករាយក្នុងការជួយសម្រួល និងឆ្លើយតបរាល់ចម្ងល់របស់អ្នក
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-800 block">ទីតាំង</span>
              <span className="text-slate-500">រាជធានីភ្នំពេញ, ព្រះរាជាណាចក្រកម្ពុជា</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-800 block">អ៊ីមែល</span>
              <a href="mailto:support@serviceplatform.kh" className="text-blue-600 hover:underline block truncate">
                support@serviceplatform.kh
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-800 block">ទូរស័ព្ទ</span>
              <a href="tel:+85587955888" className="text-blue-600 hover:underline block">
                +855 87 955 888
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="bg-blue-600 rounded-3xl p-8 text-center text-white space-y-4 shadow-md shadow-blue-500/10">
        <h2 className="text-xl font-bold">ចាប់ផ្តើមប្រើប្រាស់ឥឡូវនេះ</h2>
        <p className="text-xs text-blue-100 max-w-md mx-auto">
          មិនថាអ្នកត្រូវការជួសជុលម៉ាស៊ីនត្រជាក់ ប្រព័ន្ធភ្លើង ឬ សេវាសំអាតទេ យើងត្រៀមជួយអ្នកជានិច្ច។
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/customer/requests/create"
            className="px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-xl transition shadow-xs"
          >
            {t("postProblem")}
          </Link>
          <Link
            href="/register?role=PROVIDER"
            className="px-5 py-2.5 bg-blue-700/60 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
          >
            ក្លាយជាអ្នកផ្តល់សេវា
          </Link>
        </div>
      </div>
    </div>
  );
}
