"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Link from "next/link";

interface Category {
  id: string;
  name: string;
  bnName?: string;
  image: string;
}

const categories: Category[] = [
  {
    id: "dates",
    name: "Dates",
    bnName: "খেজুর",
    image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "spices",
    name: "Spices",
    bnName: "মসলা",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "nuts",
    name: "Nuts & Seeds",
    bnName: "বাদাম ও বীজ",
    image: "https://images.unsplash.com/photo-1541795795328-f073b763494e?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "beverage",
    name: "Beverage",
    bnName: "পানীয়",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "flours",
    name: "Flours & Lentils",
    bnName: "আটা ও ডাল",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "pickle",
    name: "Pickle (আচার)",
    bnName: "আচার",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "lichi",
    name: "Lichi (লিচু)",
    bnName: "লিচু",
    image: "https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp",
  },
  {
    id: "rice",
    name: "Rice (চাল)",
    bnName: "চাল",
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "mango",
    name: "Mango (আম)",
    bnName: "আম",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "honey",
    name: "Honey (মধু)",
    bnName: "মধু",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80",
  },
];

export default function TopCategories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-[#4E1C80] rounded-full"></div>
            <h2 className="text-base sm:text-lg font-bold tracking-wider text-slate-900 uppercase">
              TOP CATEGORIES
            </h2>
          </div>
          
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Carousel Container with Arrows */}
        <div className="relative group">
          {/* Left Arrow Button */}
          <button
            onClick={() => handleScroll("left")}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:scale-105 transition-all cursor-pointer"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => handleScroll("right")}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:scale-105 transition-all cursor-pointer"
            aria-label="Next categories"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Scroll Viewport */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.name}`}
                className="flex-shrink-0 w-32 sm:w-36 md:w-40 bg-white border border-slate-100 rounded-xl p-3 text-center shadow-2xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group/card"
              >
                {/* Image Wrapper */}
                <div className="relative w-full aspect-square mb-2.5 overflow-hidden rounded-lg bg-slate-50 flex items-center justify-center">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                    sizes="160px"
                  />
                </div>
                {/* Category Title */}
                <h3 className="text-xs font-semibold text-slate-800 group-hover/card:text-emerald-700 transition-colors line-clamp-1">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
