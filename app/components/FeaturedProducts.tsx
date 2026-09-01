"use client";

import React, { useState, useEffect } from "react";
import ProductSection from "./ProductSection";
import { ProductItem } from "./ProductCard";
import { supabase } from "../lib/supabaseClient";
import { mangoProducts as fallbackMango, lichiProducts as fallbackLichi, datesProducts as fallbackDates } from "../data/products";

export default function FeaturedProducts() {
  const [mangoes, setMangoes] = useState<ProductItem[]>(fallbackMango);
  const [lichis, setLichis] = useState<ProductItem[]>(fallbackLichi);
  const [dates, setDates] = useState<ProductItem[]>(fallbackDates);

  useEffect(() => {
    fetchCategoryProducts();
  }, []);

  const fetchCategoryProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data && data.length > 0) {
        // Group fetched Supabase products by category
        const m = data.filter((p: any) => p.category === "Mango");
        const l = data.filter((p: any) => p.category === "Lichi");
        const d = data.filter((p: any) => p.category === "Dates");

        if (m.length > 0) setMangoes(m);
        if (l.length > 0) setLichis(l);
        if (d.length > 0) setDates(d);
      }
    } catch (err) {
      console.log("Supabase fetch fallback to local data");
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 py-2 sm:py-4">
      {/* Mango Section */}
      <ProductSection title="Mango" products={mangoes} />

      {/* Lichi Section */}
      <ProductSection title="Lichi" products={lichis} />

      {/* Dates Section */}
      <ProductSection title="Dates" products={dates} />
    </div>
  );
}
