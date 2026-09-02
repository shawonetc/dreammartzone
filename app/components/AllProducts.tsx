"use client";

import React, { useState, useEffect } from "react";
import ProductCard, { ProductItem } from "./ProductCard";
import { ShoppingCart } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { getAllStoredProducts } from "../data/products";

export default function AllProducts() {
  const [productList, setProductList] = useState<ProductItem[]>([]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    const localStored = getAllStoredProducts();

    try {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data && data.length > 0) {
        // Merge Supabase products with local stored custom products
        const merged = [...data];
        localStored.forEach((lp) => {
          if (!merged.some((p) => String(p.id) === String(lp.id))) {
            merged.unshift(lp);
          }
        });
        setProductList(merged);
      } else {
        setProductList(localStored);
      }
    } catch (err) {
      setProductList(localStored);
    }
  };

  return (
    <section className="w-full py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Shopping Cart Icon */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80 mb-6">
          <ShoppingCart className="w-6 h-6 stroke-[2.2] text-slate-900" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            All Products
          </h2>
        </div>

        {/* 5 Column Grid on Desktop */}
        {productList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {productList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center max-w-md mx-auto">
            <p className="text-slate-500 font-medium text-sm">কোনো প্রোডাক্ট যোগ করা হয়নি। অ্যাডমিন প্যানেল থেকে প্রোডাক্ট এড করুন।</p>
          </div>
        )}
      </div>
    </section>
  );
}
