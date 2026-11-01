"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import FeaturesBanner from "../components/FeaturesBanner";
import Footer from "../components/Footer";
import Image from "next/image";
import {
  Trash2,
  ShoppingBag,
  Minus,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
  Truck
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabaseClient";

interface PlacedOrderSummary {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes?: string;
  total: number;
  itemsSummary: string;
}

export default function CartClient() {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrderSummary | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyOrderId = () => {
    if (placedOrder?.id && typeof window !== "undefined") {
      navigator.clipboard.writeText(placedOrder.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert("Please fill in all required fields (Name, Phone, Address).");
      return;
    }

    if (formData.phone.trim().length < 11) {
      alert("Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01XXXXXXXXX).");
      return;
    }

    setIsSubmitting(true);

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `#ORD-${randomNum}`;
    const orderDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const itemsSummary = cart
      .map((item) => `${item.name} × ${item.quantity}`)
      .join(", ");

    const currentTotal = cartTotal;

    // 1. Create order object for local storage & state
    const localOrderItem = {
      id: orderId,
      customer: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      product: itemsSummary,
      amount: String(currentTotal),
      status: "Pending" as const,
      date: orderDate,
      payment: "Cash on Delivery",
      notes: formData.notes.trim() || "",
      created_at: new Date().toISOString(),
    };

    // 2. Persist locally to amropali_custom_orders for instant Admin visibility
    try {
      const existing = localStorage.getItem("amropali_custom_orders");
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem("amropali_custom_orders", JSON.stringify([localOrderItem, ...list]));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Local storage order save error:", err);
    }

    // 3. Persist to Supabase Database (orders table & notifications table)
    try {
      await supabase.from("orders").insert([
        {
          id: orderId,
          customer_name: formData.name.trim(),
          customer_phone: formData.phone.trim(),
          address: formData.address.trim(),
          product: itemsSummary,
          items: cart.map((i) => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            image: i.image,
          })),
          total_amount: String(currentTotal),
          amount: String(currentTotal),
          status: "Pending",
          payment_method: "Cash on Delivery",
          notes: formData.notes.trim() || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      await supabase.from("notifications").insert([
        {
          title: `New Order: ${orderId}`,
          message: `${formData.name.trim()} placed an order for ৳${currentTotal} (${itemsSummary})`,
          type: "order",
          is_read: false,
        },
      ]);
    } catch (dbErr) {
      console.warn("Supabase order insert synced locally:", dbErr);
    }

    setPlacedOrder({
      id: orderId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      notes: formData.notes.trim(),
      total: currentTotal,
      itemsSummary,
    });

    clearCart();
    setFormData({ name: "", phone: "", address: "", notes: "" });
    setIsSubmitting(false);
    setOrderPlaced(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F7] text-slate-800 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Shopping Cart</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 mb-8">
          <ShoppingBag className="w-6 h-6 stroke-[2.2] text-[#4E1C80]" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart ({cartCount})
          </h1>
        </div>

        {orderPlaced && placedOrder ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm mt-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
              অর্ডার সফল হয়েছে
            </span>

            <h2 className="text-2xl font-black text-slate-950 mb-2">Order Confirmed!</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
              আপনার অর্ডারটি আমাদের অ্যাডমিন সিস্টেমে রেকর্ড করা হয়েছে। ডেলিভারি নিশ্চিত করতে আমাদের টিম শীঘ্রই যোগাযোগ করবে।
            </p>

            {/* Order ID Pill */}
            <div className="mt-6 w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Your Order ID
                </span>
                <span className="text-base font-black text-[#4E1C80]">
                  {placedOrder.id}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Details Box */}
            <div className="w-full mt-4 bg-slate-50/60 border border-slate-100 rounded-xl p-4 text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Customer</span>
                <span className="font-bold text-slate-900">{placedOrder.name}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Phone</span>
                <span className="font-bold text-slate-900">{placedOrder.phone}</span>
              </div>
              <div className="flex items-start justify-between pb-2 border-b border-slate-200/60 gap-4">
                <span className="text-slate-500 font-medium shrink-0">Address</span>
                <span className="font-bold text-slate-900 text-right">{placedOrder.address}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Payment</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Cash on Delivery
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-700 font-bold text-sm">Total Payable</span>
                <span className="text-lg font-black text-slate-950">৳{placedOrder.total}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/track-order"
                className="flex-1 py-3 bg-[#4E1C80] hover:bg-[#2D0C5F] text-white rounded-xl font-bold text-sm text-center shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Track Your Order</span>
              </Link>
              <Link
                href="/"
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm text-center transition-colors cursor-pointer"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Cart Items (cols 7) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6">
                <div className="flex flex-col gap-5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 pb-5 border-b border-slate-100 last:border-b-0 last:pb-0"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col gap-1.5">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2">
                          {item.name}
                        </h3>
                        <span className="text-base font-black text-slate-900">
                          ৳{item.price}
                        </span>

                        {/* Counter */}
                        <div className="flex items-center border border-slate-200 bg-white rounded-lg h-8 w-fit mt-1 overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 h-full text-slate-500 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-xs sm:text-sm font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 h-full text-slate-500 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Total and Trash */}
                      <div className="flex flex-col items-end justify-between self-stretch">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <span className="text-sm sm:text-base font-black text-slate-900 mt-auto">
                          ৳{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping Link */}
              <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-[#4E1C80] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* Right side: Checkout & Order Form (cols 5) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Billing Details & Checkout
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    অর্ডার কনফার্ম করতে আপনার নাম, মোবাইল নম্বর এবং ঠিকানা দিন।
                  </p>
                </div>

                <div className="bg-purple-50/70 border border-purple-200/70 rounded-xl p-3 text-xs text-[#2D0C5F] font-medium leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#4E1C80] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#1d0741]">Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
                    <span className="text-slate-600 text-[11px]">
                      পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করবেন। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি প্রযোজ্য।
                    </span>
                  </div>
                </div>

                <form id="cart-page-checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Recipient Name *</label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="আপনার পুরো নাম লিখুন"
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#4E1C80]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 01XXXXXXXXX"
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#4E1C80]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Full Shipping Address *</label>
                    <textarea
                      required
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="রোড নম্বর, বাড়ি নম্বর, এলাকা বা জেলার নাম লিখুন"
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#4E1C80] resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Delivery Notes (Optional)</label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any specific delivery instructions..."
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#4E1C80]"
                    />
                  </div>
                </form>

                {/* Subtotals Box */}
                <div className="border-t border-dashed border-slate-200 pt-5 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-500">
                    <span>Subtotal</span>
                    <span>৳{cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-500">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-700 font-bold">FREE Delivery</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-slate-900">
                    <span className="text-sm font-bold">Total Payable</span>
                    <span className="text-xl font-black text-[#4E1C80]">৳{cartTotal}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  type="submit"
                  form="cart-page-checkout-form"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#4E1C80] hover:bg-[#2D0C5F] text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>অর্ডার প্রক্রিয়াধীন...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Order (ক্যাশ অন ডেলিভারি)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center max-w-md mx-auto shadow-2xs mt-8">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 text-sm mb-6">
              You haven't added any products to your cart yet.
            </p>
            <Link
              href="/"
              className="px-6 py-2.5 bg-[#4E1C80] text-white rounded-xl font-bold text-sm hover:bg-[#2D0C5F] transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </main>

      <FeaturesBanner />
      <Footer />
    </div>
  );
}
