import Header from "./components/Header";
import HeroBanners from "./components/HeroBanners";
import TopCategories from "./components/TopCategories";
import FeaturedProducts from "./components/FeaturedProducts";
import AllProducts from "./components/AllProducts";
import FeaturesBanner from "./components/FeaturesBanner";
import Footer from "./components/Footer";
import { supabase } from "./lib/supabaseClient";
import { BannerItem, defaultBanners } from "./data/banners";
import { CategoryItem, defaultCategories, ProductItem, allCombinedProducts } from "./data/products";
import { defaultSettings, fetchStoreSettings, StoreSettings } from "./data/settings";

// Ensure fresh data from Supabase on every page request / refresh
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let banners: BannerItem[] = defaultBanners;
  let categories: CategoryItem[] = defaultCategories;
  let products: ProductItem[] = allCombinedProducts;
  let settings: StoreSettings = defaultSettings;

  try {
    const [bannersRes, categoriesRes, productsRes, settingsRes] = await Promise.all([
      supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("categories")
        .select("*"),
      supabase
        .from("products")
        .select("*"),
      fetchStoreSettings(),
    ]);

    if (bannersRes.data && bannersRes.data.length > 0) {
      banners = bannersRes.data;
    }
    if (!categoriesRes.error && categoriesRes.data) {
      categories = categoriesRes.data;
    }
    if (productsRes.data && productsRes.data.length > 0) {
      products = productsRes.data;
    }
    if (settingsRes) {
      settings = settingsRes;
    }
  } catch (err) {
    console.warn("Server-side Supabase pre-fetch fallback:", err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F7] text-slate-800">
      {/* Header section with brand logo, search bar, navigation bar */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 w-full">
        {/* Cover Image & 2 Side Stacked Banners */}
        <HeroBanners initialBanners={banners} />

        {/* Top Categories Slider Section */}
        <TopCategories initialCategories={categories} />

        {/* Popular Category Showcase Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedProducts initialProducts={products} initialPopularSettings={settings.popularCategory} />
        </div>

        {/* All Products 5-column Grid Section */}
        <AllProducts initialProducts={products} />
      </main>

      {/* Features Banner (before footer) */}
      <FeaturesBanner />

      {/* Footer */}
      <Footer />
    </div>
  );
}
