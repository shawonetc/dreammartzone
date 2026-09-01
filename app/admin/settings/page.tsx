"use client";

import React from "react";
import { Save } from "lucide-react";

export default function SettingsAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">Store Settings</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Configure store settings, business profile and preferences</p>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Store Name</label>
            <input type="text" defaultValue="Dream Mart" className="w-full p-3 bg-purple-50/40 border border-purple-100 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4e1c80]/40" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Support Phone Number</label>
            <input type="text" defaultValue="+880 1700 000000" className="w-full p-3 bg-purple-50/40 border border-purple-100 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4e1c80]/40" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Support Email</label>
            <input type="email" defaultValue="support@dreammart.com" className="w-full p-3 bg-purple-50/40 border border-purple-100 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4e1c80]/40" />
          </div>
        </div>

        <button className="px-6 py-3 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-sm rounded-xl shadow-md transition flex items-center space-x-2">
          <Save className="w-4.5 h-4.5" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
