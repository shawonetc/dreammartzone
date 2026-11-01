"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import {
  X,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  Phone,
  MapPin,
  User,
  Truck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    clearCart,
  } = useCart();

  const [checkoutMode, setCheckoutMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrderSummary | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isCartOpen) return null;

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
      alert("Please fill in all required fields (Name, Phone, and Address).");
      return;
    }

    if (formData.phone.trim().length < 11) {
      alert("Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01XXXXXXXXX).");
      return;
    }

    setIsSubmitting(true);

    // Generate unique readable Order ID
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

      // Admin alert notification
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

    // Save summary and transition UI
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

  const handleCloseDrawer = () => {
    setIsCartOpen(false);
    setCheckoutMode(false);
    setOrderPlaced(false);
    setPlacedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleCloseDrawer}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-all duration-300 relative">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#4E1C80]" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {orderPlaced
                  ? "Order Confirmed"
                  : checkoutMode
                  ? "Checkout & Delivery"
                  : `Your Cart (${cartCount})`}
              </h2>
            </div>
            <button
              onClick={handleCloseDrawer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {orderPlaced && placedOrder ? (
              /* Success Screen */
              <div className="h-full flex flex-col justify-between py-2 animate-fadeIn">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 ring-8 ring-emerald-50/50 animate-bounce">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-2">
                    অর্ডার সফল হয়েছে
                  </span>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    আপনার অর্ডারটি আমাদের অ্যাডমিন সিস্টেমে রেকর্ড করা হয়েছে। ডেলিভারির জন্য আমাদের টিম শীঘ্রই যোগাযোগ করবে।
                  </p>

                  {/* Order ID Pill */}
                  <div className="mt-4 w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
                    <div className="text-left">
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

                  {/* Order Summary Recap */}
                  <div className="w-full mt-4 bg-slate-50/60 border border-slate-100 rounded-xl p-3.5 text-left text-xs space-y-2">
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
                      <span className="text-slate-500 font-medium">Payment Method</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Cash on Delivery
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-700 font-bold text-sm">Total Payable</span>
                      <span className="text-base font-black text-slate-950">৳{placedOrder.total}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 flex flex-col gap-2">
                  <Link
                    href="/track-order"
                    onClick={handleCloseDrawer}
                    className="w-full py-3 bg-[#4E1C80] hover:bg-[#2D0C5F] text-white rounded-xl font-bold text-xs sm:text-sm text-center shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track Your Order</span>
                  </Link>
                  <button
                    onClick={handleCloseDrawer}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs sm:text-sm text-center transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : checkoutMode ? (
              /* Checkout Form */
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
                <div className="bg-purple-50/70 border border-purple-200/70 rounded-xl p-3 text-xs text-[#2D0C5F] font-medium leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#4E1C80] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#1d0741]">Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
                    <span className="text-slate-600 text-[11px]">
                      অর্ডার কনফার্ম করতে নিচের তথ্যগুলো পূরণ করুন। পণ্য হাতে পেয়ে মূল্য পরিশোধ করবেন।
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="আপনার পুরো নাম লিখুন"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#4E1C80]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#4E1C80]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Delivery Address *</span>
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="রোড নম্বর, বাড়ি নম্বর, এলাকা বা জেলার নাম লিখুন"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#4E1C80] resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Special Notes (Optional)</label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g. deliver after 4 PM"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#4E1C80]"
                  />
                </div>

                {/* mini Order Summary */}
                <div className="mt-3 border-t border-dashed border-slate-200 pt-3 flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Order Summary</span>
                  <div className="bg-slate-50 rounded-xl p-3 text-xs flex flex-col gap-1.5 border border-slate-100">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-slate-600 font-medium">
                        <span>{item.name} × {item.quantity}</span>
                        <span>৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 pt-2 mt-1 flex justify-between font-bold text-slate-900">
                      <span>Total Payable</span>
                      <span className="text-[#4E1C80] text-sm">৳{cartTotal}</span>
                    </div>
                  </div>
                </div>
              </form>
            ) : cart.length === 0 ? (
              /* Empty Cart */
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-950 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-400 max-w-[220px]">
                  Looks like you haven't added any products to your cart yet.
                </p>
              </div>
            ) : (
              /* Cart Items List */
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 pb-4 border-b border-slate-100 last:border-b-0"
                  >
                    {/* Item Image */}
                    <div className="relative w-16 h-16 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 leading-snug">
                        {item.name}
                      </h4>
                      <span className="text-xs sm:text-sm font-black text-slate-900">
                        ৳{item.price}
                      </span>

                      {/* Quantity Controls inside Cart */}
                      <div className="flex items-center border border-slate-200 bg-white rounded-md h-7 w-fit mt-1.5 overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 h-full text-slate-500 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 h-full text-slate-500 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer self-center"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && !orderPlaced && (
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col gap-4">
              <div className="flex items-center justify-between text-slate-900">
                <span className="text-sm font-bold text-slate-500">Subtotal</span>
                <span className="text-lg sm:text-xl font-black text-[#4E1C80]">৳{cartTotal}</span>
              </div>

              {checkoutMode ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutMode(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-3 text-center border border-slate-300 hover:bg-slate-200/40 text-slate-800 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-[#4E1C80] hover:bg-[#2D0C5F] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>অর্ডার সম্পন্ন হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Order</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCheckoutMode(true)}
                  className="w-full py-3 bg-[#4E1C80] hover:bg-[#2D0C5F] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer text-center"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
