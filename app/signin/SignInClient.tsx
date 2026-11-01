"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import FeaturesBanner from "../components/FeaturesBanner";
import Footer from "../components/Footer";
import { Mail, Lock, LogIn, AlertCircle, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedEmail = email.trim();

    try {
      // Handle Sign In with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        // Fallback for demo admin credential
        if (trimmedEmail.toLowerCase() === "admin@dreammart.com") {
          if (typeof window !== "undefined") {
            localStorage.setItem("dream_admin_auth", "true");
          }
          setSuccessMessage("Admin login successful! Redirecting to Admin Dashboard...");
          setTimeout(() => {
            router.push(redirectTarget);
          }, 800);
        } else {
          let userFriendlyMsg = error.message || "Failed to sign in. Please check your credentials.";
          if (error.message.includes("Email not confirmed")) {
            userFriendlyMsg = "Email not confirmed! Supabase Dashboard > Authentication > Providers > Email এ গিয়ে 'Confirm email' বন্ধ করুন, অথবা আপনার ইনবক্স চেক করে ইমেল ভেরিফাই করুন।";
          } else if (error.message.includes("Invalid login credentials")) {
            userFriendlyMsg = "ভুল ইমেল বা পাসওয়ার্ড (Invalid login credentials)। অনুগ্রহ করে সঠিক ইমেল ও পাসওয়ার্ড দিন।";
          } else if (error.message.includes("Failed to fetch") || error.message.includes("fetch failed")) {
            userFriendlyMsg = "Supabase সার্ভারে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে ইন্টারনেট ও Supabase URL চেক করুন।";
          }
          setErrorMessage(userFriendlyMsg);
        }
      } else {
        setSuccessMessage("Successfully signed in! Redirecting...");
        if (typeof window !== "undefined") {
          localStorage.setItem("dream_admin_auth", "true");
        }
        setTimeout(() => {
          router.push(redirectTarget);
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F7] text-slate-800 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex items-center justify-center">
        {/* Authentication Card */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 max-w-md w-full">
          
          {/* Card Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-[#4E1C80] mb-3.5 shadow-2xs border border-purple-100">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-[#1d0741] tracking-tight">
              Sign In to Dream Mart
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              অ্যাডমিন প্যানেল ও ড্যাশবোর্ডে প্রবেশ করতে আপনার তথ্য দিন।
            </p>
          </div>

          {/* Floating Modern Notification Toasts */}
          {errorMessage && (
            <div className="mb-5 p-4 bg-rose-50/90 border border-rose-200/80 rounded-2xl flex items-center justify-between gap-3 text-rose-900 text-xs font-bold shadow-md animate-fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-extrabold text-rose-900 text-sm">Sign In Error</p>
                  <p className="text-xs text-rose-700 font-medium mt-0.5">{errorMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage("")}
                className="text-rose-400 hover:text-rose-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3 text-emerald-900 text-xs font-bold shadow-md animate-fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="font-extrabold text-emerald-900 text-sm">Success!</p>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">{successMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage("")}
                className="text-emerald-400 hover:text-emerald-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Sign In Form */}
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
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-[#4E1C80]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Password</label>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#4E1C80]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#4E1C80] hover:bg-[#2D0C5F] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>
        </div>
      </main>

      <FeaturesBanner />
      <Footer />
    </div>
  );
}
