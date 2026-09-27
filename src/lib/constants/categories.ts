export const SERVICE_CATEGORIES = {
  OTHER: {
    km: "ផ្សេងៗ",
    en: "Other",
  },
  PAINTING: {
    km: "ថ្នាំលាប",
    en: "Painting",
  },
  CARPENTRY: {
    km: "ជាងឈើ",
    en: "Carpentry",
  },
  ELECTRICAL: {
    km: "អគ្គិសនី",
    en: "Electrical",
  },
  CLEANING: {
    km: "សម្អាត",
    en: "Cleaning",
  },
  AC_REPAIR: {
    km: "ជួសជុលម៉ាស៊ីនត្រជាក់",
    en: "AC Repair",
  },
  BEAUTY: {
    km: "សេវាសម្រស់",
    en: "Beauty",
  },
  APPLIANCE_REPAIR: {
    km: "ជួសជុលឧបករណ៍ប្រើប្រាស់",
    en: "Appliance Repair",
  },
  PEST_CONTROL: {
    km: "កម្ចាត់សត្វល្អិត",
    en: "Pest Control",
  },
  TUTORING: {
    km: "បង្រៀន",
    en: "Tutoring",
  },
  PLUMBING: {
    km: "ជាងទឹក",
    en: "Plumbing",
  },
} as const;

export type ServiceCategory =
  | "OTHER"
  | "PAINTING"
  | "CARPENTRY"
  | "ELECTRICAL"
  | "CLEANING"
  | "AC_REPAIR"
  | "BEAUTY"
  | "APPLIANCE_REPAIR"
  | "PEST_CONTROL"
  | "TUTORING"
  | "PLUMBING";

export const SERVICE_CATEGORY_LIST: ServiceCategory[] = [
  "AC_REPAIR",
  "PLUMBING",
  "ELECTRICAL",
  "CLEANING",
  "APPLIANCE_REPAIR",
  "CARPENTRY",
  "PAINTING",
  "PEST_CONTROL",
  "BEAUTY",
  "TUTORING",
  "OTHER",
];

export function isValidServiceCategory(val: unknown): val is ServiceCategory {
  if (typeof val !== "string") return false;
  return Object.prototype.hasOwnProperty.call(SERVICE_CATEGORIES, val);
}

export function getCategoryLabel(
  category: ServiceCategory | string,
  locale: "km" | "en" = "km"
): string {
  if (isValidServiceCategory(category)) {
    return SERVICE_CATEGORIES[category][locale] || SERVICE_CATEGORIES[category].km;
  }
  return String(category);
}

/**
 * Normalizes input string (e.g. from URL query, text, or legacy code) to a valid ServiceCategory
 */
export function normalizeServiceCategory(val?: string | null): ServiceCategory | null {
  if (!val) return null;
  const upper = val.trim().toUpperCase();
  if (isValidServiceCategory(upper)) {
    return upper;
  }
  // Common alias mapping for legacy codes or slugs
  const aliasMap: Record<string, ServiceCategory> = {
    "AC-REPAIR": "AC_REPAIR",
    AIRCON: "AC_REPAIR",
    "APPLIANCE-REPAIR": "APPLIANCE_REPAIR",
    "PEST-CONTROL": "PEST_CONTROL",
    "HOME-CLEANING": "CLEANING",
  };
  if (aliasMap[upper]) {
    return aliasMap[upper];
  }
  return null;
}

/**
 * Robustly maps any text, name, or arbitrary database code into one of the 11 valid backend ServiceCategory enums.
 * Guaranteed to return a valid ServiceCategory (defaults to 'OTHER' if no specific match).
 */
export function resolveToServiceCategory(codeOrName?: string | null): ServiceCategory {
  if (!codeOrName) return "OTHER";
  const normalized = normalizeServiceCategory(codeOrName);
  if (normalized) return normalized;

  const lower = codeOrName.toLowerCase();
  if (/ត្រជាក់|aircon|ac|air condition|ម៉ាស៊ីនត្រជាក់/.test(lower)) return "AC_REPAIR";
  if (/ទឹក|លេច|បំពង់|ទុយោ|ម៉ាស៊ីនបូម|plumb/.test(lower)) return "PLUMBING";
  if (/ភ្លើង|ខ្សែភ្លើង|កុងតាក់|ឌីសង់ទ័រ|ឆ្លងភ្លើង|electric/.test(lower)) return "ELECTRICAL";
  if (/សម្អាត|បោក|ធូលី|ផ្ទះបាយ|clean/.test(lower)) return "CLEANING";
  if (/ផ្ទះ|ទ្វារ|បង្អួច|ឈើ|ពិដាន|ដំបូល|តុ|កៅអី|carpenter|carpentry/.test(lower)) return "CARPENTRY";
  if (/ថ្នាំ|លាប|paint/.test(lower)) return "PAINTING";
  if (/អេឡិចត្រូនិក|កុំព្យូទ័រ|ទូរស័ព្ទ|phone|computer|pc|laptop|printer|ទូរទស្សន៍|ឧបករណ៍|appliance|electronic/.test(lower)) return "APPLIANCE_REPAIR";
  if (/សត្វល្អិត|កន្លាត|ស្រមោច|កណ្តុរ|pest/.test(lower)) return "PEST_CONTROL";
  if (/បង្រៀន|រៀន|tutor/.test(lower)) return "TUTORING";
  if (/សម្ផស្ស|កាត់សក់|make up|beauty/.test(lower)) return "BEAUTY";
  return "OTHER";
}

