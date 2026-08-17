"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import FeaturesBanner from "../components/FeaturesBanner";
import Footer from "../components/Footer";
import { Package, Search, Truck, CheckCircle2, Clock, MapPin } from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [searched, setSearched] = useState(false);
  const [status, setStatus] = useState<"not_found" | "active" | "delivered">("not_found");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setSearched(true);
    // Dummy tracking logic
    if (orderId.toLowerCase().includes("del")) {
      setStatus("delivered");
    } else if (orderId.trim().length >= 4) {
      setStatus("active");
    } else {
      setStatus("not_found");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Track Order</span>
        </nav>

        {/* Page Container */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 sm:p-10">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
              Track Your Order
            </h1>
            <p className="text-sm text-slate-500">
              Enter your Order ID (found in your confirmation message) or Phone Number to view active shipment progress.
            </p>
          </div>

          {/* Tracking Form */}
          <form onSubmit={handleTrack} className="max-w-md mx-auto mb-12">
            <div className="relative flex items-center shadow-xs rounded-xl overflow-hidden border border-slate-200 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. OD-2026-99"
                className="w-full pl-4 pr-12 py-3.5 text-sm font-semibold focus:outline-none placeholder:text-slate-400 bg-white"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-4.5 bg-[#111111] hover:bg-black text-white transition-colors flex items-center justify-center cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-2.5 text-xs text-slate-400 font-medium">
              💡 Tip: Enter 'del' (e.g. OD-DEL) to preview a completed delivery state!
            </div>
          </form>

          {/* Tracking Results Area */}
          {searched && (
            <div className="border-t border-slate-100 pt-8 animate-fade-in">
              {status === "not_found" && (
                <div className="text-center max-w-sm mx-auto py-6">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-3.5">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">No Shipment Details Found</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    We couldn't find any orders matching "{orderId}". Double-check the Order ID or phone number and try again.
                  </p>
                </div>
              )}

              {status === "active" && (
                <div className="max-w-2xl mx-auto">
                  {/* Order Info Bar */}
                  <div className="bg-slate-50 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between text-xs sm:text-sm mb-8 border border-slate-100">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Order ID</span>
                      <span className="font-bold text-slate-900 uppercase">{orderId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Status</span>
                      <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">Out for Delivery</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Est. Delivery</span>
                      <span className="font-bold text-slate-900">Today, before 8:00 PM</span>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="relative pl-8 flex flex-col gap-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                    {/* Step 1: Placed */}
                    <div className="relative">
                      <div className="absolute -left-[33px] top-0.5 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white ring-4 ring-emerald-50">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">Order Placed</h4>
                      <p className="text-xs text-slate-400 mb-1">Your order was successfully placed and verified</p>
                      <span className="text-[10px] text-slate-400 font-semibold">Aug 16, 2026 - 10:15 AM</span>
                    </div>

                    {/* Step 2: Processing */}
                    <div className="relative">
                      <div className="absolute -left-[33px] top-0.5 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white ring-4 ring-emerald-50">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">Processing</h4>
                      <p className="text-xs text-slate-400 mb-1">Items checked, packed carefully and handed to carrier</p>
                      <span className="text-[10px] text-slate-400 font-semibold">Aug 17, 2026 - 09:30 AM</span>
                    </div>

                    {/* Step 3: Out for Delivery */}
                    <div className="relative">
                      <div className="absolute -left-[33px] top-0.5 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white ring-4 ring-blue-50 animate-pulse">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">Out for Delivery</h4>
                      <p className="text-xs text-slate-400 mb-1">Rider is currently on the way to deliver your parcel</p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-blue-600 font-bold bg-blue-50/50 px-2 py-1 rounded-md w-fit">
                        <MapPin className="w-3 h-3" />
                        <span>Dhaka City South (Rider: 01799228833)</span>
                      </div>
                    </div>

                    {/* Step 4: Delivered (Pending) */}
                    <div className="relative opacity-50">
                      <div className="absolute -left-[33px] top-0.5 w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">Delivered</h4>
                      <p className="text-xs text-slate-400">Parcel received by customer</p>
                    </div>
                  </div>
                </div>
              )}

              {status === "delivered" && (
                <div className="max-w-2xl mx-auto">
                  {/* Order Info Bar */}
                  <div className="bg-slate-50 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between text-xs sm:text-sm mb-8 border border-slate-100">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Order ID</span>
                      <span className="font-bold text-slate-900 uppercase">{orderId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Status</span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Delivered</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block mb-0.5">Delivered At</span>
                      <span className="font-bold text-slate-900">Today, 2:40 PM</span>
                    </div>
                  </div>

                  {/* Completed Tracking Timeline */}
                  <div className="relative pl-8 flex flex-col gap-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-emerald-600">
                    {/* Step 1: Placed */}
                    <div className="relative">
                      <div className="absolute -left-[33px] top-0.5 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">Order Placed</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">Aug 15, 2026</span>
                    </div>

                    {/* Step 2: Processing */}
                    <div className="relative">
                      <div className="absolute -left-[33px] top-0.5 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">Processing</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">Aug 16, 2026</span>
                    </div>

                    {/* Step 3: Out for Delivery */}
                    <div className="relative">
                      <div className="absolute -left-[33px] top-0.5 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">Out for Delivery</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">Aug 17, 2026</span>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="relative">
                      <div className="absolute -left-[33px] top-0.5 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white ring-4 ring-emerald-50">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">Delivered Successfully</h4>
                      <p className="text-xs text-slate-400 mb-1">Your order was hand delivered at your location</p>
                      <span className="text-[10px] text-slate-400 font-semibold">Today, 2:40 PM</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <FeaturesBanner />
      <Footer />
    </div>
  );
}
