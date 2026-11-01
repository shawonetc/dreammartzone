"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "./Header";
import FeaturesBanner from "./FeaturesBanner";
import Footer from "./Footer";
import AdminEditBar from "./AdminEditBar";
import { FileText, ShieldCheck, CheckCircle2, ChevronRight, Sparkles, Clock } from "lucide-react";
import { getPageContent, fetchCustomPages, CustomPageData } from "../data/pages";

interface PolicyPageTemplateProps {
  slug: string;
  defaultTitle: string;
  breadcrumbLabel: string;
}

const POLICY_LINKS = [
  { slug: "terms", label: "Terms & Conditions", href: "/terms" },
  { slug: "privacy", label: "Privacy Policy", href: "/privacy" },
  { slug: "returns", label: "Return Policy", href: "/returns" },
  { slug: "refund", label: "Refund Policy", href: "/refund" },
  { slug: "shipping", label: "Shipping Policy", href: "/shipping" },
  { slug: "faq", label: "FAQs (Q&A)", href: "/faq" },
];

export default function PolicyPageTemplate({
  slug,
  defaultTitle,
  breadcrumbLabel,
}: PolicyPageTemplateProps) {
  const [page, setPage] = useState<CustomPageData>(() => {
    return getPageContent(slug);
  });

  useEffect(() => {
    fetchCustomPages()
      .then((data) => {
        if (data[slug]) {
          setPage(data[slug]);
        }
      })
      .catch(() => {});

    const handleUpdate = (e: any) => {
      if (e.detail?.[slug]) {
        setPage(e.detail[slug]);
      } else {
        setPage(getPageContent(slug));
      }
    };

    window.addEventListener("dream_pages_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("dream_pages_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F7] text-slate-800 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-purple-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{breadcrumbLabel}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Sidebar Column: Policy Navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Links Card */}
            <div className="bg-white rounded-3xl border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 space-y-4">
              <h3 className="text-sm font-black text-[#1d0741] uppercase tracking-wider pb-3 border-b border-purple-50">
                Customer Policies
              </h3>
              <nav className="flex flex-col space-y-1.5">
                {POLICY_LINKS.map((link) => {
                  const isActive = link.slug === slug;
                  return (
                    <Link
                      key={link.slug}
                      href={link.href}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-between ${
                        isActive
                          ? "bg-[#1d0741] text-amber-300 shadow-xs"
                          : "text-slate-600 hover:bg-purple-50 hover:text-purple-900"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-slate-400"}`} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Need Assistance Card */}
            <div className="bg-gradient-to-br from-[#1d0741] to-[#3B1463] rounded-3xl p-6 text-white space-y-4 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-purple-900/60 px-2.5 py-1 rounded-full">
                24/7 Support
              </span>
              <h4 className="text-base font-black">Have any questions regarding our terms?</h4>
              <p className="text-xs text-purple-200 leading-relaxed">
                Our support team is always available to answer any questions or concerns.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="tel:01611939511"
                  className="w-full text-center py-2.5 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-xs rounded-xl shadow-xs hover:opacity-95 transition"
                >
                  Call Hotline: 01611939511
                </a>
                <Link
                  href="/contact"
                  className="w-full text-center py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
                >
                  Contact Form
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Policy Document (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-10 space-y-6">
              {/* Header */}
              <div className="border-b border-purple-50 pb-6 space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#4E1C80] bg-purple-50 px-3 py-1 rounded-full inline-block">
                  {page.badge || defaultTitle}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">
                  {page.title}
                </h1>
                {page.subtitle && (
                  <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
                    {page.subtitle}
                  </p>
                )}
                {page.lastUpdated && (
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last Updated: {page.lastUpdated}</span>
                  </div>
                )}
              </div>

              {/* Introductory Content */}
              {page.content && (
                <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3">
                  {page.content}
                </div>
              )}

              {/* Numbered Clauses / Sections */}
              {(page.sections || []).length > 0 && (
                <div className="space-y-6 pt-4">
                  {(page.sections || []).map((sec, idx) => (
                    <div
                      key={sec.id || idx}
                      className="p-5 sm:p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-black text-[#1d0741]">
                          {sec.title}
                        </h2>
                        {sec.badge && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/80 px-2.5 py-0.5 rounded-full">
                            {sec.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                        {sec.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Assurance */}
              <div className="pt-6 border-t border-purple-50 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  © Dream Mart. Committed to quality, purity and consumer trust.
                </span>
                <Link
                  href="/shop"
                  className="px-5 py-2.5 bg-[#4E1C80] hover:bg-[#2D0C5F] text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AdminEditBar pageSlug={slug} pageTitle={page.title || defaultTitle} />
      <FeaturesBanner />
      <Footer />
    </div>
  );
}
