"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import FeaturesBanner from "../components/FeaturesBanner";
import Footer from "../components/Footer";
import { Mail, Lock, LogIn } from "lucide-react";

export default function SignInClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isLogin ? "Sign In simulation successful!" : "Sign Up simulation successful!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F7] text-slate-800 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        {/* Authentication Card */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8 max-w-md w-full">
          
          {/* Tabs header */}
          <div className="flex border-b border-slate-100 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-3 text-sm sm:text-base font-bold transition-all border-b-2 cursor-pointer ${
                isLogin ? "border-[#4E1C80] text-[#4E1C80]" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-3 text-sm sm:text-base font-bold transition-all border-b-2 cursor-pointer ${
                !isLogin ? "border-[#4E1C80] text-[#4E1C80]" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-1.5">
              {isLogin ? "Welcome back!" : "Join Dream Mart"}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {isLogin ? "Sign in to access your wishlist, cart, and order tracking info." : "Register to track orders and save your details."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Password</label>
                {isLogin && (
                  <a href="#" className="text-xs text-emerald-700 hover:text-emerald-800 font-bold">
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-[#4E1C80] hover:bg-[#2D0C5F] text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLogin ? "Sign In" : "Register"}</span>
            </button>
          </form>
        </div>
      </main>

      <FeaturesBanner />
      <Footer />
    </div>
  );
}
