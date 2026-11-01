"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import FeaturesBanner from "../components/FeaturesBanner";
import Footer from "../components/Footer";
import AdminEditBar from "../components/AdminEditBar";
import { ShieldCheck, Heart, Truck, Sparkles, CheckCircle2, Leaf, Award } from "lucide-react";
import { getPageContent, fetchCustomPages, CustomPageData, defaultPagesData } from "../data/pages";

export default function AboutPage() {
  const [page, setPage] = useState<CustomPageData>(() => {
    return getPageContent("about");
  });

  useEffect(() => {
    fetchCustomPages()
      .then((data) => {
        if (data.about) {
          setPage(data.about);
        }
      })
      .catch(() => {});

    const handleUpdate = (e: any) => {
      if (e.detail?.about) {
        setPage(e.detail.about);
      } else {
        setPage(getPageContent("about"));
      }
    };

    window.addEventListener("dream_pages_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("dream_pages_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F7] text-slate-800 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-purple-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{page.title || "About Us"}</span>
        </nav>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-12 space-y-8">
          <div className="border-b border-purple-50 pb-6">
            <span className="text-xs font-black uppercase tracking-wider text-[#4E1C80] bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
              {page.badge || "About Dream Mart"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1d0741] tracking-tight">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium leading-relaxed max-w-3xl">
                {page.subtitle}
              </p>
            )}
          </div>

          {/* Main Content Body */}
          {page.content && (
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
              {page.content}
            </div>
          )}

          {/* Dynamic Highlight Cards / Sections */}
          {(page.sections || []).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {(page.sections || []).map((sec, idx) => {
                const isEmerald = idx % 3 === 1;
                const isAmber = idx % 3 === 2;
                return (
                  <div
                    key={sec.id || idx}
                    className={`p-6 rounded-2xl border space-y-3 transition hover:shadow-md ${
                      isEmerald
                        ? "bg-emerald-50/60 border-emerald-100"
                        : isAmber
                        ? "bg-amber-50/60 border-amber-100"
                        : "bg-purple-50/60 border-purple-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl text-white flex items-center justify-center ${
                          isEmerald
                            ? "bg-emerald-700"
                            : isAmber
                            ? "bg-amber-600"
                            : "bg-[#4E1C80]"
                        }`}
                      >
                        {isEmerald ? (
                          <ShieldCheck className="w-5 h-5" />
                        ) : isAmber ? (
                          <Truck className="w-5 h-5" />
                        ) : (
                          <Sparkles className="w-5 h-5" />
                        )}
                      </div>
                      {sec.badge && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 text-slate-700 shadow-2xs">
                          {sec.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-slate-900 text-base">{sec.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {sec.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-6 border-t border-purple-50 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="px-6 py-3 bg-[#4E1C80] hover:bg-[#2D0C5F] text-white font-bold text-sm rounded-xl shadow-md transition"
              >
                Browse Our Fresh Products
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white border border-purple-200 hover:bg-purple-50 text-[#4E1C80] font-bold text-sm rounded-xl shadow-xs transition"
              >
                Contact Our Team
              </Link>
            </div>
            {page.lastUpdated && (
              <span className="text-xs text-slate-400 font-medium">
                Last Updated: {page.lastUpdated}
              </span>
            )}
          </div>
        </div>
      </main>

      <AdminEditBar pageSlug="about" pageTitle="About Us" />
      <FeaturesBanner />
      <Footer />
    </div>
  );
}
