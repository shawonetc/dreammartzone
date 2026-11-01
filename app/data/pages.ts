import { supabase } from "../lib/supabaseClient";

export interface PageSection {
  id: string;
  title: string;
  content: string;
  badge?: string;
  icon?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  image?: string;
  excerpt: string;
  content: string;
  category?: string;
  readTime?: string;
}

export interface CustomPageData {
  slug: string;
  title: string;
  subtitle: string;
  badge?: string;
  lastUpdated?: string;
  content?: string;
  sections?: PageSection[];
  contactInfo?: {
    phone: string;
    email: string;
    whatsapp: string;
    address: string;
    businessHours?: string;
  };
  faqs?: FAQItem[];
  blogPosts?: BlogPostItem[];
}

export const defaultPagesData: Record<string, CustomPageData> = {
  about: {
    slug: "about",
    title: "Purity, Freshness & Trust in Every Delivery",
    subtitle: "Dream Mart is Bangladesh's trusted online destination for 100% fresh, formalin-free organic fruits, premium dates, and daily household groceries.",
    badge: "About Dream Mart",
    lastUpdated: "November 2026",
    content: `Welcome to Dream Mart — where nature's purest harvests meet modern convenience. We started Dream Mart with a simple yet uncompromising goal: to deliver chemical-free, nutrient-rich fruits and groceries to every home in Bangladesh.

From the lush mango orchards of Rajshahi and Chapainawabganj to the lychee gardens of Dinajpur, our team carefully handpicks each product at the peak of ripeness. We eliminate intermediaries, guaranteeing farm-gate freshness, ethical farmer compensation, and unmatched value for our customers.

With strict quality checks, hygienic eco-packaging, and dependable Cash on Delivery across all 64 districts, Dream Mart is proud to be the trusted choice of over 25,000 health-conscious families.`,
    sections: [
      {
        id: "sec-1",
        title: "Direct From Gardens",
        content: "We partner directly with certified local orchardists in Rajshahi, Dinajpur, and Kushtia. No long warehouse storage — just fresh harvests delivered swiftly to your dining table.",
        badge: "100% Farm Sourced",
        icon: "Sparkles",
      },
      {
        id: "sec-2",
        title: "Guaranteed Formalin-Free",
        content: "Every single batch is tested before dispatch. We maintain a zero-tolerance policy towards artificial carbide ripening, formalin, or toxic preservatives.",
        badge: "Health First",
        icon: "ShieldCheck",
      },
      {
        id: "sec-3",
        title: "Nationwide Cash on Delivery",
        content: "Inspect your package upon doorstep delivery anywhere across Bangladesh. Pay comfortably in cash or via bKash/Nagad only after you are completely satisfied.",
        badge: "Peace of Mind",
        icon: "Truck",
      },
    ],
  },

  blog: {
    slug: "blog",
    title: "Blog & Fresh News",
    subtitle: "Insights, organic health benefits, seasonal fruit guides, and updates from the Dream Mart farm network.",
    badge: "Dream Mart Journal",
    lastUpdated: "November 2026",
    content: "Explore the latest updates on seasonal fruits, organic nutrition tips, and authentic grocery buying guides written by our agricultural experts.",
    blogPosts: [
      {
        id: "post-1",
        title: "The Ultimate Guide to Chemical-Free Mangoes in Bangladesh",
        slug: "chemical-free-mangoes-bangladesh-guide",
        date: "October 28, 2026",
        author: "Dream Mart Agronomy Team",
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800",
        readTime: "4 min read",
        category: "Seasonal Fruits",
        excerpt: "Learn how to differentiate naturally tree-ripened Himsagar, Amrapali, and Haribhanga mangoes from carbide-ripened market fruits.",
        content: `Mango season brings immense joy, but consumers frequently worry about harmful ripening agents like calcium carbide. 

Here is how Dream Mart ensures 100% natural mangoes:
1. Natural Tree Ripening: Mangoes stay on the branches until they achieve optimum physiological maturity.
2. Color vs Aroma: Naturally ripened mangoes emit an intoxicating sweet scent from the stem, whereas chemically forced fruits possess little aroma despite uniform artificial color.
3. Taste & Shelf Life: Organic mangoes have a balanced sweet-tangy flavor and keep fresh naturally for 4–6 days without chilling.

Order genuine Rajshahi & Chapai mangoes delivered safely to your home with Dream Mart.`,
      },
      {
        id: "post-2",
        title: "Cold-Pressed Mustard Oil (Kachi Ghani): Why Your Family Needs It",
        slug: "cold-pressed-mustard-oil-benefits",
        date: "October 20, 2026",
        author: "Nutrition Specialist",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800",
        readTime: "5 min read",
        category: "Organic Oils",
        excerpt: "Discover the heart-protective benefits of traditionally extracted cold-pressed mustard oil over industrial refined cooking oils.",
        content: `Traditional Kachi Ghani mustard oil is crushed using low-temperature wooden or stone expellers. This critical technique preserves essential monounsaturated fatty acids (MUFA), Omega-3, and natural antioxidants.

Unlike refined soybean oils that undergo high-temperature chemical bleaching, our pure mustard oil retains its signature pungency, natural antibacterial qualities, and deep golden color. Ideal for traditional Bengali delicacies, pickles, and overall immune wellness.`,
      },
      {
        id: "post-3",
        title: "Health Benefits of Pure Raw Honey: Spotting Real vs Adulterated",
        slug: "raw-honey-health-benefits-spotting-real",
        date: "October 14, 2026",
        author: "Health & Wellness Editor",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800",
        readTime: "3 min read",
        category: "Superfoods",
        excerpt: "Raw Sundarban and Mustard-flower honey are loaded with natural pollen, enzymes, and antiviral compounds. Here is how to verify purity.",
        content: `Commercial processed honey is often heated and ultra-filtered, destroying active enzymes and beneficial pollen. 

Dream Mart's Raw Honey is bottled raw, straight from bee-boxes placed in mustard fields and Sundarbans mangroves.
- Natural Crystallization: Pure raw honey often crystallizes at lower room temperatures; this is normal and proves authenticity!
- Water Test: Pure honey settles quietly at the bottom of a water cup without rapidly dissolving like artificial sugar syrup.`,
      },
    ],
  },

  contact: {
    slug: "contact",
    title: "Get in Touch With Us",
    subtitle: "Have questions about our seasonal harvests, need order support, or want bulk corporate packages? We are here to help.",
    badge: "Contact & Support",
    lastUpdated: "November 2026",
    content: "Our customer support team is available 7 days a week to assist with order tracking, product inquiries, corporate gifting, or urgent feedback.",
    contactInfo: {
      address: "363, North pirerbag, Mirpur, Dhaka 1216",
      email: "dreammarthouse@gmail.com",
      phone: "01611939511",
      whatsapp: "01834498477",
      businessHours: "Saturday - Thursday: 9:00 AM - 10:00 PM | Friday: 2:00 PM - 10:00 PM",
    },
    sections: [
      {
        id: "c-1",
        title: "Corporate & Wholesale Orders",
        content: "Looking for premium fruit gift baskets or corporate staff packages? Reach out to dreammarthouse@gmail.com or WhatsApp us at 01834498477 for special discounted rates.",
        badge: "Bulk Purchases",
      },
      {
        id: "c-2",
        title: "Fast Delivery Support",
        content: "If you have an urgent inquiry about an ongoing delivery, call our hotline 01611939511 or visit our Track Order page with your Order ID.",
        badge: "Delivery Status",
      },
    ],
  },

  terms: {
    slug: "terms",
    title: "Terms and Conditions",
    subtitle: "Please read these terms and conditions carefully before using the Dream Mart online store and placing orders.",
    badge: "Legal Agreement",
    lastUpdated: "November 01, 2026",
    content: `Welcome to Dream Mart. By accessing our website (dreammartzone), purchasing products, or using our delivery services, you acknowledge and agree to comply with the following legally binding terms and conditions. If you disagree with any part of these terms, please do not proceed with your order.`,
    sections: [
      {
        id: "t-1",
        title: "1. Acceptance of Terms",
        content: "These Terms apply to all visitors, registered customers, and users of the Dream Mart platform. By completing a checkout or registering an account, you affirm that you are at least 18 years of age or possess legal parental/guardian consent.",
      },
      {
        id: "t-2",
        title: "2. Product Freshness & Availability",
        content: "Since we specialize in organic and seasonal agricultural harvests (such as mangoes, dates, honey, and seasonal fruits), availability is dependent on harvest weather conditions. While we strive to maintain accurate inventory, Dream Mart reserves the right to notify customers and adjust or substitute items of equal or superior quality if a specific batch does not meet our high freshness standards.",
      },
      {
        id: "t-3",
        title: "3. Pricing and Payment",
        content: "All prices on Dream Mart are displayed in Bangladeshi Taka (BDT) and include applicable taxes unless specified otherwise. We support Cash on Delivery (COD), bKash, Nagad, and digital payment gateways. Dream Mart reserves the right to modify prices without prior notice based on seasonal supply changes.",
      },
      {
        id: "t-4",
        title: "4. Shipping & Home Delivery",
        content: "Deliveries inside Dhaka are usually completed within 24 to 48 hours. Deliveries outside Dhaka are delivered through trusted courier partners within 2 to 3 business days. Customers are requested to provide accurate contact numbers and delivery addresses to prevent courier delays.",
      },
      {
        id: "t-5",
        title: "5. Order Cancellation & Inspection",
        content: "You may cancel an order before it has been dispatched from our packing hub by calling our hotline. For perishable fruits, we strongly recommend customers inspect the delivery package in the presence of the courier rider.",
      },
      {
        id: "t-6",
        title: "6. Limitation of Liability & Governing Law",
        content: "These terms and conditions are governed by and construed in accordance with the laws of the People's Republic of Bangladesh. Any dispute arising out of or related to our platform shall be subject to the exclusive jurisdiction of the competent courts of Dhaka, Bangladesh.",
      },
    ],
  },

  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    subtitle: "Your privacy is of paramount importance to us. Learn how Dream Mart collects, safeguards, and responsibly uses your personal information.",
    badge: "Data Protection",
    lastUpdated: "November 01, 2026",
    content: `At Dream Mart, we are fully committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy details the types of information we collect, how it is processed, and the measures we take to keep your information secure.`,
    sections: [
      {
        id: "p-1",
        title: "1. Information We Collect",
        content: "When you browse our catalog, register an account, or complete a checkout, we may collect: your full name, primary phone number, email address, delivery street address, order history, and customer service notes.",
      },
      {
        id: "p-2",
        title: "2. How We Use Your Information",
        content: "We use your personal data exclusively to: process and dispatch your orders, notify you of delivery status via SMS or phone call, provide customer assistance, and send you occasional special discount alerts if you have subscribed to our newsletter.",
      },
      {
        id: "p-3",
        title: "3. Payment Information Security",
        content: "We never store your credit/debit card numbers, bank PINs, or bKash/Nagad security PINs on our servers. All digital payments are processed through secure, PCI-DSS compliant third-party payment gateways with end-to-end encryption.",
      },
      {
        id: "p-4",
        title: "4. Sharing With Third Parties",
        content: "Dream Mart will NEVER sell, lease, or monetize your personal data. We only share essential delivery information (recipient name, contact phone, and address) with our contracted courier partners (e.g., Steadfast, Pathao, RedX) solely for delivery execution.",
      },
      {
        id: "p-5",
        title: "5. Cookies & Site Analytics",
        content: "We use minimal necessary cookies to preserve your cart contents, track order session state, and understand general site performance. You can disable non-essential cookies via your browser settings at any time.",
      },
      {
        id: "p-6",
        title: "6. Your Privacy Rights",
        content: "You retain the right to review, update, or request the deletion of your personal account information at any time. To exercise these rights, please contact our data team at dreammarthouse@gmail.com.",
      },
    ],
  },

  returns: {
    slug: "returns",
    title: "Return & Replacement Policy",
    subtitle: "We stand behind the freshness and authenticity of every product with our customer-first return guarantee.",
    badge: "Hassle-Free Returns",
    lastUpdated: "November 01, 2026",
    content: `At Dream Mart, we prioritize quality above everything else. If any item arrives damaged, spoiled, or fails to meet our promised freshness standards, we will promptly replace it or refund you with complete peace of mind.`,
    sections: [
      {
        id: "r-1",
        title: "1. 24-Hour Freshness Guarantee",
        content: "For perishable fruits (such as mangoes, dates, or seasonal harvests), please inspect your parcel upon arrival. If you discover any defect or transit spoilage, notify our support team within 24 hours of delivery with photos of the affected items.",
      },
      {
        id: "r-2",
        title: "2. Return Conditions",
        content: "Items eligible for return must be in their original packaging with invoice or order ID. Non-perishable grocery goods (like sealed mustard oil, honey, and spices) can be returned within 48 hours if the seal is intact and undamaged.",
      },
      {
        id: "r-3",
        title: "3. How to Initiate a Return",
        content: "Simply message us on WhatsApp at 01834498477 or email dreammarthouse@gmail.com with your Order Number and photos/video of the received product. Our support agent will verify and approve the replacement or return pickup immediately.",
      },
      {
        id: "r-4",
        title: "4. Free Replacement Shipping",
        content: "If the return is due to a quality issue or shipping damage caused by Dream Mart, you will NOT be charged any additional delivery fee for your replacement shipment.",
      },
    ],
  },

  refund: {
    slug: "refund",
    title: "Refund Policy",
    subtitle: "Transparent, fast, and secure refunds whenever you are not 100% satisfied with your purchase.",
    badge: "Money-Back Assurance",
    lastUpdated: "November 01, 2026",
    content: `We strive to ensure every customer has an exceptional shopping experience with Dream Mart. If an item cannot be replaced or if you choose a refund, we process it swiftly and transparently.`,
    sections: [
      {
        id: "rf-1",
        title: "1. Refund Eligibility",
        content: "Refunds are issued under the following circumstances: (a) If you cancel a prepaid order before dispatch; (b) If an item was damaged/missing and a replacement is unavailable; (c) If you paid twice for the same order due to a gateway glitch.",
      },
      {
        id: "rf-2",
        title: "2. Processing Time",
        content: "Once approved by our support team, refunds are processed within 3 to 7 business days. Mobile financial service refunds (bKash, Nagad) are typically credited within 24–48 hours of approval.",
      },
      {
        id: "rf-3",
        title: "3. Refund Channels",
        content: "Refunds will be credited directly to the customer's original payment method (bKash, Nagad, Rocket, or Bank Transfer). Customers may also opt for instant Store Credit for immediate future purchases.",
      },
      {
        id: "rf-4",
        title: "4. Questions or Inquiries",
        content: "For inquiries regarding an approved refund status, please contact us at dreammarthouse@gmail.com or call 01611939511 with your Refund Reference ID.",
      },
    ],
  },

  shipping: {
    slug: "shipping",
    title: "Shipping & Delivery Policy",
    subtitle: "Fast, reliable, and temperature-conscious delivery directly to your home across all 64 districts in Bangladesh.",
    badge: "Delivery Across Bangladesh",
    lastUpdated: "November 01, 2026",
    content: `Dream Mart operates a specialized delivery network designed to transport delicate, fresh fruits and organic groceries safely to your doorstep with minimal transit time.`,
    sections: [
      {
        id: "s-1",
        title: "1. Delivery Coverage",
        content: "We provide home delivery across all areas of Dhaka City, as well as door-to-door courier delivery to all 64 districts and major upazilas across Bangladesh.",
      },
      {
        id: "s-2",
        title: "2. Delivery Timelines",
        content: "- Inside Dhaka City: 24 to 48 hours from order confirmation.\n- Outside Dhaka City: 2 to 3 business days via our premium courier partners.",
      },
      {
        id: "s-3",
        title: "3. Delivery Fees",
        content: "Standard delivery charges:\n- Inside Dhaka: ৳70 - ৳80\n- Outside Dhaka: ৳120 - ৳150 (depending on total weight and parcel volume). Exact delivery fees are calculated transparently during checkout.",
      },
      {
        id: "s-4",
        title: "4. Live Order Tracking",
        content: "Every order receives a tracking link via SMS. You can also visit our Track Order page at any time to verify the real-time fulfillment and transit status of your parcel.",
      },
      {
        id: "s-5",
        title: "5. Cash on Delivery (COD) Inspection",
        content: "We encourage all customers to inspect the outer seal and contents upon home delivery before handing payment to the courier rider.",
      },
    ],
  },

  faq: {
    slug: "faq",
    title: "Frequently Asked Questions (FAQs)",
    subtitle: "Find answers to the most common questions regarding our organic fruits, ordering, shipping, and quality assurance.",
    badge: "Help & Q&A",
    lastUpdated: "November 01, 2026",
    content: "Browse our frequently asked questions below. If you don't find what you are looking for, our friendly support team is always ready to assist you via WhatsApp or phone.",
    faqs: [
      {
        id: "faq-1",
        question: "How fresh are your fruits and groceries?",
        answer: "We collect our fruits directly from selected gardens in Rajshahi, Chapainawabganj, and Dinajpur every morning. We do not store fresh fruit in cold storage for months — items are dispatched within 24 hours of harvest.",
        category: "Quality",
      },
      {
        id: "faq-2",
        question: "Are your fruits 100% formalin and chemical-free?",
        answer: "Yes, absolutely! We guarantee 100% formalin-free, calcium carbide-free products. We believe chemical-free food is a basic right for every family in Bangladesh.",
        category: "Quality",
      },
      {
        id: "faq-3",
        question: "How long does delivery take inside and outside Dhaka?",
        answer: "Inside Dhaka, we deliver within 24 to 48 hours. Outside Dhaka, delivery takes approximately 2 to 3 business days via our courier network.",
        category: "Delivery",
      },
      {
        id: "faq-4",
        question: "Can I pay with Cash on Delivery (COD)?",
        answer: "Yes! We offer full Cash on Delivery nationwide. You can inspect your package when it arrives and pay cash to the delivery rider.",
        category: "Payment",
      },
      {
        id: "faq-5",
        question: "What if I receive a damaged or spoiled fruit?",
        answer: "We offer a 24-hour freshness guarantee! Simply message us on WhatsApp at 01834498477 with a photo of the affected item, and we will send you a free replacement or instant refund.",
        category: "Returns",
      },
      {
        id: "faq-6",
        question: "How can I track my placed order?",
        answer: "You can track your order anytime by visiting our 'Track Order' page on our website and entering your Phone Number or Order ID.",
        category: "Orders",
      },
      {
        id: "faq-7",
        question: "Do you take bulk or corporate gift orders?",
        answer: "Yes, we provide corporate fruit baskets, seasonal gift packaging, and bulk wholesale rates for companies and events. WhatsApp us at 01834498477 for custom pricing.",
        category: "Orders",
      },
    ],
  },
};

const PAGES_STORAGE_KEY = "dream_custom_pages_data";

/**
 * Get stored pages data synchronously from localStorage (client) or defaults
 */
export function getStoredPages(): Record<string, CustomPageData> {
  if (typeof window === "undefined") return defaultPagesData;
  try {
    const raw = localStorage.getItem(PAGES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge defaults with stored values so new pages/fields are always present
      const merged: Record<string, CustomPageData> = { ...defaultPagesData };
      for (const key of Object.keys(defaultPagesData)) {
        if (parsed[key]) {
          merged[key] = {
            ...defaultPagesData[key],
            ...parsed[key],
            sections: Array.isArray(parsed[key].sections)
              ? parsed[key].sections
              : defaultPagesData[key].sections,
            faqs: Array.isArray(parsed[key].faqs)
              ? parsed[key].faqs
              : defaultPagesData[key].faqs,
            blogPosts: Array.isArray(parsed[key].blogPosts)
              ? parsed[key].blogPosts
              : defaultPagesData[key].blogPosts,
          };
        }
      }
      return merged;
    }
  } catch (err) {
    console.error("Failed to read custom pages from localStorage:", err);
  }
  return defaultPagesData;
}

/**
 * Get a specific page by slug
 */
export function getPageContent(slug: string): CustomPageData {
  const normalized = (slug || "").toLowerCase().trim();
  const all = getStoredPages();
  return all[normalized] || defaultPagesData[normalized] || {
    slug: normalized,
    title: normalized.toUpperCase(),
    subtitle: "",
    content: "",
    sections: [],
  };
}

/**
 * Save all custom pages to Supabase and localStorage
 */
export async function saveAllPages(
  pagesData: Record<string, CustomPageData>
): Promise<{ success: boolean; syncedWithDb: boolean }> {
  let syncedWithDb = false;

  // 1. Save to local storage for zero latency
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pagesData));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(
        new CustomEvent("dream_pages_updated", { detail: pagesData })
      );
    } catch (err) {
      console.error("Failed to write custom pages to localStorage:", err);
    }
  }

  // 2. Try Supabase store_settings table
  try {
    const { error } = await supabase.from("store_settings").upsert({
      id: "site_pages",
      settings: pagesData,
      updated_at: new Date().toISOString(),
    });
    if (!error) {
      syncedWithDb = true;
    }
  } catch (err) {
    // try fallback below
  }

  // 3. Guarantee database persistence via banners table
  try {
    const { error: bErr } = await supabase.from("banners").upsert([
      {
        id: "sys_site_pages",
        slot: "system_pages",
        title: "Dream Mart Pages Content",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100",
        link: JSON.stringify(pagesData),
        badge: "pages_cms",
        is_active: false,
        sort_order: 9998,
      },
    ]);
    if (!bErr) {
      syncedWithDb = true;
    }
  } catch (err) {
    console.warn("Pages database persistence note:", err);
  }

  return { success: true, syncedWithDb };
}

/**
 * Save a single page content by slug
 */
export async function saveSinglePage(
  slug: string,
  pageData: CustomPageData
): Promise<{ success: boolean; syncedWithDb: boolean }> {
  const current = getStoredPages();
  const updated = {
    ...current,
    [slug]: pageData,
  };
  return saveAllPages(updated);
}

/**
 * Fetch latest custom pages data from Supabase database
 */
export async function fetchCustomPages(): Promise<Record<string, CustomPageData>> {
  const local = getStoredPages();

  // 1. Try store_settings table
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("settings")
      .eq("id", "site_pages")
      .maybeSingle();

    if (!error && data?.settings) {
      const dbPages = data.settings as Record<string, CustomPageData>;
      const merged: Record<string, CustomPageData> = { ...defaultPagesData };
      for (const key of Object.keys(defaultPagesData)) {
        if (dbPages[key]) {
          merged[key] = {
            ...defaultPagesData[key],
            ...dbPages[key],
            sections: Array.isArray(dbPages[key].sections)
              ? dbPages[key].sections
              : defaultPagesData[key].sections,
            faqs: Array.isArray(dbPages[key].faqs)
              ? dbPages[key].faqs
              : defaultPagesData[key].faqs,
            blogPosts: Array.isArray(dbPages[key].blogPosts)
              ? dbPages[key].blogPosts
              : defaultPagesData[key].blogPosts,
          };
        }
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch (err) {
    // try banners fallback below
  }

  // 2. Try banners fallback table
  try {
    const { data: bData, error: bErr } = await supabase
      .from("banners")
      .select("link")
      .eq("id", "sys_site_pages")
      .maybeSingle();

    if (!bErr && bData?.link) {
      const parsed = JSON.parse(bData.link) as Record<string, CustomPageData>;
      const merged: Record<string, CustomPageData> = { ...defaultPagesData };
      for (const key of Object.keys(defaultPagesData)) {
        if (parsed[key]) {
          merged[key] = {
            ...defaultPagesData[key],
            ...parsed[key],
            sections: Array.isArray(parsed[key].sections)
              ? parsed[key].sections
              : defaultPagesData[key].sections,
            faqs: Array.isArray(parsed[key].faqs)
              ? parsed[key].faqs
              : defaultPagesData[key].faqs,
            blogPosts: Array.isArray(parsed[key].blogPosts)
              ? parsed[key].blogPosts
              : defaultPagesData[key].blogPosts,
          };
        }
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch (err) {
    // use local fallback
  }

  return local;
}
