import Header from "./components/Header";
import HeroBanners from "./components/HeroBanners";
import TopCategories from "./components/TopCategories";
import FeaturedProducts from "./components/FeaturedProducts";
import AllProducts from "./components/AllProducts";
import FeaturesBanner from "./components/FeaturesBanner";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800">
      {/* Header section with brand logo, search bar, navigation bar */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 w-full">
        {/* Cover Image & 2 Side Stacked Banners */}
        <HeroBanners />

        {/* Top Categories Slider Section */}
        <TopCategories />

        {/* Category Specific Products (Mango, Lichi, Dates) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedProducts />
        </div>

        {/* All Products 5-column Grid Section */}
        <AllProducts />
      </main>

      {/* Features Banner (before footer) */}
      <FeaturesBanner />

      {/* Footer */}
      <Footer />
    </div>
  );
}

