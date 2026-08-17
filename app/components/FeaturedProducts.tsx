"use client";

import React from "react";
import ProductSection from "./ProductSection";
import { ProductItem } from "./ProductCard";

const mangoProducts: ProductItem[] = [
  {
    id: "mango-1",
    name: "terbeka mango from bongo",
    price: "200",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "mango-2",
    name: "Rupali mango from Rajshahi",
    price: "110",
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "mango-3",
    name: "Langra Mango Premium Organic",
    price: "180",
    originalPrice: "210",
    image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "mango-4",
    name: "Himsagar Mango Fresh Garden",
    price: "220",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&auto=format&fit=crop",
  },
];

const lichiProducts: ProductItem[] = [
  {
    id: "lichi-1",
    name: "Dinajpur Bombay Lichi (100 Pcs)",
    price: "750",
    originalPrice: "850",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp",
  },
  {
    id: "lichi-2",
    name: "China-3 Premium Sweet Lichi",
    price: "850",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297098577cb3.66054740.webp",
  },
  {
    id: "lichi-3",
    name: "Madrazi Fresh Garden Lichi",
    price: "650",
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "lichi-4",
    name: "Deshi Organic Sweet Lichi",
    price: "550",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp",
  },
];

const datesProducts: ProductItem[] = [
  {
    id: "dates-1",
    name: "Medjool Dates Premium (1 Kg)",
    price: "1,200",
    originalPrice: "1,400",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp",
  },
  {
    id: "dates-2",
    name: "Ajwa VIP Fresh Madina Dates",
    price: "1,500",
    image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "dates-3",
    name: "Mariami Organic Dates Premium",
    price: "950",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp",
  },
  {
    id: "dates-4",
    name: "Sukkari Soft Natural Dates",
    price: "850",
    image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=400&auto=format&fit=crop",
  },
];

export default function FeaturedProducts() {
  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 py-2 sm:py-4">
      {/* Mango Section */}
      <ProductSection title="Mango" products={mangoProducts} />

      {/* Lichi Section */}
      <ProductSection title="Lichi" products={lichiProducts} />

      {/* Dates Section */}
      <ProductSection title="Dates" products={datesProducts} />
    </div>
  );
}
