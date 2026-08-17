"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import FeaturesBanner from "../components/FeaturesBanner";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { allCombinedProducts } from "../data/products";
import { ShoppingBag, Grid, ListFilter } from "lucide-react";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories list
  const categoriesList = ["All", ...Array.from(new Set(allCombinedProducts.map((p) => p.category)))];

  // Filter products by selected category
  const filteredProducts = selectedCategory === "All"
    ? allCombinedProducts
    : allCombinedProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Shop / All Products</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 mb-8">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 stroke-[2.2] text-slate-900" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              All Shop Products ({filteredProducts.length})
            </h1>
          </div>

          {/* Quick Stats */}
          <div className="text-xs sm:text-sm text-slate-500 font-semibold bg-white border border-slate-100 rounded-xl px-4 py-2 w-fit shadow-2xs">
            Showing {selectedCategory} items
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Category Filters (cols 3) */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <ListFilter className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Filter by Category</h2>
            </div>
            
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Right Side: Products Grid (cols 9) */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center shadow-2xs">
                <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
                <p className="text-slate-500 text-sm">We couldn't find any products in this filter.</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <FeaturesBanner />
      <Footer />
    </div>
  );
}
