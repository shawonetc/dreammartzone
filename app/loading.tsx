import React from "react";
import { HeroBannersSkeleton } from "./components/HeroBanners";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F7]">
      {/* Top Header Placeholder */}
      <div className="w-full h-16 sm:h-20 bg-white border-b border-slate-100" />
      
      {/* Hero Banners Loading Skeleton */}
      <main className="flex-1 w-full">
        <HeroBannersSkeleton />

        {/* Top Categories Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-6 w-36 bg-slate-200 rounded-lg animate-pulse mb-4" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
