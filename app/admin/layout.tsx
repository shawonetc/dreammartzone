"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import {
  LayoutDashboard,
  BarChart2,
  Package,
  ShoppingBag,
  Users,
  Bell,
  Settings,
  Globe,
  LogOut,
  Search,
  Menu,
  X,
  FolderTree,
  ShieldAlert,
  Loader2,
  SlidersHorizontal
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check Supabase authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Allow if session exists or demo session flag exists in localStorage
      const demoAuth = typeof window !== "undefined" && localStorage.getItem("dream_admin_auth");
      
      if (session || demoAuth === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/signin?redirect=/admin");
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        const demoAuth = typeof window !== "undefined" && localStorage.getItem("dream_admin_auth");
        if (demoAuth !== "true") {
          setIsAuthenticated(false);
          router.push("/signin?redirect=/admin");
        }
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      localStorage.removeItem("dream_admin_auth");
    }
    router.push("/signin");
  };

  // Show loading spinner while checking authorization
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#15131f] flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-10 h-10 text-[#ea9219] animate-spin mb-4" />
        <p className="text-base font-bold text-purple-200">Verifying Admin Authentication...</p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, category: "OVERVIEW" },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart2, category: "OVERVIEW" },
    { name: "Categories", href: "/admin/categories", icon: FolderTree, category: "MANAGEMENT" },
    { name: "Products", href: "/admin/products", icon: Package, category: "MANAGEMENT" },
    { name: "Hero Banners", href: "/admin/banners", icon: SlidersHorizontal, category: "MANAGEMENT" },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag, category: "MANAGEMENT" },
    { name: "Users", href: "/admin/users", icon: Users, category: "MANAGEMENT" },
    { name: "Notifications", href: "/admin/notifications", icon: Bell, category: "SYSTEM" },
    { name: "Settings", href: "/admin/settings", icon: Settings, category: "SYSTEM" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#15131f] flex flex-col md:flex-row font-sans antialiased relative">
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed md:static top-0 bottom-0 left-0 z-50 w-72 bg-[#1d0741] text-purple-200 flex flex-col justify-between flex-shrink-0 min-h-screen transform transition-transform duration-300 ease-in-out border-r border-purple-900/50 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand / Logo */}
          <div className="p-5 flex items-center justify-between border-b border-purple-900/60 bg-[#15131f]">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-white p-1 flex items-center justify-center shrink-0 border border-purple-500/40 shadow-sm">
                <Image
                  src="/logo1.png"
                  alt="Dream Mart Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white leading-none">
                  Dream<span className="text-[#f2b51d]">Mart</span>
                </span>
                <span className="text-[10px] font-bold text-[#ea9219] uppercase tracking-widest mt-1">
                  Admin Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden text-purple-300 hover:text-white p-1"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="px-5 py-6 space-y-6">
            {/* OVERVIEW */}
            <div>
              <p className="px-3 text-xs font-extrabold uppercase tracking-widest text-purple-400/80 mb-3">
                OVERVIEW
              </p>
              <nav className="space-y-1.5">
                {navItems.filter(i => i.category === "OVERVIEW").map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl font-semibold text-base transition ${
                        isActive
                          ? "text-white bg-[#4e1c80] border-l-4 border-[#f2b51d] shadow-md"
                          : "hover:text-white hover:bg-purple-900/40"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-[#f2b51d]" : "text-purple-300"}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* MANAGEMENT */}
            <div>
              <p className="px-3 text-xs font-extrabold uppercase tracking-widest text-purple-400/80 mb-3">
                MANAGEMENT
              </p>
              <nav className="space-y-1.5">
                {navItems.filter(i => i.category === "MANAGEMENT").map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl font-semibold text-base transition ${
                        isActive
                          ? "text-white bg-[#4e1c80] border-l-4 border-[#f2b51d] shadow-md"
                          : "hover:text-white hover:bg-purple-900/40"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-[#f2b51d]" : "text-purple-300"}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* SYSTEM */}
            <div>
              <p className="px-3 text-xs font-extrabold uppercase tracking-widest text-purple-400/80 mb-3">
                SYSTEM
              </p>
              <nav className="space-y-1.5">
                {navItems.filter(i => i.category === "SYSTEM").map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`flex items-center space-x-3.5 px-4 py-3 rounded-xl font-semibold text-base transition ${
                        isActive
                          ? "text-white bg-[#4e1c80] border-l-4 border-[#f2b51d] shadow-md"
                          : "hover:text-white hover:bg-purple-900/40"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-[#f2b51d]" : "text-purple-300"}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-purple-900/60 space-y-4">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-purple-200 hover:text-white hover:bg-purple-900/40 rounded-xl transition"
          >
            <Globe className="w-5 h-5 text-[#f2b51d]" />
            <span>View Website</span>
          </Link>

          <div className="bg-[#2d0c5f] p-3.5 rounded-2xl flex items-center justify-between border border-purple-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-extrabold flex items-center justify-center text-sm shadow">
                D
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white leading-none">Dream Mart</p>
                <p className="text-xs font-medium text-purple-300 mt-1">Store Manager</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="text-purple-300 hover:text-white transition p-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-white">
        {/* Top Search & Profile Bar */}
        <header className="bg-white border-b border-purple-100 px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2.5 text-purple-900 hover:text-[#4e1c80] rounded-xl bg-purple-50 transition"
              aria-label="Open Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-sm sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="Search orders, products..."
                className="w-full pl-11 pr-4 py-2.5 bg-purple-50/60 border border-purple-100 rounded-xl text-sm text-slate-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-[#4e1c80]/40"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 ml-3">
            <Link
              href="/admin/notifications"
              className="relative p-2.5 text-purple-700 hover:text-[#4e1c80] rounded-full hover:bg-purple-50 transition"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#ea9219] animate-pulse"></span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4e1c80] to-[#ea9219] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                D
              </div>
              <div className="text-left leading-tight hidden md:block">
                <p className="text-sm font-bold text-slate-900">Dream Mart</p>
                <p className="text-xs text-purple-600 font-medium">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="p-5 sm:p-8 lg:p-10 space-y-8 w-full bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
