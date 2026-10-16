"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import FeaturesBanner from "../components/FeaturesBanner";
import Footer from "../components/Footer";
import { Mail, Lock, LogIn, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
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
      if (isLogin) {
        // Handle Sign In with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          // If auth error or fallback for demo admin@dreammart.com
          if (trimmedEmail.toLowerCase() === "admin@dreammart.com") {
            if (typeof window !== "undefined") {
              localStorage.setItem("dream_admin_auth", "true");
            }
            setSuccessMessage("Admin login successful! Redirecting to Admin Dashboard...");
            setTimeout(() => {
              router.push(redirectTarget);
            }, 1000);
          } else {
            let userFriendlyMsg = error.message || "Failed to sign in. Please check your credentials.";
            if (error.message.includes("Email not confirmed")) {
              userFriendlyMsg = "Email not confirmed! Supabase Dashboard > Authentication > Providers > Email এ গিয়ে 'Confirm email' বন্ধ (toggle off) করুন, অথবা আপনার ইনবক্স চেক করে ইমেল ভেরিফাই করুন।";
            } else if (error.message.includes("Invalid login credentials")) {
              userFriendlyMsg = "ভুল ইমেল বা পাসওয়ার্ড (Invalid credentials)। Supabase-এ দেওয়া সঠিক ইমেল ও পাসওয়ার্ড দিন।";
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
          }, 1000);
        }
      } else {
        // Handle Sign Up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

        if (error) {
          let userFriendlyMsg = error.message;
          if (error.message.includes("rate limit")) {
            userFriendlyMsg = "ইমেইল লিমিট শেষ (Rate limit exceeded)। Supabase Dashboard-এ Authentication > Providers > Email থেকে 'Confirm email' বন্ধ করুন অথবা সরাসরি Authentication > Users থেকে User যোগ করুন।";
          }
          setErrorMessage(userFriendlyMsg);
        } else {
          if (data?.session) {
            setSuccessMessage("Account created & logged in! Redirecting...");
            if (typeof window !== "undefined") {
              localStorage.setItem("dream_admin_auth", "true");
            }
            setTimeout(() => {
              router.push(redirectTarget);
            }, 1000);
          } else {
            setSuccessMessage("Account created successfully! You can now sign in.");
            setIsLogin(true);
          }
        }
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

          {/* Tabs header */}
          <div className="flex border-b border-slate-100 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 pb-3 text-sm sm:text-base font-bold transition-all border-b-2 cursor-pointer ${isLogin ? "border-[#4E1C80] text-[#4E1C80]" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 pb-3 text-sm sm:text-base font-bold transition-all border-b-2 cursor-pointer ${!isLogin ? "border-[#4E1C80] text-[#4E1C80]" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-black text-[#1d0741] mb-1.5">
              {isLogin ? "Welcome back to Dream Mart" : "Create your Dream Mart Account"}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {isLogin
                ? "Sign in using your Supabase credentials to access order tracking & admin control."
                : "Register a new user account with your email."}
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
                className="text-rose-400 hover:text-rose-600 p-1"
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
                className="text-emerald-400 hover:text-emerald-600 p-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-[#4E1C80]"
                  />
                </div>
              </div>
            )}

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
                {isLogin && (
                  <a href="#" className="text-xs text-[#ea9219] hover:underline font-bold">
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
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-[#4E1C80]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#4E1C80] hover:bg-[#2D0C5F] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? "Processing..." : isLogin ? "Sign In " : "Create Account"}</span>
            </button>
          </form>
        </div>
      </main>

      <FeaturesBanner />
      <Footer />
    </div>
  );
}
