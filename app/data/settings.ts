import { supabase } from "../lib/supabaseClient";

export interface QAPair {
  id: string;
  question: string;
  answer: string;
}

export interface ContactSettings {
  heading: string;
  phone: string;
  email: string;
  whatsapp: string;
}

export interface HeaderNavItem {
  id: string;
  name: string;
  href: string;
}

export interface PopularCategorySettings {
  title: string;
  badge: string;
  subtitle: string;
}

export interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
}

export interface FooterSocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
}

export interface FooterSettings {
  callText: string;
  callPhone: string;
  address: string;
  email: string;
  importantLinksTitle: string;
  importantLinks: FooterLinkItem[];
  customerServiceTitle: string;
  customerServiceLinks: FooterLinkItem[];
  newsletterTitle: string;
  newsletterSubtitle: string;
  socialLinks: FooterSocialLinks;
  copyrightText: string;
}

export const defaultFooterSettings: FooterSettings = {
  callText: "Call Us 24/7",
  callPhone: "01611939511",
  address: "363, North pirerbag, Mirpur, Dhaka 1216",
  email: "dreammarthouse@gmail.com",
  importantLinksTitle: "Important Links",
  importantLinks: [
    { id: "imp-1", label: "Blog", url: "/blog" },
    { id: "imp-2", label: "About Us", url: "/about" },
    { id: "imp-3", label: "Contact Us", url: "/contact" },
    { id: "imp-4", label: "Terms and Conditions", url: "/terms" },
    { id: "imp-5", label: "Privacy Policy", url: "/privacy" },
  ],
  customerServiceTitle: "Customer Service",
  customerServiceLinks: [
    { id: "cs-1", label: "Return Policy", url: "/returns" },
    { id: "cs-2", label: "Refund Policy", url: "/refund" },
    { id: "cs-3", label: "Shipping Policy", url: "/shipping" },
    { id: "cs-4", label: "FAQs", url: "/faq" },
  ],
  newsletterTitle: "Subscribe to Newsletter",
  newsletterSubtitle: "Subscribe to get the latest offers and new products.",
  socialLinks: {
    facebook: "https://www.facebook.com/dreammart21",
    twitter: "#",
    instagram: "#",
    youtube: "#",
    linkedin: "#",
  },
  copyrightText: "Dream Mart. All rights reserved.",
};

export interface StoreSettings {
  storeName: string;
  contact: ContactSettings;
  qaList: QAPair[];
  headerNav: HeaderNavItem[];
  popularCategory: PopularCategorySettings;
  footer: FooterSettings;
}

export const defaultSettings: StoreSettings = {
  storeName: "Dream Mart",
  contact: {
    heading: "Have questions or want bulk orders?",
    phone: "01961363543",
    email: "info@demo21.com",
    whatsapp: "01834498477",
  },
  qaList: [
    {
      id: "qa-1",
      question: "How fresh are these fruits/products?",
      answer: "We collect our products directly from our selected premium gardens and suppliers every day to ensure maximum freshness.",
    },
    {
      id: "qa-2",
      question: "How long does the delivery take?",
      answer: "Inside Dhaka, we deliver within 24 to 48 hours. Outside Dhaka, it takes around 2 to 3 days.",
    },
  ],
  headerNav: [
    { id: "nav-1", name: "Mango", href: "/category/Mango" },
    { id: "nav-2", name: "Oil & Ghee", href: "/category/Oil & Ghee" },
    { id: "nav-3", name: "Honey", href: "/category/Honey" },
    { id: "nav-4", name: "Dates", href: "/category/Dates" },
    { id: "nav-5", name: "Spices", href: "/category/Spices" },
  ],
  popularCategory: {
    title: "Popular Category",
    badge: "জনপ্রিয় পণ্যসমূহ",
    subtitle: "আম, খেজুর, লিচু ও অন্যান্য জনপ্রিয় ক্যাটাগরির সেরা পণ্যসমূহ",
  },
  footer: defaultFooterSettings,
};

const SETTINGS_STORAGE_KEY = "dream_store_settings";

/**
 * Get stored settings synchronously from localStorage (client) or fallback to defaults
 */
export function getStoredSettings(): StoreSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const parsedFooter = parsed.footer || {};
      return {
        storeName: parsed.storeName || defaultSettings.storeName,
        contact: {
          ...defaultSettings.contact,
          ...(parsed.contact || {}),
        },
        qaList: Array.isArray(parsed.qaList)
          ? parsed.qaList
          : defaultSettings.qaList,
        headerNav: Array.isArray(parsed.headerNav)
          ? parsed.headerNav
          : defaultSettings.headerNav,
        popularCategory: {
          title: parsed.popularCategory?.title || defaultSettings.popularCategory.title,
          badge: parsed.popularCategory?.badge !== undefined ? parsed.popularCategory.badge : defaultSettings.popularCategory.badge,
          subtitle: parsed.popularCategory?.subtitle || defaultSettings.popularCategory.subtitle,
        },
        footer: {
          callText: parsedFooter.callText || defaultFooterSettings.callText,
          callPhone: parsedFooter.callPhone || defaultFooterSettings.callPhone,
          address: parsedFooter.address || defaultFooterSettings.address,
          email: parsedFooter.email || defaultFooterSettings.email,
          importantLinksTitle: parsedFooter.importantLinksTitle || defaultFooterSettings.importantLinksTitle,
          importantLinks: Array.isArray(parsedFooter.importantLinks)
            ? parsedFooter.importantLinks
            : defaultFooterSettings.importantLinks,
          customerServiceTitle: parsedFooter.customerServiceTitle || defaultFooterSettings.customerServiceTitle,
          customerServiceLinks: Array.isArray(parsedFooter.customerServiceLinks)
            ? parsedFooter.customerServiceLinks
            : defaultFooterSettings.customerServiceLinks,
          newsletterTitle: parsedFooter.newsletterTitle || defaultFooterSettings.newsletterTitle,
          newsletterSubtitle: parsedFooter.newsletterSubtitle || defaultFooterSettings.newsletterSubtitle,
          socialLinks: {
            ...defaultFooterSettings.socialLinks,
            ...(parsedFooter.socialLinks || {}),
          },
          copyrightText: parsedFooter.copyrightText || defaultFooterSettings.copyrightText,
        },
      };
    }
  } catch (err) {
    console.error("Failed to read store settings from localStorage:", err);
  }
  return defaultSettings;
}

/**
 * Save settings to database (Supabase) and localStorage
 */
export async function saveStoredSettings(settings: StoreSettings): Promise<{ success: boolean; syncedWithDb: boolean }> {
  let syncedWithDb = false;

  // 1. Save to local storage for instant responsiveness
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("dream_settings_updated", { detail: settings }));
    } catch (err) {
      console.error("Failed to write store settings to localStorage:", err);
    }
  }

  // 2. Try Supabase store_settings table first
  try {
    const { error } = await supabase
      .from("store_settings")
      .upsert({
        id: "main_settings",
        settings: settings,
        updated_at: new Date().toISOString(),
      });

    if (!error) {
      syncedWithDb = true;
    }
  } catch (err) {
    // try fallback table below
  }

  // 3. Guarantee database persistence via banners table
  try {
    const { error: bannerErr } = await supabase.from("banners").upsert([
      {
        id: "sys_store_settings",
        slot: "system_settings",
        title: settings.storeName || "Dream Mart",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100",
        link: JSON.stringify(settings),
        badge: "settings",
        is_active: false,
        sort_order: 9999,
      },
    ]);
    if (!bannerErr) {
      syncedWithDb = true;
    }
  } catch (err) {
    console.warn("Database persistence note:", err);
  }

  return { success: true, syncedWithDb };
}

/**
 * Fetch latest settings from Supabase database
 */
export async function fetchStoreSettings(): Promise<StoreSettings> {
  const local = getStoredSettings();

  // 1. Try store_settings table
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("settings")
      .eq("id", "main_settings")
      .maybeSingle();

    if (!error && data?.settings) {
      const dbSettings = data.settings as StoreSettings;
      const merged: StoreSettings = {
        storeName: dbSettings.storeName || local.storeName,
        contact: {
          ...local.contact,
          ...(dbSettings.contact || {}),
        },
        qaList: Array.isArray(dbSettings.qaList)
          ? dbSettings.qaList
          : local.qaList,
        headerNav: Array.isArray(dbSettings.headerNav)
          ? dbSettings.headerNav
          : local.headerNav,
        popularCategory: {
          title: dbSettings.popularCategory?.title || local.popularCategory?.title || defaultSettings.popularCategory.title,
          badge: dbSettings.popularCategory?.badge !== undefined ? dbSettings.popularCategory.badge : (local.popularCategory?.badge ?? defaultSettings.popularCategory.badge),
          subtitle: dbSettings.popularCategory?.subtitle || local.popularCategory?.subtitle || defaultSettings.popularCategory.subtitle,
        },
        footer: {
          callText: (dbSettings.footer || {}).callText || local.footer?.callText || defaultFooterSettings.callText,
          callPhone: (dbSettings.footer || {}).callPhone || local.footer?.callPhone || defaultFooterSettings.callPhone,
          address: (dbSettings.footer || {}).address || local.footer?.address || defaultFooterSettings.address,
          email: (dbSettings.footer || {}).email || local.footer?.email || defaultFooterSettings.email,
          importantLinksTitle: (dbSettings.footer || {}).importantLinksTitle || local.footer?.importantLinksTitle || defaultFooterSettings.importantLinksTitle,
          importantLinks: Array.isArray((dbSettings.footer || {}).importantLinks)
            ? (dbSettings.footer || {}).importantLinks
            : (local.footer?.importantLinks || defaultFooterSettings.importantLinks),
          customerServiceTitle: (dbSettings.footer || {}).customerServiceTitle || local.footer?.customerServiceTitle || defaultFooterSettings.customerServiceTitle,
          customerServiceLinks: Array.isArray((dbSettings.footer || {}).customerServiceLinks)
            ? (dbSettings.footer || {}).customerServiceLinks
            : (local.footer?.customerServiceLinks || defaultFooterSettings.customerServiceLinks),
          newsletterTitle: (dbSettings.footer || {}).newsletterTitle || local.footer?.newsletterTitle || defaultFooterSettings.newsletterTitle,
          newsletterSubtitle: (dbSettings.footer || {}).newsletterSubtitle || local.footer?.newsletterSubtitle || defaultFooterSettings.newsletterSubtitle,
          socialLinks: {
            ...defaultFooterSettings.socialLinks,
            ...(local.footer?.socialLinks || {}),
            ...((dbSettings.footer || {}).socialLinks || {}),
          },
          copyrightText: (dbSettings.footer || {}).copyrightText || local.footer?.copyrightText || defaultFooterSettings.copyrightText,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch (err) {
    // try banners fallback below
  }

  // 2. Try banners table system_settings row
  try {
    const { data: bData, error: bErr } = await supabase
      .from("banners")
      .select("link")
      .eq("id", "sys_store_settings")
      .maybeSingle();

    if (!bErr && bData?.link) {
      const parsed = JSON.parse(bData.link) as StoreSettings;
      const merged: StoreSettings = {
        storeName: parsed.storeName || local.storeName,
        contact: {
          ...local.contact,
          ...(parsed.contact || {}),
        },
        qaList: Array.isArray(parsed.qaList)
          ? parsed.qaList
          : local.qaList,
        headerNav: Array.isArray(parsed.headerNav)
          ? parsed.headerNav
          : local.headerNav,
        popularCategory: {
          title: parsed.popularCategory?.title || local.popularCategory?.title || defaultSettings.popularCategory.title,
          badge: parsed.popularCategory?.badge !== undefined ? parsed.popularCategory.badge : (local.popularCategory?.badge ?? defaultSettings.popularCategory.badge),
          subtitle: parsed.popularCategory?.subtitle || local.popularCategory?.subtitle || defaultSettings.popularCategory.subtitle,
        },
        footer: {
          callText: (parsed.footer || {}).callText || local.footer?.callText || defaultFooterSettings.callText,
          callPhone: (parsed.footer || {}).callPhone || local.footer?.callPhone || defaultFooterSettings.callPhone,
          address: (parsed.footer || {}).address || local.footer?.address || defaultFooterSettings.address,
          email: (parsed.footer || {}).email || local.footer?.email || defaultFooterSettings.email,
          importantLinksTitle: (parsed.footer || {}).importantLinksTitle || local.footer?.importantLinksTitle || defaultFooterSettings.importantLinksTitle,
          importantLinks: Array.isArray((parsed.footer || {}).importantLinks)
            ? (parsed.footer || {}).importantLinks
            : (local.footer?.importantLinks || defaultFooterSettings.importantLinks),
          customerServiceTitle: (parsed.footer || {}).customerServiceTitle || local.footer?.customerServiceTitle || defaultFooterSettings.customerServiceTitle,
          customerServiceLinks: Array.isArray((parsed.footer || {}).customerServiceLinks)
            ? (parsed.footer || {}).customerServiceLinks
            : (local.footer?.customerServiceLinks || defaultFooterSettings.customerServiceLinks),
          newsletterTitle: (parsed.footer || {}).newsletterTitle || local.footer?.newsletterTitle || defaultFooterSettings.newsletterTitle,
          newsletterSubtitle: (parsed.footer || {}).newsletterSubtitle || local.footer?.newsletterSubtitle || defaultFooterSettings.newsletterSubtitle,
          socialLinks: {
            ...defaultFooterSettings.socialLinks,
            ...(local.footer?.socialLinks || {}),
            ...((parsed.footer || {}).socialLinks || {}),
          },
          copyrightText: (parsed.footer || {}).copyrightText || local.footer?.copyrightText || defaultFooterSettings.copyrightText,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch (err) {
    // use local fallback
  }

  return local;
}
