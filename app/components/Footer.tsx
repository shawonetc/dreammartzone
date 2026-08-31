"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  Lock,
  CheckCircle2,
  ChevronUp,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  return (
    <footer className="w-full bg-[#15131F] text-slate-300 text-xs sm:text-sm pt-12 pb-6 border-t border-[#2D0C5F]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-10">
          {/* Column 1: Call Box, Description, Social Icons (~4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Call Us 24/7 Pill Box */}
            <div className="inline-flex items-center gap-3 border border-slate-700/80 bg-[#2D0C5F] px-4 py-2.5 rounded-full w-fit">
              <div className="w-8 h-8 rounded-full bg-emerald-900/60 flex items-center justify-center text-emerald-400">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 leading-tight">Call Us 24/7</span>
                <span className="text-sm font-bold text-white tracking-wide">01611939511</span>
              </div>
            </div>

            {/* Brand Title */}
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Dream Mart
            </h3>

            {/* Contact details */}
            <div className="text-xs text-slate-300 flex flex-col gap-1.5 leading-relaxed max-w-sm">
              <p>📍 Address: 363, North pirerbag, Mirpur, Dhaka 1216</p>
              <p>📧 Email: dreammarthouse@gmail.com</p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-emerald-400 hover:text-slate-950 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-emerald-400 hover:text-slate-950 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-emerald-400 hover:text-slate-950 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Youtube */}
              <a
                href="#"
                aria-label="Youtube"
                className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-emerald-400 hover:text-slate-950 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Linkedin */}
              <a
                href="#"
                aria-label="Linkedin"
                className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-emerald-400 hover:text-slate-950 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Important Links (~2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Important Links
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms and Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Service (~3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Customer Service
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Column 4: Subscribe to Newsletter (~3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Subscribe to Newsletter
            </h3>
            <p className="text-xs text-slate-300">
              Subscribe to get the latest offers and new products.
            </p>

            {/* Newsletter Input Box */}
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-4 py-3 rounded-lg text-xs font-bold animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>ধন্যবাদ! আপনার সাবস্ক্রিপশন সফল হয়েছে।</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center w-full max-w-sm pt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className="w-full bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-l-md focus:outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="bg-[#EA9219] hover:bg-[#cf7b0f] text-white text-xs font-bold px-4 py-2.5 rounded-r-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Section: WE ACCEPT Payment Methods */}
        <div className="border-t border-slate-700/40 pt-6 pb-8 flex flex-col items-center gap-4">
          <span className="text-[11px] font-bold tracking-widest text-slate-300 uppercase">
            WE ACCEPT
          </span>

          {/* Payment Badges Image */}
          <div className="w-full flex justify-center">
            <img 
              src="https://demo21.sellsull.com/ssl_commerze.png" 
              alt="Payment Methods (VISA, Mastercard, AMEX, bKash, Nagad, Rocket, DBBL, mCash, MYCash, t-cash, Upay, iPay, OKWallet, GMoney)" 
              className="max-w-full md:max-w-2xl lg:max-w-3xl object-contain"
            />
          </div>
        </div>

        {/* Bottom Bar: Copyright & Security Pills */}
        <div className="border-t border-slate-700/40 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Scroll to Top + Copyright */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-[#4E1C80] border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <span className="text-slate-300 text-xs">
              © {new Date().getFullYear()} Dream Mart. All rights reserved.
            </span>
          </div>

          {/* Security Pills */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 border border-slate-700/80 bg-[#2D0C5F] px-3 py-1 rounded-lg text-[11px] text-slate-200">
              <Lock className="w-3 h-3 text-slate-300" />
              <span>SSL Secure</span>
            </div>
            <div className="flex items-center gap-1.5 border border-slate-700/80 bg-[#2D0C5F] px-3 py-1 rounded-lg text-[11px] text-slate-200">
              <Lock className="w-3 h-3 text-slate-300" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 border border-slate-700/80 bg-[#2D0C5F] px-3 py-1 rounded-lg text-[11px] text-slate-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Verified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
