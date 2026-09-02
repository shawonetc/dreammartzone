"use client";

import React, { useState, useEffect } from "react";
import ProductSection from "./ProductSection";
import { ProductItem } from "./ProductCard";
import { supabase } from "../lib/supabaseClient";
import { getCustomUserProducts } from "../data/products";

export default function FeaturedProducts() {
  const [mangoes, setMangoes] = useState<ProductItem[]>([]);
  const [lichis, setLichis] = useState<ProductItem[]>([]);
  const [dates, setDates] = useState<ProductItem[]>([]);

  useEffect(() => {
    fetchCategoryProducts();
  }, []);

  const fetchCategoryProducts = async () => {
    const customStored = getCustomUserProducts();
    let allProducts = [...customStored];

    try {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data && data.length > 0) {
        data.forEach((p: any) => {
          if (!allProducts.some((item) => String(item.id) === String(p.id))) {
            allProducts.push(p);
          }
        });
      }
    } catch (err) {
      console.log("Supabase fetch fallback");
    }

    const m = allProducts.filter((p) => p.category?.toLowerCase() === "mango");
    const l = allProducts.filter((p) => p.category?.toLowerCase() === "lichi");
    const d = allProducts.filter((p) => p.category?.toLowerCase() === "dates");

    setMangoes(m);
    setLichis(l);
    setDates(d);
  };

  if (mangoes.length === 0 && lichis.length === 0 && dates.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 py-2 sm:py-4">
      {/* Mango Section */}
      {mangoes.length > 0 && <ProductSection title="Mango" products={mangoes} />}

      {/* Lichi Section */}
      {lichis.length > 0 && <ProductSection title="Lichi" products={lichis} />}

      {/* Dates Section */}
      {dates.length > 0 && <ProductSection title="Dates" products={dates} />}
    </div>
  );
}
