"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Database,
  Eye,
  FileText,
  HelpCircle,
  Newspaper,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw as RefreshIcon,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Globe,
} from "lucide-react";
import {
  CustomPageData,
  defaultPagesData,
  getStoredPages,
  saveAllPages,
  saveSinglePage,
  fetchCustomPages,
  PageSection,
  FAQItem,
  BlogPostItem,
} from "@/app/data/pages";

const PAGE_KEYS = [
  { key: "about", label: "About Us", path: "/about", icon: Info, group: "General" },
  { key: "blog", label: "Blog & News", path: "/blog", icon: Newspaper, group: "Content" },
  { key: "contact", label: "Contact Us", path: "/contact", icon: Phone, group: "General" },
  { key: "terms", label: "Terms & Conditions", path: "/terms", icon: FileText, group: "Policies" },
  { key: "privacy", label: "Privacy Policy", path: "/privacy", icon: ShieldCheck, group: "Policies" },
  { key: "returns", label: "Return Policy", path: "/returns", icon: RefreshIcon, group: "Customer Service" },
  { key: "refund", label: "Refund Policy", path: "/refund", icon: CheckCircle2, group: "Customer Service" },
  { key: "shipping", label: "Shipping Policy", path: "/shipping", icon: Truck, group: "Customer Service" },
  { key: "faq", label: "FAQs (Q&A)", path: "/faq", icon: HelpCircle, group: "Customer Service" },
];

export default function AdminPagesCMS() {
  const [pages, setPages] = useState<Record<string, CustomPageData>>(defaultPagesData);
  const [activeSlug, setActiveSlug] = useState<string>("about");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [dbSynced, setDbSynced] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState<boolean>(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    const local = getStoredPages();
    setPages(local);

    try {
      const fetched = await fetchCustomPages();
      setPages(fetched);
      setDbSynced(true);
    } catch (err) {
      // offline fallback
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const currentPage: CustomPageData = pages[activeSlug] || defaultPagesData[activeSlug] || {
    slug: activeSlug,
    title: "",
    subtitle: "",
    content: "",
  };

  const updateCurrentPage = (updater: (prev: CustomPageData) => CustomPageData) => {
    setPages((prev) => {
      const current = prev[activeSlug] || defaultPagesData[activeSlug];
      const updated = updater(current);
      return {
        ...prev,
        [activeSlug]: updated,
      };
    });
  };

  const handleSavePage = async () => {
    setSaving(true);
    try {
      const res = await saveSinglePage(activeSlug, currentPage);
      setDbSynced(res.syncedWithDb);
      showToast(`"${currentPage.title || activeSlug}" saved successfully! Live page updated. 🎉`);
    } catch (err) {
      showToast("Page saved locally! (Database sync pending)");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllPages = async () => {
    setSaving(true);
    try {
      const res = await saveAllPages(pages);
      setDbSynced(res.syncedWithDb);
      showToast("All 9 custom pages saved successfully to Cloud & Storage! 🎉");
    } catch (err) {
      showToast("All pages saved locally!");
    } finally {
      setSaving(false);
    }
  };

  const handleResetCurrentPage = () => {
    if (confirm(`Are you sure you want to reset "${currentPage.title || activeSlug}" to default text?`)) {
      const defaultData = defaultPagesData[activeSlug];
      if (defaultData) {
        updateCurrentPage(() => defaultData);
        showToast(`Reset "${defaultData.title}" to default. Click 'Save Page Changes' to publish.`);
      }
    }
  };

  // Section Handlers (Policies, About, Contact)
  const handleAddSection = () => {
    const newSection: PageSection = {
      id: `sec-${Date.now()}`,
      title: "New Policy Clause / Section",
      content: "Enter your section details, terms, rules or explanation here...",
      badge: "Section",
    };
    updateCurrentPage((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));
  };

  const handleRemoveSection = (idx: number) => {
    updateCurrentPage((prev) => ({
      ...prev,
      sections: (prev.sections || []).filter((_, i) => i !== idx),
    }));
  };

  const handleUpdateSection = (idx: number, field: keyof PageSection, value: string) => {
    updateCurrentPage((prev) => {
      const updated = [...(prev.sections || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, sections: updated };
    });
  };

  // FAQ Handlers
  const handleAddFAQ = () => {
    const newFAQ: FAQItem = {
      id: `faq-${Date.now()}`,
      question: "Frequently Asked Question?",
      answer: "Clear, helpful answer to this customer question...",
      category: "General",
    };
    updateCurrentPage((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), newFAQ],
    }));
  };

  const handleRemoveFAQ = (idx: number) => {
    updateCurrentPage((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== idx),
    }));
  };

  const handleUpdateFAQ = (idx: number, field: keyof FAQItem, value: string) => {
    updateCurrentPage((prev) => {
      const updated = [...(prev.faqs || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  // Blog Post Handlers
  const handleAddBlogPost = () => {
    const newPost: BlogPostItem = {
      id: `post-${Date.now()}`,
      title: "New Fresh Article Title",
      slug: `article-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      author: "Dream Mart Team",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800",
      category: "Organic Living",
      readTime: "3 min read",
      excerpt: "Short summary of this article to entice readers...",
      content: "Write the full body content of your article here. You can include tips, benefits, recipes, and insights.",
    };
    updateCurrentPage((prev) => ({
      ...prev,
      blogPosts: [newPost, ...(prev.blogPosts || [])],
    }));
  };

  const handleRemoveBlogPost = (idx: number) => {
    updateCurrentPage((prev) => ({
      ...prev,
      blogPosts: (prev.blogPosts || []).filter((_, i) => i !== idx),
    }));
  };

  const handleUpdateBlogPost = (idx: number, field: keyof BlogPostItem, value: string) => {
    updateCurrentPage((prev) => {
      const updated = [...(prev.blogPosts || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, blogPosts: updated };
    });
  };

  const activePageMeta = PAGE_KEYS.find((p) => p.key === activeSlug) || PAGE_KEYS[0];

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1d0741] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center space-x-3 text-sm font-bold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Action Header */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full">
              CMS Page Editor
            </span>
            {dbSynced ? (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cloud Synced</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                <span>Local Storage Active</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">
            Manage Custom Pages &amp; Content
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium max-w-2xl">
            Edit text, headings, policies, FAQs, blog articles, and contact details for all 9 public store pages. Changes appear live instantly!
          </p>
        </div>

        {/* Global Save Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition flex items-center space-x-1.5 cursor-pointer ${
              showLivePreview
                ? "bg-purple-50 border-purple-200 text-purple-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showLivePreview ? "Hide Preview" : "Show Preview"}</span>
          </button>

          <button
            type="button"
            onClick={handleResetCurrentPage}
            className="px-3.5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
            title="Reset this page to default content"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Page</span>
          </button>

          <button
            type="button"
            onClick={handleSavePage}
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Page Changes"}</span>
          </button>
        </div>
      </div>

      {/* Page Tabs Switcher */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PAGE_KEYS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSlug === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveSlug(item.key)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition flex items-center space-x-2 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#1d0741] text-amber-300 shadow-md scale-102"
                    : "bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-[#1d0741]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${isActive ? "bg-purple-900/60 text-purple-200" : "bg-slate-200/70 text-slate-500"}`}>
                  {item.path}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace: Editor Form + Live Preview */}
      <div className={`grid grid-cols-1 ${showLivePreview ? "lg:grid-cols-12" : "max-w-5xl mx-auto"} gap-8`}>
        {/* Left Column: Form Editor (cols 7 if preview, else full) */}
        <div className={`${showLivePreview ? "lg:col-span-7" : "w-full"} space-y-6`}>
          
          {/* Section 1: Page Hero & Title Details */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#4e1c80] flex items-center justify-center">
                  <activePageMeta.icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1d0741]">
                    {currentPage.title || activePageMeta.label}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Route: <span className="font-mono text-purple-700">{activePageMeta.path}</span>
                  </p>
                </div>
              </div>

              <Link
                href={activePageMeta.path}
                target="_blank"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
                title="View public page in a new tab"
              >
                <span>View Live</span>
                <ExternalLink className="w-3.5 h-3.5 text-purple-700" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Page Main Title
                </label>
                <input
                  type="text"
                  value={currentPage.title}
                  onChange={(e) => updateCurrentPage((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  placeholder="e.g. Terms and Conditions"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Badge Pill Text <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={currentPage.badge || ""}
                  onChange={(e) => updateCurrentPage((prev) => ({ ...prev, badge: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  placeholder="e.g. Customer Protection"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subtitle / Hero Summary
                </label>
                <input
                  type="text"
                  value={currentPage.subtitle}
                  onChange={(e) => updateCurrentPage((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  placeholder="Brief 1-sentence intro to the page"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Last Updated Date
                </label>
                <input
                  type="text"
                  value={currentPage.lastUpdated || ""}
                  onChange={(e) => updateCurrentPage((prev) => ({ ...prev, lastUpdated: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  placeholder="e.g. November 2026"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Introductory Content / Main Body
              </label>
              <textarea
                rows={5}
                value={currentPage.content || ""}
                onChange={(e) => updateCurrentPage((prev) => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                placeholder="Write your main text or introductory statement for this page..."
              />
            </div>
          </div>

          {/* Contact Details Section (Specifically for Contact Page) */}
          {activeSlug === "contact" && (
            <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-purple-50">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Phone className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1d0741]">
                    Store Contact &amp; Support Info
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official address, hotline, email and working hours shown on /contact page
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    📍 Office / Store Address
                  </label>
                  <input
                    type="text"
                    value={currentPage.contactInfo?.address || ""}
                    onChange={(e) =>
                      updateCurrentPage((prev) => ({
                        ...prev,
                        contactInfo: {
                          ...(prev.contactInfo || { email: "", phone: "", whatsapp: "", address: "" }),
                          address: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    placeholder="e.g. 363, North pirerbag, Mirpur, Dhaka 1216"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    📧 Support Email
                  </label>
                  <input
                    type="email"
                    value={currentPage.contactInfo?.email || ""}
                    onChange={(e) =>
                      updateCurrentPage((prev) => ({
                        ...prev,
                        contactInfo: {
                          ...(prev.contactInfo || { email: "", phone: "", whatsapp: "", address: "" }),
                          email: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    placeholder="e.g. dreammarthouse@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    📞 Customer Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={currentPage.contactInfo?.phone || ""}
                    onChange={(e) =>
                      updateCurrentPage((prev) => ({
                        ...prev,
                        contactInfo: {
                          ...(prev.contactInfo || { email: "", phone: "", whatsapp: "", address: "" }),
                          phone: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    placeholder="e.g. 01611939511"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    💬 WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={currentPage.contactInfo?.whatsapp || ""}
                    onChange={(e) =>
                      updateCurrentPage((prev) => ({
                        ...prev,
                        contactInfo: {
                          ...(prev.contactInfo || { email: "", phone: "", whatsapp: "", address: "" }),
                          whatsapp: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    placeholder="e.g. 01834498477"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  🕒 Working &amp; Delivery Hours
                </label>
                <input
                  type="text"
                  value={currentPage.contactInfo?.businessHours || ""}
                  onChange={(e) =>
                    updateCurrentPage((prev) => ({
                      ...prev,
                      contactInfo: {
                        ...(prev.contactInfo || { email: "", phone: "", whatsapp: "", address: "" }),
                        businessHours: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  placeholder="e.g. Saturday - Thursday: 9:00 AM - 10:00 PM | Friday: 2:00 PM - 10:00 PM"
                />
              </div>
            </div>
          )}

          {/* FAQ Custom Editor (Specifically for FAQ page) */}
          {activeSlug === "faq" && (
            <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#ea9219] flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1d0741]">
                      Questions &amp; Answers ({(currentPage.faqs || []).length} items)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Add, remove, or customize answers shown on the /faq (Q&amp;A) page
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddFAQ}
                  className="px-3.5 py-1.5 bg-[#4e1c80] hover:bg-[#381062] text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {(currentPage.faqs || []).map((faq, idx) => (
                  <div
                    key={faq.id || idx}
                    className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                        FAQ #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFAQ(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete this question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleUpdateFAQ(idx, "question", e.target.value)}
                          placeholder="e.g. How long does delivery take?"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Category Pill
                        </label>
                        <input
                          type="text"
                          value={faq.category || ""}
                          onChange={(e) => handleUpdateFAQ(idx, "category", e.target.value)}
                          placeholder="e.g. Delivery, Quality"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Answer
                      </label>
                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => handleUpdateFAQ(idx, "answer", e.target.value)}
                        placeholder="Detailed answer provided to the user..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                      />
                    </div>
                  </div>
                ))}

                {(currentPage.faqs || []).length === 0 && (
                  <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 font-medium">No FAQ items added yet.</p>
                    <button
                      type="button"
                      onClick={handleAddFAQ}
                      className="mt-2 text-xs font-bold text-[#4e1c80] hover:underline"
                    >
                      + Click here to add the first question
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Blog Custom Editor (Specifically for Blog page) */}
          {activeSlug === "blog" && (
            <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Newspaper className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1d0741]">
                      Blog Articles ({(currentPage.blogPosts || []).length} posts)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Create, update, or remove blog posts displayed on /blog
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddBlogPost}
                  className="px-3.5 py-1.5 bg-[#4e1c80] hover:bg-[#381062] text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Post</span>
                </button>
              </div>

              <div className="space-y-5 max-h-[600px] overflow-y-auto pr-1">
                {(currentPage.blogPosts || []).map((post, idx) => (
                  <div
                    key={post.id || idx}
                    className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                        Article #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlogPost(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete this article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Article Title
                        </label>
                        <input
                          type="text"
                          value={post.title}
                          onChange={(e) => handleUpdateBlogPost(idx, "title", e.target.value)}
                          placeholder="e.g. Top 5 Health Benefits of Mangoes"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Slug (URL identifier)
                        </label>
                        <input
                          type="text"
                          value={post.slug}
                          onChange={(e) => handleUpdateBlogPost(idx, "slug", e.target.value)}
                          placeholder="e.g. top-5-benefits-mangoes"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={post.category || ""}
                          onChange={(e) => handleUpdateBlogPost(idx, "category", e.target.value)}
                          placeholder="e.g. Seasonal Fruits"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Author
                        </label>
                        <input
                          type="text"
                          value={post.author || ""}
                          onChange={(e) => handleUpdateBlogPost(idx, "author", e.target.value)}
                          placeholder="e.g. Dream Mart Team"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Date
                        </label>
                        <input
                          type="text"
                          value={post.date || ""}
                          onChange={(e) => handleUpdateBlogPost(idx, "date", e.target.value)}
                          placeholder="e.g. October 28, 2026"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Featured Image URL
                      </label>
                      <input
                        type="text"
                        value={post.image || ""}
                        onChange={(e) => handleUpdateBlogPost(idx, "image", e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Excerpt (Summary)
                      </label>
                      <textarea
                        rows={2}
                        value={post.excerpt}
                        onChange={(e) => handleUpdateBlogPost(idx, "excerpt", e.target.value)}
                        placeholder="Short summary displayed on the card..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Full Article Content
                      </label>
                      <textarea
                        rows={4}
                        value={post.content}
                        onChange={(e) => handleUpdateBlogPost(idx, "content", e.target.value)}
                        placeholder="Full body of the article..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Clauses / Policy Sections (For Terms, Privacy, Returns, Refund, Shipping, About) */}
          {activeSlug !== "faq" && activeSlug !== "blog" && (
            <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Layers className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#1d0741]">
                      Detailed Sections &amp; Clauses ({(currentPage.sections || []).length} sections)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Add, delete, or modify individual numbered points, policies or highlight cards
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-3.5 py-1.5 bg-[#4e1c80] hover:bg-[#381062] text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {(currentPage.sections || []).map((sec, idx) => (
                  <div
                    key={sec.id || idx}
                    className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md">
                        Section #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete this section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Section Heading / Title
                        </label>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => handleUpdateSection(idx, "title", e.target.value)}
                          placeholder="e.g. 1. Acceptance of Terms"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Badge / Tag (Optional)
                        </label>
                        <input
                          type="text"
                          value={sec.badge || ""}
                          onChange={(e) => handleUpdateSection(idx, "badge", e.target.value)}
                          placeholder="e.g. Mandatory, Quality"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Section Content / Paragraphs
                      </label>
                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={(e) => handleUpdateSection(idx, "content", e.target.value)}
                        placeholder="Explain the policy, rule or feature details in depth..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                      />
                    </div>
                  </div>
                ))}

                {(currentPage.sections || []).length === 0 && (
                  <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 font-medium">No sections added yet.</p>
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="mt-2 text-xs font-bold text-[#4e1c80] hover:underline"
                    >
                      + Click here to add your first section
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="p-4 bg-white rounded-2xl border border-purple-100 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-medium">
              Ready to publish? Changes sync instantly across the website.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSavePage}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : `Save ${currentPage.title || "Page"}`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Visual Preview */}
        {showLivePreview && (
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#1d0741] text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Live Public Page Preview
                </span>
              </div>
              <span className="text-[11px] font-mono text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded">
                {activePageMeta.path}
              </span>
            </div>

            {/* Mock Browser Frame */}
            <div className="bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
              {/* Browser Header Bar */}
              <div className="bg-slate-200/80 px-4 py-2 border-b border-slate-300/80 flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 text-center">
                  <div className="bg-white/80 text-[11px] font-mono text-slate-600 px-3 py-0.5 rounded-md inline-block max-w-xs truncate">
                    dreammartzone.com{activePageMeta.path}
                  </div>
                </div>
              </div>

              {/* Rendered Page Preview Content */}
              <div className="p-4 sm:p-6 bg-[#F5F2F7] max-h-[750px] overflow-y-auto space-y-4 text-slate-800">
                {/* Header Card */}
                <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs space-y-3">
                  {currentPage.badge && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#4E1C80] bg-purple-50 px-2.5 py-0.5 rounded-full inline-block">
                      {currentPage.badge}
                    </span>
                  )}
                  <h2 className="text-xl font-black text-[#1d0741] leading-tight">
                    {currentPage.title || "Untitled Page"}
                  </h2>
                  {currentPage.subtitle && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {currentPage.subtitle}
                    </p>
                  )}
                  {currentPage.lastUpdated && (
                    <p className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                      Last Updated: {currentPage.lastUpdated}
                    </p>
                  )}
                </div>

                {/* Main Content Body */}
                {currentPage.content && (
                  <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {currentPage.content}
                  </div>
                )}

                {/* Contact Info Card if /contact */}
                {activeSlug === "contact" && currentPage.contactInfo && (
                  <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs space-y-2 text-xs">
                    <p className="font-black text-[#1d0741] text-sm pb-1 border-b border-purple-50">
                      Direct Contact Details
                    </p>
                    <p>📍 <strong>Address:</strong> {currentPage.contactInfo.address}</p>
                    <p>📧 <strong>Email:</strong> {currentPage.contactInfo.email}</p>
                    <p>📞 <strong>Phone:</strong> {currentPage.contactInfo.phone}</p>
                    <p>💬 <strong>WhatsApp:</strong> {currentPage.contactInfo.whatsapp}</p>
                    {currentPage.contactInfo.businessHours && (
                      <p className="text-[11px] text-slate-500 pt-1">
                        🕒 {currentPage.contactInfo.businessHours}
                      </p>
                    )}
                  </div>
                )}

                {/* FAQ Accordion Preview if /faq */}
                {activeSlug === "faq" && (currentPage.faqs || []).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Frequently Asked Questions:
                    </p>
                    {(currentPage.faqs || []).map((faq, i) => (
                      <div key={i} className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs text-[#1d0741]">{faq.question}</p>
                          {faq.category && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded">
                              {faq.category}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Blog Posts Preview if /blog */}
                {activeSlug === "blog" && (currentPage.blogPosts || []).length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Featured Articles:
                    </p>
                    {(currentPage.blogPosts || []).map((post, i) => (
                      <div key={i} className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-xs space-y-2">
                        {post.category && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded">
                            {post.category}
                          </span>
                        )}
                        <h4 className="font-bold text-xs text-[#1d0741]">{post.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                          <span>{post.author}</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sections / Clauses Preview */}
                {(currentPage.sections || []).length > 0 && (
                  <div className="space-y-2.5">
                    {(currentPage.sections || []).map((sec, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-[#1d0741]">{sec.title}</h4>
                          {sec.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded">
                              {sec.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
                          {sec.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
