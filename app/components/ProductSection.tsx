"use client";

import React from "react";
import ProductCard, { ProductItem } from "./ProductCard";

interface ProductSectionProps {
  title: string;
  products: ProductItem[];
}

export default function ProductSection({ title, products }: ProductSectionProps) {
  return (
    <section className="w-full py-4">
      <div className="bg-white border border-slate-200/70 rounded-2xl p-4 sm:p-6 shadow-2xs">
        {/* Category Header with Vertical Bar Accent */}
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <div className="w-1 h-5 sm:h-6 bg-slate-900 rounded-full"></div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
