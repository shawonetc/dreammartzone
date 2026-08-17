export interface ProductItem {
  id: string;
  name: string;
  price: string | number;
  originalPrice?: string | number;
  image: string;
  category: string;
  brand?: string;
  shortDescription?: string;
  longDescription?: string;
  highlights?: string[];
  images?: string[];
}

export const mangoProducts: ProductItem[] = [
  {
    id: "mango-1",
    name: "terbeka mango from bongo",
    price: "200",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&auto=format&fit=crop",
    category: "Mango",
    brand: "Unknown",
    shortDescription: "বঙ্গের সেরা টেরবেকা আম, আপনার রুচির জন্য একটি অনন্য উপহার",
    longDescription: "টেরবেকা ম্যাঙ্গো হলো বঙ্গের একটি অনন্য ফল। এটির স্বাদ অত্যন্ত মিষ্টি এবং সুস্বাদু। সরাসরি বাগান থেকে সংগৃহীত করে আপনাদের জন্য আনা হয়েছে।",
    highlights: [
      "টেরবেকা ম্যাঙ্গো সম্পূর্ণভাবে প্রাকৃতিক ও রাসায়নিকমুক্ত",
      "এটির রং হলো সোনালি হলুদ এবং অত্যন্ত রসালো",
      "প্রতিটি আমের আকার বড় ও আকর্ষণীয়"
    ],
    images: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=600&auto=format&fit=crop"
    ]
  },
  {
    id: "mango-2",
    name: "Rupali mango from Rajshahi",
    price: "110",
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&auto=format&fit=crop",
    category: "Mango",
    brand: "Rajshahi Mangoes",
    shortDescription: "রাজশাহীর বিখ্যাত রুপালি আম, মিষ্টি ও সুস্বাদু স্বাদের নিশ্চয়তা।",
    longDescription: "রুপালি আম রাজশাহীর বাগান থেকে সরাসরি অত্যন্ত যত্ন সহকারে সংগ্রহ করা হয়। এটি খেতে মিষ্টি এবং আঁশহীন।",
    highlights: [
      "১০০% আঁশহীন ও অত্যন্ত সুস্বাদু",
      "সরাসরি রাজশাহীর বাগান থেকে সংগৃহীত",
      "প্রাকৃতিক উপায়ে পাকানো"
    ],
    images: [
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=600&auto=format&fit=crop"
    ]
  },
  {
    id: "mango-3",
    name: "Langra Mango Premium Organic",
    price: "180",
    originalPrice: "210",
    image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400&auto=format&fit=crop",
    category: "Mango",
    brand: "Organic Fruits",
    shortDescription: "প্রিমিয়াম ল্যাংড়া আম, অতুলনীয় সুবাস ও অত্যন্ত মিষ্টি স্বাদের রাজকীয় ফল।",
    longDescription: "ল্যাংড়া আম তার চমৎকার সুবাস এবং অনন্য স্বাদের জন্য পরিচিত। এটি আমাদের নিজস্ব প্রিমিয়াম তালিকার অন্যতম সেরা আম।",
    highlights: [
      "অতুলনীয় রাজকীয় সুবাস ও মিষ্টি স্বাদ",
      "সম্পূর্ণ অর্গানিক উপায়ে উৎপাদিত ও সংরক্ষিত",
      "ফরমালিন মুক্ত ও স্বাস্থ্যসম্মত"
    ],
    images: [
      "https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=600&auto=format&fit=crop"
    ]
  },
  {
    id: "mango-4",
    name: "Himsagar Mango Fresh Garden",
    price: "220",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&auto=format&fit=crop",
    category: "Mango",
    brand: "Fresh Garden",
    shortDescription: "তাজা হিমসাগর আম, কোনো আঁশ নেই এবং অত্যন্ত আকর্ষণীয় স্বাদ।",
    longDescription: "হিমসাগর আমের কদর দেশজুড়ে। কোনো আঁশ ছাড়াই চামড়া পাতলা এবং মাংসল অংশ বেশি থাকায় এটি ভোজনরসিকদের প্রথম পছন্দ।",
    highlights: [
      "আঁশবিহীন ও পাতলা খোসাযুক্ত আম",
      "অত্যন্ত পুষ্টিকর ও মিষ্টি গন্ধযুক্ত",
      "রাসায়নিক মুক্ত তাজা ফল"
    ],
    images: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop"
    ]
  }
];

export const lichiProducts: ProductItem[] = [
  {
    id: "lichi-1",
    name: "Dinajpur Bombay Lichi (100 Pcs)",
    price: "750",
    originalPrice: "850",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp",
    category: "Lichi",
    brand: "Dinajpur Special",
    shortDescription: "দিনাজপুরের বিখ্যাত বোম্বাই লিচু (১০০ পিস)। তাজা ও মিষ্টি লাল টকটকে লিচু।",
    longDescription: "দিনাজপুরের ঐতিহ্যবাহী বোম্বাই লিচু তার বড় আকার ও মিষ্টি রসের জন্য বিখ্যাত। বাগান থেকে সরাসরি সংগ্রহ করে দ্রুত ডেলিভারি নিশ্চিত করা হয়।",
    highlights: [
      "১০০ টি তাজা ও বাছাইকৃত বোম্বাই লিচু",
      "মিষ্টি এবং রসালো লাল টকটকে খোসা",
      "বাগান থেকে সরাসরি তাজা ডেলিভারি"
    ],
    images: [
      "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp"
    ]
  },
  {
    id: "lichi-2",
    name: "China-3 Premium Sweet Lichi",
    price: "850",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297098577cb3.66054740.webp",
    category: "Lichi",
    brand: "Premium Fruits",
    shortDescription: "প্রিমিয়াম চায়না-৩ লিচু। অত্যন্ত ছোট আঁটি এবং প্রচুর রসালো অংশযুক্ত।",
    longDescription: "চায়না-৩ জাতের লিচু সবচেয়ে উন্নত জাতের অন্যতম। এর আঁটি খুবই ছোট হয় এবং রসালো অংশ অনেক বেশি থাকে, যার স্বাদ অনন্য।",
    highlights: [
      "অত্যন্ত ছোট আঁটি ও বেশি মাংসল অংশ",
      "অসাধারণ মিষ্টি ও সুস্বাদু স্বাদ",
      "প্যাকেজিংয়ে সর্বোচ্চ সতর্কতা অবলম্বন"
    ],
    images: [
      "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297098577cb3.66054740.webp"
    ]
  },
  {
    id: "lichi-3",
    name: "Madrazi Fresh Garden Lichi",
    price: "650",
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=400&auto=format&fit=crop",
    category: "Lichi",
    brand: "Fresh Garden",
    shortDescription: "তাজা মাদ্রাজি লিচু, দারুণ মিষ্টি স্বাদ ও চোখ জুড়ানো লাল রং।",
    longDescription: "মাদ্রাজি জাতের লিচু মৌসুমের শুরুতে পাকে এবং এর সুমিষ্ট স্বাদ সবার মন কাড়ে।",
    highlights: [
      "মৌসুমের প্রথম তাজা লিচু",
      "মিষ্টি ও রসালো স্বাদযুক্ত",
      "১০০% কেমিক্যাল মুক্ত ফল"
    ],
    images: [
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=600&auto=format&fit=crop"
    ]
  },
  {
    id: "lichi-4",
    name: "Deshi Organic Sweet Lichi",
    price: "550",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp",
    category: "Lichi",
    brand: "Organic",
    shortDescription: "দেশি অর্গানিক মিষ্টি লিচু। সম্পূর্ণ প্রাকৃতিক সার ব্যবহারে উৎপাদিত।",
    longDescription: "কোন প্রকার কীটনাশক ছাড়া সম্পূর্ণ দেশীয় ও অর্গানিক উপায়ে উৎপাদিত লিচু। এটি আপনার পরিবারের সবার স্বাস্থ্যের জন্য নিরাপদ।",
    highlights: [
      "১০০% প্রাকৃতিক ও রাসায়নিক মুক্ত",
      "পরিবারের জন্য সম্পূর্ণ নিরাপদ ও পুষ্টিকর",
      "বাজেট ফ্রেন্ডলি ও তাজা"
    ],
    images: [
      "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp"
    ]
  }
];

export const datesProducts: ProductItem[] = [
  {
    id: "dates-1",
    name: "Medjool Dates Premium (1 Kg)",
    price: "1,200",
    originalPrice: "1,400",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp",
    category: "Dates",
    brand: "Premium Imported",
    shortDescription: "প্রিমিয়াম মেদজুল খেজুর (১ কেজি)। বড় ও নরম মিষ্টি খেজুরের রাজা।",
    longDescription: "মেদজুল খেজুরকে বলা হয় খেজুরের রাজা। এর মিষ্টি ও চুইং টেক্সচার মুখে দিলেই গলে যায়। এটি এনার্জির অন্যতম বড় প্রাকৃতিক উৎস।",
    highlights: [
      "বড় সাইজের অত্যন্ত নরম ও প্রিমিয়াম মেদজুল",
      "প্রাকৃতিক মিষ্টি ও এনার্জিতে ভরপুর",
      "১ কেজি ওজনের চমৎকার প্যাক"
    ],
    images: [
      "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp"
    ]
  },
  {
    id: "dates-2",
    name: "Ajwa VIP Fresh Madina Dates",
    price: "1,500",
    image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=400&auto=format&fit=crop",
    category: "Dates",
    brand: "Madina Al-Munawwarah",
    shortDescription: "মদিনার তাজা আজওয়া ভিআইপি খেজুর। অসাধারণ পুষ্টিগুণ সমৃদ্ধ কালো মখমলি টেক্সচার।",
    longDescription: "পবিত্র মদিনার বিখ্যাত আজওয়া খেজুর যা এর ওষধি ও পুষ্টিগুণের জন্য বিশ্বজুড়ে সুপরিচিত। কালো রঙের এই খেজুরটি নিয়মিত খেলে শরীর সুস্থ থাকে।",
    highlights: [
      "মদিনা শরিফ থেকে আমদানিকৃত প্রিমিয়াম গ্রেড",
      "অসাধারণ পুষ্টিগুণ সম্পন্ন কালো নরম খেজুর",
      "ডায়াবেটিস রোগীদের জন্যও বেশ উপযোগী"
    ],
    images: [
      "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=600&auto=format&fit=crop"
    ]
  },
  {
    id: "dates-3",
    name: "Mariami Organic Dates Premium",
    price: "950",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp",
    category: "Dates",
    brand: "Mariami Premium",
    shortDescription: "মিষ্টি ও সুস্বাদু মরিয়ম খেজুর। অসাধারণ স্বাদ ও প্রিমিয়াম মানের নিশ্চয়তা।",
    longDescription: "মরিয়ম খেজুর বেশ জনপ্রিয় ও পুষ্টিগুণে অনন্য। এর স্বাদ ও টেক্সচার খেজুর প্রেমীদের খুবই পছন্দের।",
    highlights: [
      "জনপ্রিয় ও সবার পছন্দের মরিয়ম খেজুর",
      "খুবই মিষ্টি ও ফাইবার সমৃদ্ধ",
      "স্বাস্থ্যসম্মত উপায়ে সংরক্ষিত ও প্যাকেটজাত"
    ],
    images: [
      "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp"
    ]
  },
  {
    id: "dates-4",
    name: "Sukkari Soft Natural Dates",
    price: "850",
    image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=400&auto=format&fit=crop",
    category: "Dates",
    brand: "Sukkari Saudi",
    shortDescription: "সৌদি আরবের সুক্কারী নরম খেজুর। মুখে দিলে গলে যাওয়া মিষ্টি স্বাদ।",
    longDescription: "সুক্কারী খেজুর অত্যন্ত নরম ও মিষ্টি টেক্সচারের জন্য পরিচিত। যারা বেশি নরম ও অতিরিক্ত রসালো খেজুর পছন্দ করেন তাদের জন্য সেরা।",
    highlights: [
      "সৌদি আরবের বিশেষ সুক্কারী নরম খেজুর",
      "ক্রিমি ও মুখে গলে যাওয়া মিষ্টি স্বাদ",
      "সম্পূর্ণ প্রাকৃতিক উপায়ে সংরক্ষিত"
    ],
    images: [
      "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=600&auto=format&fit=crop"
    ]
  }
];

export const allProducts: ProductItem[] = [
  {
    id: "all-1",
    name: "ঘরের মতো খাঁটি আচার | স্বাদের অনন্য অভিজ্ঞতা",
    price: "700",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80",
    category: "Pickle (আচার)",
    brand: "Home Made",
    shortDescription: "সম্পূর্ণ ঘরে তৈরি খাঁটি আচার। কোনো ধরনের কৃত্রিম প্রিজারভেটিভ নেই।",
    longDescription: "আমাদের তৈরি ঘরের খাঁটি আচার খাঁটি সরিষার তেল ও মসলার মিশ্রণে তৈরি করা হয়। এটি খাবারের রুচি বাড়ায় বহুগুণ।",
    highlights: [
      "সম্পূর্ণ ঘরে তৈরি ও শতভাগ স্বাস্থ্যসম্মত",
      "খাঁটি সরিষার তেল ও বিশেষ মসলা ব্যবহারে প্রস্তুত",
      "কোনো ক্ষতিকর রাসায়নিক বা প্রিজারভেটিভ নেই"
    ],
    images: [
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "all-2",
    name: "প্রিমিয়াম খেজুর 1KG | প্রকৃতির মিষ্টি উপহার",
    price: "1300",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp",
    category: "Dates",
    brand: "Imported Premium",
    shortDescription: "প্রিমিয়াম কোয়ালিটির খেজুর (১ কেজি)। শরীরের শক্তি যোগাতে সাহায্য করে।",
    longDescription: "সরাসরি আমদানিকৃত সেরা মানের খেজুরের ১ কেজির প্যাক। প্রতিদিন সকালে ১টি করে খেজুর খাওয়া আপনার হার্ট ও শরীরের জন্য উপকারী।",
    highlights: [
      "উন্নত মানের প্রাকৃতিক ও পুষ্টিকর খেজুর",
      "১ কেজির ফ্যামিলি ও ফ্রেশ প্যাক",
      "সহজ ও স্বাস্থ্যসম্মত সংরক্ষণ প্রণালী"
    ],
    images: [
      "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp"
    ]
  },
  {
    id: "all-3",
    name: "১০০% খাঁটি প্রাকৃতিক মধু 1KG | সরাসরি মৌচাক থেকে সংগৃহীত",
    price: "1600",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80",
    category: "Honey",
    brand: "Natural Pure",
    shortDescription: "সরাসরি মৌচাক থেকে সংগৃহীত ১০০% খাঁটি প্রাকৃতিক মধু (১ কেজি)।",
    longDescription: "কোনো প্রকার ভেজাল বা চিনি মেশানো ছাড়াই আমাদের এই মধু সরাসরি মৌচাক কেটে সংগ্রহ করা হয়। এটি অ্যান্টিঅক্সিডেন্ট ও নানা ঔষধি গুণে ভরপুর।",
    highlights: [
      "১০০% খাঁটি ও সরাসরি মৌচাক থেকে সংগৃহীত",
      "কোনো কৃত্রিম সুগার বা প্রিজারভেটিভ নেই",
      "প্রাকৃতিক রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে"
    ],
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "all-4",
    name: "খাঁটি হলুদের গুঁড়া 500 gm",
    price: "280",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
    category: "Spices",
    brand: "Organic Spices",
    shortDescription: "নিজস্ব তত্ত্বাবধানে তৈরি খাঁটি হলুদের গুঁড়া (৫০০ গ্রাম)। চমৎকার রং ও সুবাস।",
    longDescription: "সেরা মানের আস্ত হলুদ বাছাই করে ধুয়ে, শুকিয়ে এবং নিজস্ব মিলে গুঁড়া করে প্রস্তুত করা হয়েছে। খাবারে যোগ করবে খাঁটি ঐতিহ্যবাহী স্বাদ।",
    highlights: [
      "ভেজালমুক্ত ও ১০০% খাঁটি আস্ত হলুদ থেকে তৈরি",
      "আকর্ষণীয় সোনালী হলুদ রং ও চমৎকার ফ্লেভার",
      "৫০০ গ্রামের জিপ লক ফ্রেশ প্যাক"
    ],
    images: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "all-5",
    name: "খাঁটি ঘানিভাঙা সরিষার তেল 1 ltr",
    price: "600",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    category: "Oil & Ghee",
    brand: "Traditional Ghani",
    shortDescription: "কাঠের ঘানিতে ভাঙানো ১০০% খাঁটি ও ঝাঁঝালো সরিষার তেল (১ লিটার)।",
    longDescription: "অত্যন্ত যত্নে বাছাইকৃত দেশীয় সরিষার বীজ থেকে কাঠের ঘানিতে প্রাকৃতিকভাবে প্রস্তুত করা খাঁটি সরিষার তেল। এর ঝাঁঝ ও পুষ্টিগুণ অক্ষুণ্ণ থাকে।",
    highlights: [
      "কাঠের ঘানিভাঙা কোল্ড-প্রেসড খাঁটি সরিষার তেল",
      "১০০% প্রাকৃতিক ও ঝাঁঝালো স্বাদের ঐতিহ্য",
      "১ লিটারের বোতলজাত নিরাপদ প্যাক"
    ],
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "all-6",
    name: "খাঁটি সূর্যমুখী তেল 5 ltr",
    price: "1150",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    category: "Oil & Ghee",
    brand: "Heart Healthy",
    shortDescription: "প্রিমিয়াম খাঁটি সূর্যমুখী তেল (৫ লিটার)। কোলেস্টেরল মুক্ত ও লাইট রান্নার উপযোগী।",
    longDescription: "হার্টের জন্য অত্যন্ত উপকারী ও কোলেস্টেরল মুক্ত ৫ লিটারের বড় প্যাক সূর্যমুখী তেল। এটি সহজে হজমযোগ্য ও সুস্বাদু রান্নার জন্য আদর্শ।",
    highlights: [
      "কোলেস্টেরল মুক্ত ও হার্ট ফ্রেন্ডলি অয়েল",
      "ভিটামিন ই এবং প্রয়োজনীয় ফ্যাটি এসিডে ভরপুর",
      "৫ লিটারের বড় সাশ্রয়ী ফ্যামিলি প্যাক"
    ],
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "all-7",
    name: "খাঁটি রিফাইন সোয়াবিন তেল 5 ltr",
    price: "890",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    category: "Oil & Ghee",
    brand: "Daily cooking",
    shortDescription: "প্রিমিয়াম রিফাইন্ড সোয়াবিন তেল (৫ লিটার)। প্রতিদিনের রান্নার সেরা সঙ্গী।",
    longDescription: "সেরা মানের সয়াবিন থেকে প্রস্তুতকৃত খাঁটি রিফাইন তেল যা আপনার রান্নার স্বাদ বাড়ায় এবং খাবারে অতিরিক্ত তেল চিটচিটে ভাব রাখে না।",
    highlights: [
      "উন্নত মানের রিফাইন্ড সয়াবিন তেল",
      "দৈনিক রান্নার জন্য হালকা ও সুস্বাদু",
      "৫ লিটারের বোতলজাত সুরক্ষিত প্যাক"
    ],
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "all-8",
    name: "খাঁটি দেশি গাওয়া ঘি 500 gm",
    price: "1250",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    category: "Oil & Ghee",
    brand: "Gawa Pure",
    shortDescription: "তাজা ও সুগন্ধি দেশি গাওয়া ঘি (৫০০ গ্রাম)। ঐতিহ্যবাহী উপায়ে তৈরি।",
    longDescription: "গরুর দুধের খাঁটি মাখন জ্বাল দিয়ে প্রস্তুত করা সুস্বাদু গাওয়া ঘি। পোলাও, বিরিয়ানি ও যেকোনো খাবারে যোগ করবে অতুলনীয় রাজকীয় সুবাস।",
    highlights: [
      "শতভাগ খাঁটি মাখন থেকে তৈরি দেশি ঘি",
      "অসাধারণ রাজকীয় সুবাস ও দানাদার টেক্সচার",
      "৫০০ গ্রামের কাঁচের বৈয়াম/প্যাকেজিং"
    ],
    images: [
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "all-9",
    name: "প্রিমিয়াম খাঁটি গাওয়া ঘি 1 kg",
    price: "2400",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    category: "Oil & Ghee",
    brand: "Gawa Premium",
    shortDescription: "প্রিমিয়াম কোয়ালিটির খাঁটি গাওয়া ঘি (১ কেজি)। যেকোনো রেসিপিতে নিয়ে আসে রাজকীয় ফ্লেভার।",
    longDescription: "১০০% প্রিমিয়াম গরুর দুধের ক্রিম থেকে তৈরি বিশেষ দানাদার ঘি। ১ কেজির প্যাক যা আপনার উৎসবের রান্নায় এনে দেবে বিশুদ্ধ ঘ্রাণ ও অতুলনীয় স্বাদ।",
    highlights: [
      "প্রিমিয়াম দানাদার ও সুগন্ধি গাওয়া ঘি",
      "১ কেজির বড় ও সাশ্রয়ী প্যাক",
      "বিশুদ্ধতা ও পুষ্টিগুণের পূর্ণ নিশ্চয়তা"
    ],
    images: [
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "all-10",
    name: "দিনাজপুরের তাজা বোম্বে লিচু (১০-পিস)",
    price: "75",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp",
    category: "Lichi",
    brand: "Dinajpur Special",
    shortDescription: "তাজা বোম্বাই লিচু (১০ পিস)। কম মিষ্টি খেতে আগ্রহীদের জন্য দারুণ ট্রায়াল প্যাক।",
    longDescription: "দিনাজপুরের বিখ্যাত রসালো বোম্বাই লিচুর ছোট ট্রায়াল প্যাক। তাজা ও সরাসরি বাগান থেকে নিয়ে আসা হয়েছে।",
    highlights: [
      "১০ পিসের ছোট তাজা প্যাক",
      "মিষ্টি ও রসালো লালচে চমৎকার ফল",
      "কম পরিমাণ টেস্ট করার জন্য সেরা"
    ],
    images: [
      "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp"
    ]
  }
];

export const allCombinedProducts: ProductItem[] = [
  ...mangoProducts,
  ...lichiProducts,
  ...datesProducts,
  ...allProducts
];

export function getProductById(id: string): ProductItem | undefined {
  return allCombinedProducts.find((p) => p.id === id);
}
