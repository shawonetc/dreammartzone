"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import FeaturesBanner from "../components/FeaturesBanner";
import Footer from "../components/Footer";
import AdminEditBar from "../components/AdminEditBar";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Phone,
  MessageCircle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { getPageContent, fetchCustomPages, CustomPageData, FAQItem } from "../data/pages";

export default function FAQPage() {
  const [page, setPage] = useState<CustomPageData>(() => {
    return getPageContent("faq");
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ "faq-1": true });

  useEffect(() => {
    fetchCustomPages()
      .then((data) => {
        if (data.faq) {
          setPage(data.faq);
        }
      })
      .catch(() => {});

    const handleUpdate = (e: any) => {
      if (e.detail?.faq) {
        setPage(e.detail.faq);
      } else {
        setPage(getPageContent("faq"));
      }
    };

    window.addEventListener("dream_pages_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("dream_pages_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqs = page.faqs || [];

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)))];

  // Filter FAQs
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F7] text-slate-800 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-purple-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{page.title || "FAQs"}</span>
        </nav>

        {/* Hero Banner Card */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-10 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#4E1C80] bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
                {page.badge || "Help Center & FAQs"}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-[#1d0741] tracking-tight">
                {page.title}
              </h1>
              {page.subtitle && (
                <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium leading-relaxed max-w-2xl">
                  {page.subtitle}
                </p>
              )}
            </div>

            {/* Live Search */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219] transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-purple-50 scrollbar-none">
            {categories.map((cat: any) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#4E1C80] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIds[faq.id || `faq-${idx}`];
            return (
              <div
                key={faq.id || idx}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-purple-200 shadow-md ring-1 ring-purple-100"
                    : "border-purple-100/80 shadow-xs hover:border-purple-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id || `faq-${idx}`)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-purple-50 text-[#4E1C80] text-xs font-black flex items-center justify-center shrink-0">
                      Q
                    </span>
                    <span className="font-extrabold text-[#1d0741] text-sm sm:text-base leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {faq.category && (
                      <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                        {faq.category}
                      </span>
                    )}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-purple-100 text-[#4E1C80]" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-purple-50 text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-purple-200 p-8 space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No matching questions found</h3>
              <p className="text-xs text-slate-400">
                Try searching with different terms or contact our hotline directly.
              </p>
            </div>
          )}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 bg-gradient-to-r from-[#1d0741] to-[#3B1463] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-purple-900/60 px-3 py-1 rounded-full inline-block">
              Still Need Assistance?
            </span>
            <h3 className="text-xl sm:text-2xl font-black">Can&apos;t find your question answered here?</h3>
            <p className="text-xs sm:text-sm text-purple-200">
              Our support representatives are active 24/7 on WhatsApp and phone.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/8801834498477"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm rounded-xl flex items-center space-x-2 shadow-md transition"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href="tel:01611939511"
              className="px-5 py-3 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-xs sm:text-sm rounded-xl flex items-center space-x-2 shadow-md transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call 01611939511</span>
            </a>
          </div>
        </div>
      </main>

      <AdminEditBar pageSlug="faq" pageTitle="FAQs (Q&A)" />
      <FeaturesBanner />
      <Footer />
    </div>
  );
}
