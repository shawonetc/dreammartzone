"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Download,
  Filter,
  Users,
  Award,
  ChevronDown
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [activeMetric, setActiveMetric] = useState<"revenue" | "orders">("revenue");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(5);

  // Revenue chart dataset for 30d
  const chartData = [
    { label: "১ সেপ", revenue: 14200, orders: 12 },
    { label: "৫ সেপ", revenue: 21500, orders: 18 },
    { label: "১০ সেপ", revenue: 18900, orders: 15 },
    { label: "১৫ সেপ", revenue: 34200, orders: 28 },
    { label: "২০ সেপ", revenue: 29800, orders: 24 },
    { label: "২৫ সেপ", revenue: 42500, orders: 35 },
    { label: "৩০ সেপ", revenue: 48900, orders: 41 },
  ];

  const categoryBreakdown = [
    { name: "আম (Mangoes)", percent: 38, amount: "৳৬৫,৫০০", color: "bg-[#ea9219]" },
    { name: "খেজুর (Dates)", percent: 27, amount: "৳৪৬,২০০", color: "bg-[#4e1c80]" },
    { name: "মধু ও ঘি (Honey & Ghee)", percent: 20, amount: "৳৩৪,৪০০", color: "bg-emerald-500" },
    { name: "লিচু ও অন্যান্য (Lichi & Grocery)", percent: 15, amount: "৳২৫,৮০০", color: "bg-amber-500" },
  ];

  const topProducts = [
    { id: 1, name: "রাজশাহী হিমসাগর আম (৫ কেজি)", sales: 142, revenue: "৳১,৮৫০/বক্স", total: "৳৩৫,৫০০", growth: "+২৪%" },
    { id: 2, name: "মেদজুল প্রিমিয়াম খেজুর (১ কেজি)", sales: 98, revenue: "৳১,২০০/কেজি", total: "৳২৬,৪০০", growth: "+১৮%" },
    { id: 3, name: "সুন্দরবনের খাঁটি প্রাকৃতিক মধু (১ কেজি)", sales: 74, revenue: "৳১,৫০০/কেজি", total: "৳২২,৫০০", growth: "+১২%" },
    { id: 4, name: "দিনাজপুরের বোম্বাই লিচু (১০০ পিস)", sales: 65, revenue: "৳৭৫০/প্যাক", total: "৳১৬,২৫০", growth: "+৯%" },
  ];

  // Map revenue values to SVG point paths
  const maxRevenue = 60000;
  const svgWidth = 700;
  const svgHeight = 200;
  const points = chartData.map((d, index) => {
    const x = (index / (chartData.length - 1)) * (svgWidth - 60) + 30;
    const val = activeMetric === "revenue" ? d.revenue : d.orders * 1200;
    const y = svgHeight - (val / maxRevenue) * (svgHeight - 40) - 20;
    return { x, y, data: d };
  });

  // Create smooth bezier curve SVG string
  const createBezierPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const linePath = createBezierPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">
              Sales & Analytics Report
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 animate-pulse">
              ● Live Data
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Real-time revenue, order growth, category breakdown and sales trends
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  timeRange === range
                    ? "bg-[#4e1c80] text-white shadow-xs"
                    : "text-slate-600 hover:text-purple-950"
                }`}
              >
                {range === "7d" ? "৭ দিন" : range === "30d" ? "৩০ দিন" : "৯০ দিন"}
              </button>
            ))}
          </div>

          <button className="px-4 py-2 bg-[#ea9219] hover:bg-[#d68314] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ea9219] to-amber-300"></div>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-[#ea9219] group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-[#1d0741]">৳১,৬৮,৯০০</h2>
            <div className="mt-2 flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>+১৬.৪% গত মাসের তুলনায়</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4e1c80] to-purple-400"></div>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-[#4e1c80] group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-[#1d0741]">১৯৯ টি</h2>
            <div className="mt-2 flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>+১২.২% গত মাসের তুলনায়</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Avg Order Value</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-[#1d0741]">৳১,২৪৮</h2>
            <div className="mt-2 flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>+৪.৮% গড়ের চেয়ে বেশি</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs hover:shadow-md transition group relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Repeat Customers</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-[#1d0741]">৪২.৫%</h2>
            <div className="mt-2 flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>+৫.১% লয়াল কাস্টমার</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Revenue Trend Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-purple-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-[#1d0741]">Revenue Trend Over Time</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              দৈনিক সেলস এবং মোট অর্ডারের পারফরম্যান্স গ্রাফ
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveMetric("revenue")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeMetric === "revenue"
                  ? "bg-white text-[#4e1c80] shadow-xs"
                  : "text-slate-600 hover:text-purple-950"
              }`}
            >
              রেভিনিউ (৳)
            </button>
            <button
              onClick={() => setActiveMetric("orders")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                activeMetric === "orders"
                  ? "bg-white text-[#4e1c80] shadow-xs"
                  : "text-slate-600 hover:text-purple-950"
              }`}
            >
              অর্ডার সংখ্যা
            </button>
          </div>
        </div>

        {/* SVG Interactive Chart Box */}
        <div className="relative bg-gradient-to-b from-purple-50/30 to-white rounded-2xl border border-purple-100 p-4 sm:p-6 overflow-hidden">
          {/* Chart Header Stats Overlay */}
          {hoveredPointIndex !== null && (
            <div className="mb-4 flex items-center justify-between bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-purple-100 shadow-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ea9219]"></span>
                <span className="text-xs font-bold text-slate-600">
                  তারিখ: <strong className="text-[#1d0741]">{chartData[hoveredPointIndex].label}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs font-bold">
                <span className="text-slate-600">
                  মোট সেলস: <strong className="text-[#ea9219]">৳{chartData[hoveredPointIndex].revenue.toLocaleString("bn-BD")}</strong>
                </span>
                <span className="text-slate-600">
                  অর্ডার: <strong className="text-[#4e1c80]">{chartData[hoveredPointIndex].orders} টি</strong>
                </span>
              </div>
            </div>
          )}

          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 700 240" className="w-full min-w-[500px] h-60 overflow-visible">
              <defs>
                {/* Gradient Fill under line */}
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ea9219" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ea9219" stopOpacity="0.0" />
                </linearGradient>
                {/* Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Horizontal Gridlines */}
              {[0, 50, 100, 150].map((gridY, i) => (
                <g key={i}>
                  <line
                    x1="20"
                    y1={gridY + 20}
                    x2="680"
                    y2={gridY + 20}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text x="25" y={gridY + 16} fill="#94a3b8" fontSize="10" fontWeight="bold">
                    ৳{((4 - i) * 15).toLocaleString("bn-BD")}k
                  </text>
                </g>
              ))}

              {/* Smooth Area Gradient Fill */}
              <path d={areaPath} fill="url(#chartGradient)" />

              {/* Main Smooth Line */}
              <path
                d={linePath}
                fill="none"
                stroke="#ea9219"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />

              {/* Interactive Data Circles */}
              {points.map((pt, idx) => (
                <g
                  key={idx}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredPointIndex(idx)}
                >
                  {/* Invisible enlarged hit target */}
                  <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                  {/* Outer Pulsing Ring on Hover */}
                  {hoveredPointIndex === idx && (
                    <circle cx={pt.x} cy={pt.y} r="10" fill="#ea9219" opacity="0.3" className="animate-ping" />
                  )}

                  {/* Circle point */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPointIndex === idx ? "7" : "5"}
                    fill="#white"
                    stroke="#ea9219"
                    strokeWidth="3"
                    className="transition-all duration-200"
                  />

                  {/* Vertical Guide Line on Hover */}
                  {hoveredPointIndex === idx && (
                    <line
                      x1={pt.x}
                      y1={pt.y}
                      x2={pt.x}
                      y2="200"
                      stroke="#4e1c80"
                      strokeDasharray="2 2"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              ))}

              {/* X Axis Labels */}
              {points.map((pt, idx) => (
                <text
                  key={idx}
                  x={pt.x}
                  y="225"
                  textAnchor="middle"
                  fill={hoveredPointIndex === idx ? "#4e1c80" : "#64748b"}
                  fontSize="11"
                  fontWeight={hoveredPointIndex === idx ? "bold" : "normal"}
                >
                  {pt.data.label}
                </text>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Category Breakdown & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Performance */}
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[#1d0741]">ক্যাটাগরি ভিত্তিক সেলস</h3>
            <span className="text-xs font-bold text-slate-400">মোট ৪ টি ক্যাটাগরি</span>
          </div>

          <div className="space-y-4">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">{cat.name}</span>
                  <div className="space-x-2">
                    <span className="text-slate-500">{cat.amount}</span>
                    <span className="text-[#4e1c80]">{cat.percent}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cat.color}`}
                    style={{ width: `${cat.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[#1d0741]">টপ সেলিং প্রোডাক্টস</h3>
            <span className="text-xs font-bold text-[#ea9219]">সেরা ৪টি</span>
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 hover:bg-purple-50/50 px-2 rounded-xl transition">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#4e1c80] flex items-center justify-center text-xs font-black shrink-0">
                    #{item.id}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">{item.sales} টি বিক্রি হয়েছে</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-[#1d0741]">{item.total}</p>
                  <span className="text-[10px] font-bold text-emerald-600">{item.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

