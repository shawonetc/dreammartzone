"use client";

import React from "react";
import Link from "next/link";
import { BarChart2, TrendingUp, DollarSign, ShoppingBag, ArrowUpRight, ArrowDownRight, RefreshCw, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">Sales & Analytics Report</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Real-time revenue, order growth and performance trends</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2.5 bg-white border border-purple-200 hover:bg-purple-50 text-purple-900 text-sm font-bold rounded-xl shadow-xs transition flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#4e1c80]" />
            <span>This Month (Sep 2026)</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Gross Revenue</span>
            <DollarSign className="w-5 h-5 text-[#ea9219]" />
          </div>
          <h2 className="text-3xl font-black text-[#1d0741]">৳১,৪৮,৫০০</h2>
          <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>+14.2% vs previous month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Average Order Value</span>
            <ShoppingBag className="w-5 h-5 text-[#4e1c80]" />
          </div>
          <h2 className="text-3xl font-black text-[#1d0741]">৳১,২৫০</h2>
          <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>+5.8% vs previous month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Repeat Customer Rate</span>
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-3xl font-black text-[#1d0741]">38.5%</h2>
          <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>+3.1% higher retention</span>
          </div>
        </div>
      </div>

      {/* Visual Chart Placeholder */}
      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-[#1d0741]">Revenue Trend Over Time</h3>
        <div className="h-64 bg-purple-50/40 rounded-xl border border-purple-100 flex items-center justify-center p-4">
          <svg viewBox="0 0 500 150" className="w-full h-full">
            <path
              d="M 10 120 Q 80 40, 160 90 T 320 30 T 490 70"
              fill="none"
              stroke="#ea9219"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
