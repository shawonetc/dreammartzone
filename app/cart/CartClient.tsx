"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import FeaturesBanner from "../components/FeaturesBanner";
import Footer from "../components/Footer";
import Image from "next/image";
import { Trash2, ShoppingBag, Minus, Plus, Send, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getStoredSettings } from "../data/settings";

export default function CartClient() {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
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

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }

    const orderItemsText = cart
      .map((item) => `- ${item.name} (Qty: ${item.quantity}) - ৳${item.price * item.quantity}`)
      .join("\n");

    const message =
      `*New Order from Dream Mart*\n\n` +
      `*Customer Details:*\n` +
      `- Name: ${formData.name}\n` +
      `- Phone: ${formData.phone}\n` +
      `- Address: ${formData.address}\n` +
      `${formData.notes ? `- Notes: ${formData.notes}\n` : ""}\n` +
      `*Order Details:*\n${orderItemsText}\n\n` +
      `*Total Amount:* ৳${cartTotal}\n\n` +
      `Thank you!`;

    const encodedText = encodeURIComponent(message);
    const storeNumber = (getStoredSettings().contact?.whatsapp || "01834498477").replace(/\D/g, "");
    const formattedNumber = storeNumber.startsWith("01") ? `88${storeNumber}` : storeNumber;
    window.open(`https://wa.me/${formattedNumber}?text=${encodedText}`, "_blank");

    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
      setFormData({ name: "", phone: "", address: "", notes: "" });
    }, 3000);
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
          <ShoppingBag className="w-6 h-6 stroke-[2.2] text-slate-900" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart ({cartCount})
          </h1>
        </div>

        {orderPlaced ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center max-w-md mx-auto shadow-2xs mt-8">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 mx-auto animate-bounce">
              <Send className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-950 mb-2">Order Confirmed!</h2>
            <p className="text-slate-500 text-sm">
              We are opening WhatsApp to coordinate your delivery. Thanks for choosing Dream Mart!
            </p>
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
              <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-emerald-700 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* Right side: Checkout & Order Form (cols 5) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Billing Details & Checkout
                </h2>

                <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Recipient Name *</label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-600"
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
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-600"
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
                      placeholder="Enter delivery address details"
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-600 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Delivery Notes (Optional)</label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any specific instructions..."
                      className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-600"
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
                    <span className="text-sm font-bold">Total Amount</span>
                    <span className="text-xl font-black">৳{cartTotal}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  type="submit"
                  onClick={handlePlaceOrder}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Place Order via WhatsApp</span>
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
              You haven't added any products to your cart yet. Fill it with our fresh organic fruits!
            </p>
            <Link
              href="/"
              className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-sm hover:bg-emerald-800 transition-colors inline-block"
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
