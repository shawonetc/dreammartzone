"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { mangoProducts, lichiProducts, datesProducts, allProducts, ProductItem, getStoredCategories } from "@/app/data/products";
import { Plus, Edit, Trash2, Search, Database, CheckCircle2, X, Image as ImageIcon, Tag, DollarSign, Package, UploadCloud } from "lucide-react";

const CATEGORIES = ["Mango", "Lichi", "Dates", "Honey", "Ghee", "Grocery", "Organic Special"];

const PRESET_IMAGES = [
  { label: "Mango", url: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400&auto=format&fit=crop" },
  { label: "Lichi", url: "https://images.unsplash.com/photo-1527100956580-c4a91054b4a3?q=80&w=400&auto=format&fit=crop" },
  { label: "Dates", url: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?q=80&w=400&auto=format&fit=crop" },
  { label: "Honey", url: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?q=80&w=400&auto=format&fit=crop" },
  { label: "Ghee", url: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=400&auto=format&fit=crop" },
];

export default function ProductsAdminPage() {
  const localDefaultProducts = [...mangoProducts, ...lichiProducts, ...datesProducts, ...allProducts];
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbSynced, setDbSynced] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Drag and drop state & refs
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isGalleryDragging, setIsGalleryDragging] = useState(false);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    price: string;
    originalPrice: string;
    image: string;
    images: string[];
    brand: string;
    shortDescription: string;
    longDescription: string;
  }>({
    name: "",
    category: "Mango",
    price: "",
    originalPrice: "",
    image: "",
    images: [],
    brand: "Amropali Organic",
    shortDescription: "",
    longDescription: "",
  });

  // Fetch products on mount (Supabase + localStorage fallback)
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      
      // Load saved custom products from localStorage
      const customSaved = localStorage.getItem("amropali_custom_products");
      const customProducts: ProductItem[] = customSaved ? JSON.parse(customSaved) : [];

      if (!error && data && data.length > 0) {
        // Merge Supabase products with custom local products if any non-duplicates
        const merged = [...data];
        customProducts.forEach((cp) => {
          if (!merged.some((p) => p.id === cp.id)) {
            merged.unshift(cp);
          }
        });
        setProducts(merged);
        setDbSynced(true);
      } else {
        // Fallback to static data + custom local storage
        setProducts([...customProducts, ...localDefaultProducts]);
      }
    } catch (err) {
      console.log("Using local data fallback");
      const customSaved = localStorage.getItem("amropali_custom_products");
      const customProducts: ProductItem[] = customSaved ? JSON.parse(customSaved) : [];
      setProducts([...customProducts, ...localDefaultProducts]);
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
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Mango",
      price: "",
      originalPrice: "",
      image: "",
      images: [],
      brand: "Amropali Organic",
      shortDescription: "",
      longDescription: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    const prodImages = prod.images && prod.images.length > 0 ? prod.images : (prod.image ? [prod.image] : []);
    setFormData({
      name: prod.name || "",
      category: prod.category || "Mango",
      price: String(prod.price || ""),
      originalPrice: prod.originalPrice ? String(prod.originalPrice) : "",
      image: prod.image || prodImages[0] || "",
      images: prodImages,
      brand: prod.brand || "Amropali Organic",
      shortDescription: prod.shortDescription || "",
      longDescription: prod.longDescription || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert("Please provide Product Name and Price");
      return;
    }

    const allImages = formData.images.length > 0
      ? formData.images
      : (formData.image ? [formData.image] : []);

    const primaryImg = formData.image || allImages[0] || "";

    const newProductItem: ProductItem = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      price: formData.price,
      originalPrice: formData.originalPrice ? formData.originalPrice : undefined,
      image: primaryImg,
      images: allImages,
      brand: formData.brand.trim() || "Amropali Organic",
      shortDescription: formData.shortDescription.trim(),
      longDescription: formData.longDescription.trim(),
    };

    try {
      // 1. Try Supabase insert/upsert
      const { error } = await supabase.from("products").upsert([newProductItem]);
      if (error) {
        console.warn("Supabase upsert note:", error.message);
      }
    } catch (err) {
      console.warn("Supabase update offline or table missing, using local storage.");
    }

    // 2. Update local state
    if (editingProduct) {
      const updatedList = products.map((p) => (p.id === editingProduct.id ? newProductItem : p));
      setProducts(updatedList);
      showToast("Product updated successfully! 🎉");
    } else {
      const updatedList = [newProductItem, ...products];
      setProducts(updatedList);

      // Save custom item to local storage
      const customSaved = localStorage.getItem("amropali_custom_products");
      const customProducts: ProductItem[] = customSaved ? JSON.parse(customSaved) : [];
      localStorage.setItem("amropali_custom_products", JSON.stringify([newProductItem, ...customProducts]));

      showToast("New product added successfully! 🎉");
    }

    setIsModalOpen(false);
  };

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP)");
      return;
    }

    setUploadingImage(true);

    // Read as Data URL for instant local preview
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({ ...prev, image: dataUrl }));

      // Optional: upload to Supabase storage bucket
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `product_${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(`products/${fileName}`, file, { upsert: true });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(`products/${fileName}`);
          if (publicUrlData?.publicUrl) {
            setFormData((prev) => ({ ...prev, image: publicUrlData.publicUrl }));
          }
        }
      } catch (err) {
        console.log("Supabase storage upload fallback to dataUrl", err);
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

  const handleGalleryFilesProcess = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) return;

    setUploadingImage(true);

    for (const file of fileArray) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const dataUrl = event.target?.result as string;
          
          setFormData((prev) => {
            const updatedImages = [...prev.images, dataUrl];
            return {
              ...prev,
              image: prev.image ? prev.image : dataUrl,
              images: updatedImages,
            };
          });

          try {
            const fileExt = file.name.split(".").pop();
            const fileName = `product_gal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${fileExt}`;
            const { data, error } = await supabase.storage
              .from("product-images")
              .upload(`products/${fileName}`, file, { upsert: true });

            if (!error && data) {
              const { data: publicUrlData } = supabase.storage
                .from("product-images")
                .getPublicUrl(`products/${fileName}`);
              if (publicUrlData?.publicUrl) {
                const pUrl = publicUrlData.publicUrl;
                setFormData((prev) => {
                  const updated = prev.images.map((img) => (img === dataUrl ? pUrl : img));
                  return {
                    ...prev,
                    image: prev.image === dataUrl ? pUrl : prev.image,
                    images: updated,
                  };
                });
              }
            }
          } catch (err) {
            console.log("Gallery upload note:", err);
          } finally {
            resolve();
          }
        };
        reader.readAsDataURL(file);
      });
    }

    setUploadingImage(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await supabase.from("products").delete().eq("id", id);
    } catch (err) {
      console.log("Deleted locally");
    }

    const updatedList = products.filter((p) => p.id !== id);
    setProducts(updatedList);

    // Update custom items in local storage
    const customSaved = localStorage.getItem("amropali_custom_products");
    if (customSaved) {
      const customProducts: ProductItem[] = JSON.parse(customSaved);
      const filteredCustom = customProducts.filter((p) => p.id !== id);
      localStorage.setItem("amropali_custom_products", JSON.stringify(filteredCustom));
    }

    showToast("Product deleted!");
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">Products Inventory</h1>
            {dbSynced ? (
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
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage organic fruits, ghee, honey & groceries database</p>
        </div>
        
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Main Table Container */}
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
          <span className="text-xs font-bold text-[#4e1c80] bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100 self-start sm:self-auto">
            Total Products: {filteredProducts.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium animate-pulse">Loading products data...</div>
        ) : (
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      No products found. Click "Add New Product" to create one!
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-purple-50/50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={prod.image || PRESET_IMAGES[0].url}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover border border-purple-100 bg-slate-50 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                            }}
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm line-clamp-1">{prod.name}</p>
                            <p className="text-xs text-slate-400">ID: {prod.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#4e1c80]">
                        <span className="bg-purple-100/80 px-2.5 py-1 rounded-md text-xs font-bold">{prod.category}</span>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        ৳{prod.price}
                        {prod.originalPrice && (
                          <span className="ml-1.5 text-xs text-slate-400 line-through">৳{prod.originalPrice}</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          In Stock
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            title="Edit product"
                            className="p-2 text-slate-400 hover:text-[#ea9219] hover:bg-amber-50 rounded-lg transition cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            title="Delete product"
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100 p-6 sm:p-8 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1d0741]">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {editingProduct ? "Update product information" : "Fill out details to list a new product in the store"}
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
            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Rajshahi Himsagor Mango"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                />
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  >
                    {getStoredCategories().map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name} {cat.bnName ? `(${cat.bnName})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Brand / Origin
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amropali Organic"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Selling Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 250"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Original Price (৳) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 300"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
              </div>

              {/* Drag and Drop Primary Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Cover Image (Drag & Drop File) *
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
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center relative min-h-[130px] ${
                    isDragging
                      ? "border-[#ea9219] bg-amber-50/60 scale-[1.01]"
                      : formData.image
                      ? "border-emerald-300 bg-emerald-50/20"
                      : "border-purple-200 bg-purple-50/20 hover:bg-purple-50/40 hover:border-purple-300"
                  }`}
                >
                  {uploadingImage ? (
                    <div className="py-4 text-center">
                      <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-600">Processing & uploading image...</p>
                    </div>
                  ) : formData.image ? (
                    <div className="flex flex-col items-center space-y-2 w-full py-1">
                      <div className="relative group">
                        <img
                          src={formData.image}
                          alt="Primary product cover"
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md bg-white"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({ ...formData, image: "" });
                          }}
                          title="Remove Image"
                          className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full shadow-lg hover:bg-rose-700 transition"
                        >
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>

                      <div className="text-center">
                        <p className="text-xs font-bold text-emerald-800 flex items-center justify-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Primary cover selected</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 space-y-1.5">
                      <div className="w-10 h-10 bg-amber-100 text-[#ea9219] rounded-xl flex items-center justify-center mx-auto shadow-xs border border-amber-200">
                        <UploadCloud className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Drag & drop cover photo here, or <span className="text-[#ea9219] underline">browse file</span>
                        </p>
                        <p className="text-[11px] text-slate-400">Primary product thumbnail</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Gallery Images Section */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Additional Gallery Photos (Optional)
                </label>

                <input
                  type="file"
                  ref={galleryFileInputRef}
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleGalleryFilesProcess(e.target.files);
                    }
                  }}
                  className="hidden"
                />

                {/* Uploaded Gallery Thumbnails */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 mb-3 p-3 bg-purple-50/40 rounded-2xl border border-purple-100">
                    {formData.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs">
                        <img src={imgUrl} alt={`Gallery photo ${idx + 1}`} className="w-full h-full object-cover" />
                        
                        {/* Remove image button */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.images.filter((_, i) => i !== idx);
                            const updatedPrimary = formData.image === imgUrl ? (updated[0] || "") : formData.image;
                            setFormData({ ...formData, image: updatedPrimary, images: updated });
                          }}
                          className="absolute top-1 right-1 bg-rose-600/90 text-white p-1 rounded-md opacity-90 hover:opacity-100 hover:scale-105 transition"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3 stroke-[3]" />
                        </button>

                        {/* Cover Badge / Button */}
                        {formData.image === imgUrl ? (
                          <span className="absolute bottom-1 left-1 right-1 bg-emerald-600 text-white text-[9px] font-bold text-center rounded-xs py-0.5 shadow-xs">
                            Cover
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image: imgUrl })}
                            className="absolute bottom-1 left-1 right-1 bg-slate-900/80 hover:bg-[#1d0741] text-white text-[9px] font-bold text-center rounded-xs py-0.5 transition opacity-0 group-hover:opacity-100"
                          >
                            Set Cover
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Gallery Drag and Drop Box */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsGalleryDragging(true);
                  }}
                  onDragLeave={() => setIsGalleryDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsGalleryDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleGalleryFilesProcess(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => galleryFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-3.5 text-center cursor-pointer transition flex items-center justify-center space-x-3 ${
                    isGalleryDragging
                      ? "border-[#ea9219] bg-amber-50/60 scale-[1.01]"
                      : "border-slate-300 bg-slate-50 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="w-8 h-8 bg-purple-100 text-[#4e1c80] rounded-xl flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">
                      Drag & drop multiple gallery photos, or <span className="text-[#ea9219] underline">browse photos</span>
                    </p>
                    <p className="text-[10px] text-slate-400">Add side view, packaging, or detail images</p>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short tagline or summary of the fruit/product..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                />
              </div>

              {/* Action Buttons */}
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
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

