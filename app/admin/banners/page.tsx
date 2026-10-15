"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  SlidersHorizontal, 
  Plus, 
  Edit, 
  Trash2, 
  UploadCloud, 
  ExternalLink, 
  CheckCircle2, 
  Eye, 
  Sparkles, 
  X, 
  RotateCcw, 
  Database,
  ArrowUpRight,
  Layers,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";
import { BannerItem, defaultBanners, getStoredBanners } from "@/app/data/banners";

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<BannerItem[]>(defaultBanners);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbSynced, setDbSynced] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Preview Carousel active slide state
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [targetSlot, setTargetSlot] = useState<"main" | "side-top" | "side-bottom">("main");

  // Form State
  const [formData, setFormData] = useState<{
    id: string;
    slot: "main" | "side-top" | "side-bottom";
    title: string;
    image: string;
    link: string;
    badge: string;
    is_active: boolean;
  }>({
    id: "",
    slot: "main",
    title: "",
    image: "",
    link: "/shop",
    badge: "",
    is_active: true,
  });

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const fetchBanners = async () => {
    setLoading(true);
    const local = getStoredBanners();
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setBanners(data);
        setDbSynced(true);
        localStorage.setItem("dream_custom_banners", JSON.stringify(data));
      } else {
        setBanners(local.length > 0 ? local : defaultBanners);
      }
    } catch (err) {
      setBanners(local.length > 0 ? local : defaultBanners);
    } finally {
      setLoading(false);
    }
  };

  // Sync changes to both Supabase and LocalStorage
  const persistBanners = async (newList: BannerItem[], updatedItem?: BannerItem, isDeleteId?: string) => {
    setBanners(newList);
    localStorage.setItem("dream_custom_banners", JSON.stringify(newList));

    try {
      if (isDeleteId) {
        await supabase.from("banners").delete().eq("id", isDeleteId);
      } else if (updatedItem) {
        await supabase.from("banners").upsert([updatedItem]);
      }
      setDbSynced(true);
    } catch (err) {
      console.warn("Supabase banners offline/missing table, saved locally:", err);
    }
  };

  // Open Edit Modal
  const openEditModal = (banner: BannerItem) => {
    setEditingBanner(banner);
    setTargetSlot(banner.slot);
    setFormData({
      id: banner.id,
      slot: banner.slot,
      title: banner.title || "",
      image: banner.image || "",
      link: banner.link || "/shop",
      badge: banner.badge || "",
      is_active: banner.is_active !== undefined ? banner.is_active : true,
    });
    setIsModalOpen(true);
  };

  // Open Add Slide Modal (for main carousel)
  const openAddSlideModal = () => {
    setEditingBanner(null);
    setTargetSlot("main");
    setFormData({
      id: `main-${Date.now()}`,
      slot: "main",
      title: "নতুন অফার ব্যানার",
      image: "",
      link: "/shop",
      badge: "স্পেশাল অফার",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  // Process File Upload to Supabase Storage
  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    setUploadingImage(true);

    // Instant local preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setFormData((prev) => ({ ...prev, image: dataUrl }));

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `banner_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(`banners/${fileName}`, file, { upsert: true });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(`banners/${fileName}`);

          if (publicUrlData?.publicUrl) {
            setFormData((prev) => ({ ...prev, image: publicUrlData.publicUrl }));
          }
        }
      } catch (err) {
        console.warn("Storage upload note:", err);
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Modal Form
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image.trim()) {
      alert("Please provide an image URL or upload an image file.");
      return;
    }

    const itemToSave: BannerItem = {
      id: formData.id || `${formData.slot}-${Date.now()}`,
      slot: formData.slot,
      title: formData.title.trim(),
      image: formData.image.trim(),
      link: formData.link.trim() || "/shop",
      badge: formData.badge.trim(),
      is_active: formData.is_active,
      sort_order: editingBanner?.sort_order || (formData.slot === "main" ? banners.filter(b => b.slot === "main").length + 1 : 1),
    };

    let updatedList: BannerItem[];
    const exists = banners.some((b) => b.id === itemToSave.id);

    if (exists) {
      updatedList = banners.map((b) => (b.id === itemToSave.id ? itemToSave : b));
    } else {
      updatedList = [...banners, itemToSave];
    }

    await persistBanners(updatedList, itemToSave);
    showToast(`Banner "${itemToSave.title || itemToSave.slot}" saved successfully! 🎉`);
    setIsModalOpen(false);
  };

  // Delete Banner (Main slides only, side banners must keep at least 1)
  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to remove this slide?")) return;
    const updatedList = banners.filter((b) => b.id !== id);
    await persistBanners(updatedList, undefined, id);
    showToast("Slide removed successfully!");
  };

  // Toggle Active State
  const handleToggleActive = async (banner: BannerItem) => {
    const updated: BannerItem = {
      ...banner,
      is_active: !(banner.is_active !== undefined ? banner.is_active : true),
    };
    const updatedList = banners.map((b) => (b.id === banner.id ? updated : b));
    await persistBanners(updatedList, updated);
    showToast(`Banner ${updated.is_active ? "Enabled" : "Disabled"}`);
  };

  // Reset to default
  const handleResetToDefault = async () => {
    if (!confirm("Are you sure you want to restore the original 3 default hero banners?")) return;
    await persistBanners(defaultBanners);
    showToast("Default hero banners restored successfully! 🔄");
  };

  // Segregated data
  const mainSlides = banners.filter((b) => b.slot === "main");
  const sideTopBanner = banners.find((b) => b.slot === "side-top") || defaultBanners[1];
  const sideBottomBanner = banners.find((b) => b.slot === "side-bottom") || defaultBanners[2];

  // Active slide for preview
  const activeMainSlides = mainSlides.filter(b => b.is_active !== false);
  const currentPreviewBanner = activeMainSlides[previewSlideIdx] || activeMainSlides[0] || defaultBanners[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1d0741] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-purple-500/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#ea9219]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-[#4e1c80] uppercase tracking-wider">
              Homepage Customizer
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              dbSynced ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}>
              <Database className="w-3 h-3" />
              {dbSynced ? "Supabase Live Sync" : "Local Storage Mode"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">
            Hero Banners Management
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            হোমপেজের প্রধান স্লাইডার ও ডানপাশের প্রোমো ব্যানারগুলো পরিবর্তন ও নিয়ন্ত্রণ করুন
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetToDefault}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition flex items-center space-x-2 cursor-pointer"
            title="মূল ডিফল্ট ব্যানারে ফিরে যান"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Defaults</span>
          </button>
          
          <button
            onClick={openAddSlideModal}
            className="px-5 py-2.5 bg-[#4e1c80] hover:bg-[#2d0c5f] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Main Slide</span>
          </button>
        </div>
      </div>

      {/* 1. REAL-TIME LIVE STORE VISUAL PREVIEW */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-5 sm:p-7">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#4e1c80] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1d0741]">Live Store Preview</h2>
              <p className="text-xs text-slate-400">হোমপেজে যেভাবে হিরো ব্যানারগুলো লাইভ প্রদর্শিত হচ্ছে</p>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-xs font-bold text-[#4e1c80] hover:text-[#ea9219] flex items-center gap-1 group transition"
          >
            <span>Visit Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Scaled Preview Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 bg-[#F5F2F7] p-3 sm:p-4 rounded-2xl border border-slate-200/80">
          
          {/* Main Banner Preview (cols 8) */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/60 shadow-sm flex flex-col group min-h-[220px] sm:min-h-[290px]">
            <div className="relative w-full h-full flex-1">
              {currentPreviewBanner && (
                <Image
                  src={currentPreviewBanner.image}
                  alt={currentPreviewBanner.title || "Main Banner Preview"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>

            {/* Badge pill */}
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
              <Sparkles className="w-3 h-3 text-[#f2b51d]" />
              <span>Main Slider ({activeMainSlides.length} slides)</span>
            </div>

            {/* Pagination Controls */}
            {activeMainSlides.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                {activeMainSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewSlideIdx(i)}
                    className={`rounded-full transition-all cursor-pointer ${
                      previewSlideIdx === i ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Side Banners Preview (cols 4) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            
            {/* Top Side Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/60 shadow-sm flex-1 min-h-[105px] sm:min-h-[140px] group">
              <Image
                src={sideTopBanner.image}
                alt={sideTopBanner.title || "Side Top Preview"}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                Side Top Banner
              </div>
            </div>

            {/* Bottom Side Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/60 shadow-sm flex-1 min-h-[105px] sm:min-h-[140px] group">
              <Image
                src={sideBottomBanner.image}
                alt={sideBottomBanner.title || "Side Bottom Preview"}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                Side Bottom Banner
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. SECTION CARDS FOR MANAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Main Carousel Slides Manager (cols 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#4e1c80] flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h2 className="text-lg font-black text-[#1d0741]">
                  Main Carousel Slides (বামপাশের বড় স্লাইডার)
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  একাধিক স্লাইড যুক্ত করলে হোমপেজে স্বয়ংক্রিয়ভাবে ক্যারোজেল স্লাইডার চলবে
                </p>
              </div>
            </div>

            <button
              onClick={openAddSlideModal}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#4e1c80] font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="space-y-3">
            {mainSlides.length === 0 ? (
              <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                <p className="text-sm font-semibold text-slate-500">No slides configured yet.</p>
                <button
                  onClick={openAddSlideModal}
                  className="mt-3 px-4 py-2 bg-[#4e1c80] text-white text-xs font-bold rounded-xl"
                >
                  Create First Slide
                </button>
              </div>
            ) : (
              mainSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`bg-white rounded-2xl border p-4 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    slide.is_active !== false ? "border-purple-100 hover:border-purple-300" : "border-slate-200 bg-slate-50/70 opacity-75"
                  }`}
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    {/* Thumbnail */}
                    <div className="relative w-28 h-16 sm:w-32 sm:h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                        Slide {idx + 1}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {slide.title || "Untitled Slide"}
                        </h4>
                        {slide.is_active !== false ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-slate-500">Link:</span>
                        <span className="truncate text-purple-700 font-mono text-[11px]">{slide.link || "/shop"}</span>
                      </div>
                      {slide.badge && (
                        <div className="mt-1">
                          <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200/60">
                            {slide.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                        slide.is_active !== false 
                          ? "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100" 
                          : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      {slide.is_active !== false ? "Hide" : "Show"}
                    </button>

                    <button
                      onClick={() => openEditModal(slide)}
                      className="p-2 bg-purple-50 hover:bg-purple-100 text-[#4e1c80] rounded-xl transition cursor-pointer"
                      title="Edit Slide"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {mainSlides.length > 1 && (
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: 2 Side Banners Manager (cols 5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Top Side Banner Card */}
          <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1d0741]">
                    Side Top Banner (ডানপাশের উপরের ব্যানার)
                  </h3>
                  <p className="text-[11px] text-slate-400">সাধারণত খেজুর বা স্পেশাল ক্যাটাগরির ব্যানার</p>
                </div>
              </div>
              <button
                onClick={() => openEditModal(sideTopBanner)}
                className="px-3 py-1.5 bg-[#4e1c80] hover:bg-[#2d0c5f] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={sideTopBanner.image}
                alt={sideTopBanner.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="pt-1 text-xs space-y-1">
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-slate-400 font-semibold">Title:</span>
                <span className="font-bold">{sideTopBanner.title || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-slate-400 font-semibold">Redirect Link:</span>
                <span className="font-mono text-purple-700 font-bold">{sideTopBanner.link}</span>
              </div>
            </div>
          </div>

          {/* Bottom Side Banner Card */}
          <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1d0741]">
                    Side Bottom Banner (ডানপাশের নিচের ব্যানার)
                  </h3>
                  <p className="text-[11px] text-slate-400">সাধারণত লিচু বা আকর্ষণীয় ফলের ব্যানার</p>
                </div>
              </div>
              <button
                onClick={() => openEditModal(sideBottomBanner)}
                className="px-3 py-1.5 bg-[#4e1c80] hover:bg-[#2d0c5f] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={sideBottomBanner.image}
                alt={sideBottomBanner.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="pt-1 text-xs space-y-1">
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-slate-400 font-semibold">Title:</span>
                <span className="font-bold">{sideBottomBanner.title || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-slate-400 font-semibold">Redirect Link:</span>
                <span className="font-mono text-purple-700 font-bold">{sideBottomBanner.link}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. EDIT / ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-purple-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-[#1d0741] p-5 sm:p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#f2b51d]">
                  {formData.slot === "main" ? "Main Carousel Banner" : formData.slot === "side-top" ? "Side Top Banner" : "Side Bottom Banner"}
                </span>
                <h3 className="text-lg sm:text-xl font-black mt-0.5">
                  {editingBanner ? "Edit Banner Details" : "Add New Hero Slide"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBanner} className="p-6 space-y-5">
              
              {/* Image Upload Zone */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Banner Image <span className="text-red-500">*</span>
                </label>

                {/* Drag & Drop Area */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleProcessFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    isDragging ? "border-purple-600 bg-purple-50/60" : "border-purple-200 hover:border-purple-400 bg-purple-50/20"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleProcessFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  {uploadingImage ? (
                    <div className="py-4 flex flex-col items-center text-[#4e1c80]">
                      <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-700 rounded-full animate-spin mb-2" />
                      <span className="text-xs font-bold">Uploading to Supabase Storage...</span>
                    </div>
                  ) : formData.image ? (
                    <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden shadow-inner group">
                      <Image
                        src={formData.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                        <UploadCloud className="w-4 h-4" />
                        <span>Click to Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 flex flex-col items-center text-slate-500">
                      <div className="w-12 h-12 rounded-full bg-purple-100/80 text-[#4e1c80] flex items-center justify-center mb-2">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        Drag & Drop or Click to Upload Image
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        PNG, JPG, WebP recommended (Auto-uploaded to Supabase Storage)
                      </span>
                    </div>
                  )}
                </div>

                {/* Direct Image URL input */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-semibold">
                    <span>Or paste external image URL:</span>
                  </div>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/banner.jpg"
                    className="w-full px-3.5 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4e1c80]/20"
                  />
                </div>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Banner Title (ব্যানারের শিরোনাম)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="যেমন: বাগানের সেরা আম্রপালি"
                    className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4e1c80]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Badge / Tagline (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="যেমন: মিষ্টি-রসালো স্বাদের অনন্য"
                    className="w-full px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4e1c80]/20"
                  />
                </div>
              </div>

              {/* Redirect Target Link */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Target Link (ক্লিক করলে যেখানে যাবে)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/category/Mango অথবা /shop"
                  className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4e1c80]/20"
                  required
                />
                
                {/* Quick Link Chips */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[11px] font-bold text-slate-400">Quick options:</span>
                  {[
                    { label: "🥭 Mango", href: "/category/Mango" },
                    { label: "🌴 Dates", href: "/category/Dates" },
                    { label: "🍒 Lichi", href: "/category/Lichi" },
                    { label: "🍯 Honey", href: "/category/Honey" },
                    { label: "🛍 All Shop", href: "/shop" },
                  ].map((chip) => (
                    <button
                      key={chip.href}
                      type="button"
                      onClick={() => setFormData({ ...formData, link: chip.href })}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-purple-100 hover:text-[#4e1c80] rounded-lg transition cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Banner Status</span>
                  <span className="text-[11px] text-slate-500">হোমপেজে এই ব্যানারটি দৃশ্যমান রাখবেন কিনা</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    formData.is_active ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      formData.is_active ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-6 py-2.5 bg-[#4e1c80] hover:bg-[#2d0c5f] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  Save Banner Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
