export interface FooterLink {
  name: string;
  nameEn?: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export interface SocialLink {
  name: string;
  href: string;
  ariaLabel: string;
  platform: "facebook" | "telegram" | "tiktok";
}

export interface FooterContact {
  location: string;
  locationEn?: string;
  email: string;
  phone: string;
}

// 1. Column 2: សេវាកម្ម (Services)
export const FOOTER_SERVICES_LINKS: FooterLink[] = [
  { name: "ជួសជុលម៉ាស៊ីនត្រជាក់", nameEn: "Air Conditioning Repair", href: "/services/ac-repair" },
  { name: "ជួសជុលកុំព្យូទ័រ", nameEn: "Computer Repair", href: "/services/computer-repair" },
  { name: "ជាងអគ្គិសនី", nameEn: "Electricians", href: "/services/electrical" },
  { name: "ជាងទឹក", nameEn: "Plumbers", href: "/services/plumbing" },
  { name: "ជួសជុលឧបករណ៍ប្រើប្រាស់", nameEn: "Appliance Repair", href: "/services/appliance-repair" },
  { name: "សេវាសម្អាត", nameEn: "Cleaning Service", href: "/services/cleaning" },
  { name: "មើលសេវាកម្មទាំងអស់", nameEn: "View All Services", href: "/services" },
];

// 2. Column 3: សម្រាប់អ្នកប្រើប្រាស់ (For Customers)
export const FOOTER_CUSTOMER_LINKS: FooterLink[] = [
  { name: "អំពីខ្មែរ សេវា", nameEn: "About Khmer Service", href: "/about" },
  { name: "ស្វែងរកសេវាកម្ម", nameEn: "Browse Services", href: "/services" },
  { name: "ស្វែងរកជាង", nameEn: "Find Technicians", href: "/providers" },
  { name: "របៀបប្រើប្រាស់", nameEn: "How It Works", href: "/about#how-it-works" },
  { name: "សំណួរដែលសួរញឹកញាប់", nameEn: "FAQs", href: "/about#faq" },
  { name: "ទំនាក់ទំនង", nameEn: "Contact Us", href: "/about#contact" },
  { name: "រាយការណ៍បញ្ហា", nameEn: "Post a Problem", href: "/customer/requests/create" },
];

// 3. Column 4: សម្រាប់អ្នកផ្តល់សេវា (For Service Providers)
export const FOOTER_PROVIDER_LINKS: FooterLink[] = [
  { name: "ចុះឈ្មោះ", nameEn: "Register", href: "/register?role=PROVIDER" },
  { name: "ចូលគណនី", nameEn: "Login", href: "/login" },
  { name: "បង្កើតប្រវត្តិរូប", nameEn: "Create Profile", href: "/provider/profile" },
  { name: "គ្រប់គ្រងសេវាកម្ម", nameEn: "Provider Dashboard", href: "/provider/dashboard" },
  { name: "របៀបក្លាយជាអ្នកផ្តល់សេវា", nameEn: "Become a Provider", href: "/about#provider" },
];

// 4. Contact Information
export const FOOTER_CONTACT_INFO: FooterContact = {
  location: process.env.NEXT_PUBLIC_CONTACT_LOCATION || "រាជធានីភ្នំពេញ, ប្រទេសកម្ពុជា",
  locationEn: "Phnom Penh, Cambodia",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@serviceplatform.kh",
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+855 87 955 888",
};

// 5. Popular SEO Links (សេវាកម្មពេញនិយម)
export const FOOTER_POPULAR_LINKS: FooterLink[] = [
  { name: "ជាងជួសជុលម៉ាស៊ីនត្រជាក់នៅភ្នំពេញ", nameEn: "AC Repair in Phnom Penh", href: "/services/ac-repair" },
  { name: "ជាងជួសជុលកុំព្យូទ័រ", nameEn: "Computer Repair", href: "/services/computer-repair" },
  { name: "ជាងអគ្គិសនី", nameEn: "Electricians", href: "/services/electrical" },
  { name: "ជាងទឹក", nameEn: "Plumbers", href: "/services/plumbing" },
  { name: "សេវាសម្អាតផ្ទះ", nameEn: "Home Cleaning", href: "/services/cleaning" },
];

// 6. Social Media Links
export const FOOTER_SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Facebook",
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com",
    ariaLabel: "ទំព័រ Facebook ផ្លូវការរបស់ ខ្មែរ សេវា",
    platform: "facebook",
  },
  {
    name: "Telegram",
    href: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me",
    ariaLabel: "ឆានែល Telegram ផ្លូវការរបស់ ខ្មែរ សេវា",
    platform: "telegram",
  },
  {
    name: "TikTok",
    href: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com",
    ariaLabel: "គណនី TikTok ផ្លូវការរបស់ ខ្មែរ សេវា",
    platform: "tiktok",
  },
];

// 7. Legal Links
export const FOOTER_LEGAL_LINKS: FooterLink[] = [
  { name: "គោលការណ៍ឯកជនភាព", nameEn: "Privacy Policy", href: "/privacy" },
  { name: "លក្ខខណ្ឌប្រើប្រាស់", nameEn: "Terms of Service", href: "/terms" },
];
