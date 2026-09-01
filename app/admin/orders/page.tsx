"use client";

import React, { useState, useEffect } from "react";
import { Eye, Edit, Clock, CheckCircle2, Truck, XCircle, Database } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";

const fallbackOrders = [
  { id: "#ORD-33", customer: "Jahirul Islam khan", phone: "01700000000", product: "Waterproof Bedsheet", amount: "৳১,১৫০", status: "Delivered", date: "01 Sep 2026", payment: "Cash on Delivery" },
  { id: "#ORD-32", customer: "তানভীর আহমেদ", phone: "01811112233", product: "মেদজুল খেজুর (১ কেজি) × ২", amount: "৳২,৪০০", status: "Processing", date: "01 Sep 2026", payment: "bKash" },
  { id: "#ORD-31", customer: "সাদিয়া আরফিন", phone: "01922334455", product: "দিনাজপুরের বোম্বাই লিচু (১০০ পিস)", amount: "৳৭৫০", status: "Shipped", date: "31 Aug 2026", payment: "Nagad" }
];

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<any[]>(fallbackOrders);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    fetchOrdersFromSupabase();
  }, []);

  const fetchOrdersFromSupabase = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("orders").select("*");
      if (!error && data && data.length > 0) {
        const formatted = data.map((o: any) => ({
          id: o.id,
          customer: o.customer_name,
          phone: o.customer_phone,
          product: Array.isArray(o.items) ? o.items.map((i: any) => i.name).join(", ") : "Grocery Item",
          amount: `৳${o.total_amount}`,
          status: o.status,
          date: o.created_at ? new Date(o.created_at).toLocaleDateString("en-GB") : "Recently",
          payment: o.payment_method || "Cash on Delivery"
        }));
        setOrders(formatted);
        setIsLive(true);
      }
    } catch (err) {
      console.log("Fallback to demo orders data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">Orders Management</h1>
            {isLive && (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Live</span>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">Track and process real customer orders from Supabase database</p>
        </div>
        <span className="text-xs font-bold text-[#4e1c80] bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100 self-start sm:self-auto">
          Total: {orders.length} Orders
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 min-w-[650px]">
            <thead className="text-xs font-bold text-purple-900/60 uppercase tracking-wider border-b border-purple-100 bg-purple-50/30">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Products</th>
                <th className="py-3.5 px-4">Total Price</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50 font-medium">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-purple-50/50 transition">
                  <td className="py-4 px-4 font-bold text-[#4e1c80]">{ord.id}</td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{ord.customer}</div>
                    <div className="text-xs text-slate-400">{ord.phone}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-700">{ord.product}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{ord.amount}</td>
                  <td className="py-4 px-4 text-xs font-bold text-purple-700">{ord.payment}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        ord.status === "Delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : ord.status === "Processing"
                          ? "bg-amber-100 text-amber-800"
                          : ord.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1.5 text-slate-400 hover:text-[#4e1c80]">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-[#ea9219]">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
