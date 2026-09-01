"use client";

import React from "react";
import { Bell, Package, ShoppingBag } from "lucide-react";

export default function NotificationsAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">Notifications & Alerts</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Real-time system updates and order alerts</p>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-5 h-5 text-[#ea9219]" />
            <span className="text-sm font-bold text-amber-900">New Order #ORD-33 received from Jahirul Islam khan</span>
          </div>
          <span className="text-xs text-amber-700 font-semibold">10 mins ago</span>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="w-5 h-5 text-[#4e1c80]" />
            <span className="text-sm font-bold text-purple-900">Stock updated for Dinajpur Lichi (100 Pcs)</span>
          </div>
          <span className="text-xs text-purple-700 font-semibold">1 hour ago</span>
        </div>
      </div>
    </div>
  );
}
