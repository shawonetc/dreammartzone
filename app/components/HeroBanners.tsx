"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { BannerItem, defaultBanners, getStoredBanners } from "../data/banners";

// ============================================================================
// 1. HERO BANNERS SKELETON COMPONENT
// ============================================================================
export function HeroBannersSkeleton() {
  return (
    <section className="w-full py-4 sm:py-6" aria-label="Loading Banners">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4 items-stretch">
          
          {/* Main Cover Banner Skeleton (col-span-8) */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-slate-200 animate-pulse min-h-[220px] sm:min-h-[320px] lg:min-h-[380px] border border-slate-200/80 shadow-xs flex flex-col justify-end p-6 sm:p-8">
            <div className="space-y-3 max-w-sm sm:max-w-md z-10">
              {/* Badge placeholder */}
              <div className="h-5 w-32 bg-slate-300 rounded-full" />
              {/* Heading placeholder */}
              <div className="h-8 sm:h-10 w-3/4 bg-slate-300 rounded-xl" />
              {/* Subtitle placeholder */}
              <div className="h-4 w-1/2 bg-slate-300 rounded-md" />
            </div>

            {/* Slider Dots Placeholder */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-slate-300/80 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="w-6 h-2 rounded-full bg-slate-400" />
              <span className="w-2 h-2 rounded-full bg-slate-400" />
            </div>
          </div>

          {/* Side Banners Skeletons (col-span-4 stacked) */}
          <div className="lg:col-span-4 flex flex-col gap-3 sm:gap-4">
            
            {/* Top Side Skeleton */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-200 animate-pulse flex-1 min-h-[120px] sm:min-h-[170px] border border-slate-200/80 shadow-xs p-5 flex flex-col justify-center">
              <div className="space-y-2.5 max-w-xs">
                <div className="h-4 w-24 bg-slate-300 rounded-full" />
                <div className="h-6 sm:h-7 w-44 bg-slate-300 rounded-lg" />
              </div>
            </div>

            {/* Bottom Side Skeleton */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-200 animate-pulse flex-1 min-h-[120px] sm:min-h-[170px] border border-slate-200/80 shadow-xs p-5 flex flex-col justify-center">
              <div className="space-y-2.5 max-w-xs">
                <div className="h-4 w-24 bg-slate-300 rounded-full" />
                <div className="h-6 sm:h-7 w-44 bg-slate-300 rounded-lg" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 2. MAIN HERO BANNERS COMPONENT
// ============================================================================
interface HeroBannersProps {
  initialBanners?: BannerItem[];
  isLoading?: boolean;
}

export default function HeroBanners({ initialBanners, isLoading = false }: HeroBannersProps) {
  const [banners, setBanners] = useState<BannerItem[]>(() => {
    if (initialBanners && initialBanners.length > 0) return initialBanners;
    return getStoredBanners();
  });
  
  const [loading, setLoading] = useState<boolean>(() => {
    if (isLoading) return true;
    if (initialBanners && initialBanners.length > 0) return false;
    return false;
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  useEffect(() => {
    // Only re-fetch if initialBanners were missing
    if (!initialBanners || initialBanners.length === 0) {
      fetchBanners();
    }
  }, [initialBanners]);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setBanners(data);
      }
    } catch (err) {
      console.warn("Client banners fetch fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  // If explicitly loading and no banners ready, display skeleton
  if (loading && (!banners || banners.length === 0)) {
    return <HeroBannersSkeleton />;
  }

  // Filter banners by slots
  const mainSlides = banners.filter(
    (b) => b.slot === "main" && (b.is_active === undefined || b.is_active === true)
  );
  const sideTop = banners.find(
    (b) => b.slot === "side-top" && (b.is_active === undefined || b.is_active === true)
  ) || defaultBanners.find((b) => b.slot === "side-top")!;
  const sideBottom = banners.find(
    (b) => b.slot === "side-bottom" && (b.is_active === undefined || b.is_active === true)
  ) || defaultBanners.find((b) => b.slot === "side-bottom")!;

  // Fallback for main slides if none active
  const activeMainSlides = mainSlides.length > 0 
    ? mainSlides 
    : defaultBanners.filter((b) => b.slot === "main");

  // Auto slide interval
  useEffect(() => {
    if (activeMainSlides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeMainSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeMainSlides.length, isPaused]);

  const activeSlide = activeMainSlides[currentSlide] || activeMainSlides[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? activeMainSlides.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % activeMainSlides.length);
  };

  return (
    <section className="w-full py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4 items-stretch">
          
          {/* Main Cover Banner / Carousel (Left Column - ~8/12 grid columns) */}
          <div 
            className="lg:col-span-8 relative group overflow-hidden rounded-2xl shadow-sm border border-slate-100 bg-slate-200 flex flex-col"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <Link 
              href={activeSlide?.link || "/shop"} 
              className="relative w-full aspect-[16/9] lg:h-full lg:aspect-auto min-h-[220px] sm:min-h-[320px] lg:min-h-[380px] block cursor-pointer bg-slate-200"
            >
              <Image
                key={activeSlide?.id || currentSlide}
                src={activeSlide?.image || defaultBanners[0].image}
                alt={activeSlide?.title || "Hero Banner"}
                fill
                priority
                onLoad={() => setMainImageLoaded(true)}
                className={`object-cover transition-all duration-700 group-hover:scale-[1.01] ${
                  mainImageLoaded ? "opacity-100" : "opacity-90"
                }`}
                sizes="(max-width: 1024px) 100vw, 67vw"
              />
            </Link>

            {/* Carousel Navigation Arrows (visible when multiple slides) */}
            {activeMainSlides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 cursor-pointer shadow-md"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 cursor-pointer shadow-md"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Slider Pagination Dots */}
            {activeMainSlides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-full">
                {activeMainSlides.map((slide, idx) => (
                  <button
                    key={slide.id || idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx 
                        ? "w-6 h-2 bg-white shadow-xs" 
                        : "w-2 h-2 bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Side Banners (Right Column - 4/12 grid columns stacked) */}
          <div className="lg:col-span-4 flex flex-col gap-3 sm:gap-4">
            
            {/* Top Side Banner */}
            <Link 
              href={sideTop?.link || "/category/Dates"} 
              className="relative group overflow-hidden rounded-2xl shadow-sm border border-slate-100 bg-slate-200 flex-1 min-h-[120px] sm:min-h-[170px] cursor-pointer block"
            >
              <div className="relative w-full h-full aspect-[21/9] lg:aspect-auto">
                <Image
                  src={sideTop?.image || defaultBanners[1].image}
                  alt={sideTop?.title || "Top Side Banner"}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            </Link>

            {/* Bottom Side Banner */}
            <Link 
              href={sideBottom?.link || "/category/Lichi"} 
              className="relative group overflow-hidden rounded-2xl shadow-sm border border-slate-100 bg-slate-200 flex-1 min-h-[120px] sm:min-h-[170px] cursor-pointer block"
            >
              <div className="relative w-full h-full aspect-[21/9] lg:aspect-auto">
                <Image
                  src={sideBottom?.image || defaultBanners[2].image}
                  alt={sideBottom?.title || "Bottom Side Banner"}
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
