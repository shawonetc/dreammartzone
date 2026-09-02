"use client";

import React, { useState, useEffect } from "react";
import { Eye, Edit, Clock, CheckCircle2, Truck, XCircle, Database, Search, X, User, Phone, MapPin, DollarSign, Package, AlertCircle } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";

export interface OrderItem {
  id: string;
  customer: string;
  phone: string;
  address?: string;
  product: string;
  amount: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  payment: string;
  notes?: string;
}

const fallbackOrders: OrderItem[] = [
  { id: "#ORD-33", customer: "Jahirul Islam khan", phone: "01700000000", address: "Mirpur 10, Dhaka", product: "Waterproof Bedsheet", amount: "1150", status: "Delivered", date: "01 Sep 2026", payment: "Cash on Delivery" },
  { id: "#ORD-32", customer: "তানভীর আহমেদ", phone: "01811112233", address: "Rajshahi Sadar", product: "মেদজুল খেজুর (১ কেজি) × ২", amount: "2400", status: "Processing", date: "01 Sep 2026", payment: "bKash" },
  { id: "#ORD-31", customer: "সাদিয়া আরফিন", phone: "01922334455", address: "Chittagong GEC", product: "দিনাজপুরের বোম্বাই লিচু (১০০ পিস)", amount: "750", status: "Shipped", date: "31 Aug 2026", payment: "Nagad" }
];

const STATUS_OPTIONS: OrderItem["status"][] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<OrderItem>({
    id: "",
    customer: "",
    phone: "",
    address: "",
    product: "",
    amount: "",
    status: "Pending",
    date: "",
    payment: "Cash on Delivery",
    notes: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("orders").select("*");
      
      const savedLocal = localStorage.getItem("amropali_custom_orders");
      const localOrders: OrderItem[] = savedLocal ? JSON.parse(savedLocal) : [];

      if (!error && data && data.length > 0) {
        const formatted: OrderItem[] = data.map((o: any) => ({
          id: String(o.id).startsWith("#") ? o.id : `#ORD-${o.id}`,
          customer: o.customer_name || "Customer",
          phone: o.customer_phone || "N/A",
          address: o.address || "Dhaka, Bangladesh",
          product: Array.isArray(o.items) ? o.items.map((i: any) => i.name).join(", ") : (o.product || "Organic Product"),
          amount: String(o.total_amount || o.amount || "0").replace("৳", "").trim(),
          status: o.status || "Processing",
          date: o.created_at ? new Date(o.created_at).toLocaleDateString("en-GB") : "Today",
          payment: o.payment_method || "Cash on Delivery",
          notes: o.notes || "",
        }));

        // Merge Supabase orders with custom local orders
        const merged = [...formatted];
        localOrders.forEach((lo) => {
          if (!merged.some((m) => m.id === lo.id)) {
            merged.unshift(lo);
          }
        });

        setOrders(merged);
        setIsLive(true);
      } else {
        setOrders(localOrders.length > 0 ? localOrders : fallbackOrders);
      }
    } catch (err) {
      console.log("Fallback to local orders data");
      const savedLocal = localStorage.getItem("amropali_custom_orders");
      const localOrders: OrderItem[] = savedLocal ? JSON.parse(savedLocal) : [];
      setOrders(localOrders.length > 0 ? localOrders : fallbackOrders);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const openEditModal = (ord: OrderItem) => {
    setEditingOrder(ord);
    setFormData({ ...ord });
    setIsModalOpen(true);
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    const updatedOrder: OrderItem = {
      ...formData,
      amount: String(formData.amount).replace("৳", "").trim(),
    };

    // 1. Try Supabase update
    try {
      const cleanId = editingOrder.id.replace("#ORD-", "");
      await supabase.from("orders").update({
        customer_name: updatedOrder.customer,
        customer_phone: updatedOrder.phone,
        address: updatedOrder.address,
        status: updatedOrder.status,
        total_amount: updatedOrder.amount,
        payment_method: updatedOrder.payment,
        notes: updatedOrder.notes,
      }).eq("id", cleanId);
    } catch (err) {
      console.log("Supabase update fallback");
    }

    // 2. Update local state
    const updatedList = orders.map((o) => (o.id === editingOrder.id ? updatedOrder : o));
    setOrders(updatedList);
    localStorage.setItem("amropali_custom_orders", JSON.stringify(updatedList));

    showToast(`Order ${updatedOrder.id} updated successfully! 🎉`);
    setIsModalOpen(false);
  };

  const handleQuickStatusChange = async (ord: OrderItem, newStatus: OrderItem["status"]) => {
    const updatedOrder: OrderItem = { ...ord, status: newStatus };
    
    try {
      const cleanId = ord.id.replace("#ORD-", "");
      await supabase.from("orders").update({ status: newStatus }).eq("id", cleanId);
    } catch (err) {
      console.log("Saved locally");
    }

    const updatedList = orders.map((o) => (o.id === ord.id ? updatedOrder : o));
    setOrders(updatedList);
    localStorage.setItem("amropali_custom_orders", JSON.stringify(updatedList));

    showToast(`Status updated to ${newStatus}`);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1d0741] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-amber-400/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">Orders Management</h1>
            {isLive ? (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                <Package className="w-3.5 h-3.5" />
                <span>Local Sync</span>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">Track, process, edit & manage customer orders database</p>
        </div>
        <span className="text-xs font-bold text-[#4e1c80] bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100 self-start sm:self-auto">
          Total: {filteredOrders.length} Orders
        </span>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-6">
        {/* Search & Status Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-purple-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, customer, or phone..."
              className="w-full pl-11 pr-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4e1c80]/40"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
            {["All", ...STATUS_OPTIONS].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#1d0741] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium animate-pulse">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 min-w-[700px]">
              <thead className="text-xs font-bold text-purple-900/60 uppercase tracking-wider border-b border-purple-100 bg-purple-50/30">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 font-medium">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-purple-50/50 transition">
                      <td className="py-4 px-4 font-bold text-[#4e1c80]">{ord.id}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{ord.customer}</div>
                        <div className="text-xs text-slate-400">{ord.phone}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-700 max-w-[200px] truncate" title={ord.product}>
                        {ord.product}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">৳{ord.amount}</td>
                      <td className="py-4 px-4 text-xs font-bold text-purple-700">{ord.payment}</td>
                      <td className="py-4 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleQuickStatusChange(ord, e.target.value as OrderItem["status"])}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition ${
                            ord.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : ord.status === "Processing"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : ord.status === "Shipped"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : ord.status === "Cancelled"
                              ? "bg-rose-100 text-rose-800 border-rose-200"
                              : "bg-purple-100 text-purple-800 border-purple-200"
                          }`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(ord)}
                            title="Edit / View Order"
                            className="p-2 text-slate-500 hover:text-[#ea9219] hover:bg-amber-50 rounded-lg transition cursor-pointer flex items-center space-x-1 font-bold text-xs"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Order Modal */}
      {isModalOpen && editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100 p-6 sm:p-8 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1d0741] flex items-center space-x-2">
                  <span>Edit Order {editingOrder.id}</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Update customer details, shipping status, and order details
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveOrder} className="space-y-4">
              {/* Order Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Order Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderItem["status"] })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  rows={2}
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full customer delivery address..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                />
              </div>

              {/* Product Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ordered Products
                </label>
                <input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                />
              </div>

              {/* Amount & Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Total Amount (৳) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={formData.payment}
                    onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              {/* Internal Notes / Tracking */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Courier / Tracking Notes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Steadfast Tracking ID: SF-88291"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 font-bold text-sm rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-sm rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Save Order Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

