export interface BannerItem {
  id: string;
  slot: "main" | "side-top" | "side-bottom";
  title: string;
  image: string;
  link: string;
  badge?: string;
  sort_order?: number;
  is_active?: boolean;
}

export const defaultBanners: BannerItem[] = [
  {
    id: "main-1",
    slot: "main",
    title: "বাগানের সেরা আম্রপালি",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp",
    link: "/category/Mango",
    badge: "মিষ্টি-রসালো স্বাদের অনন্য",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "side-top-1",
    slot: "side-top",
    title: "প্রকৃতির মিষ্টিতায় ভরপুর খেজুর",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp",
    link: "/category/Dates",
    badge: "স্বাদে খাঁটি, গুণে ভরপুর",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "side-bottom-1",
    slot: "side-bottom",
    title: "লিচুর সেরা স্বাদ অনলাইনে",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297098577cb3.66054740.webp",
    link: "/category/Lichi",
    badge: "মিষ্টি-রসালো স্বাদের অনন্য",
    sort_order: 1,
    is_active: true,
  },
];

export function getStoredBanners(): BannerItem[] {
  if (typeof window === "undefined") return defaultBanners;
  try {
    const customSaved = localStorage.getItem("dream_custom_banners");
    if (customSaved) {
      const parsed = JSON.parse(customSaved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read local banners:", err);
  }
  return defaultBanners;
}
