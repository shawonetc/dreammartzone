"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { CategoryItem, defaultCategories, getStoredCategories, getCustomUserProducts } from "@/app/data/products";
import { Plus, Edit, Trash2, Search, Database, CheckCircle2, X, UploadCloud, FolderTree, Tag } from "lucide-react";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbSynced, setDbSynced] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drag and drop state & refs
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    bnName: string;
    image: string;
    description: string;
  }>({
    name: "",
    bnName: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("categories").select("*");
      
      const localCategories = getStoredCategories();

      if (!error && data && data.length > 0) {
        const merged = [...data];
        localCategories.forEach((lc) => {
          if (!merged.some((c) => c.id === lc.id)) {
            merged.push(lc);
          }
        });
        setCategories(merged);
        setDbSynced(true);
      } else {
        setCategories(localCategories);
      }
    } catch (err) {
      setCategories(getStoredCategories());
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

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      bnName: "",
      image: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || "",
      bnName: cat.bnName || "",
      image: cat.image || "",
      description: cat.description || "",
    });
    setIsModalOpen(true);
  };

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP)");
      return;
    }

    setUploadingImage(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({ ...prev, image: dataUrl }));

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `category_${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(`categories/${fileName}`, file, { upsert: true });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(`categories/${fileName}`);
          if (publicUrlData?.publicUrl) {
            setFormData((prev) => ({ ...prev, image: publicUrlData.publicUrl }));
          }
        }
      } catch (err) {
        console.log("Storage upload note:", err);
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter a Category Name");
      return;
    }

    const catId = editingCategory ? editingCategory.id : formData.name.toLowerCase().trim().replace(/\s+/g, "-");

    const categoryItem: CategoryItem = {
      id: catId,
      name: formData.name.trim(),
      bnName: formData.bnName.trim() || undefined,
      image: formData.image.trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300",
      description: formData.description.trim() || undefined,
    };

    try {
      await supabase.from("categories").upsert([categoryItem]);
    } catch (err) {
      console.log("Saved locally");
    }

    let updatedList: CategoryItem[];
    if (editingCategory) {
      updatedList = categories.map((c) => (c.id === editingCategory.id ? categoryItem : c));
      showToast("Category updated successfully! 🎉");
    } else {
      updatedList = [categoryItem, ...categories.filter((c) => c.id !== categoryItem.id)];
      showToast("New category created successfully! 🎉");
    }

    setCategories(updatedList);
    localStorage.setItem("amropali_custom_categories", JSON.stringify(updatedList));
    setIsModalOpen(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await supabase.from("categories").delete().eq("id", id);
    } catch (err) {
      console.log("Deleted locally");
    }

    const updatedList = categories.filter((c) => c.id !== id);
    setCategories(updatedList);
    localStorage.setItem("amropali_custom_categories", JSON.stringify(updatedList));
    showToast("Category deleted!");
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.bnName?.toLowerCase().includes(search.toLowerCase())
  );

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
            <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">Category Manager</h1>
            {dbSynced ? (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                <FolderTree className="w-3.5 h-3.5" />
                <span>Local Sync</span>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">Create, edit, & manage product categories shown on the homepage</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Main Content Table */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-purple-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category by name or Bangla title..."
              className="w-full pl-11 pr-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4e1c80]/40"
            />
          </div>
          <span className="text-xs font-bold text-[#4e1c80] bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100 self-start sm:self-auto">
            Total Categories: {filteredCategories.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium animate-pulse">Loading categories...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 min-w-[600px]">
              <thead className="text-xs font-bold text-purple-900/60 uppercase tracking-wider border-b border-purple-100 bg-purple-50/30">
                <tr>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Bangla Title</th>
                  <th className="py-3.5 px-4">ID / Slug</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 font-medium">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400">
                      No categories found. Click "Add New Category" to create one!
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-purple-50/50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-12 h-12 rounded-xl object-cover border border-purple-100 bg-slate-50 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300";
                            }}
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{cat.name}</p>
                            {cat.description && <p className="text-xs text-slate-400 line-clamp-1">{cat.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#4e1c80]">
                        {cat.bnName ? (
                          <span className="bg-purple-100/80 px-3 py-1 rounded-md text-xs">{cat.bnName}</span>
                        ) : (
                          <span className="text-slate-400 text-xs italic">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-slate-500">{cat.id}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(cat)}
                            title="Edit Category"
                            className="p-2 text-slate-400 hover:text-[#ea9219] hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            title="Delete Category"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100 p-6 sm:p-8 relative">
            <div className="flex items-center justify-between border-b border-purple-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1d0741]">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {editingCategory ? "Update category information" : "Create a new category to show on the homepage"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Honey"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bangla Title <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. খাঁটি মধু"
                  value={formData.bnName}
                  onChange={(e) => setFormData({ ...formData, bnName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                />
              </div>

              {/* Drag and Drop Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Image (Drag & Drop File)
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center relative min-h-[140px] ${
                    isDragging
                      ? "border-[#ea9219] bg-amber-50/60 scale-[1.01]"
                      : formData.image
                      ? "border-emerald-300 bg-emerald-50/20"
                      : "border-purple-200 bg-purple-50/20 hover:bg-purple-50/40"
                  }`}
                >
                  {uploadingImage ? (
                    <div className="py-4 text-center">
                      <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-600">Uploading category image...</p>
                    </div>
                  ) : formData.image ? (
                    <div className="flex flex-col items-center space-y-2 w-full py-2">
                      <div className="relative group">
                        <img
                          src={formData.image}
                          alt="Category preview"
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md bg-white"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({ ...formData, image: "" });
                          }}
                          className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full shadow-lg hover:bg-rose-700 transition"
                        >
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-emerald-800">Image selected & ready</p>
                    </div>
                  ) : (
                    <div className="py-3 space-y-2">
                      <div className="w-10 h-10 bg-amber-100 text-[#ea9219] rounded-xl flex items-center justify-center mx-auto shadow-xs border border-amber-200">
                        <UploadCloud className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Drag & drop category image, or <span className="text-[#ea9219] underline">browse file</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Category summary or details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                />
              </div>

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
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
