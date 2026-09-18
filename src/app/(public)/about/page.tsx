"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Wrench, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
          <Wrench className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">{t("about")} - សេវាខ្មែរ</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          វេទិកាឌីជីថលទីផ្សារសេវាកម្មឈានមុខគេនៅកម្ពុជា សម្រាប់ជួយសម្រួលការស្វែងរក និងផ្តល់សេវាកម្មក្នុងគេហដ្ឋានប្រកបដោយទំនុកចិត្ត។
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs text-center">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">ទំនុកចិត្ត & សុវត្ថិភាព</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            អ្នកផ្តល់សេវាទាំងអស់ត្រូវបានត្រួតពិនិត្យ និងផ្ទៀងផ្ទាត់អត្តសញ្ញាណប័ណ្ណយ៉ាងត្រឹមត្រូវ។
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs text-center">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">រហ័ស & ងាយស្រួល</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            គ្រាន់តែបង្ហោះបញ្ហារបស់អ្នក នោះអ្នកផ្តល់សេវានៅជិតអ្នកនឹងផ្ញើសំណើតម្លៃមកអ្នកភ្លាមៗ។
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2 shadow-xs text-center">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">គាំទ្រជាងខ្មែរ</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            បង្កើនឱកាសការងារ និងចំណូលបន្ថែមសម្រាប់ជាង និងអ្នកផ្តល់សេវាអាជីពក្នុងស្រុក។
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-center text-white space-y-4">
        <h2 className="text-xl font-bold">ចាប់ផ្តើមប្រើប្រាស់ឥឡូវនេះ</h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          មិនថាអ្នកត្រូវការជួសជុលម៉ាស៊ីនត្រជាក់ ប្រព័ន្ធភ្លើង ឬ សេវាសំអាតទេ យើងត្រៀមជួយអ្នកជានិច្ច។
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/customer/requests/create"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
          >
            {t("postProblem")}
          </Link>
          <Link
            href="/register?role=PROVIDER"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition"
          >
            ក្លាយជាអ្នកផ្តល់សេវា
          </Link>
        </div>
      </div>
    </div>
  );
}
