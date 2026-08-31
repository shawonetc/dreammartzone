"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { X, Trash2, Minus, Plus, ShoppingBag, Send } from "lucide-react";
import Image from "next/image";

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
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isCartOpen) return null;

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

    // Build WhatsApp Message
    const orderItemsText = cart
      .map((item) => `- ${item.name} x${item.quantity} (৳${item.price * item.quantity})`)
      .join("\n");

    const message = `*NEW ORDER PLACED (আম্রপালি)*\n\n` +
      `*Customer Details:*\n` +
      `- Name: ${formData.name}\n` +
      `- Phone: ${formData.phone}\n` +
      `- Address: ${formData.address}\n` +
      `${formData.notes ? `- Notes: ${formData.notes}\n` : ""}\n` +
      `*Order Details:*\n${orderItemsText}\n\n` +
      `*Total Amount:* ৳${cartTotal}\n\n` +
      `Thank you!`;

    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/8801961363543?text=${encodedText}`, "_blank");

    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
      setCheckoutMode(false);
      setIsCartOpen(false);
      setFormData({ name: "", phone: "", address: "", notes: "" });
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-all duration-300 relative">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {checkoutMode ? "Checkout Info" : `Your Cart (${cartCount})`}
              </h2>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setCheckoutMode(false);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {orderPlaced ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-2">Order Submitted!</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xs">
                  We are redirecting you to WhatsApp to complete your order. Thank you for shopping with আম্রপালি!
                </p>
              </div>
            ) : checkoutMode ? (
              /* Checkout Form */
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 font-medium leading-relaxed">
                  Your order details will be sent directly to our team via WhatsApp to confirm the delivery.
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Delivery Address *</label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full street address"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-600 resize-none"
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
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* mini Order Summary */}
                <div className="mt-4 border-t border-dashed border-slate-200 pt-4 flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Order Summary</span>
                  <div className="bg-slate-50 rounded-xl p-3 text-xs flex flex-col gap-1.5">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-slate-600 font-medium">
                        <span>{item.name} x{item.quantity}</span>
                        <span>৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 pt-2 mt-1 flex justify-between font-bold text-slate-900">
                      <span>Total</span>
                      <span>৳{cartTotal}</span>
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
                <span className="text-lg sm:text-xl font-black">৳{cartTotal}</span>
              </div>

              {checkoutMode ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCheckoutMode(false)}
                    className="flex-1 py-3 text-center border border-slate-300 hover:bg-slate-200/40 text-slate-800 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                  >
                    Place Order (WhatsApp)
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
