"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import {
  Search,
  Truck,
  User,
  Heart,
  ShoppingBag,
  Menu,
  ChevronDown,
  PhoneCall,
  ChevronRight,
  X,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const navCategories = [
  { name: "Mango", href: "/category/Mango", hasDropdown: false },
  { name: "Oil & Ghee", href: "/category/Oil & Ghee", hasDropdown: false },
  { name: "Honey", href: "/category/Honey", hasDropdown: false },
  { name: "Dates", href: "/category/Dates", hasDropdown: false },
  { name: "Spices", href: "/category/Spices", hasDropdown: false },
  { name: "Nuts & Seeds", href: "/category/Nuts & Seeds", hasDropdown: true },
  { name: "Beverage", href: "/category/Beverage", hasDropdown: true },
  { name: "Flours & Lentils", href: "/category/Flours & Lentils", hasDropdown: false },
  { name: "Pickle", href: "/category/Pickle", hasDropdown: false },
  { name: "Lichi", href: "/category/Lichi", hasDropdown: false },
  { name: "Rice", href: "/category/Rice", hasDropdown: false },
];

const headerCategories = navCategories.slice(0, 5); // Only display top 5 categories in the header bar

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { cartCount, setIsCartOpen } = useCart();

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        const demoAuth = typeof window !== "undefined" && localStorage.getItem("dream_admin_auth");
        if (demoAuth === "true") {
          setUserEmail("Admin");
        }
      }
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        const demoAuth = typeof window !== "undefined" && localStorage.getItem("dream_admin_auth");
        if (demoAuth === "true") {
          setUserEmail("Admin");
        } else {
          setUserEmail(null);
        }
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      localStorage.removeItem("dream_admin_auth");
    }
    setUserEmail(null);
    router.push("/signin");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="w-full bg-white shadow-xs sticky top-0 z-50">
      {/* Top Bar / Brand header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer select-none shrink-0">
          <Image
            src="/logo1.png"
            alt="Dream Mart Logo"
            width={300}
            height={90}
            priority
            className="object-contain h-10 sm:h-14 w-auto"
          />
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-4 hidden md:flex items-center">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter product name..."
              className="w-full py-2 pl-4 pr-12 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-4 bg-[#151E4A] hover:bg-[#0c122e] text-white rounded-r-full transition-colors flex items-center justify-center cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4 sm:gap-6 text-slate-700 text-xs font-medium">
          <Link href="/track-order" className="hidden sm:flex flex-col items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer">
            <Truck className="w-5 h-5 stroke-[1.5]" />
            <span>Track Order</span>
          </Link>
          
          {userEmail ? (
            <div className="relative group">
              <Link href="/admin" className="flex flex-col items-center gap-1 text-[#4E1C80] hover:text-[#2D0C5F] transition-colors cursor-pointer">
                <div className="relative">
                  <ShieldCheck className="w-5 h-5 stroke-[2] text-[#4E1C80]" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
                </div>
                <span className="font-bold text-[11px] max-w-[80px] truncate text-center">
                  Admin Panel
                </span>
              </Link>
            </div>
          ) : (
            <Link href="/signin" className="flex flex-col items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer">
              <User className="w-5 h-5 stroke-[1.5]" />
              <span>Sign In</span>
            </Link>
          )}
          
          <Link href="/wishlist" className="hidden sm:flex flex-col items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer">
            <Heart className="w-5 h-5 stroke-[1.5]" />
            <span>Wishlist</span>
          </Link>
          
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-1 hover:text-emerald-700 transition-colors relative cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <span className="absolute -top-1.5 -right-2.5 bg-[#EA9219] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <span>Cart</span>
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex flex-col items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer md:hidden"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <form onSubmit={handleSearchSubmit} className="px-4 pb-3 md:hidden">
        <div className="relative w-full flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter product name..."
            className="w-full py-2 pl-4 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-emerald-600"
          />
          <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 bg-[#151E4A] hover:bg-[#0c122e] text-white rounded-r-full cursor-pointer">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Navigation Category Bar (Plum Background) */}
      <nav className="bg-[#2D0C5F] text-white text-xs font-semibold overflow-visible relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start gap-5">
          
          {/* Shop By Category Dropdown Button (PC View Only) */}
          <div className="relative hidden md:block py-1.5 shrink-0">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-2 bg-[#4E1C80] hover:bg-[#3d1664] px-4 py-1.5 rounded-md text-white border border-[#2D0C5F]/60 font-bold transition-all cursor-pointer shadow-xs select-none"
            >
              <Menu className="w-4 h-4" />
              <span>Shop By Category</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75" />
            </button>

            {/* Dropdown Menu */}
            {isCategoryMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setIsCategoryMenuOpen(false)} 
                />
                <div className="absolute left-0 mt-2.5 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 text-slate-800 z-50 animate-fade-in">
                  {navCategories.map((cat, idx) => (
                    <Link
                      key={idx}
                      href={cat.href}
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs sm:text-sm font-bold hover:bg-slate-50 hover:text-emerald-700 transition-colors group"
                    >
                      <span>{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-700 transition-colors" />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Category List */}
          <div className="flex items-center gap-5 sm:gap-6 py-1.5 overflow-x-auto scrollbar-none flex-1">
            {headerCategories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="flex items-center gap-1 whitespace-nowrap hover:text-amber-300 transition-colors py-0.5"
              >
                <span>{cat.name}</span>
                {cat.hasDropdown && <ChevronDown className="w-3 h-3 opacity-75" />}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer/Sidebar for Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="fixed inset-y-0 right-0 w-64 max-w-xs bg-white shadow-2xl flex flex-col h-full z-50 transform transition-transform duration-300">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="font-bold text-sm sm:text-base text-slate-900">Categories</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {navCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-emerald-700 transition-colors border-b border-slate-50 last:border-b-0"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>

            {/* Mobile Drawer Auth Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col gap-2">
              {userEmail ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 bg-[#4E1C80] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full py-2 px-4 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 bg-[#4E1C80] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
