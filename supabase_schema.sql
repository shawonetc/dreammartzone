-- ==============================================================================
-- DREAM MART - COMPLETE SUPABASE DATABASE SETUP SCHEMA
-- Project URL: https://lpawmxawuqrddhelcjmy.supabase.co
-- Run this entire script in Supabase Dashboard -> SQL Editor -> Click 'Run'
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLES CREATION
-- ==============================================================================

-- 2.1 Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "bnName" TEXT,
    bnname TEXT,
    image TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.2 Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    "originalPrice" TEXT,
    original_price TEXT,
    image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}'::text[],
    brand TEXT DEFAULT 'Amropali Organic',
    "shortDescription" TEXT,
    short_description TEXT,
    "longDescription" TEXT,
    long_description TEXT,
    highlights TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.3 Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    address TEXT,
    product TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    total_amount TEXT NOT NULL,
    amount TEXT,
    status TEXT DEFAULT 'Processing',
    payment_method TEXT DEFAULT 'Cash on Delivery',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.4 User Profiles Table (Synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'Customer',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.5 Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'order',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.6 Hero Banners Table
CREATE TABLE IF NOT EXISTS public.banners (
    id TEXT PRIMARY KEY,
    slot TEXT NOT NULL, -- 'main', 'side-top', 'side-bottom'
    title TEXT,
    image TEXT NOT NULL,
    link TEXT DEFAULT '/shop',
    badge TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. HELPER FUNCTIONS & TRIGGERS (Auto-sync camelCase & snake_case columns)
-- ==============================================================================

-- Sync Categories
CREATE OR REPLACE FUNCTION sync_category_fields()
RETURNS TRIGGER AS $$
BEGIN
    NEW."bnName" := COALESCE(NEW."bnName", NEW.bnname);
    NEW.bnname := COALESCE(NEW.bnname, NEW."bnName");
    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_category_fields ON public.categories;
CREATE TRIGGER trg_sync_category_fields
BEFORE INSERT OR UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION sync_category_fields();

-- Sync Products
CREATE OR REPLACE FUNCTION sync_product_fields()
RETURNS TRIGGER AS $$
BEGIN
    NEW."shortDescription" := COALESCE(NEW."shortDescription", NEW.short_description);
    NEW.short_description := COALESCE(NEW.short_description, NEW."shortDescription");
    NEW."longDescription" := COALESCE(NEW."longDescription", NEW.long_description);
    NEW.long_description := COALESCE(NEW.long_description, NEW."longDescription");
    NEW."originalPrice" := COALESCE(NEW."originalPrice", NEW.original_price);
    NEW.original_price := COALESCE(NEW.original_price, NEW."originalPrice");
    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_product_fields ON public.products;
CREATE TRIGGER trg_sync_product_fields
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION sync_product_fields();

-- Sync Orders
CREATE OR REPLACE FUNCTION sync_order_fields()
RETURNS TRIGGER AS $$
BEGIN
    NEW.amount := COALESCE(NEW.amount, NEW.total_amount);
    NEW.total_amount := COALESCE(NEW.total_amount, NEW.amount);
    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_order_fields ON public.orders;
CREATE TRIGGER trg_sync_order_fields
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION sync_order_fields();

-- Auto create profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'Customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 4. STORAGE SETUP (Bucket: product-images)
-- ==============================================================================

-- 4.1 Create public storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- 4.2 Storage RLS Policies
DROP POLICY IF EXISTS "Public Access to product-images" ON storage.objects;
CREATE POLICY "Public Access to product-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow uploads to product-images" ON storage.objects;
CREATE POLICY "Allow uploads to product-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow update in product-images" ON storage.objects;
CREATE POLICY "Allow update in product-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow delete in product-images" ON storage.objects;
CREATE POLICY "Allow delete in product-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 5.1 Categories RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all insert categories" ON public.categories;
CREATE POLICY "Allow all insert categories" ON public.categories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all update categories" ON public.categories;
CREATE POLICY "Allow all update categories" ON public.categories FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow all delete categories" ON public.categories;
CREATE POLICY "Allow all delete categories" ON public.categories FOR DELETE USING (true);

-- 5.2 Products RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read products" ON public.products;
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all insert products" ON public.products;
CREATE POLICY "Allow all insert products" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all update products" ON public.products;
CREATE POLICY "Allow all update products" ON public.products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow all delete products" ON public.products;
CREATE POLICY "Allow all delete products" ON public.products FOR DELETE USING (true);

-- 5.3 Orders RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all insert orders" ON public.orders;
CREATE POLICY "Allow all insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all update orders" ON public.orders;
CREATE POLICY "Allow all update orders" ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow all delete orders" ON public.orders;
CREATE POLICY "Allow all delete orders" ON public.orders FOR DELETE USING (true);

-- 5.4 Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users update own profile" ON public.profiles;
CREATE POLICY "Allow users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 5.5 Notifications RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read notifications" ON public.notifications;
CREATE POLICY "Allow public read notifications" ON public.notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert notifications" ON public.notifications;
CREATE POLICY "Allow insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update notifications" ON public.notifications;
CREATE POLICY "Allow update notifications" ON public.notifications FOR UPDATE USING (true);

-- 5.6 Banners RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read banners" ON public.banners;
CREATE POLICY "Allow public read banners" ON public.banners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all insert banners" ON public.banners;
CREATE POLICY "Allow all insert banners" ON public.banners FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all update banners" ON public.banners;
CREATE POLICY "Allow all update banners" ON public.banners FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow all delete banners" ON public.banners;
CREATE POLICY "Allow all delete banners" ON public.banners FOR DELETE USING (true);

-- ==============================================================================
-- 6. DEFAULT SEED DATA (Pre-populate with initial store products & categories)
-- ==============================================================================

-- 6.1 Categories Seed
INSERT INTO public.categories (id, name, "bnName", image, description)
VALUES 
    ('dates', 'Dates', 'খেজুর', 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=300&q=80', 'প্রিমিয়াম কোয়ালিটির প্রাকৃতিক খেজুর'),
    ('mango', 'Mango', 'আম', 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=300&q=80', 'বাগান থেকে সরাসরি বাছাইকৃত সুমিষ্ট আম'),
    ('lichi', 'Lichi', 'লিচু', 'https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp', 'দিনাজপুরের বিখ্যাত মিষ্টি ও রসালো বোম্বাই লিচু'),
    ('honey', 'Honey', 'মধু', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80', '১০০% খাঁটি প্রাকৃতিক পাহাড়ি ও সুন্দরবনের মধু'),
    ('ghee', 'Ghee', 'ঘি', 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=300&q=80', 'দেশি খাঁটি দানাদার গাওয়া ঘি'),
    ('spices', 'Spices', 'মসলা', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80', 'ভেজালমুক্ত নিজস্ব মিলে ভাঙানো খাঁটি মসলা'),
    ('mustard-oil', 'Mustard Oil', 'সরিষার তেল', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80', 'কাঠের ঘানিভাঙা খাঁটি সরিষার তেল'),
    ('pickle', 'Pickle', 'আচার', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=300&q=80', 'সম্পূর্ণ ঘরে তৈরি ঐতিহ্যবাহী খাঁটি আচার')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    "bnName" = EXCLUDED."bnName",
    image = EXCLUDED.image,
    description = EXCLUDED.description;

-- 6.2 Products Seed
INSERT INTO public.products (
    id, name, category, price, "originalPrice", image, images, brand, "shortDescription", "longDescription", highlights
)
VALUES
    (
        'mango-1',
        'terbeka mango from bongo',
        'Mango',
        '200',
        NULL,
        'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&auto=format&fit=crop',
        ARRAY[
            'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=600&auto=format&fit=crop'
        ],
        'Unknown',
        'বঙ্গের সেরা টেরবেকা আম, আপনার রুচির জন্য একটি অনন্য উপহার',
        'টেরবেকা ম্যাঙ্গো হলো বঙ্গের একটি অনন্য ফল। এটির স্বাদ অত্যন্ত মিষ্টি এবং সুস্বাদু। সরাসরি বাগান থেকে সংগৃহীত করে আপনাদের জন্য আনা হয়েছে।',
        ARRAY['টেরবেকা ম্যাঙ্গো সম্পূর্ণভাবে প্রাকৃতিক ও রাসায়নিকমুক্ত', 'এটির রং হলো সোনালি হলুদ এবং অত্যন্ত রসালো', 'প্রতিটি আমের আকার বড় ও আকর্ষণীয়']
    ),
    (
        'mango-2',
        'Rupali mango from Rajshahi',
        'Mango',
        '110',
        NULL,
        'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&auto=format&fit=crop',
        ARRAY['https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=600&auto=format&fit=crop'],
        'Rajshahi Mangoes',
        'রাজশাহীর বিখ্যাত রুপালি আম, মিষ্টি ও সুস্বাদু স্বাদের নিশ্চয়তা।',
        'রুপালি আম রাজশাহীর বাগান থেকে সরাসরি অত্যন্ত যত্ন সহকারে সংগ্রহ করা হয়। এটি খেতে মিষ্টি এবং আঁশহীন।',
        ARRAY['১০০% আঁশহীন ও অত্যন্ত সুস্বাদু', 'সরাসরি রাজশাহীর বাগান থেকে সংগৃহীত', 'প্রাকৃতিক উপায়ে পাকানো']
    ),
    (
        'mango-3',
        'Langra Mango Premium Organic',
        'Mango',
        '180',
        '210',
        'https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400&auto=format&fit=crop',
        ARRAY['https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=600&auto=format&fit=crop'],
        'Organic Fruits',
        'প্রিমিয়াম ল্যাংড়া আম, অতুলনীয় সুবাস ও অত্যন্ত মিষ্টি স্বাদের রাজকীয় ফল।',
        'ল্যাংড়া আম তার চমৎকার সুবাস এবং অনন্য স্বাদের জন্য পরিচিত। এটি আমাদের নিজস্ব প্রিমিয়াম তালিকার অন্যতম সেরা আম।',
        ARRAY['অতুলনীয় রাজকীয় সুবাস ও মিষ্টি স্বাদ', 'সম্পূর্ণ অর্গানিক উপায়ে উৎপাদিত ও সংরক্ষিত', 'ফরমালিন মুক্ত ও স্বাস্থ্যসম্মত']
    ),
    (
        'mango-4',
        'Himsagar Mango Fresh Garden',
        'Mango',
        '220',
        NULL,
        'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&auto=format&fit=crop',
        ARRAY['https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop'],
        'Fresh Garden',
        'তাজা হিমসাগর আম, কোনো আঁশ নেই এবং অত্যন্ত আকর্ষণীয় স্বাদ।',
        'হিমসাগর আমের কদর দেশজুড়ে। কোনো আঁশ ছাড়াই চামড়া পাতলা এবং মাংসল অংশ বেশি থাকায় এটি ভোজনরসিকদের প্রথম পছন্দ।',
        ARRAY['আঁশবিহীন ও পাতলা খোসাযুক্ত আম', 'অত্যন্ত পুষ্টিকর ও মিষ্টি গন্ধযুক্ত', 'রাসায়নিক মুক্ত তাজা ফল']
    ),
    (
        'lichi-1',
        'Dinajpur Bombay Lichi (100 Pcs)',
        'Lichi',
        '750',
        '850',
        'https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp',
        ARRAY['https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp'],
        'Dinajpur Special',
        'দিনাজপুরের বিখ্যাত বোম্বাই লিচু (১০০ পিস)। তাজা ও মিষ্টি লাল টকটকে লিচু।',
        'দিনাজপুরের ঐতিহ্যবাহী বোম্বাই লিচু তার বড় আকার ও মিষ্টি রসের জন্য বিখ্যাত। বাগান থেকে সরাসরি সংগ্রহ করে দ্রুত ডেলিভারি নিশ্চিত করা হয়।',
        ARRAY['১০০ টি তাজা ও বাছাইকৃত বোম্বাই লিচু', 'মিষ্টি এবং রসালো লাল টকটকে খোসা', 'বাগান থেকে সরাসরি তাজা ডেলিভারি']
    ),
    (
        'lichi-2',
        'China-3 Premium Sweet Lichi',
        'Lichi',
        '850',
        NULL,
        'https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297098577cb3.66054740.webp',
        ARRAY['https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297098577cb3.66054740.webp'],
        'Premium Fruits',
        'প্রিমিয়াম চায়না-৩ লিচু। অত্যন্ত ছোট আঁটি এবং প্রচুর রসালো অংশযুক্ত।',
        'চায়না-৩ জাতের লিচু সবচেয়ে উন্নত জাতের অন্যতম। এর আঁটি খুবই ছোট হয় এবং রসালো অংশ অনেক বেশি থাকে, যার স্বাদ অনন্য।',
        ARRAY['অত্যন্ত ছোট আঁটি ও বেশি মাংসল অংশ', 'অসাধারণ মিষ্টি ও সুস্বাদু স্বাদ', 'প্যাকেজিংয়ে সর্বোচ্চ সতর্কতা অবলম্বন']
    ),
    (
        'dates-1',
        'Medjool Dates Premium (1 Kg)',
        'Dates',
        '1200',
        '1400',
        'https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp',
        ARRAY['https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp'],
        'Premium Imported',
        'প্রিমিয়াম মেদজুল খেজুর (১ কেজি)। বড় ও নরম মিষ্টি খেজুরের রাজা।',
        'মেদজুল খেজুরকে বলা হয় খেজুরের রাজা। এর মিষ্টি ও চুইং টেক্সচার মুখে দিলেই গলে যায়। এটি এনার্জির অন্যতম বড় প্রাকৃতিক উৎস।',
        ARRAY['বড় সাইজের অত্যন্ত নরম ও প্রিমিয়াম মেদজুল', 'প্রাকৃতিক মিষ্টি ও এনার্জিতে ভরপুর', '১ কেজি ওজনের চমৎকার প্যাক']
    ),
    (
        'dates-2',
        'Ajwa VIP Fresh Madina Dates',
        'Dates',
        '1500',
        NULL,
        'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=400&auto=format&fit=crop',
        ARRAY['https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=600&auto=format&fit=crop'],
        'Madina Al-Munawwarah',
        'মদিনার তাজা আজওয়া ভিআইপি খেজুর। অসাধারণ পুষ্টিগুণ সমৃদ্ধ কালো মখমলি টেক্সচার।',
        'পবিত্র মদিনার বিখ্যাত আজওয়া খেজুর যা এর ওষধি ও পুষ্টিগুণের জন্য বিশ্বজুড়ে সুপরিচিত। কালো রঙের এই খেজুরটি নিয়মিত খেলে শরীর সুস্থ থাকে।',
        ARRAY['মদিনা শরিফ থেকে আমদানিকৃত প্রিমিয়াম গ্রেড', 'অসাধারণ পুষ্টিগুণ সম্পন্ন কালো নরম খেজুর', 'ডায়াবেটিস রোগীদের জন্যও বেশ উপযোগী']
    ),
    (
        'all-1',
        'ঘরের মতো খাঁটি আচার | স্বাদের অনন্য অভিজ্ঞতা',
        'Pickle (আচার)',
        '700',
        NULL,
        'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80',
        ARRAY['https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80'],
        'Home Made',
        'সম্পূর্ণ ঘরে তৈরি খাঁটি আচার। কোনো ধরনের কৃত্রিম প্রিজারভেটিভ নেই।',
        'আমাদের তৈরি ঘরের খাঁটি আচার খাঁটি সরিষার তেল ও মসলার মিশ্রণে তৈরি করা হয়। এটি খাবারের রুচি বাড়ায় বহুগুণ।',
        ARRAY['সম্পূর্ণ ঘরে তৈরি ও শতভাগ স্বাস্থ্যসম্মত', 'খাঁটি সরিষার তেল ও বিশেষ মসলা ব্যবহারে প্রস্তুত', 'কোনো ক্ষতিকর রাসায়নিক বা প্রিজারভেটিভ নেই']
    ),
    (
        'all-3',
        '১০০% খাঁটি প্রাকৃতিক মধু 1KG | সরাসরি মৌচাক থেকে সংগৃহীত',
        'Honey',
        '1600',
        NULL,
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
        ARRAY['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80'],
        'Natural Pure',
        'সরাসরি মৌচাক থেকে সংগৃহীত ১০০% খাঁটি প্রাকৃতিক মধু (১ কেজি)।',
        'কোনো প্রকার ভেজাল বা চিনি মেশানো ছাড়াই আমাদের এই মধু সরাসরি মৌচাক কেটে সংগ্রহ করা হয়। এটি অ্যান্টিঅক্সিডেন্ট ও নানা ঔষধি গুণে ভরপুর।',
        ARRAY['১০০% খাঁটি ও সরাসরি মৌচাক থেকে সংগৃহীত', 'কোনো কৃত্রিম সুগার বা প্রিজারভেটিভ নেই', 'প্রাকৃতিক রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে']
    ),
    (
        'all-5',
        'খাঁটি ঘানিভাঙা সরিষার তেল 1 ltr',
        'Oil & Ghee',
        '600',
        NULL,
        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
        ARRAY['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'],
        'Traditional Ghani',
        'কাঠের ঘানিতে ভাঙানো ১০০% খাঁটি ও ঝাঁঝালো সরিষার তেল (১ লিটার)।',
        'অত্যন্ত যত্নে বাছাইকৃত দেশীয় সরিষার বীজ থেকে কাঠের ঘানিতে প্রাকৃতিকভাবে প্রস্তুত করা খাঁটি সরিষার তেল। এর ঝাঁঝ ও পুষ্টিগুণ অক্ষুণ্ণ থাকে।',
        ARRAY['কাঠের ঘানিভাঙা কোল্ড-প্রেসড খাঁটি সরিষার তেল', '১০০% প্রাকৃতিক ও ঝাঁঝালো স্বাদের ঐতিহ্য', '১ লিটারের বোতলজাত নিরাপদ প্যাক']
    ),
    (
        'all-8',
        'খাঁটি দেশি গাওয়া ঘি 500 gm',
        'Oil & Ghee',
        '1250',
        NULL,
        'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
        ARRAY['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80'],
        'Gawa Pure',
        'তাজা ও সুগন্ধি দেশি গাওয়া ঘি (৫০০ গ্রাম)। ঐতিহ্যবাহী উপায়ে তৈরি।',
        'গরুর দুধের খাঁটি মাখন জ্বাল দিয়ে প্রস্তুত করা সুস্বাদু গাওয়া ঘি। পোলাও, বিরিয়ানি ও যেকোনো খাবারে যোগ করবে অতুলনীয় রাজকীয় সুবাস।',
        ARRAY['শতভাগ খাঁটি মাখন থেকে তৈরি দেশি ঘি', 'অসাধারণ রাজকীয় সুবাস ও দানাদার টেক্সচার', '৫০০ গ্রামের কাঁচের বৈয়াম/প্যাকেজিং']
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    "originalPrice" = EXCLUDED."originalPrice",
    image = EXCLUDED.image,
    images = EXCLUDED.images,
    brand = EXCLUDED.brand,
    "shortDescription" = EXCLUDED."shortDescription",
    "longDescription" = EXCLUDED."longDescription",
    highlights = EXCLUDED.highlights;

-- 6.3 Orders Seed (Sample Orders for Admin Panel)
INSERT INTO public.orders (id, customer_name, customer_phone, address, product, total_amount, status, payment_method, notes)
VALUES
    ('ORD-33', 'Jahirul Islam khan', '01700000000', 'Mirpur 10, Dhaka', 'Waterproof Bedsheet', '1150', 'Delivered', 'Cash on Delivery', 'Please deliver after 5 PM'),
    ('ORD-32', 'তানভীর আহমেদ', '01811112233', 'Rajshahi Sadar', 'মেদজুল খেজুর (১ কেজি) × ২', '2400', 'Processing', 'bKash', 'Priority packing requested'),
    ('ORD-31', 'সাদিয়া আরফিন', '01922334455', 'Chittagong GEC', 'দিনাজপুরের বোম্বাই লিচু (১০০ পিস)', '750', 'Shipped', 'Nagad', 'Call before arrival')
ON CONFLICT (id) DO NOTHING;

-- 6.4 Hero Banners Seed
INSERT INTO public.banners (id, slot, title, image, link, badge, sort_order, is_active)
VALUES
    (
        'main-1',
        'main',
        'বাগানের সেরা আম্রপালি',
        'https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp',
        '/category/Mango',
        'মিষ্টি-রসালো স্বাদের অনন্য',
        1,
        true
    ),
    (
        'side-top-1',
        'side-top',
        'প্রকৃতির মিষ্টিতায় ভরপুর খেজুর',
        'https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp',
        '/category/Dates',
        'স্বাদে খাঁটি, গুণে ভরপুর',
        1,
        true
    ),
    (
        'side-bottom-1',
        'side-bottom',
        'লিচুর সেরা স্বাদ অনলাইনে',
        'https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297098577cb3.66054740.webp',
        '/category/Lichi',
        'মিষ্টি-রসালো স্বাদের অনন্য',
        1,
        true
    )
ON CONFLICT (id) DO UPDATE SET
    slot = EXCLUDED.slot,
    title = EXCLUDED.title,
    image = EXCLUDED.image,
    link = EXCLUDED.link,
    badge = EXCLUDED.badge,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

-- ==============================================================================
-- SETUP COMPLETE!
-- Your Supabase database is ready for Dream Mart ecommerce frontend & admin panel.
-- ==============================================================================
