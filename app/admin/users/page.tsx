"use client";

import React from "react";
import { Edit, UserPlus } from "lucide-react";

const sampleUsers = [
  { id: "USR-1", name: "Jahirul Islam khan", email: "jahirul@example.com", phone: "01700000000", role: "Customer", orders: 3 },
  { id: "USR-2", name: "তানভীর আহমেদ", email: "tanvir@example.com", phone: "01811112233", role: "Customer", orders: 5 },
  { id: "USR-3", name: "সাদিয়া আরফিন", email: "sadia@example.com", phone: "01922334455", role: "Customer", orders: 2 },
  { id: "USR-4", name: "রফিকুল ইসলাম", email: "rafiq@example.com", phone: "01555667788", role: "Customer", orders: 1 },
  { id: "USR-5", name: "ম্যানেজার সাহেব", email: "admin@dreammart.com", phone: "01711223344", role: "Super Admin", orders: 0 }
];

export default function UsersAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">Users & Customers</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage user accounts and admin roles</p>
        </div>
        <button className="px-5 py-2.5 bg-[#4e1c80] hover:bg-[#2d0c5f] text-white font-bold text-sm rounded-xl shadow transition flex items-center justify-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 min-w-[600px]">
            <thead className="text-xs font-bold text-purple-900/60 uppercase tracking-wider border-b border-purple-100 bg-purple-50/30">
              <tr>
                <th className="py-3.5 px-4">User Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50 font-medium">
              {sampleUsers.map((u) => (
                <tr key={u.id} className="hover:bg-purple-50/50 transition">
                  <td className="py-4 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-4 px-4">
                    <div>{u.email}</div>
                    <div className="text-xs text-slate-400">{u.phone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'Super Admin' ? 'bg-purple-100 text-[#4e1c80]' : 'bg-slate-100 text-slate-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">{u.orders}</td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-[#ea9219]">
                      <Edit className="w-4 h-4" />
                    </button>
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
