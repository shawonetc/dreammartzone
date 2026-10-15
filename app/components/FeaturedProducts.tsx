"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Flame } from "lucide-react";
import ProductCard from "./ProductCard";
import { supabase } from "../lib/supabaseClient";
import { ProductItem, getAllStoredProducts } from "../data/products";

interface PopularCategorySectionProps {
  initialProducts?: ProductItem[];
}

export default function PopularCategorySection({ initialProducts = [] }: PopularCategorySectionProps) {
  const [allProducts, setAllProducts] = useState<ProductItem[]>(() => {
    if (initialProducts && initialProducts.length > 0) return initialProducts;
    return getAllStoredProducts();
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>(() => {
    const list = initialProducts && initialProducts.length > 0 ? initialProducts : getAllStoredProducts();
    const uniqueCats = Array.from(
      new Set(
        list
          .map((p) => p.category?.trim())
          .filter((cat): cat is string => Boolean(cat && cat.length > 0))
      )
    );
    return ["All", ...uniqueCats];
  });

  useEffect(() => {
    // Only re-fetch if initialProducts were not provided by the server
    if (!initialProducts || initialProducts.length === 0) {
      fetchProducts();
    }
  }, [initialProducts]);

  const fetchProducts = async () => {
    const localStored = getAllStoredProducts();
    let combined = [...localStored];

    try {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data && data.length > 0) {
        data.forEach((p: any) => {
          if (!combined.some((item) => String(item.id) === String(p.id))) {
            combined.push(p);
          }
        });
      }
    } catch (err) {
      console.warn("Popular Category products fetch note:", err);
    }

    setAllProducts(combined);

    // Extract unique categories, prioritizing Mango, Dates, Lichi, Honey, etc.
    const uniqueCats = Array.from(
      new Set(
        combined
          .map((p) => p.category?.trim())
          .filter((cat): cat is string => Boolean(cat && cat.length > 0))
      )
    );

    // Sort to place popular ones first
    const popularOrder = ["mango", "dates", "lichi", "honey", "oil & ghee", "spices", "mustard oil", "pickle"];
    uniqueCats.sort((a, b) => {
      const idxA = popularOrder.indexOf(a.toLowerCase());
      const idxB = popularOrder.indexOf(b.toLowerCase());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    setCategories(["All", ...uniqueCats]);
  };

  // Filter products based on selected tab
  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory === "All") {
      const cat = product.category?.toLowerCase() || "";
      return ["mango", "dates", "lichi", "honey", "oil & ghee"].some(c => cat.includes(c)) || true;
    }
    return product.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Limit display to maximum 4 featured products as requested
  const displayedProducts = filteredProducts.slice(0, 4);

  return (
    <section className="w-full py-4 sm:py-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-[#4E1C80] flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#ea9219]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  Popular Category
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                  জনপ্রিয় পণ্যসমূহ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                আম, খেজুর, লিচু ও অন্যান্য জনপ্রিয় ক্যাটাগরির সেরা পণ্যসমূহ
              </p>
            </div>
          </div>

          {/* View All Link */}
          <Link
            href={selectedCategory !== "All" ? `/category/${encodeURIComponent(selectedCategory)}` : "/shop"}
            className="self-start md:self-center text-xs sm:text-sm font-bold text-[#4E1C80] hover:text-[#ea9219] transition-colors flex items-center gap-1 group shrink-0"
          >
            <span>View All {selectedCategory !== "All" ? selectedCategory : "Products"}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.slice(0, 7).map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#4E1C80] text-white shadow-sm scale-[1.02]"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-700"
                }`}
              >
                {cat === "All" ? "🔥 All Popular" : cat}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-slate-500 text-sm font-medium">
              এই ক্যাটাগরিতে এখনো কোনো পণ্য যোগ করা হয়নি।
            </p>
            <Link
              href="/shop"
              className="mt-3 inline-block text-xs font-bold text-[#4E1C80] hover:underline"
            >
              সকল পণ্য ব্রাউজ করুন →
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
