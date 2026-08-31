"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import FeaturesBanner from "../components/FeaturesBanner";
import Footer from "../components/Footer";
import Image from "next/image";
import { Heart, Trash2, ShoppingCart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { allCombinedProducts } from "../data/products";

export default function WishlistClient() {
  const { addToCart, setIsCartOpen } = useCart();

  // Set default initial wishlist items from our products database
  const [wishlist, setWishlist] = useState([
    allCombinedProducts[0], // mango-1
    allCombinedProducts[4], // lichi-1
  ]);

  const handleRemove = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item: any) => {
    addToCart(item, 1);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F7] text-slate-800 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Wishlist</span>
        </nav>

        {/* Wishlist Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 mb-8">
          <Heart className="w-6 h-6 stroke-[2.2] text-slate-900 fill-slate-900" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Wishlist ({wishlist.length})
          </h1>
        </div>

        {/* Wishlist Content */}
        {wishlist.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="divide-y divide-slate-100">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Image */}
                    <Link href={`/product/${item.id}`} className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="80px"
                      />
                    </Link>
 
                    {/* Text Details */}
                    <div>
                      <Link
                        href={`/product/${item.id}`}
                        className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-2 mb-1"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">
                        Category: {item.category}
                      </span>
                      <span className="text-base font-black text-slate-900">
                        ৳{item.price}
                      </span>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-1.5 py-2.5 px-4 bg-[#4E1C80] hover:bg-[#2D0C5F] text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-2xs shrink-0"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center max-w-md mx-auto shadow-2xs mt-8">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
            <p className="text-slate-500 text-sm mb-6">
              You haven't saved any items yet. Start exploring our organic products!
            </p>
            <Link
              href="/"
              className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-sm hover:bg-emerald-800 transition-colors inline-block"
            >
              Discover Products
            </Link>
          </div>
        )}
      </main>

      <FeaturesBanner />
      <Footer />
    </div>
  );
}
