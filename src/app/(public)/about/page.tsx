import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Wrench,
  CheckCircle2,
  Users,
  Search,
  MessageSquare,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Code2,
  Database,
  Server,
  Lock,
  ExternalLink,
  Mail,
  Layers,
  HeartHandshake,
  Cpu,
  Globe,
} from "lucide-react";
import { generateSeoMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "អំពីខ្មែរ សេវា | វេទិកាស្វែងរកសេវាកម្មនៅកម្ពុជា",
  description:
    "ស្វែងយល់អំពីខ្មែរ សេវា ដែលជាវេទិកាជួយភ្ជាប់អ្នកប្រើប្រាស់ជាមួយជាង និងអ្នកផ្តល់សេវាកម្មនៅកម្ពុជា។",
  path: "/about",
});

const PRINCIPLES = [
  {
    title: "ងាយស្រួល",
    desc: "ធ្វើឱ្យការស្វែងរកសេវាកម្មកាន់តែងាយស្រួល និងចំណេញពេលវេលា។",
    icon: Search,
  },
  {
    title: "ភ្ជាប់មនុស្ស",
    desc: "ជួយភ្ជាប់អ្នកដែលត្រូវការសេវា ជាមួយអ្នកផ្តល់សេវានៅក្នុងតំបន់របស់ពួកគេ។",
    icon: HeartHandshake,
  },
  {
    title: "សម្រាប់កម្ពុជា",
    desc: "រចនាឡើងដោយគិតពីតម្រូវការ និងបទពិសោធន៍របស់អ្នកប្រើប្រាស់នៅកម្ពុជា។",
    icon: Globe,
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "បង្ហាញតម្រូវការ",
    desc: "អ្នកប្រើប្រាស់បង្ហាញពីបញ្ហា ឬសេវាកម្មដែលខ្លួនត្រូវការ។",
  },
  {
    step: "02",
    title: "ស្វែងរកអ្នកផ្តល់សេវា",
    desc: "ប្រព័ន្ធជួយស្វែងរកអ្នកផ្តល់សេវាដែលសមស្របតាមប្រភេទសេវា និងទីតាំង។",
  },
  {
    step: "03",
    title: "ទាក់ទង និងដោះស្រាយ",
    desc: "អ្នកប្រើប្រាស់អាចទាក់ទងជាមួយអ្នកផ្តល់សេវា និងសម្របសម្រួលការងារ។",
  },
];

const SERVICES_LIST = [
  {
    name: "ជួសជុលម៉ាស៊ីនត្រជាក់",
    href: "/services/ac-repair",
    desc: "លាងសម្អាត បញ្ចូលហ្គាស ជួសជុលម៉ាស៊ីនមិនត្រជាក់",
  },
  {
    name: "ជួសជុលកុំព្យូទ័រ",
    href: "/services/computer-repair",
    desc: "ដំឡើងប្រព័ន្ធ ជួសជុលផ្នែករឹង កម្ចាត់មេរោគ",
  },
  {
    name: "ជាងអគ្គិសនី",
    href: "/services/electrical",
    desc: "ជួសជុលឆ្លងភ្លើង រៀបចំខ្សែភ្លើង និងដំឡើងឧបករណ៍",
  },
  {
    name: "ជាងទឹក",
    href: "/services/plumbing",
    desc: "ជួសជុលទុយោទឹកលិច ស្ទះលូ ដំឡើងម៉ូទ័រទឹក",
  },
  {
    name: "សេវាសម្អាត",
    href: "/services/cleaning",
    desc: "សម្អាតគេហដ្ឋាន ការិយាល័យ និងបោកពូកសាឡុង",
  },
  {
    name: "ជួសជុលឧបករណ៍ប្រើប្រាស់",
    href: "/services/appliance-repair",
    desc: "ទូរទឹកកក ម៉ាស៊ីនបោកខោអាវ និងឧបករណ៍ប្រើប្រាស់",
  },
];

const DEVELOPER_SKILLS = [
  "Spring Boot",
  "Java",
  "Next.js",
  "React",
  "PostgreSQL",
  "Docker",
  "REST API",
  "JWT",
  "Git",
];

const TECH_STACK = [
  {
    category: "Frontend",
    tech: "Next.js / React / TypeScript",
    icon: Code2,
  },
  {
    category: "Backend",
    tech: "Spring Boot / Java",
    icon: Server,
  },
  {
    category: "Database",
    tech: "PostgreSQL",
    icon: Database,
  },
  {
    category: "Infrastructure",
    tech: "Docker / REST API",
    icon: Cpu,
  },
  {
    category: "Authentication",
    tech: "JWT / Spring Security",
    icon: Lock,
  },
];

const PLATFORM_FOCUS = [
  { text: "ស្វែងរកសេវាកម្ម", sub: "រហ័ស និងច្បាស់លាស់" },
  { text: "ស្វែងរកតាមទីតាំង", sub: "នៅជិតអ្នកបំផុត" },
  { text: "ភ្ជាប់អ្នកប្រើប្រាស់ និងអ្នកផ្តល់សេវា", sub: "ទំនាក់ទំនងដោយផ្ទាល់" },
  { text: "បទពិសោធន៍ប្រើប្រាស់ជាភាសាខ្មែរ", sub: "ងាយស្រួលយល់ និងប្រើប្រាស់" },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        
        {/* ========================================================
            2. HERO SECTION
            ======================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>អំពីខ្មែរ សេវា</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              ជួយឱ្យការស្វែងរកសេវាកម្មកាន់តែងាយស្រួល
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              ខ្មែរ សេវា គឺជាវេទិកាដែលជួយភ្ជាប់អ្នកដែលត្រូវការសេវាកម្ម ជាមួយអ្នកផ្តល់សេវា និងជាងដែលមានជំនាញនៅកម្ពុជា។
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                <span>ស្វែងរកសេវាកម្ម</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register?role=PROVIDER"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition"
              >
                <span>ក្លាយជាអ្នកផ្តល់សេវា</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. WHAT IS KHMER SERVICE? & FLOW DIAGRAM
            ======================================================== */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              ខ្មែរ សេវា គឺជាអ្វី?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              ខ្មែរ សេវា គឺជាវេទិកាសម្រាប់ស្វែងរក និងភ្ជាប់អ្នកប្រើប្រាស់ជាមួយអ្នកផ្តល់សេវាកម្មនៅកម្ពុជា។ អ្នកប្រើប្រាស់អាចស្វែងរកសេវាកម្មដែលត្រូវការ ប្រាប់ពីបញ្ហា និងស្វែងរកអ្នកផ្តល់សេវាដែលសមស្របតាមប្រភេទសេវា និងទីតាំង។
            </p>
          </div>

          {/* Simple Visual Flow Diagram */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
              ដំណើរការតភ្ជាប់សេវាកម្ម (Workflow)
            </h3>

            {/* Desktop Flow (Horizontal) */}
            <div className="hidden md:grid md:grid-cols-5 items-center gap-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1.5">
                <Users className="w-5 h-5 text-blue-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">អ្នកប្រើប្រាស់</p>
              </div>

              <div className="text-center text-slate-400">
                <ArrowRight className="w-5 h-5 mx-auto" />
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-center space-y-1.5">
                <Search className="w-5 h-5 text-blue-600 mx-auto" />
                <p className="text-xs font-bold text-blue-900 leading-tight">
                  បង្ហាញបញ្ហា / ស្វែងរកសេវា
                </p>
              </div>

              <div className="text-center text-slate-400">
                <ArrowRight className="w-5 h-5 mx-auto" />
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center space-y-1.5">
                <Wrench className="w-5 h-5 text-indigo-600 mx-auto" />
                <p className="text-xs font-bold text-indigo-900">អ្នកផ្តល់សេវា</p>
              </div>
            </div>

            {/* Mobile Flow (Vertical) */}
            <div className="md:hidden flex flex-col space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">អ្នកប្រើប្រាស់</span>
              </div>
              <div className="text-center text-slate-400 py-0.5">↓</div>
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center space-x-3">
                <Search className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold text-blue-900">បង្ហាញបញ្ហា / ស្វែងរកសេវា</span>
              </div>
              <div className="text-center text-slate-400 py-0.5">↓</div>
              <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs font-semibold">ខ្មែរ សេវា (ស្វែងរកអ្នកផ្តល់សេវា)</span>
              </div>
              <div className="text-center text-slate-400 py-0.5">↓</div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center space-x-3">
                <Wrench className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs font-semibold text-indigo-900">អ្នកផ្តល់សេវា / ជាងជំនាញ</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. OUR MISSION
            ======================================================== */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              គោលបំណងរបស់យើង
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              បង្កើតវិធីសាមញ្ញ និងងាយស្រួលសម្រាប់ប្រជាជនកម្ពុជាក្នុងការស្វែងរកជាង និងអ្នកផ្តល់សេវាកម្មដែលសមស្របនឹងតម្រូវការរបស់ពួកគេ។
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRINCIPLES.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            5. HOW IT WORKS
            ======================================================== */}
        <section id="how-it-works" className="space-y-6 scroll-mt-24">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              របៀបដែលខ្មែរ សេវា ដំណើរការ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              ដំណើរការងាយៗ ៣ ជំហាន ក្នុងការស្វែងរកដំណោះស្រាយសេវាកម្មគេហដ្ឋាន
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS_STEPS.map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3 relative"
              >
                <span className="text-xs font-bold text-blue-600 font-mono tracking-wider">
                  {s.step}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            6. SERVICES
            ======================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                សេវាកម្មដែលអាចស្វែងរកបាន
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                ប្រភេទសេវាកម្មពេញនិយម និងមានតម្រូវការខ្ពស់នៅក្នុងគេហដ្ឋាន
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline shrink-0"
            >
              <span>មើលសេវាកម្មទាំងអស់</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES_LIST.map((srv) => (
              <Link
                key={srv.href}
                href={srv.href}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition space-y-1.5 block group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">
                    {srv.name}
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{srv.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================
            7. WHY WE BUILT IT
            ======================================================== */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-4">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              ហេតុផលនៃការបង្កើត
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              ហេតុអ្វីបានជាបង្កើតខ្មែរ សេវា?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              នៅពេលមានបញ្ហានៅផ្ទះ ឬត្រូវការសេវាកម្មជួសជុល ការស្វែងរកជាងដែលសមស្របអាចចំណាយពេល និងមិនងាយស្រួល។ ខ្មែរ សេវា ត្រូវបានបង្កើតឡើងដើម្បីធ្វើឱ្យដំណើរការនេះកាន់តែសាមញ្ញ ដោយផ្តល់កន្លែងមួយសម្រាប់ស្វែងរក និងភ្ជាប់ជាមួយអ្នកផ្តល់សេវាកម្មនៅកម្ពុជា។
            </p>
          </div>
        </section>

        {/* ========================================================
            8 & 9. DEVELOPED BY SECTION (WITH DEVELOPER PHOTO)
            ======================================================== */}
        <section className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              អ្នកបង្កើត និងអភិវឌ្ឍ
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              បង្កើត និងអភិវឌ្ឍដោយ
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Developer Photo */}
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/bun-raksa.jpg"
                alt="ប៊ុន រក្សា (Bun Raksa) - Developer of Khmer Service"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-blue-600 text-[10px] text-white font-bold rounded-md shadow-xs">
                Dev
              </span>
            </div>

            {/* Developer Details */}
            <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  ប៊ុន រក្សា <span className="text-sm font-medium text-slate-500">(Bun Raksa)</span>
                </h3>
                <p className="text-xs font-semibold text-blue-600">
                  Backend / Full-Stack Developer
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                ខ្មែរ សេវា ត្រូវបានរចនា និងអភិវឌ្ឍដោយ ប៊ុន រក្សា ក្នុងគោលបំណងបង្កើតវេទិកាដែលជួយសម្រួលដល់ការស្វែងរក និងការភ្ជាប់អ្នកប្រើប្រាស់ជាមួយអ្នកផ្តល់សេវាកម្មនៅកម្ពុជា។
              </p>

              {/* Skills Badges */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  ជំនាញ និងបច្ចេកវិទ្យា (Skills)
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {DEVELOPER_SKILLS.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 bg-slate-100 border border-slate-200/80 rounded-md text-[11px] font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Profile Links */}
              <div className="pt-2 flex items-center justify-center sm:justify-start space-x-3 text-xs">
                <a
                  href="https://github.com/raksabun2006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <span className="text-slate-300">|</span>
                <a
                  href="mailto:support@serviceplatform.kh"
                  className="inline-flex items-center space-x-1.5 text-blue-600 hover:underline font-semibold"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>ទំនាក់ទំនង</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            10. DEVELOPER PROJECT INFORMATION (TECH STACK)
            ======================================================== */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              បច្ចេកវិទ្យាដែលប្រើប្រាស់ក្នុងគម្រោង
            </h2>
            <p className="text-xs text-slate-500">
              ស្ថាបត្យកម្មបច្ចេកវិទ្យាស្តង់ដារសម្រាប់ការដំណើរការប្រព័ន្ធ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TECH_STACK.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.category}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center space-x-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {t.category}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {t.tech}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            12. TRUST & PLATFORM SECTION
            ======================================================== */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            ការផ្តោតសំខាន់របស់ថ្នាល
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PLATFORM_FOCUS.map((item) => (
              <div
                key={item.text}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">{item.text}</h3>
                <p className="text-[11px] text-slate-500">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            11. DEVELOPER CTA
            ======================================================== */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white text-center space-y-3 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold">
            ចង់ស្វែងយល់បន្ថែមអំពីគម្រោងនេះ?
          </h2>
          <p className="text-xs text-blue-100 max-w-xl mx-auto leading-relaxed">
            ស្វែងយល់អំពីការអភិវឌ្ឍ និងបច្ចេកវិទ្យាដែលប្រើប្រាស់ក្នុងគម្រោងខ្មែរ សេវា។
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <a
              href="https://github.com/raksabun2006/servicemaketplacefront"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl transition inline-flex items-center space-x-1.5 shadow-xs"
            >
              <span>មើល GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:support@serviceplatform.kh"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition inline-flex items-center space-x-1.5"
            >
              <span>ទំនាក់ទំនង</span>
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
