"use client";

import React from "react";
import ProductCard, { ProductItem } from "./ProductCard";
import { ShoppingCart } from "lucide-react";

const allProducts: ProductItem[] = [
  {
    id: "all-1",
    name: "ঘরের মতো খাঁটি আচার | স্বাদের অনন্য অভিজ্ঞতা",
    price: "700",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "all-2",
    name: "প্রিমিয়াম খেজুর 1KG | প্রকৃতির মিষ্টি উপহার",
    price: "1300",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp",
  },
  {
    id: "all-3",
    name: "১০০% খাঁটি প্রাকৃতিক মধু 1KG | সরাসরি মৌচাক থেকে সংগৃহীত",
    price: "1600",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "all-4",
    name: "খাঁটি হলুদের গুঁড়া 500 gm",
    price: "280",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "all-5",
    name: "খাঁটি ঘানিভাঙা সরিষার তেল 1 ltr",
    price: "600",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "all-6",
    name: "খাঁটি সূর্যমুখী তেল 5 ltr",
    price: "1150",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "all-7",
    name: "খাঁটি রিফাইন সোয়াবিন তেল 5 ltr",
    price: "890",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "all-8",
    name: "খাঁটি দেশি গাওয়া ঘি 500 gm",
    price: "1250",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "all-9",
    name: "প্রিমিয়াম খাঁটি গাওয়া ঘি 1 kg",
    price: "2400",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "all-10",
    name: "দিনাজপুরের তাজা বোম্বে লিচু (১০-পিস)",
    price: "750",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp",
  },
];

export default function AllProducts() {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
