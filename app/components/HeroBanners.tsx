"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroBanners() {
  return (
    <section className="w-full py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4 items-stretch">
          {/* Main Cover Banner (Left Column - ~8/12 grid columns) */}
          <Link 
            href="/category/Mango" 
            className="lg:col-span-8 relative group overflow-hidden rounded-2xl shadow-sm border border-slate-100 bg-white flex flex-col cursor-pointer"
          >
            <div className="relative w-full aspect-[16/9] lg:h-full lg:aspect-auto min-h-[220px] sm:min-h-[320px] lg:min-h-[380px]">
              <Image
                src="https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a29705e78cec3.58156451.webp"
                alt="লিচুর সেরা স্বাদ - আম্রপালি অর্গানিক"
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                sizes="(max-width: 1024px) 100vw, 67vw"
              />
            </div>
            
            {/* Slider Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white/60"></span>
              <span className="w-6 h-2 rounded-full bg-white transition-all duration-300"></span>
              <span className="w-2 h-2 rounded-full bg-white/60"></span>
            </div>
          </Link>

          {/* Side Banners (Right Column - 4/12 grid columns stacked) */}
          <div className="lg:col-span-4 flex flex-col gap-3 sm:gap-4">
            {/* Top Side Banner */}
            <Link 
              href="/category/Dates" 
              className="relative group overflow-hidden rounded-2xl shadow-sm border border-slate-100 bg-white flex-1 min-h-[120px] sm:min-h-[170px] cursor-pointer block"
            >
              <div className="relative w-full h-full aspect-[21/9] lg:aspect-auto">
                <Image
                  src="https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297090d49979.25000568.webp"
                  alt="প্রকৃতির প্রিমিয়াম খেজুর"
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            </Link>

            {/* Bottom Side Banner */}
            <Link 
              href="/category/Lichi (লিচু)" 
              className="relative group overflow-hidden rounded-2xl shadow-sm border border-slate-100 bg-white flex-1 min-h-[120px] sm:min-h-[170px] cursor-pointer block"
            >
              <div className="relative w-full h-full aspect-[21/9] lg:aspect-auto">
                <Image
                  src="https://pub-fbc89431f7ed4d21a4222f885f3cb56d.r2.dev/demo21/img_6a297098577cb3.66054740.webp"
                  alt="লিচুর সেরা স্বাদ অনলাইনে"
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
