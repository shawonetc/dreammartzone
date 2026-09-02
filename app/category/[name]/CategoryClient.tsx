"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import FeaturesBanner from "../../components/FeaturesBanner";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { getCustomUserProducts, ProductItem } from "../../data/products";
import { supabase } from "../../lib/supabaseClient";
import { ShoppingBag } from "lucide-react";

export default function CategoryClient() {
  const params = useParams();
  const rawCategoryName = params?.name as string;
  const decodedCategory = rawCategoryName ? decodeURIComponent(rawCategoryName) : "";

  const [products, setProducts] = React.useState<ProductItem[]>([]);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const local = getCustomUserProducts();
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data && data.length > 0) {
        const merged = [...data];
        local.forEach((lp) => {
          if (!merged.some((p) => String(p.id) === String(lp.id))) {
            merged.unshift(lp);
          }
        });
        setProducts(merged);
      } else {
        setProducts(local);
      }
    } catch (err) {
      setProducts(local);
    }
  };

  // Normalize category name comparison (e.g., matching "Dates (আজওয়া)" with "Dates")
  const getCleanCategoryKey = (catStr: string) => {
    if (!catStr) return "";
    return catStr.split("(")[0].trim().toLowerCase();
  };

  const targetKey = getCleanCategoryKey(decodedCategory);

  // Filter products belonging to this category
  const filteredProducts = products.filter((product) => {
    const productKey = getCleanCategoryKey(product.category || "");
    return productKey === targetKey || product.category?.toLowerCase().includes(targetKey);
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F7] text-slate-800">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{decodedCategory}</span>
        </nav>

        {/* Category Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 mb-8">
          <ShoppingBag className="w-6 h-6 stroke-[2.2] text-slate-900" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight capitalize">
            {decodedCategory} Products
          </h1>
        </div>

        {/* Products Grid or Empty Message */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center max-w-md mx-auto shadow-2xs">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Products Found</h2>
            <p className="text-slate-500 text-sm mb-6">
              Currently there are no products available in the "{decodedCategory}" category. Please check back later!
            </p>
            <Link
              href="/"
              className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-sm hover:bg-emerald-800 transition-colors inline-block"
            >
              Go Back Home
            </Link>
          </div>
        )}
      </main>

      <FeaturesBanner />
      <Footer />
    </div>
  );
}
