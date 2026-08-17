"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import FeaturesBanner from "../../components/FeaturesBanner";
import Footer from "../../components/Footer";
import { getProductById, allCombinedProducts } from "../../data/products";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import {
  Minus,
  Plus,
  ShoppingCart,
  Phone,
  Link2,
  Check,
  ChevronUp
} from "lucide-react";

interface ProductDetailClientProps {
  id: string;
}

export default function ProductDetailClient({ id }: ProductDetailClientProps) {
  const product = getProductById(id);

  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "contact" | "qa">("description");
  const [copied, setCopied] = useState(false);
  
  const { addToCart, setIsCartOpen } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Product Not Found</h2>
            <p className="text-slate-500 mb-6">The product you are looking for does not exist or has been removed.</p>
            <Link
              href="/"
              className="px-6 py-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors inline-block"
            >
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fallback images if not provided
  const imagesList = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(`Hi, I'm interested in "${product.name}" (Price: ৳${product.price}). Can you tell me more?`);
    window.open(`https://wa.me/8801961363543?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-400 capitalize">{product.category.toLowerCase()}</span>
          <span>/</span>
          <span className="text-slate-900 truncate font-semibold">{product.name}</span>
        </nav>

        {/* Product Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 lg:p-8 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Image Gallery (cols 5) */}
            <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnails */}
              {imagesList.length > 1 && (
                <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-x-visible shrink-0 pb-2 sm:pb-0">
                  {imagesList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 bg-slate-50 shrink-0 transition-all ${
                        activeImageIdx === idx ? "border-emerald-600 scale-[1.03] shadow-xs" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="relative flex-1 aspect-square sm:aspect-[4/3] md:aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-2xs">
                <Image
                  src={imagesList[activeImageIdx]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 500px"
                />
              </div>
            </div>

            {/* Right Column: Details (cols 7) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                  {product.name}
                </h1>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-500 mb-5">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-400">Category:</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">{product.category}</span>
                  </div>
                  <div className="w-[1px] h-3.5 bg-slate-200 hidden sm:block"></div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-400">Brand:</span>
                    <span className="text-slate-800 font-bold">{product.brand || "Unknown"}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6 pb-5 border-b border-slate-100">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    ৳ {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm sm:text-base text-slate-400 line-through">
                      ৳ {product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Short Description Container */}
                {product.shortDescription && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-slate-700 font-medium mb-6 leading-relaxed">
                    {product.shortDescription}
                  </div>
                )}

                {/* Quantity and Cart Actions */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 bg-white rounded-lg h-[46px] overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3.5 h-full text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-slate-900 select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3.5 h-full text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Order & Add to Cart */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-[200px]">
                    <button
                      onClick={() => {
                        addToCart(product, quantity);
                        setIsCartOpen(true);
                      }}
                      className="flex-1 h-[46px] bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-2xs tracking-wide"
                    >
                      Order Now
                    </button>
                    <button
                      onClick={() => {
                        addToCart(product, quantity);
                      }}
                      className="flex-1 h-[46px] bg-white hover:bg-slate-50 text-slate-900 border border-slate-900 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Share Box */}
                <div className="flex items-center gap-3.5 mb-6 text-xs sm:text-sm text-slate-500 font-medium">
                  <span>Share:</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <button
                      onClick={handleWhatsAppContact}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#25D366] hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.202-1.362a9.98 9.98 0 0 0 4.808 1.226h.003c5.502 0 9.99-4.479 9.99-9.987C22 6.478 17.518 2 12.012 2zm0 18.29h-.001a8.25 8.25 0 0 1-4.215-1.154l-.303-.18-3.13.82.835-3.053-.197-.314a8.27 8.27 0 0 1-1.267-4.427c.001-4.558 3.71-8.262 8.281-8.262a8.23 8.23 0 0 1 5.845 2.422c2.392 2.396 3.708 5.58 3.705 8.963-.002 4.56-3.71 8.265-8.281 8.265zm4.534-6.205c-.249-.125-1.472-.725-1.699-.809-.228-.083-.393-.125-.559.124-.166.249-.643.809-.787.975-.145.166-.29.187-.539.062a6.787 6.787 0 0 1-2.002-1.233 7.48 7.48 0 0 1-1.385-1.724c-.145-.249-.015-.384.109-.508.113-.112.25-.29.374-.435.124-.145.166-.249.25-.415.082-.166.04-.31-.021-.435-.062-.124-.559-1.348-.766-1.847-.2-.483-.404-.418-.559-.426-.145-.008-.31-.008-.477-.008s-.435.062-.663.31a2.535 2.535 0 0 0-.787 1.887c0 1.116.81 2.195.922 2.348.114.153 1.593 2.433 3.86 3.41.539.233 1.018.397 1.365.507.542.172 1.035.148 1.424.09.435-.065 1.472-.601 1.679-1.182.207-.58.207-1.077.145-1.182-.062-.104-.228-.166-.477-.291z" />
                      </svg>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer relative"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600 animate-pulse" /> : <Link2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact WhatsApp Banner Button */}
              <button
                onClick={handleWhatsAppContact}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa4f] text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_16px_rgba(37,211,102,0.15)] cursor-pointer text-center text-sm md:text-base"
              >
                <Phone className="w-5 h-5 fill-current" />
                Contact us on WhatsApp for any queries
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Section: Tabs Container */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 lg:p-8">
          {/* Tab headers */}
          <div className="flex border-b border-slate-100 gap-6 sm:gap-8 mb-6 overflow-x-auto">
            {(["description", "contact", "qa"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm sm:text-base font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "description" ? "Description" : tab === "contact" ? "Contact Us" : "Q&A"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {activeTab === "description" && (
              <div className="flex flex-col gap-4">
                <p className="font-semibold text-slate-800">
                  {product.longDescription || product.name}
                </p>
                {product.highlights && product.highlights.length > 0 && (
                  <ul className="list-disc pl-5 flex flex-col gap-2.5 text-slate-600 font-medium">
                    {product.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === "contact" && (
              <div className="flex flex-col gap-3 font-medium text-slate-600">
                <p className="text-slate-800 font-bold">Have questions or want bulk orders?</p>
                <p>Phone: <span className="text-slate-900 font-bold">01961363543</span></p>
                <p>Email: <span className="text-slate-900 font-bold">info@demo21.com</span></p>
                <p>WhatsApp: <span className="text-slate-900 font-bold">01961363543</span></p>
              </div>
            )}

            {activeTab === "qa" && (
              <div className="flex flex-col gap-4 font-medium text-slate-600">
                <div>
                  <p className="font-bold text-slate-800 mb-1">Q1: How fresh are these fruits/products?</p>
                  <p>A: We collect our products directly from our selected premium gardens and suppliers every day to ensure maximum freshness.</p>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <p className="font-bold text-slate-800 mb-1">Q2: How long does the delivery take?</p>
                  <p>A: Inside Dhaka, we deliver within 24 to 48 hours. Outside Dhaka, it takes around 2 to 3 days.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {(() => {
          const related = allCombinedProducts
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4);

          if (related.length === 0) return null;

          return (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-200">
                <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Related Products
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {related.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          );
        })()}

      </main>

      <FeaturesBanner />
      <Footer />
    </div>
  );
}
