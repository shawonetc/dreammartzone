"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag as ShoppingBagIcon,
  Users as UsersIcon,
  PackageCheck,
  ChevronRight,
  Download,
  Plus,
  Database
} from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";
import { mangoProducts, lichiProducts, datesProducts, allProducts } from "@/app/data/products";

const fallbackOrders = [
  { id: "#ORD-33", customer: "Jahirul Islam khan", phone: "01700000000", product: "Waterproof Bedsheet", amount: "৳১,১৫০", status: "Delivered" },
  { id: "#ORD-32", customer: "তানভীর আহমেদ", phone: "01811112233", product: "মেদজুল খেজুর (১ কেজি) × ২", amount: "৳২,৪০০", status: "Processing" },
  { id: "#ORD-31", customer: "সাদিয়া আরফিন", phone: "01922334455", product: "দিনাজপুরের বোম্বাই লিচু (১০০ পিস)", amount: "৳৭৫০", status: "Shipped" }
];

export default function DashboardOverviewPage() {
  const localProducts = [...mangoProducts, ...lichiProducts, ...datesProducts, ...allProducts];
  const [productsCount, setProductsCount] = useState<number>(localProducts.length);
  const [orders, setOrders] = useState<any[]>(fallbackOrders);
  const [revenue, setRevenue] = useState<number>(1150);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    fetchDashboardRealData();

    // 1. Storage event listener for immediate updates across tabs
    const handleStorageChange = () => {
      fetchDashboardRealData();
    };
    window.addEventListener("storage", handleStorageChange);

    // 2. Supabase Realtime channel to capture new orders inserted into database
    const channel = supabase
      .channel("admin-dashboard-realtime-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchDashboardRealData();
        }
      )
      .subscribe();

    // 3. Polling interval every 4 seconds to guarantee synchronization
    const pollInterval = setInterval(() => {
      fetchDashboardRealData();
    }, 4000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, []);

  const fetchDashboardRealData = async () => {
    try {
      // 1. Fetch live product count from Supabase
      const { data: prodData, error: prodErr } = await supabase.from("products").select("id");
      if (!prodErr && prodData && prodData.length > 0) {
        setProductsCount(prodData.length);
        setIsLive(true);
      }

      // 2. Fetch live orders from Supabase with newest first (created_at descending)
      const { data: orderData, error: orderErr } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      const savedLocal = typeof window !== "undefined" ? localStorage.getItem("amropali_custom_orders") : null;
      const localOrders: any[] = savedLocal ? JSON.parse(savedLocal) : [];

      const mergedMap = new Map<string, any>();

      // 1. First add live Supabase orders
      if (!orderErr && orderData && orderData.length > 0) {
        orderData.forEach((o: any) => {
          const cleanId = String(o.id).replace(/^[#\s]*(ORD-?)*/i, "");
          const formattedId = `#ORD-${cleanId}`;
          mergedMap.set(formattedId, {
            id: formattedId,
            customer: o.customer_name || "Customer",
            phone: o.customer_phone || "N/A",
            product: Array.isArray(o.items)
              ? o.items.map((i: any) => `${i.name} × ${i.quantity || 1}`).join(", ")
              : (o.product || "Product"),
            amount: `৳${o.total_amount || o.amount || 0}`,
            rawAmount: Number(String(o.total_amount || o.amount || 0).replace(/[^\d.]/g, "")) || 0,
            status: o.status || "Pending",
            created_at: o.created_at || new Date().toISOString(),
          });
        });
        setIsLive(true);
      }

      // 2. Merge local orders (ensuring newly placed local orders are never missed)
      localOrders.forEach((lo: any) => {
        const cleanId = String(lo.id).replace(/^[#\s]*(ORD-?)*/i, "");
        const formattedId = `#ORD-${cleanId}`;
        if (!mergedMap.has(formattedId)) {
          mergedMap.set(formattedId, {
            id: formattedId,
            customer: lo.customer || lo.customer_name || "Customer",
            phone: lo.phone || lo.customer_phone || "N/A",
            product: lo.product || (Array.isArray(lo.items) ? lo.items.map((i: any) => `${i.name} × ${i.quantity || 1}`).join(", ") : "Product"),
            amount: String(lo.amount).startsWith("৳") ? lo.amount : `৳${lo.amount}`,
            rawAmount: Number(String(lo.amount).replace(/[^\d.]/g, "")) || 0,
            status: lo.status || "Pending",
            created_at: lo.created_at || new Date().toISOString(),
          });
        }
      });

      let finalOrders: any[] = Array.from(mergedMap.values());

      if (finalOrders.length === 0) {
        finalOrders = fallbackOrders.map((f, idx) => ({
          ...f,
          rawAmount: Number(String(f.amount).replace(/[^\d.]/g, "")) || 0,
          created_at: new Date(Date.now() - (idx + 1) * 3600000).toISOString(),
        }));
      } else {
        // ALWAYS sort descending so the newest order appears at the VERY TOP
        finalOrders.sort((a, b) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
          if (timeA !== timeB) return timeB - timeA;
          return String(b.id).localeCompare(String(a.id));
        });
      }

      setOrders(finalOrders);
      const sum = finalOrders.reduce((acc: number, curr: any) => acc + (curr.rawAmount || 0), 0);
      setRevenue(sum);
    } catch (err) {
      console.log("Using static data fallback for dashboard overview");
    }
  };

  const totalCustomersCount = new Set(
    orders.map((o) => o.phone || o.customer).filter(Boolean)
  ).size || 12;

  return (
    <div className="space-y-8">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">Dashboard Overview</h1>
            {isLive && (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Live Data</span>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">Welcome back! Real-time analytics from your Supabase database.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-purple-200 hover:bg-purple-50 text-purple-900 text-sm font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-2">
            <Download className="w-4.5 h-4.5 text-[#4e1c80]" />
            <span>Export</span>
          </button>
          <Link
            href="/admin/products"
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] hover:opacity-95 text-sm font-black rounded-xl shadow-md transition flex items-center justify-center space-x-2"
          >
            <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards Grid (Clickable to respective details pages) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Revenue -> /admin/analytics */}
        <Link
          href="/admin/analytics"
          className="group bg-white p-5 sm:p-6 rounded-2xl border border-purple-100 shadow-xs space-y-4 hover:shadow-lg hover:border-purple-300 transition-all duration-200 transform hover:-translate-y-1 block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-[#ea9219] group-hover:scale-110 transition-transform">
              <span className="text-xl sm:text-2xl font-black">৳</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-purple-50 text-[#4e1c80] flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:bg-[#4e1c80] group-hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">Total Revenue</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1d0741] mt-1">৳{revenue.toLocaleString()}</h3>
            <p className="text-[11px] font-bold text-[#4e1c80] mt-2 flex items-center gap-1 group-hover:underline">
              <span>View Analytics</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </Link>

        {/* Card 2: Total Orders -> /admin/orders */}
        <Link
          href="/admin/orders"
          className="group bg-white p-5 sm:p-6 rounded-2xl border border-purple-100 shadow-xs space-y-4 hover:shadow-lg hover:border-purple-300 transition-all duration-200 transform hover:-translate-y-1 block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-[#4e1c80] group-hover:scale-110 transition-transform">
              <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="w-7 h-7 rounded-full bg-purple-50 text-[#4e1c80] flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:bg-[#4e1c80] group-hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">Total Orders</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1d0741] mt-1">{orders.length}</h3>
            <p className="text-[11px] font-bold text-[#4e1c80] mt-2 flex items-center gap-1 group-hover:underline">
              <span>Manage Orders</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </Link>

        {/* Card 3: Total Customers -> /admin/users */}
        <Link
          href="/admin/users"
          className="group bg-white p-5 sm:p-6 rounded-2xl border border-purple-100 shadow-xs space-y-4 hover:shadow-lg hover:border-purple-300 transition-all duration-200 transform hover:-translate-y-1 block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="w-7 h-7 rounded-full bg-purple-50 text-[#4e1c80] flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:bg-[#4e1c80] group-hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">Total Customers</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1d0741] mt-1">{totalCustomersCount}</h3>
            <p className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1 group-hover:underline">
              <span>+5.4% • View Customers</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </Link>

        {/* Card 4: Total Products -> /admin/products */}
        <Link
          href="/admin/products"
          className="group bg-white p-5 sm:p-6 rounded-2xl border border-purple-100 shadow-xs space-y-4 hover:shadow-lg hover:border-purple-300 transition-all duration-200 transform hover:-translate-y-1 block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <PackageCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="w-7 h-7 rounded-full bg-purple-50 text-[#4e1c80] flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:bg-[#4e1c80] group-hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">Total Products</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1d0741] mt-1">{productsCount}</h3>
            <p className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1 group-hover:underline">
              <span>Manage Products</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </Link>
      </div>

      {/* Main Grid: Orders & Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Recent Orders Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-purple-100 shadow-xs p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1d0741]">Recent Orders (Real Supabase Data)</h2>
            <Link
              href="/admin/orders"
              className="text-sm font-bold text-[#4e1c80] hover:text-[#2d0c5f] flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
            <table className="w-full text-left text-sm text-slate-700 min-w-[560px]">
              <thead className="text-xs font-bold text-purple-900/60 uppercase tracking-wider border-b border-purple-100 bg-purple-50/30">
                <tr>
                  <th className="py-3.5 px-3 font-semibold">Order ID</th>
                  <th className="py-3.5 px-3 font-semibold">Customer</th>
                  <th className="py-3.5 px-3 font-semibold">Product</th>
                  <th className="py-3.5 px-3 font-semibold">Amount</th>
                  <th className="py-3.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 font-medium">
                {orders.slice(0, 8).map((ord, idx) => (
                  <tr key={`${ord.id}-${idx}`} className="hover:bg-purple-50/50 transition">
                    <td className="py-4 px-3 font-bold text-[#4e1c80] text-sm">
                      <div className="flex items-center gap-1.5">
                        <span>{ord.id}</span>
                        {idx === 0 && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-3 text-slate-900 font-bold">
                      <div>{ord.customer}</div>
                      <div className="text-xs text-slate-400 font-normal">{ord.phone}</div>
                    </td>
                    <td className="py-4 px-3 text-slate-700 max-w-[160px] truncate text-sm">{ord.product}</td>
                    <td className="py-4 px-3 font-bold text-slate-900 text-sm">{ord.amount}</td>
                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          ord.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : ord.status === "Shipped"
                            ? "bg-indigo-100 text-indigo-800"
                            : ord.status === "Pending"
                            ? "bg-amber-100 text-amber-900 border border-amber-200"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Analytics Chart */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1d0741]">Sales Analytics</h2>
              <p className="text-xs text-slate-400 mt-0.5">Store performance trends (14 days)</p>
            </div>
            <Link
              href="/admin/analytics"
              className="px-3 py-1.5 bg-purple-50 text-[#4e1c80] font-bold text-xs rounded-lg hover:bg-purple-100 transition"
            >
              Full Report
            </Link>
          </div>

          <div className="relative pt-2 pb-2">
            <svg viewBox="0 0 400 150" className="w-full h-36 sm:h-40 overflow-visible">
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ea9219" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ea9219" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 110 Q 50 120, 80 40 T 160 60 T 240 20 T 320 50 T 390 80 L 390 140 L 10 140 Z"
                fill="url(#purpleGrad)"
              />
              <path
                d="M 10 110 Q 50 120, 80 40 T 160 60 T 240 20 T 320 50 T 390 80"
                fill="none"
                stroke="#ea9219"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>

            <div className="flex justify-between text-xs font-semibold text-slate-400 pt-2 px-1 border-t border-purple-100">
              <span>Apr 21</span>
              <span>Apr 24</span>
              <span>Apr 27</span>
              <span>Apr 30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
