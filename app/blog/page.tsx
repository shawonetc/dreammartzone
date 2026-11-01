"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import FeaturesBanner from "../components/FeaturesBanner";
import Footer from "../components/Footer";
import AdminEditBar from "../components/AdminEditBar";
import { Newspaper, Calendar, User, Clock, ArrowRight, Search, X, Sparkles } from "lucide-react";
import { getPageContent, fetchCustomPages, CustomPageData, BlogPostItem } from "../data/pages";

export default function BlogPage() {
  const [page, setPage] = useState<CustomPageData>(() => {
    return getPageContent("blog");
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState<BlogPostItem | null>(null);

  useEffect(() => {
    fetchCustomPages()
      .then((data) => {
        if (data.blog) {
          setPage(data.blog);
        }
      })
      .catch(() => {});

    const handleUpdate = (e: any) => {
      if (e.detail?.blog) {
        setPage(e.detail.blog);
      } else {
        setPage(getPageContent("blog"));
      }
    };

    window.addEventListener("dream_pages_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("dream_pages_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const posts = page.blogPosts || [];

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F7] text-slate-800 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-purple-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{page.title || "Blog & News"}</span>
        </nav>

        {/* Hero Banner Card */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-10 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#4E1C80] bg-purple-50 px-3 py-1 rounded-full inline-block mb-3">
                {page.badge || "Dream Mart Journal"}
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

            {/* Search Input */}
            <div className="w-full md:w-72 relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219] transition"
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

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
            >
              {/* Thumbnail Image */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-300">
                    <Newspaper className="w-12 h-12" />
                  </div>
                )}
                {post.category && (
                  <span className="absolute top-3 left-3 bg-[#1d0741]/90 backdrop-blur-md text-amber-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                    {post.category}
                  </span>
                )}
                {post.readTime && (
                  <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-purple-600" />
                    <span>{post.readTime}</span>
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{post.author}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#1d0741] leading-snug group-hover:text-[#4E1C80] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveArticle(post)}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#4E1C80] hover:text-[#ea9219] transition-colors cursor-pointer group/btn pt-2"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-purple-200 p-8 space-y-3">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No articles found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}

        {/* Read Article Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto relative">
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div>
                {activeArticle.category && (
                  <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full mb-2 inline-block">
                    {activeArticle.category}
                  </span>
                )}
                <h2 className="text-xl sm:text-3xl font-black text-[#1d0741] leading-tight">
                  {activeArticle.title}
                </h2>
                <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2 font-medium">
                  <span>By {activeArticle.author}</span>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                </div>
              </div>

              {activeArticle.image && (
                <div className="rounded-2xl overflow-hidden h-64 w-full">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
                {activeArticle.content}
              </div>

              <div className="pt-4 border-t border-purple-50 flex items-center justify-between">
                <Link
                  href="/shop"
                  className="px-5 py-2.5 bg-[#4E1C80] hover:bg-[#2D0C5F] text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  Shop Fresh Products
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <AdminEditBar pageSlug="blog" pageTitle="Blog & News" />
      <FeaturesBanner />
      <Footer />
    </div>
  );
}
