"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { mangoProducts, lichiProducts, datesProducts, allProducts, ProductItem } from "@/app/data/products";
import { Plus, Edit, Trash2, Search, Database, CheckCircle2 } from "lucide-react";

export default function ProductsAdminPage() {
  const localProducts = [...mangoProducts, ...lichiProducts, ...datesProducts, ...allProducts];
  const [products, setProducts] = useState<ProductItem[]>(localProducts);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbSynced, setDbSynced] = useState(false);

  // Fetch products from Supabase on mount
  useEffect(() => {
    fetchProductsFromSupabase();
  }, []);

  const fetchProductsFromSupabase = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data && data.length > 0) {
        setProducts(data);
        setDbSynced(true);
      }
    } catch (err) {
      console.log("Using static data fallback");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">Products Inventory</h1>
            {dbSynced && (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Live</span>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage all organic fruits, ghee, honey & groceries in Supabase Database</p>
        </div>
        <button className="px-5 py-2.5 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2">
          <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-purple-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product by name or category..."
              className="w-full pl-11 pr-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4e1c80]/40"
            />
          </div>
          <span className="text-xs font-bold text-[#4e1c80] bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100">
            Total Products: {filteredProducts.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 min-w-[600px]">
            <thead className="text-xs font-bold text-purple-900/60 uppercase tracking-wider border-b border-purple-100 bg-purple-50/30">
              <tr>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50 font-medium">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-purple-50/50 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border border-purple-100" />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{prod.name}</p>
                        <p className="text-xs text-slate-400">ID: {prod.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#4e1c80]">
                    <span className="bg-purple-100/80 px-2.5 py-1 rounded-md text-xs font-bold">{prod.category}</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">৳{prod.price}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      In Stock
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1.5 text-slate-400 hover:text-[#ea9219]">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
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
