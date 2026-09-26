import type { Metadata } from "next";
import { ServiceCategory } from "@/types/service-request";

export const siteConfig = {
  name: "Khmer Service",
  khmerName: "ខ្មែរ សេវា",
  tagline: "វេទិកាស្វែងរក និងផ្គូផ្គងជាងជំនាញនៅកម្ពុជា",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://servicemaketplacefront.vercel.app").replace(/\/+$/, ""),
  description:
    "ខ្មែរ សេវា (Khmer Service) — ថ្នាលសេវាកម្មឈានមុខគេនៅកម្ពុជា សម្រាប់ស្វែងរកជាង និងអ្នកផ្តល់សេវាកម្ម។ ជួសជុលម៉ាស៊ីនត្រជាក់ ជាងភ្លើង ជាងទឹក ជាងកុំព្យូទ័រ សេវាសម្អាត និងជាងជំនាញជាច្រើនទៀត។",
  englishDescription:
    "Khmer Service — Leading service marketplace in Cambodia. Connect with verified service providers for AC repair, electrical, plumbing, cleaning, computer repair, and more.",
  locale: "km_KH",
  alternateLocale: "en_US",
  defaultOgImage: "/logo.png",
  twitterHandle: "@khmerservice",
  contact: {
    email: "support@serviceplatform.kh",
    country: "Cambodia",
  },
  keywords: [
    // General Khmer Keywords
    "ខ្មែរ សេវា",
    "សេវាកម្ម",
    "សេវាកម្មជួសជុល",
    "ស្វែងរកជាង",
    "រកជាង",
    "ជាងជួសជុល",
    "ជាងនៅជិតខ្ញុំ",
    "សេវាជួសជុល",
    "អ្នកផ្តល់សេវាកម្ម",
    "ស្វែងរកអ្នកជំនាញ",
    "សេវាកម្មនៅកម្ពុជា",
    "ជាងនៅភ្នំពេញ",
    // Service Specific Keywords
    "ជាងជួសជុលម៉ាស៊ីនត្រជាក់",
    "ជួសជុលម៉ាស៊ីនត្រជាក់",
    "ជាងជួសជុលកុំព្យូទ័រ",
    "ជួសជុលកុំព្យូទ័រ",
    "ជាងអគ្គិសនី",
    "ជាងទឹក",
    "ជាងជួសជុលទូទឹកកក",
    "ជាងជួសជុលម៉ាស៊ីនបោកខោអាវ",
    "សេវាសម្អាតផ្ទះ",
    "ជាងជួសជុលឧបករណ៍អគ្គិសនី",
    "ជាងឈើ",
    "ជាងលាបថ្នាំ",
    // English Keywords
    "Khmer Service",
    "service provider Cambodia",
    "home services Cambodia",
    "repair service Cambodia",
    "handyman Cambodia",
    "AC repair Phnom Penh",
    "computer repair Phnom Penh",
    "electrician Phnom Penh",
    "plumber Phnom Penh",
    "local service providers Cambodia",
    // Mixed Khmer + English Keywords
    "ជាង AC ភ្នំពេញ",
    "AC repair Phnom Penh",
    "ជាង computer",
    "computer repair Cambodia",
    "ជាង plumbing",
    "electrician ភ្នំពេញ",
  ],
};

export interface ServiceCategorySeo {
  slug: string;
  category: ServiceCategory;
  khmerTitle: string;
  englishTitle: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  commonProblems: Array<{ issue: string; remedy: string }>;
  whenToCall: string;
  howToChoose: string;
  faqs: Array<{ q: string; a: string }>;
  keywords: string[];
}

export const SERVICE_CATEGORIES_SEO: Record<string, ServiceCategorySeo> = {
  "ac-repair": {
    slug: "ac-repair",
    category: "AC_REPAIR",
    khmerTitle: "ជាងជួសជុលម៉ាស៊ីនត្រជាក់",
    englishTitle: "AC Repair & Maintenance",
    metaTitle: "ជាងជួសជុលម៉ាស៊ីនត្រជាក់ | ខ្មែរ សេវា - Khmer Service",
    metaDescription:
      "ស្វែងរកជាងជួសជុលម៉ាស៊ីនត្រជាក់នៅកម្ពុជា។ សេវាលាងសម្អាត បញ្ចូលហ្គាស ជួសជុលម៉ាស៊ីនមិនត្រជាក់ ដោះដំឡើង និងថែទាំម៉ាស៊ីនត្រជាក់គ្រប់ប្រភេទដោយជាងជំនាញ។",
    h1: "ជាងជួសជុលម៉ាស៊ីនត្រជាក់",
    intro:
      "ស្វែងរកជាងជួសជុល និងលាងសម្អាតម៉ាស៊ីនត្រជាក់ដែលមានបទពិសោធន៍នៅជិតអ្នកបំផុត។ យើងខ្ញុំជួយផ្គូផ្គងអ្នកជាមួយជាងជំនាញដែលមានការផ្ទៀងផ្ទាត់ និងតម្លៃច្បាស់លាស់។",
    commonProblems: [
      {
        issue: "ម៉ាស៊ីនត្រជាក់ចេញតែខ្យល់ មិនចេញភាពត្រជាក់",
        remedy: "អាចបណ្តាលមកពីខ្វះហ្គាស ធ្លាយបំពង់ ឬកខ្វក់តម្រងខ្យល់ខ្លាំងដែលត្រូវការលាងសម្អាត និងបញ្ចូលហ្គាសឡើងវិញ។",
      },
      {
        issue: "ម៉ាស៊ីនត្រជាក់ហៀរទឹក ឬស្រក់ទឹកក្នុងបន្ទប់",
        remedy: "ទុយោបង្ហូរទឹកស្ទះ ឬធ្លាក់កម្រិតជម្រាល ត្រូវការការបាញ់សម្អាតបំពង់បង្ហូរទឹក និងតម្រង់កម្រិត។",
      },
      {
        issue: "ម៉ាស៊ីនត្រជាក់មានក្លិនមិនល្អ ឬមានសំឡេងរំខានខ្លាំង",
        remedy: "ដុះផ្សិតនៅក្នុងតម្រង ឬកង្ហារកូដត្រូវការការត្រួតពិនិត្យប្រព័ន្ធម៉ូទ័រ និងសម្អាតកម្ចាត់បាក់តេរី។",
      },
    ],
    whenToCall:
      "គួរហៅជាងជំនាញភ្លាមៗនៅពេលម៉ាស៊ីនត្រជាក់ស្រក់ទឹក មិនដំណើរការត្រជាក់ មានក្លិនឆ្អាប ឬនៅពេលដល់វដ្តថែទាំលាងសម្អាតរៀងរាល់ ៣ ទៅ ៦ ខែម្តង។",
    howToChoose:
      "ជ្រើសរើសជាងដែលមានការផ្ទៀងផ្ទាត់អត្តសញ្ញាណ (Verified) មានការវាយតម្លៃល្អពីអតិថិជនមុនៗ និងមានការធានាលើការជួសជុលច្បាស់លាស់។",
    faqs: [
      {
        q: "តើតម្លៃលាងសម្អាត និងបញ្ចូលហ្គាសម៉ាស៊ីនត្រជាក់ប្រហែលប៉ុន្មាន?",
        a: "តម្លៃជាទូទៅចាប់ពី ១០ ទៅ ៣០ ដុល្លារ អាស្រ័យលើកម្លាំងសេះ (HP) និងស្ថានភាពជាក់ស្តែងនៃម៉ាស៊ីន។ ជាងនឹងផ្តល់តម្លៃច្បាស់លាស់មុនពេលចាប់ផ្តើមការងារ។",
      },
      {
        q: "តើខ្ញុំអាចហៅជាងម៉ាស៊ីនត្រជាក់បន្ទាន់បានទេ?",
        a: "បាន! នៅពេលអ្នកបង្ហោះបញ្ហា សូមជ្រើសរើស «បន្ទាន់ (Urgent)» ជាងជំនាញនៅក្បែរទីតាំងរបស់អ្នកនឹងទាក់ទងមកក្នុងរយៈពេល ១០ ទៅ ១៥ នាទី។",
      },
      {
        q: "តើមានការធានាលើការជួសជុលដែរឬទេ?",
        a: "ជាងជំនាញនៅលើថ្នាលសេវាខ្មែរផ្តល់ការធានាលើគុណភាពការងារ។ ប្រសិនបើមានបញ្ហាមិនពេញចិត្ត ជាងនឹងមកត្រួតពិនិត្យជូនឡើងវិញ។",
      },
    ],
    keywords: [
      "ជាងជួសជុលម៉ាស៊ីនត្រជាក់",
      "ជួសជុលម៉ាស៊ីនត្រជាក់",
      "លាងម៉ាស៊ីនត្រជាក់",
      "បញ្ចូលហ្គាសម៉ាស៊ីនត្រជាក់",
      "ដំឡើងម៉ាស៊ីនត្រជាក់",
      "AC repair Phnom Penh",
      "ជាង AC ភ្នំពេញ",
      "air conditioner repair Cambodia",
    ],
  },
  plumbing: {
    slug: "plumbing",
    category: "PLUMBING",
    khmerTitle: "ជាងទឹក និងប្រព័ន្ធបំពង់ទុយោ",
    englishTitle: "Plumbing Services",
    metaTitle: "ជាងទឹក និងប្រព័ន្ធបំពង់ទុយោ | ខ្មែរ សេវា - Khmer Service",
    metaDescription:
      "ស្វែងរកជាងទឹក និងប្រព័ន្ធបំពង់ទុយោនៅកម្ពុជា។ ជួសជុលទុយោទឹកលិច កកស្ទះលូ ដំឡើងម៉ូទ័រទឹក និងបរិក្ខារបន្ទប់ទឹកដោយជាងជំនាញរហ័សទាន់ចិត្ត។",
    h1: "ជាងទឹក និងប្រព័ន្ធបំពង់ទុយោ",
    intro:
      "ដោះស្រាយបញ្ហាទឹកលិច ស្ទះលូ ឬតបណ្តាញទឹកថ្មីយ៉ាងមានប្រសិទ្ធភាព។ ស្វែងរកជាងទឹកជំនាញដែលមានឧបករណ៍ទំនើប និងបទពិសោធន៍ខ្ពស់។",
    commonProblems: [
      {
        issue: "ទឹកហូរខ្សោយ ឬម៉ូទ័រដើរមិនឈប់",
        remedy: "អាចមានការលេចធ្លាយទុយោក្រោមដី ឬសន្ទះទឹកខូចដែលត្រូវការជាងពិនិត្យសម្ពាធទឹក។",
      },
      {
        issue: "ស្ទះបង្គន់ ឬស្ទះលូបង្ហូរទឹកបន្ទប់ទឹក",
        remedy: "ត្រូវការឧបករណ៍រាវស្ទះទំនើប ឬម៉ាស៊ីនខ្យល់សម្អាតលូដោយមិនបាច់គាស់ក្បឿង។",
      },
    ],
    whenToCall:
      "គួរហៅជាងទឹកភ្លាមៗនៅពេលមានទឹកលិចជញ្ជាំង វិក្កយបត្រទឹកឡើងខុសប្រក្រតី ឬស្ទះលូដែលមិនអាចដោះស្រាយដោយខ្លួនឯងបាន។",
    howToChoose:
      "ជ្រើសរើសជាងដែលមានឧបករណ៍ត្រួតពិនិត្យត្រឹមត្រូវ ផ្តល់ការប៉ាន់ស្មានតម្លៃមុនពេលធ្វើ និងមានបទពិសោធន៍ដោះស្រាយបញ្ហាប្រព័ន្ធទឹក។",
    faqs: [
      {
        q: "តើជាងទឹកអាចមកពិនិត្យដល់ផ្ទះបានលឿនប៉ុណ្ណា?",
        a: "ជាមធ្យម ជាងទឹកដែលនៅជិតអ្នកអាចមកដល់ទីតាំងក្នុងរយៈពេល ៣០ នាទី ទៅ ១ ម៉ោង ក្រោយពេលយល់ព្រមលើការផ្តល់តម្លៃ។",
      },
      {
        q: "តើការកកស្ទះលូគិតតម្លៃយ៉ាងដូចម្តេច?",
        a: "តម្លៃអាស្រ័យលើកម្រិតស្ទះ និងឧបករណ៍ដែលត្រូវប្រើប្រាស់។ ជាងនឹងពិនិត្យនិងជូនដំណឹងតម្លៃច្បាស់លាស់ជាមុន។",
      },
    ],
    keywords: [
      "ជាងទឹក",
      "ជាងបំពង់ទឹក",
      "ជួសជុលទុយោទឹក",
      "ស្ទះលូ",
      "ដំឡើងម៉ូទ័រទឹក",
      "plumber Phnom Penh",
      "plumbing Cambodia",
      "ជាង plumbing",
    ],
  },
  electrical: {
    slug: "electrical",
    category: "ELECTRICAL",
    khmerTitle: "ជាងអគ្គិសនី និងប្រព័ន្ធភ្លើង",
    englishTitle: "Electrical Services",
    metaTitle: "ជាងអគ្គិសនី និងប្រព័ន្ធភ្លើង | ខ្មែរ សេវា - Khmer Service",
    metaDescription:
      "ស្វែងរកជាងអគ្គិសនីដែលមានការបណ្តុះបណ្តាលត្រឹមត្រូវនៅកម្ពុជា។ ជួសជុលឆ្លងភ្លើង ដាច់ឌីសង់ទ័រ រៀបចំបណ្តាញខ្សែភ្លើង និងដំឡើងបរិក្ខារអគ្គិសនីប្រកបដោយសុវត្ថិភាព។",
    h1: "ជាងអគ្គិសនី និងប្រព័ន្ធភ្លើង",
    intro:
      "សុវត្ថិភាពអគ្គិសនីជាចម្បង! ស្វែងរកជាងអគ្គិសនីដែលមានការបណ្តុះបណ្តាល និងជំនាញច្បាស់លាស់ ដើម្បីដោះស្រាយបញ្ហាឆ្លងភ្លើង និងដំឡើងប្រព័ន្ធភ្លើងស្តង់ដារ។",
    commonProblems: [
      {
        issue: "ឌីសង់ទ័រលោតដាច់ភ្លាមៗ ឬឆ្លងភ្លើង",
        remedy: "មានឧបករណ៍ប្រើប្រាស់អគ្គិសនីលើសទម្ងន់ ឬខ្សែភ្លើងរលាត់ប៉ះគ្នា ដែលត្រូវការជាងពិនិត្យភ្លាមៗដើម្បីបញ្ចៀសគ្រោះអគ្គិភ័យ។",
      },
      {
        issue: "ព្រីភ្លើងក្តៅ ឬមានស្នាមឆេះ",
        remedy: "រលុងក្បាលតភ្ជាប់ ឬផ្ទុកចរន្តលើសចំណុះ ត្រូវប្តូរព្រីថ្មី និងពិនិត្យទំហំខ្សែភ្លើង។",
      },
    ],
    whenToCall:
      "ហៅជាងអគ្គិសនីជាបន្ទាន់នៅពេលមានក្លិនឆេះខ្សែភ្លើង ឌីសង់ទ័រលោតញឹកញាប់ ឬមានចរន្តឆក់នៅពេលប៉ះពាល់ឧបករណ៍ប្រើប្រាស់។",
    howToChoose:
      "កុំប្រថុយជួសជុលប្រព័ន្ធភ្លើងដោយគ្មានជំនាញ! ជ្រើសរើសជាងដែលមានវិញ្ញាបនបត្រ ឬបទពិសោធន៍ច្បាស់លាស់នៅលើថ្នាលសេវាខ្មែរ។",
    faqs: [
      {
        q: "តើជាងអគ្គិសនីអាចដោះស្រាយបញ្ហាឆ្លងភ្លើងពេលយប់បានទេ?",
        a: "ជាងជាច្រើននៅលើប្រព័ន្ធផ្តល់សេវាបន្ទាន់ ២៤ ម៉ោង។ លោកអ្នកអាចជ្រើសរើសជម្រើសបន្ទាន់ពេលបង្ហោះសំណើ។",
      },
    ],
    keywords: [
      "ជាងអគ្គិសនី",
      "ជាងភ្លើង",
      "ជួសជុលឆ្លងភ្លើង",
      "ដំឡើងអំពូល",
      "រៀបចំប្រព័ន្ធភ្លើង",
      "electrician Phnom Penh",
      "electrician ភ្នំពេញ",
      "electrical repair Cambodia",
    ],
  },
  "appliance-repair": {
    slug: "appliance-repair",
    category: "APPLIANCE_REPAIR",
    khmerTitle: "ជាងជួសជុលឧបករណ៍អគ្គិសនី & កុំព្យូទ័រ",
    englishTitle: "Appliance & Computer Repair",
    metaTitle: "ជាងជួសជុលឧបករណ៍អគ្គិសនី & កុំព្យូទ័រ | ខ្មែរ សេវា - Khmer Service",
    metaDescription:
      "ស្វែងរកជាងជួសជុលឧបករណ៍អគ្គិសនី កុំព្យូទ័រ ទូរទឹកកក ម៉ាស៊ីនបោកខោអាវ ទូរទស្សន៍ និងឧបករណ៍ប្រើប្រាស់ក្នុងផ្ទះនៅកម្ពុជា។",
    h1: "ជាងជួសជុលឧបករណ៍អគ្គិសនី & កុំព្យូទ័រ",
    intro:
      "ជួសជុលកុំព្យូទ័រ ទូរទឹកកក ម៉ាស៊ីនបោកខោអាវ និងបរិក្ខារប្រើប្រាស់ក្នុងគេហដ្ឋានរបស់អ្នកដោយអ្នកបច្ចេកទេសជំនាញ។",
    commonProblems: [
      {
        issue: "កុំព្យូទ័រដើរយឺត ខូចប្រព័ន្ធ ឬបើកមិនចេញ",
        remedy: "ជួសជុលផ្នែករឹង (Hardware), ដំឡើងប្រព័ន្ធប្រតិបត្តិការ និងសម្អាតកម្ចាត់មេរោគ។",
      },
      {
        issue: "ទូរទឹកកកមិនត្រជាក់ ឬកកកកកុញទឹកកកខុសធម្មតា",
        remedy: "ត្រួតពិនិត្យម៉ូទ័រសប់ហ្គាស និងប្រព័ន្ធកម្តៅស្វ័យប្រវត្តិ។",
      },
    ],
    whenToCall:
      "នៅពេលឧបករណ៍ប្រើប្រាស់ខូចដំណើរការ មិនដំណើរការត្រឹមត្រូវ ឬមានសំឡេងរោទិ៍ខុសប្រក្រតី។",
    howToChoose:
      "ជ្រើសរើសជាងដែលមានគ្រឿងបន្លាស់ដើម និងផ្តល់ការធានាលើគ្រឿងបន្លាស់ដែលបានផ្លាស់ប្តូរ។",
    faqs: [
      {
        q: "តើជាងអាចមកជួសជុលដល់គេហដ្ឋានបានទេ?",
        a: "បាន! សម្រាប់ឧបករណ៍ធំៗដូចជា ទូរទឹកកក ម៉ាស៊ីនបោក ឬកុំព្យូទ័រ Desktop ជាងអាចមកត្រួតពិនិត្យ និងជួសជុលផ្ទាល់ដល់ទីកន្លែង។",
      },
    ],
    keywords: [
      "ជាងជួសជុលកុំព្យូទ័រ",
      "ជួសជុលកុំព្យូទ័រ",
      "ជាង computer",
      "ជាងជួសជុលទូរទឹកកក",
      "ជាងម៉ាស៊ីនបោកខោអាវ",
      "computer repair Phnom Penh",
      "computer repair Cambodia",
      "appliance repair Cambodia",
    ],
  },
  "computer-repair": {
    slug: "computer-repair",
    category: "APPLIANCE_REPAIR",
    khmerTitle: "ជាងជួសជុលកុំព្យូទ័រ និងបច្ចេកវិទ្យា",
    englishTitle: "Computer & IT Repair",
    metaTitle: "ជាងជួសជុលកុំព្យូទ័រ និងបច្ចេកវិទ្យា | ខ្មែរ សេវា - Khmer Service",
    metaDescription:
      "ស្វែងរកជាងជួសជុលកុំព្យូទ័រ Laptop Desktop និងប្រព័ន្ធបច្ចេកវិទ្យានៅកម្ពុជា។ ដំឡើង Windows ជួសជុល Hardware កម្ចាត់មេរោគ និងថែទាំកុំព្យូទ័រដោយជាងជំនាញ។",
    h1: "ជាងជួសជុលកុំព្យូទ័រ និងបច្ចេកវិទ្យា",
    intro:
      "ដោះស្រាយបញ្ហាកុំព្យូទ័រដើរយឺត ខូចប្រព័ន្ធ ឬត្រូវការជួសជុលផ្នែករឹងដោយជាងកុំព្យូទ័រជំនាញ និងមានទំនុកចិត្តខ្ពស់។",
    commonProblems: [
      {
        issue: "កុំព្យូទ័រដើរយឺត ឬគាំងប្រព័ន្ធញឹកញាប់",
        remedy: "សម្អាតមេរោគ បង្កើន RAM ឬប្តូរប្រើ SSD ដើម្បីបង្កើនល្បឿនដំណើរការ។",
      },
      {
        issue: "បើកមិនចេញ ឬអេក្រង់ខៀវ (Blue Screen)",
        remedy: "ត្រួតពិនិត្យប្រព័ន្ធភ្លើង Mainboard ឬដំឡើងប្រព័ន្ធប្រតិបត្តិការឡើងវិញ។",
      },
    ],
    whenToCall: "នៅពេលកុំព្យូទ័រមិនដំណើរការ ឆ្លងមេរោគ ឬត្រូវការដំឡើងកម្មវិធី និងគ្រឿងបន្លាស់ថ្មី។",
    howToChoose: "ជ្រើសរើសជាងដែលមានបទពិសោធន៍ច្បាស់លាស់ ផ្តល់ការធានា និងតម្លៃសមរម្យ។",
    faqs: [
      {
        q: "តើជាងអាចមកជួសជុលដល់គេហដ្ឋាន ឬការិយាល័យបានទេ?",
        a: "បាន! ជាងកុំព្យូទ័រជាច្រើនអាចចុះមកពិនិត្យ និងជួសជុលផ្ទាល់ដល់ទីកន្លែងរបស់លោកអ្នក។",
      },
    ],
    keywords: [
      "ជាងជួសជុលកុំព្យូទ័រ",
      "ជួសជុលកុំព្យូទ័រ",
      "ជាង computer",
      "កុំព្យូទ័រ",
      "computer repair Phnom Penh",
      "computer repair Cambodia",
    ],
  },
  cleaning: {
    slug: "cleaning",
    category: "CLEANING",
    khmerTitle: "សេវាសម្អាតគេហដ្ឋាន និងការិយាល័យ",
    englishTitle: "Cleaning Services",
    metaTitle: "សេវាសម្អាតគេហដ្ឋាន និងការិយាល័យ | ខ្មែរ សេវា - Khmer Service",
    metaDescription:
      "ស្វែងរកសេវាសម្អាតផ្ទះ ខុនដូ និងការិយាល័យនៅកម្ពុជា។ សម្អាតទូទៅ សម្អាតស៊ីជម្រៅ (Deep Cleaning) និងបោកសម្អាតពូក សាឡុង ដោយក្រុមការងារជំនាញ។",
    h1: "សេវាសម្អាតគេហដ្ឋាន និងការិយាល័យ",
    intro:
      "គេហដ្ឋានស្អាត បរិយាកាសស្រស់បំព្រង! ជ្រើសរើសសេវាសម្អាតតាមម៉ោង ឬសម្អាតប្រចាំខែពីអ្នកផ្តល់សេវាដែលមានការត្រួតពិនិត្យប្រវត្តិរូបត្រឹមត្រូវ។",
    commonProblems: [
      {
        issue: "ផ្ទះទើបសាងសង់រួចមានកម្ទេចធូលី និងស្នាមថ្នាំច្រើន",
        remedy: "សេវាសម្អាតក្រោយការសាងសង់ (Post-construction cleaning) ដោយប្រើម៉ាស៊ីនបូមធូលីឧស្សាហកម្ម និងសូលុយស្យុងជំនាញ។",
      },
    ],
    whenToCall:
      "នៅពេលត្រូវការសម្អាតផ្ទះមុនចូលនៅ សម្អាតសាឡុង ពូក ឬត្រូវការជំនួយការសម្អាតប្រចាំសប្តាហ៍។",
    howToChoose:
      "ជ្រើសរើសអ្នកផ្តល់សេវាដែលមានការផ្ទៀងផ្ទាត់ និងទទួលបានការសរសើរពីអតិថិជនលើភាពស្មោះត្រង់ និងភាពស្អាតបាត។",
    faqs: [
      {
        q: "តើអ្នកសម្អាតមានភ្ជាប់សម្ភារៈសម្អាតមកជាមួយទេ?",
        a: "លោកអ្នកអាចបញ្ជាក់នៅក្នុងសំណើបាន ថាតើត្រូវការឲ្យអ្នកផ្តល់សេវាត្រៀមឧបករណ៍ និងទឹកថ្នាំមកជាមួយ ឬប្រើប្រាស់សម្ភារៈនៅផ្ទះរបស់លោកអ្នក។",
      },
    ],
    keywords: [
      "សេវាសម្អាតផ្ទះ",
      "សម្អាតការិយាល័យ",
      "បោកពូកសាឡុង",
      "cleaning service Cambodia",
      "cleaning service Phnom Penh",
      "house cleaning Phnom Penh",
    ],
  },
  carpentry: {
    slug: "carpentry",
    category: "CARPENTRY",
    khmerTitle: "ជាងឈើ និងគ្រឿងសង្ហារឹម",
    englishTitle: "Carpentry Services",
    metaTitle: "ជាងឈើ និងគ្រឿងសង្ហារឹម | ខ្មែរ សេវា - Khmer Service",
    metaDescription:
      "ស្វែងរកជាងឈើជំនាញនៅកម្ពុជា។ ដំឡើង ជួសជុលទ្វារ បង្អួច តុ ទូ និងគ្រឿងសង្ហារឹមគ្រប់ប្រភេទ។",
    h1: "ជាងឈើ និងគ្រឿងសង្ហារឹម",
    intro:
      "ជួសជុល និងដំឡើងគ្រឿងសង្ហារឹមឈើ ទ្វារ បង្អួច និងសោរដោយជាងឈើដែលមានថ្វីដៃច្បាស់លាស់។",
    commonProblems: [
      {
        issue: "ទ្វារកៀប បិទមិនជិត ឬសោរគាំង",
        remedy: "កែសម្រួលគន្លឹះទ្វារ ប្តូរត្រចៀកទ្វារ ឬដំឡើងសោរថ្មី។",
      },
    ],
    whenToCall: "នៅពេលត្រូវការដំឡើងគ្រឿងសង្ហារឹមថ្មី ឬជួសជុលទ្វារបង្អួចដែលខូច។",
    howToChoose: "ជ្រើសរើសជាងដែលមានរូបភាពស្នាដៃការងារជាក់ស្តែង និងបទពិសោធន៍យូរឆ្នាំ។",
    faqs: [
      {
        q: "តើជាងឈើគិតតម្លៃតាមម៉ោង ឬតាមការងារ?",
        a: "ជាទូទៅគិតតាមទំហំការងារជាក់ស្តែង។ ជាងនឹងវាយតម្លៃការងារមុនពេលកំណត់តម្លៃ។",
      },
    ],
    keywords: ["ជាងឈើ", "ជួសជុលទ្វារ", "ដំឡើងទូ", "carpenter Phnom Penh", "carpentry Cambodia"],
  },
  painting: {
    slug: "painting",
    category: "PAINTING",
    khmerTitle: "ជាងលាបថ្នាំផ្ទះ និងអគារ",
    englishTitle: "Painting Services",
    metaTitle: "ជាងលាបថ្នាំផ្ទះ និងអគារ | ខ្មែរ សេវា - Khmer Service",
    metaDescription:
      "ស្វែងរកជាងលាបថ្នាំផ្ទះ ជួសជុលស្នាមប្រេះ និងលាបថ្នាំការពារជម្រាបទឹកនៅកម្ពុជា។",
    h1: "ជាងលាបថ្នាំផ្ទះ និងអគារ",
    intro:
      "លាបថ្នាំគេហដ្ឋានថ្មី ឬកែកុនផ្ទះចាស់ឲ្យស្រស់ស្អាតដូចដើម ដោយជាងលាបថ្នាំមានបទពិសោធន៍។",
    commonProblems: [
      {
        issue: "ជញ្ជាំងជ្រាបទឹក របកថ្នាំ ឬឡើងផ្សិត",
        remedy: "កោសថ្នាំចាស់ចេញ លាបថ្នាំការពារជ្រាបទឹក និងលាបថ្នាំពណ៌ស្តង់ដារគុណភាពខ្ពស់។",
      },
    ],
    whenToCall: "នៅពេលជញ្ជាំងផ្ទះមានស្នាមរបក ជ្រាបទឹក ឬត្រូវការផ្លាស់ប្តូរពណ៌ផ្ទះថ្មី។",
    howToChoose: "ជ្រើសរើសជាងដែលណែនាំប្រភេទថ្នាំត្រឹមត្រូវតាមអាកាសធាតុប្រទេសកម្ពុជា។",
    faqs: [
      {
        q: "តើជាងអាចជួយគណនាបរិមាណថ្នាំដែលត្រូវទិញបានទេ?",
        a: "បាន! ជាងនឹងចុះវាស់វែងផ្ទៃក្រឡា និងគណនាចំនួនធុងថ្នាំឲ្យបានត្រឹមត្រូវ។",
      },
    ],
    keywords: ["ជាងលាបថ្នាំ", "លាបផ្ទះ", "painter Phnom Penh", "painting service Cambodia"],
  },
  "pest-control": {
    slug: "pest-control",
    category: "PEST_CONTROL",
    khmerTitle: "សេវាកម្ចាត់សត្វល្អិត និងកណ្តៀរ",
    englishTitle: "Pest Control Services",
    metaTitle: "សេវាកម្ចាត់សត្វល្អិត និងកណ្តៀរ | ខ្មែរ សេវា - Khmer Service",
    metaDescription:
      "សេវាកម្ចាត់កណ្តៀរ កន្លាត កណ្តុរ និងសត្វល្អិតចង្រៃគ្រប់ប្រភេទប្រកបដោយសុវត្ថិភាព និងប្រសិទ្ធភាពខ្ពស់នៅកម្ពុជា។",
    h1: "សេវាកម្ចាត់សត្វល្អិត និងកណ្តៀរ",
    intro:
      "ការពារគេហដ្ឋាន និងទ្រព្យសម្បត្តិរបស់អ្នកពីការបំផ្លាញដោយកណ្តៀរ និងសត្វល្អិតចង្រៃដោយប្រើប្រាស់ថ្នាំដែលមានសុវត្ថិភាពសម្រាប់មនុស្ស និងសត្វចិញ្ចឹម។",
    commonProblems: [
      {
        issue: "កណ្តៀរស៊ីគ្រឿងសង្ហារឹមឈើ ឬទ្វារ",
        remedy: "បាញ់ថ្នាំកម្ចាត់កណ្តៀរដល់សំបុក និងដាក់នុយជីវសាស្ត្រដើម្បីការពារយូរអង្វែង។",
      },
    ],
    whenToCall: "ភ្លាមៗនៅពេលប្រទះឃើញដានកណ្តៀរ ឬសត្វល្អិតរំខាននៅក្នុងផ្ទះ។",
    howToChoose: "ជ្រើសរើសក្រុមហ៊ុន ឬអ្នកជំនាញដែលមានការធានារយៈពេល ៦ ខែ ទៅ ១ ឆ្នាំ។",
    faqs: [
      {
        q: "តើថ្នាំបាញ់មានគ្រោះថ្នាក់ដល់កុមារ ឬសត្វចិញ្ចឹមទេ?",
        a: "អ្នកជំនាញប្រើប្រាស់ថ្នាំស្តង់ដារដែលមានការអនុញ្ញាត និងផ្តល់ការណែនាំសុវត្ថិភាពយ៉ាងម៉ត់ចត់។",
      },
    ],
    keywords: ["សេវាកម្ចាត់កណ្តៀរ", "កម្ចាត់សត្វល្អិត", "pest control Cambodia", "pest control Phnom Penh"],
  },
  tutoring: {
    slug: "tutoring",
    category: "TUTORING",
    khmerTitle: "សេវាគ្រូបង្រៀនតាមផ្ទះ",
    englishTitle: "Tutoring Services",
    metaTitle: "សេវាគ្រូបង្រៀនតាមផ្ទះ | ខ្មែរ សេវា - Khmer Service",
    metaDescription:
      "ស្វែងរកគ្រូបង្រៀនតាមផ្ទះគ្រប់កម្រិតថ្នាក់ និងភាសាបរទេសនៅកម្ពុជា។ គណិត រូប គីមី ភាសាអង់គ្លេស និងចិន។",
    h1: "សេវាគ្រូបង្រៀនតាមផ្ទះ",
    intro: "ពង្រឹងការសិក្សារបស់កូនៗលោកអ្នកជាមួយគ្រូបង្រៀនដែលមានគរុកោសល្យ និងជំនាញច្បាស់លាស់។",
    commonProblems: [],
    whenToCall: "នៅពេលសិស្សត្រូវការជំនួយបន្ថែមលើមុខវិជ្ជាជាក់លាក់ ឬត្រៀមប្រឡង។",
    howToChoose: "ជ្រើសរើសគ្រូដែលមានប្រវត្តិរូប និងបទពិសោធន៍បង្រៀនស្របតាមតម្រូវការ។",
    faqs: [
      {
        q: "តើអាចរៀនសាកល្បងបានទេ?",
        a: "លោកអ្នកអាចពិភាក្សាជាមួយគ្រូអំពីការសាកល្បងម៉ោងដំបូងបាន។",
      },
    ],
    keywords: ["គ្រូបង្រៀនតាមផ្ទះ", "home tutor Phnom Penh", "tutoring Cambodia"],
  },
  beauty: {
    slug: "beauty",
    category: "BEAUTY",
    khmerTitle: "សេវាសម្ផស្ស និងថែទាំសម្រស់តាមផ្ទះ",
    englishTitle: "Beauty & Wellness Services",
    metaTitle: "សេវាសម្ផស្ស និងថែទាំសម្រស់តាមផ្ទះ | ខ្មែរ សេវា - Khmer Service",
    metaDescription:
      "សេវាកាត់សក់ តុបតែងមុខ ធ្វើក្រចក និងម៉ាស្សាដល់គេហដ្ឋានដោយជាងជំនាញនៅកម្ពុជា។",
    h1: "សេវាសម្ផស្ស និងថែទាំសម្រស់តាមផ្ទះ",
    intro: "សម្រាក និងថែទាំសម្រស់នៅគេហដ្ឋានរបស់អ្នកដោយមិនបាច់ធ្វើដំណើរតាមដងផ្លូវ។",
    commonProblems: [],
    whenToCall: "សម្រាប់កម្មវិធីពិសេស មង្គលការ ឬការថែទាំសម្រស់ប្រចាំសប្តាហ៍។",
    howToChoose: "ពិនិត្យមើលរូបភាពស្នាដៃមុនៗ និងការវាយតម្លៃពីអតិថិជន។",
    faqs: [
      {
        q: "តើជាងមានយកឧបករណ៍មកគ្រប់គ្រាន់ទេ?",
        a: "អ្នកជំនាញនឹងរៀបចំឧបករណ៍អនាម័យ និងផលិតផលពេញលេញមកដល់ផ្ទះរបស់អ្នក។",
      },
    ],
    keywords: ["សេវាសម្ផស្ស", "ផាត់មុខតាមផ្ទះ", "beauty service Cambodia", "makeup home service"],
  },
  other: {
    slug: "other",
    category: "OTHER",
    khmerTitle: "សេវាកម្មទូទៅផ្សេងៗ",
    englishTitle: "Other Local Services",
    metaTitle: "សេវាកម្មទូទៅផ្សេងៗ | ខ្មែរ សេវា - Khmer Service",
    metaDescription: "ស្វែងរកអ្នកជំនាញ និងសេវាកម្មផ្សេងៗជាច្រើនទៀតនៅទូទាំងប្រទេសកម្ពុជា។",
    h1: "សេវាកម្មទូទៅផ្សេងៗ",
    intro: "ស្វែងរកដំណោះស្រាយសម្រាប់គ្រប់តម្រូវការសេវាកម្មគេហដ្ឋាន និងអាជីវកម្មរបស់អ្នក។",
    commonProblems: [],
    whenToCall: "នៅពេលអ្នកមានបញ្ហាដែលត្រូវការជំនួយពីអ្នកបច្ចេកទេសជំនាញ។",
    howToChoose: "បង្ហោះបញ្ហារបស់អ្នក និងរង់ចាំការផ្តល់តម្លៃប្រកួតប្រជែងពីជាងជាច្រើន។",
    faqs: [],
    keywords: ["សេវាកម្មទូទៅ", "handyman Cambodia", "local services Cambodia"],
  },
};

export interface LocationSeo {
  slug: string;
  nameKm: string;
  nameEn: string;
  type: "city" | "province" | "district";
  parentCity?: string;
  districts?: Array<{ slug: string; nameKm: string; nameEn: string }>;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
}

export const LOCATIONS_SEO: Record<string, LocationSeo> = {
  "phnom-penh": {
    slug: "phnom-penh",
    nameKm: "រាជធានីភ្នំពេញ",
    nameEn: "Phnom Penh",
    type: "city",
    districts: [
      { slug: "meanchey", nameKm: "ខណ្ឌមានជ័យ", nameEn: "Meanchey" },
      { slug: "chamkarmon", nameKm: "ខណ្ឌចំការមន", nameEn: "Chamkarmon" },
      { slug: "daun-penh", nameKm: "ខណ្ឌដូនពេញ", nameEn: "Daun Penh" },
      { slug: "toul-kork", nameKm: "ខណ្ឌទួលគោក", nameEn: "Toul Kork" },
      { slug: "sen-sok", nameKm: "ខណ្ឌសែនសុខ", nameEn: "Sen Sok" },
      { slug: "boeung-keng-kang", nameKm: "ខណ្ឌបឹងកេងកង", nameEn: "Boeung Keng Kang" },
      { slug: "por-senchey", nameKm: "ខណ្ឌពោធិ៍សែនជ័យ", nameEn: "Por Senchey" },
      { slug: "russey-keo", nameKm: "ខណ្ឌឫស្សីកែវ", nameEn: "Russey Keo" },
      { slug: "chbar-ampov", nameKm: "ខណ្ឌច្បារអំពៅ", nameEn: "Chbar Ampov" },
      { slug: "chroy-changvar", nameKm: "ខណ្ឌជ្រោយចង្វារ", nameEn: "Chroy Changvar" },
      { slug: "dangkao", nameKm: "ខណ្ឌដង្កោ", nameEn: "Dangkao" },
    ],
    metaTitle: "ស្វែងរកជាង និងសេវាកម្មនៅរាជធានីភ្នំពេញ | ខ្មែរ សេវា",
    metaDescription:
      "ស្វែងរកជាងជំនាញ និងសេវាកម្មជួសជុលនៅរាជធានីភ្នំពេញ។ ជាងម៉ាស៊ីនត្រជាក់ ជាងភ្លើង ជាងទឹក និងជាងកុំព្យូទ័រនៅគ្រប់ខណ្ឌក្នុងរាជធានីភ្នំពេញ។",
    h1: "សេវាកម្ម និងជាងជំនាញនៅរាជធានីភ្នំពេញ",
    intro:
      "ស្វែងរកជាងជំនាញនៅក្បែរអ្នកក្នុងរាជធានីភ្នំពេញ។ គ្របដណ្តប់គ្រប់ខណ្ឌដូចជា មានជ័យ ទួលគោក ចំការមន សែនសុខ ដូនពេញ និងខណ្ឌដទៃទៀត។",
    keywords: [
      "ជាងនៅភ្នំពេញ",
      "សេវាកម្មភ្នំពេញ",
      "ជាងជួសជុលភ្នំពេញ",
      "service provider Phnom Penh",
      "repair service Phnom Penh",
      "handyman Phnom Penh",
    ],
  },
  "siem-reap": {
    slug: "siem-reap",
    nameKm: "ខេត្តសៀមរាប",
    nameEn: "Siem Reap",
    type: "province",
    metaTitle: "ស្វែងរកជាង និងសេវាកម្មនៅខេត្តសៀមរាប | ខ្មែរ សេវា",
    metaDescription:
      "ស្វែងរកអ្នកផ្តល់សេវាកម្ម និងជាងជួសជុលនៅក្រុងសៀមរាប។ ជាងម៉ាស៊ីនត្រជាក់ ជាងភ្លើង ជាងទឹក និងសេវាសម្អាត។",
    h1: "សេវាកម្ម និងជាងជំនាញនៅខេត្តសៀមរាប",
    intro: "ស្វែងរកអ្នកផ្តល់សេវាកម្ម និងជាងជួសជុលដែលអាចទុកចិត្តបាននៅក្រុងសៀមរាប។",
    keywords: ["ជាងនៅសៀមរាប", "សេវាកម្មសៀមរាប", "service provider Siem Reap"],
  },
  battambang: {
    slug: "battambang",
    nameKm: "ខេត្តបាត់ដំបង",
    nameEn: "Battambang",
    type: "province",
    metaTitle: "ស្វែងរកជាង និងសេវាកម្មនៅខេត្តបាត់ដំបង | ខ្មែរ សេវា",
    metaDescription: "ស្វែងរកជាងជួសជុល និងសេវាកម្មគេហដ្ឋាននៅក្រុងបាត់ដំបង។ ជាងជំនាញមានការផ្ទៀងផ្ទាត់។",
    h1: "សេវាកម្ម និងជាងជំនាញនៅខេត្តបាត់ដំបង",
    intro: "ភ្ជាប់ទំនាក់ទំនងជាមួយជាងជំនាញនៅក្រុងបាត់ដំបងយ៉ាងងាយស្រួល និងរហ័ស។",
    keywords: ["ជាងនៅបាត់ដំបង", "សេវាកម្មបាត់ដំបង", "handyman Battambang"],
  },
  "preah-sihanouk": {
    slug: "preah-sihanouk",
    nameKm: "ខេត្តព្រះសីហនុ",
    nameEn: "Preah Sihanouk",
    type: "province",
    metaTitle: "ស្វែងរកជាង និងសេវាកម្មនៅខេត្តព្រះសីហនុ (កំពង់សោម) | ខ្មែរ សេវា",
    metaDescription: "ស្វែងរកជាងជួសជុល និងសេវាកម្មនៅក្រុងព្រះសីហនុ។ ជាងម៉ាស៊ីនត្រជាក់ ជាងភ្លើង និងជាងទឹក។",
    h1: "សេវាកម្ម និងជាងជំនាញនៅខេត្តព្រះសីហនុ",
    intro: "ស្វែងរកអ្នកផ្តល់សេវាដែលនៅជិតអ្នកបំផុតក្នុងក្រុងព្រះសីហនុ។",
    keywords: ["ជាងនៅកំពង់សោម", "ជាងនៅព្រះសីហនុ", "Sihanoukville service provider"],
  },
  kampot: {
    slug: "kampot",
    nameKm: "ខេត្តកំពត",
    nameEn: "Kampot",
    type: "province",
    metaTitle: "ស្វែងរកជាង និងសេវាកម្មនៅខេត្តកំពត | ខ្មែរ សេវា",
    metaDescription: "ស្វែងរកជាងជួសជុល និងសេវាគេហដ្ឋាននៅក្រុងកំពត។",
    h1: "សេវាកម្ម និងជាងជំនាញនៅខេត្តកំពត",
    intro: "ស្វែងរកជាងជំនាញនៅក្រុងកំពតដោយទំនុកចិត្ត។",
    keywords: ["ជាងនៅកំពត", "សេវាកម្មកំពត", "Kampot handyman"],
  },
  kandal: {
    slug: "kandal",
    nameKm: "ខេត្តកណ្តាល",
    nameEn: "Kandal",
    type: "province",
    metaTitle: "ស្វែងរកជាង និងសេវាកម្មនៅខេត្តកណ្តាល (តាខ្មៅ) | ខ្មែរ សេវា",
    metaDescription: "ស្វែងរកជាងជួសជុលនៅក្រុងតាខ្មៅ និងតំបន់ជុំវិញក្នុងខេត្តកណ្តាល។",
    h1: "សេវាកម្ម និងជាងជំនាញនៅខេត្តកណ្តាល",
    intro: "ស្វែងរកជាង និងអ្នកផ្តល់សេវាកម្មនៅក្រុងតាខ្មៅ និងខេត្តកណ្តាល។",
    keywords: ["ជាងនៅតាខ្មៅ", "ជាងនៅកណ្តាល", "Kandal service provider"],
  },
};

// Slug mapping helpers
export function categoryToSlug(category: string): string {
  const match = Object.values(SERVICE_CATEGORIES_SEO).find((c) => c.category === category);
  if (match) return match.slug;
  return category.toLowerCase().replace(/_/g, "-");
}

export function slugToCategory(slug: string): ServiceCategorySeo | undefined {
  return SERVICE_CATEGORIES_SEO[slug.toLowerCase()];
}

export function locationToSlug(location: string): string {
  const normalized = location.toLowerCase().trim().replace(/\s+/g, "-");
  return normalized;
}

export function slugToLocation(slug: string): LocationSeo | undefined {
  return LOCATIONS_SEO[slug.toLowerCase()];
}

// Generate Next.js Metadata
export function generateSeoMetadata({
  title,
  description,
  path = "",
  keywords = [],
  image,
  noIndex = false,
  type = "website",
}: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
}): Metadata {
  const canonicalUrl = `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
  const ogTitle = title
    ? (title.includes(siteConfig.khmerName) ? title : `${title} | ${siteConfig.khmerName}`)
    : `${siteConfig.khmerName} | ${siteConfig.tagline}`;
  const ogDesc = description || siteConfig.description;
  const ogImg = image?.startsWith("http") ? image : `${siteConfig.url}${image || siteConfig.defaultOgImage}`;

  const allKeywords = Array.from(new Set([...keywords, ...siteConfig.keywords]));

  return {
    title: title
      ? {
          default: title,
          template: `%s | ${siteConfig.khmerName} - ${siteConfig.name}`,
        }
      : {
          default: `${siteConfig.khmerName} | ${siteConfig.tagline}`,
          template: `%s | ${siteConfig.khmerName} - ${siteConfig.name}`,
        },
    description: ogDesc,
    keywords: allKeywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "km-KH": canonicalUrl,
        "en-US": canonicalUrl,
      },
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          nocache: false,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonicalUrl,
      siteName: `${siteConfig.khmerName} (${siteConfig.name})`,
      locale: siteConfig.locale,
      alternateLocale: [siteConfig.alternateLocale],
      type,
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: [ogImg],
      creator: siteConfig.twitterHandle,
    },
  };
}

// JSON-LD Schemas
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: [siteConfig.khmerName, "Khmer Service Marketplace"],
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: ["km-KH", "en-US"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/services?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.khmerName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    areaServed: {
      "@type": "Country",
      name: "Cambodia",
    },
  };
}

export function generateServiceJsonLd({
  name,
  description,
  url,
  image,
  category,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: siteConfig.khmerName,
      url: siteConfig.url,
    },
    areaServed: {
      "@type": "Country",
      name: "Cambodia",
    },
    serviceType: category || name,
    image: image || `${siteConfig.url}${siteConfig.defaultOgImage}`,
  };
}

export function generateLocalBusinessJsonLd({
  name,
  description,
  url,
  image,
  city,
  district,
  ratingValue,
  reviewCount,
}: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  city?: string;
  district?: string;
  ratingValue?: number;
  reviewCount?: number;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    url,
    image: image || `${siteConfig.url}${siteConfig.defaultOgImage}`,
    description: description || `${name} - អ្នកផ្តល់សេវាកម្មនៅលើ ${siteConfig.khmerName}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: district || city || "Phnom Penh",
      addressRegion: city || "Phnom Penh",
      addressCountry: "KH",
    },
    areaServed: city || "Cambodia",
  };

  if (ratingValue && reviewCount && reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(ratingValue.toFixed(1)),
      reviewCount,
    };
  }

  return schema;
}

export function generateBreadcrumbsJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

export function generateFaqJsonLd(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}
