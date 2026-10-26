"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";
import {
  mangoProducts,
  lichiProducts,
  datesProducts,
  allProducts,
  ProductItem,
  getStoredCategories,
  normalizeProduct,
  packProductForDb,
} from "@/app/data/products";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Database,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Package,
  UploadCloud,
  FileText,
  Phone,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";

export default function ProductsAdminPage() {
  const localDefaultProducts = [...mangoProducts, ...lichiProducts, ...datesProducts, ...allProducts];
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbSynced, setDbSynced] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [modalTab, setModalTab] = useState<"basic" | "description" | "contact" | "qa">("basic");
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
    highlights: string[];
    useCustomContact: boolean;
    contactHeading: string;
    contactPhone: string;
    contactEmail: string;
    contactWhatsapp: string;
    useCustomQA: boolean;
    qaList: { question: string; answer: string }[];
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
    highlights: [],
    useCustomContact: false,
    contactHeading: "Have questions or want bulk orders?",
    contactPhone: "01961363543",
    contactEmail: "info@demo21.com",
    contactWhatsapp: "01834498477",
    useCustomQA: false,
    qaList: [],
  });

  // Fetch products on mount (Supabase + localStorage fallback)
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");

      if (!error && data && data.length > 0) {
        const normalizedDbProducts = data.map(normalizeProduct);
        setProducts(normalizedDbProducts);
        setDbSynced(true);
      } else {
        const customSaved = localStorage.getItem("amropali_custom_products");
        const customProducts: ProductItem[] = customSaved ? JSON.parse(customSaved) : [];
        const base = [...localDefaultProducts];
        customProducts.forEach((cp) => {
          const idx = base.findIndex((p) => p.id === cp.id);
          if (idx >= 0) {
            base[idx] = cp;
          } else {
            base.unshift(cp);
          }
        });
        setProducts(base);
      }
    } catch (err) {
      console.log("Using local data fallback");
      const customSaved = localStorage.getItem("amropali_custom_products");
      const customProducts: ProductItem[] = customSaved ? JSON.parse(customSaved) : [];
      const base = [...localDefaultProducts];
      customProducts.forEach((cp) => {
        const idx = base.findIndex((p) => p.id === cp.id);
        if (idx >= 0) {
          base[idx] = cp;
        } else {
          base.unshift(cp);
        }
      });
      setProducts(base);
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
      highlights: [],
      useCustomContact: false,
      contactHeading: "Have questions or want bulk orders?",
      contactPhone: "01961363543",
      contactEmail: "info@demo21.com",
      contactWhatsapp: "01834498477",
      useCustomQA: false,
      qaList: [],
    });
    setModalTab("basic");
    setIsModalOpen(true);
  };

  const openEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    const prodImages = prod.images && prod.images.length > 0 ? prod.images : prod.image ? [prod.image] : [];
    const hasCustomContact = !!(
      prod.contact &&
      (prod.contact.heading || prod.contact.phone || prod.contact.email || prod.contact.whatsapp)
    );
    const hasCustomQA = !!(prod.qa && prod.qa.length > 0);

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
      highlights: prod.highlights && prod.highlights.length > 0 ? [...prod.highlights] : [],
      useCustomContact: hasCustomContact,
      contactHeading: prod.contact?.heading || "Have questions or want bulk orders?",
      contactPhone: prod.contact?.phone || "01961363543",
      contactEmail: prod.contact?.email || "info@demo21.com",
      contactWhatsapp: prod.contact?.whatsapp || "01834498477",
      useCustomQA: hasCustomQA,
      qaList: prod.qa && prod.qa.length > 0 ? [...prod.qa] : [],
    });
    setModalTab("basic");
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert("Please provide Product Name and Price");
      setModalTab("basic");
      return;
    }

    const allImages = formData.images.length > 0 ? formData.images : formData.image ? [formData.image] : [];
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
      highlights: formData.highlights.filter((h) => h.trim().length > 0),
      contact: formData.useCustomContact
        ? {
            heading: formData.contactHeading.trim(),
            phone: formData.contactPhone.trim(),
            email: formData.contactEmail.trim(),
            whatsapp: formData.contactWhatsapp.trim(),
          }
        : undefined,
      qa: formData.useCustomQA ? formData.qaList.filter((q) => q.question.trim().length > 0) : undefined,
    };

    const dbPayload = packProductForDb(newProductItem);

    try {
      // 1. Try Supabase insert/upsert to Database
      const { error } = await supabase.from("products").upsert([dbPayload]);
      if (error) {
        console.warn("Supabase upsert note:", error.message);
      } else {
        setDbSynced(true);
      }
    } catch (err) {
      console.warn("Supabase update offline or table missing, using local storage.");
    }

    // 2. Update local state & localStorage for BOTH add & edit
    const customSaved = localStorage.getItem("amropali_custom_products");
    let customProducts: ProductItem[] = customSaved ? JSON.parse(customSaved) : [];

    if (editingProduct) {
      const updatedList = products.map((p) => (p.id === editingProduct.id ? newProductItem : p));
      setProducts(updatedList);

      const existsIdx = customProducts.findIndex((p) => p.id === editingProduct.id);
      if (existsIdx >= 0) {
        customProducts[existsIdx] = newProductItem;
      } else {
        customProducts.unshift(newProductItem);
      }
      localStorage.setItem("amropali_custom_products", JSON.stringify(customProducts));
      showToast("Product updated successfully! 🎉");
    } else {
      const updatedList = [newProductItem, ...products];
      setProducts(updatedList);

      customProducts = [newProductItem, ...customProducts];
      localStorage.setItem("amropali_custom_products", JSON.stringify(customProducts));
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

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({ ...prev, image: dataUrl }));

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
    <div className="space-y-6 relative pb-12">
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
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                <span>Local Storage Active</span>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage your items, edit product tabs (Description, Contact Us, Q&amp;A), and pricing.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-sm rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-4 flex items-center space-x-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search products by title, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm font-medium focus:outline-none placeholder-slate-400"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-[#ea9219] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-100 bg-purple-50/40 text-[11px] font-black text-[#1d0741] uppercase tracking-wider">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Tabs Configured</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 text-sm font-medium text-slate-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No products found matching &quot;{search}&quot;
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-purple-50/20 transition group">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200/80">
                            <img
                              src={prod.image || (prod.images && prod.images[0]) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 group-hover:text-[#4e1c80] transition">
                              {prod.name}
                            </p>
                            <p className="text-xs text-slate-400">{prod.brand || "Dream Mart"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block bg-purple-50 text-[#4e1c80] border border-purple-200/60 px-2.5 py-0.5 rounded-full text-xs font-bold">
                          {prod.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-black text-slate-900">
                        ৳{prod.price}
                        {prod.originalPrice && (
                          <span className="text-xs text-slate-400 line-through ml-1.5 font-normal">
                            ৳{prod.originalPrice}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                          <span className={`px-2 py-0.5 rounded-md ${prod.longDescription ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                            Desc: {prod.longDescription ? "Custom" : "Standard"}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md ${prod.contact ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-purple-50 text-purple-600"}`}>
                            Contact: {prod.contact ? "Custom" : "Global"}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md ${prod.qa && prod.qa.length > 0 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-purple-50 text-purple-600"}`}>
                            Q&amp;A: {prod.qa && prod.qa.length > 0 ? `${prod.qa.length} FAQs` : "Global"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          In Stock
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                          <Link
                            href={`/product/${prod.id}`}
                            target="_blank"
                            title="View product on website"
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEditModal(prod)}
                            title="Edit product & tabs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-purple-100 p-5 sm:p-7 relative flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-4 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1d0741]">
                  {editingProduct ? "Edit Product & Page Tabs" : "Add New Product"}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Customize product details, Description, Contact Us info, and Q&amp;A FAQs.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Header */}
            <div className="flex border-b border-slate-200 gap-2 sm:gap-4 mb-5 overflow-x-auto pb-1 text-xs sm:text-sm font-bold">
              <button
                type="button"
                onClick={() => setModalTab("basic")}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  modalTab === "basic"
                    ? "border-[#4e1c80] text-[#4e1c80]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Basic Details</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("description")}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  modalTab === "description"
                    ? "border-[#4e1c80] text-[#4e1c80]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Description Tab</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("contact")}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  modalTab === "contact"
                    ? "border-[#4e1c80] text-[#4e1c80]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Contact Us Tab</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("qa")}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  modalTab === "qa"
                    ? "border-[#4e1c80] text-[#4e1c80]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Q&amp;A Tab</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 flex-1">
              
              {/* TAB 1: BASIC DETAILS */}
              {modalTab === "basic" && (
                <div className="space-y-4 animate-fadeIn">
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

                  {/* Primary Cover Image */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Primary Cover Image *
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
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center relative min-h-[120px] ${
                        isDragging
                          ? "border-[#ea9219] bg-amber-50/60 scale-[1.01]"
                          : formData.image
                          ? "border-emerald-300 bg-emerald-50/20"
                          : "border-purple-200 bg-purple-50/20 hover:bg-purple-50/40 hover:border-purple-300"
                      }`}
                    >
                      {uploadingImage ? (
                        <div className="py-3 text-center">
                          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-xs font-bold text-slate-600">Processing & uploading...</p>
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
                          <p className="text-xs font-bold text-emerald-800 flex items-center justify-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Primary cover active</span>
                          </p>
                        </div>
                      ) : (
                        <div className="py-2 space-y-1.5">
                          <div className="w-9 h-9 bg-amber-100 text-[#ea9219] rounded-xl flex items-center justify-center mx-auto shadow-xs border border-amber-200">
                            <UploadCloud className="w-4.5 h-4.5 stroke-[2.2]" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              Drag &amp; drop cover photo here, or <span className="text-[#ea9219] underline">browse file</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery Photos */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Additional Gallery Photos
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

                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-3 p-2.5 bg-purple-50/40 rounded-xl border border-purple-100">
                        {formData.images.map((imgUrl, idx) => (
                          <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white">
                            <img src={imgUrl} alt={`Gallery photo ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.images.filter((_, i) => i !== idx);
                                const updatedPrimary = formData.image === imgUrl ? updated[0] || "" : formData.image;
                                setFormData({ ...formData, image: updatedPrimary, images: updated });
                              }}
                              className="absolute top-1 right-1 bg-rose-600/90 text-white p-1 rounded-md opacity-90 hover:opacity-100 transition"
                            >
                              <X className="w-3 h-3 stroke-[3]" />
                            </button>
                            {formData.image === imgUrl && (
                              <span className="absolute bottom-1 left-1 right-1 bg-emerald-600 text-white text-[9px] font-bold text-center rounded-xs py-0.5">
                                Cover
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

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
                      className="border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/80 rounded-xl p-3 text-center cursor-pointer transition flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-slate-700">Add Gallery Photos</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DESCRIPTION & HIGHLIGHTS */}
              {modalTab === "description" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-xs text-purple-900 font-medium flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#4e1c80] shrink-0 mt-0.5" />
                    <span>
                      The details configured here will directly show up in the <strong>&quot;Description&quot;</strong> tab on the product detail page.
                    </span>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Short Tagline / Summary (Shown above order button)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief one or two line summary of the product..."
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    />
                  </div>

                  {/* Long Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Product Description (Description Tab Text)
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write comprehensive details about the product, harvest origin, taste, quality guarantees, storage tips, etc..."
                      value={formData.longDescription}
                      onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219] leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports multiple paragraphs and newlines.
                    </p>
                  </div>

                  {/* Highlights / Bullet Points */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Key Highlights / Bullet Points
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, highlights: [...formData.highlights, ""] })}
                        className="text-xs font-bold text-[#4e1c80] hover:text-[#ea9219] flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Bullet Point</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.highlights.map((point, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <input
                            type="text"
                            placeholder="e.g. 100% Organic & Chemical Free"
                            value={point}
                            onChange={(e) => {
                              const updated = [...formData.highlights];
                              updated[idx] = e.target.value;
                              setFormData({ ...formData, highlights: updated });
                            }}
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.highlights.filter((_, i) => i !== idx);
                              setFormData({ ...formData, highlights: updated });
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {formData.highlights.length === 0 && (
                        <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <p className="text-xs text-slate-400">No bullet points added yet.</p>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, highlights: [""] })}
                            className="mt-1 text-xs font-bold text-[#4e1c80] hover:underline"
                          >
                            + Add first bullet point
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CONTACT US TAB */}
              {modalTab === "contact" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">Contact Us Source</h4>
                        <p className="text-xs text-slate-500">
                          Choose whether to inherit the store default contact or customize for this product
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.useCustomContact}
                          onChange={(e) => setFormData({ ...formData, useCustomContact: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4e1c80]"></div>
                      </label>
                    </div>

                    <p className="text-xs font-bold text-[#4e1c80]">
                      {formData.useCustomContact ? "Custom contact details enabled for this product" : "Using Store Global Default Contact"}
                    </p>
                  </div>

                  {formData.useCustomContact ? (
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Contact Heading
                        </label>
                        <input
                          type="text"
                          value={formData.contactHeading}
                          onChange={(e) => setFormData({ ...formData, contactHeading: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                          placeholder="e.g. Have questions or want bulk orders?"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                            placeholder="e.g. 01961363543"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                            placeholder="e.g. info@demo21.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          WhatsApp Number
                        </label>
                        <input
                          type="text"
                          value={formData.contactWhatsapp}
                          onChange={(e) => setFormData({ ...formData, contactWhatsapp: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                          placeholder="e.g. 01834498477"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          Clicking WhatsApp on this product page will chat directly to this number.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 text-xs text-slate-600 space-y-1.5">
                      <p className="font-bold text-[#1d0741]">Currently using Store Default Contact:</p>
                      <p>• Phone: <span className="font-semibold text-slate-800">01961363543</span></p>
                      <p>• Email: <span className="font-semibold text-slate-800">info@demo21.com</span></p>
                      <p>• WhatsApp: <span className="font-semibold text-slate-800">01834498477</span></p>
                      <p className="text-[11px] text-slate-400 pt-1">
                        (You can change the global defaults at any time from Admin &gt; Store Settings)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Q&A TAB */}
              {modalTab === "qa" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">Q&amp;A / FAQs Source</h4>
                        <p className="text-xs text-slate-500">
                          Use global store FAQs or add custom questions specific to this product
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.useCustomQA}
                          onChange={(e) => setFormData({ ...formData, useCustomQA: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4e1c80]"></div>
                      </label>
                    </div>

                    <p className="text-xs font-bold text-[#4e1c80]">
                      {formData.useCustomQA ? "Custom Q&A enabled for this product" : "Using Store Global FAQs"}
                    </p>
                  </div>

                  {formData.useCustomQA ? (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Custom Questions ({formData.qaList.length})
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              qaList: [...formData.qaList, { question: "", answer: "" }],
                            })
                          }
                          className="text-xs font-bold text-[#4e1c80] hover:text-[#ea9219] flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Question</span>
                        </button>
                      </div>

                      {formData.qaList.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-[#4e1c80]">Q{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.qaList.filter((_, i) => i !== idx);
                                setFormData({ ...formData, qaList: updated });
                              }}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Question, e.g. How is this fruit packed?"
                            value={item.question}
                            onChange={(e) => {
                              const updated = [...formData.qaList];
                              updated[idx] = { ...updated[idx], question: e.target.value };
                              setFormData({ ...formData, qaList: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                          />
                          <textarea
                            rows={2}
                            placeholder="Answer..."
                            value={item.answer}
                            onChange={(e) => {
                              const updated = [...formData.qaList];
                              updated[idx] = { ...updated[idx], answer: e.target.value };
                              setFormData({ ...formData, qaList: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                          />
                        </div>
                      ))}

                      {formData.qaList.length === 0 && (
                        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <p className="text-xs text-slate-400">No custom questions added.</p>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                qaList: [{ question: "", answer: "" }],
                              })
                            }
                            className="mt-1 text-xs font-bold text-[#4e1c80] hover:underline"
                          >
                            + Add first question
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 text-xs text-slate-600 space-y-1.5">
                      <p className="font-bold text-[#1d0741]">Currently using Store Default FAQs:</p>
                      <p>• Q1: How fresh are these fruits/products?</p>
                      <p>• Q2: How long does the delivery take?</p>
                      <p className="text-[11px] text-slate-400 pt-1">
                        (You can manage store-wide FAQs from Admin &gt; Store Settings)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-purple-100 mt-6">
                <div>
                  {modalTab !== "basic" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalTab === "qa") setModalTab("contact");
                        else if (modalTab === "contact") setModalTab("description");
                        else if (modalTab === "description") setModalTab("basic");
                      }}
                      className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    >
                      ← Previous Tab
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  {modalTab !== "qa" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalTab === "basic") setModalTab("description");
                        else if (modalTab === "description") setModalTab("contact");
                        else if (modalTab === "contact") setModalTab("qa");
                      }}
                      className="px-4 py-2.5 bg-purple-100 hover:bg-purple-200 text-[#4e1c80] font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
                    >
                      Next Tab →
                    </button>
                  )}

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    {editingProduct ? "Save Product" : "Create Product"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
