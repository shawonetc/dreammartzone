"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Phone,
  Mail,
  MessageSquare,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Store,
  Layers,
  Database,
  Menu,
  FolderTree,
  ExternalLink,
  ChevronRight,
  Flame,
  Globe,
  Share2,
  FileText,
  Headphones,
} from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";
import {
  StoreSettings,
  defaultSettings,
  getStoredSettings,
  saveStoredSettings,
  fetchStoreSettings,
  QAPair,
  HeaderNavItem,
  PopularCategorySettings,
  FooterLinkItem,
  FooterSettings,
  defaultFooterSettings,
} from "@/app/data/settings";

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [dbSynced, setDbSynced] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<"headerNav" | "popularCategory" | "contact" | "qa" | "footer">("popularCategory");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const local = getStoredSettings();
    setSettings({
      ...defaultSettings,
      ...local,
      footer: {
        ...defaultFooterSettings,
        ...(local.footer || {}),
      },
    });

    try {
      const fetched = await fetchStoreSettings();
      setSettings({
        ...defaultSettings,
        ...fetched,
        footer: {
          ...defaultFooterSettings,
          ...(fetched.footer || {}),
        },
      });
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
    }, 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveStoredSettings(settings);
      setDbSynced(res.syncedWithDb);
      showToast("Store settings saved successfully! 🎉");
    } catch (err) {
      showToast("Settings saved locally! (Database sync pending)");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Are you sure you want to reset settings to default values?")) {
      setSettings(defaultSettings);
      showToast("Settings reset to defaults. Click 'Save Changes' to apply.");
    }
  };

  // Header Nav handlers
  const handleAddNavItem = () => {
    const newItem: HeaderNavItem = {
      id: `nav-${Date.now()}`,
      name: "",
      href: "/category/",
    };
    setSettings((prev) => ({
      ...prev,
      headerNav: [...(prev.headerNav || []), newItem],
    }));
  };

  const handleRemoveNavItem = (idx: number) => {
    const itemToRemove = settings.headerNav?.[idx];
    setSettings((prev) => ({
      ...prev,
      headerNav: (prev.headerNav || []).filter((_, i) => i !== idx),
    }));
    showToast(`Removed "${itemToRemove?.name || `Item #${idx + 1}`}". Click 'Save Changes' to apply.`);
  };

  const handleClearAllNavItems = () => {
    if (confirm("Are you sure you want to remove ALL items from the header navigation bar?")) {
      setSettings((prev) => ({
        ...prev,
        headerNav: [],
      }));
      showToast("All navigation items removed. Click 'Save Changes' to apply.");
    }
  };

  const handleUpdateNavItem = (idx: number, field: "name" | "href", value: string) => {
    setSettings((prev) => {
      const updated = [...(prev.headerNav || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, headerNav: updated };
    });
  };

  const handleImportCategoriesToNav = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*");
      if (!error && data && data.length > 0) {
        const imported: HeaderNavItem[] = data.map((c, i) => ({
          id: `nav-${c.id || i}`,
          name: c.name,
          href: `/category/${encodeURIComponent(c.name)}`,
        }));
        setSettings((prev) => ({
          ...prev,
          headerNav: imported,
        }));
        showToast(`Imported ${imported.length} categories into header navigation!`);
      } else {
        showToast("No categories found in database.");
      }
    } catch (e) {
      showToast("Error loading categories from database.");
    }
  };

  // Q&A handlers
  const handleAddQA = () => {
    const newQA: QAPair = {
      id: `qa-${Date.now()}`,
      question: "",
      answer: "",
    };
    setSettings((prev) => ({
      ...prev,
      qaList: [...prev.qaList, newQA],
    }));
  };

  const handleRemoveQA = (idx: number) => {
    setSettings((prev) => ({
      ...prev,
      qaList: prev.qaList.filter((_, i) => i !== idx),
    }));
  };

  const handleUpdateQA = (idx: number, field: "question" | "answer", value: string) => {
    setSettings((prev) => {
      const updated = [...prev.qaList];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, qaList: updated };
    });
  };

  // Footer Important Links Handlers
  const handleAddImportantLink = () => {
    const newLink: FooterLinkItem = {
      id: `imp-${Date.now()}`,
      label: "",
      url: "/",
    };
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || defaultFooterSettings),
        importantLinks: [...(prev.footer?.importantLinks || []), newLink],
      },
    }));
  };

  const handleRemoveImportantLink = (idx: number) => {
    const item = settings.footer?.importantLinks?.[idx];
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || defaultFooterSettings),
        importantLinks: (prev.footer?.importantLinks || []).filter((_, i) => i !== idx),
      },
    }));
    showToast(`Removed "${item?.label || `Link #${idx + 1}`}". Click 'Save All Settings' to apply.`);
  };

  const handleUpdateImportantLink = (idx: number, field: "label" | "url", value: string) => {
    setSettings((prev) => {
      const updated = [...(prev.footer?.importantLinks || defaultFooterSettings.importantLinks)];
      updated[idx] = { ...updated[idx], [field]: value };
      return {
        ...prev,
        footer: {
          ...(prev.footer || defaultFooterSettings),
          importantLinks: updated,
        },
      };
    });
  };

  const handleResetImportantLinks = () => {
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || defaultFooterSettings),
        importantLinks: defaultFooterSettings.importantLinks,
      },
    }));
    showToast("Important links reset to defaults.");
  };

  // Footer Customer Service Links Handlers
  const handleAddCustomerServiceLink = () => {
    const newLink: FooterLinkItem = {
      id: `cs-${Date.now()}`,
      label: "",
      url: "/",
    };
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || defaultFooterSettings),
        customerServiceLinks: [...(prev.footer?.customerServiceLinks || []), newLink],
      },
    }));
  };

  const handleRemoveCustomerServiceLink = (idx: number) => {
    const item = settings.footer?.customerServiceLinks?.[idx];
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || defaultFooterSettings),
        customerServiceLinks: (prev.footer?.customerServiceLinks || []).filter((_, i) => i !== idx),
      },
    }));
    showToast(`Removed "${item?.label || `Link #${idx + 1}`}". Click 'Save All Settings' to apply.`);
  };

  const handleUpdateCustomerServiceLink = (idx: number, field: "label" | "url", value: string) => {
    setSettings((prev) => {
      const updated = [...(prev.footer?.customerServiceLinks || defaultFooterSettings.customerServiceLinks)];
      updated[idx] = { ...updated[idx], [field]: value };
      return {
        ...prev,
        footer: {
          ...(prev.footer || defaultFooterSettings),
          customerServiceLinks: updated,
        },
      };
    });
  };

  const handleResetCustomerServiceLinks = () => {
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || defaultFooterSettings),
        customerServiceLinks: defaultFooterSettings.customerServiceLinks,
      },
    }));
    showToast("Customer Service links reset to defaults.");
  };

  const handleUpdateFooterField = (field: keyof FooterSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || defaultFooterSettings),
        [field]: value,
      },
    }));
  };

  const handleUpdateFooterSocial = (platform: "facebook" | "twitter" | "instagram" | "youtube" | "linkedin", value: string) => {
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || defaultFooterSettings),
        socialLinks: {
          ...(prev.footer?.socialLinks || defaultFooterSettings.socialLinks),
          [platform]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6 relative max-w-6xl pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1d0741] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-amber-400/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1d0741] tracking-tight">
              Store &amp; Navigation Settings
            </h1>
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
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Customize header navigation links (names after &quot;Shop By Category&quot;), default &quot;Contact Us&quot; details, and &quot;Q&amp;A&quot; FAQs.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4.5 h-4.5" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Settings Forms (cols 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: General Profile */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-purple-50">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#4e1c80] flex items-center justify-center">
                <Store className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1d0741]">General Store Profile</h3>
                <p className="text-xs text-slate-400">Basic brand details</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                placeholder="e.g. Dream Mart"
              />
            </div>
          </div>

          {/* Section 2: Header Navigation Bar (Names after Shop By Category) */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-purple-50 gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Menu className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1d0741]">
                    Header Navigation Bar (Items after &quot;Shop By Category&quot;)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Category names that appear directly on the top header bar next to &quot;Shop By Category&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleImportCategoriesToNav}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer border border-amber-200/60"
                  title="Import current categories from database"
                >
                  <FolderTree className="w-3.5 h-3.5 text-amber-600" />
                  <span>Import Categories</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAllNavItems}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer border border-rose-200"
                  title="Remove all categories from header navigation"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Clear All</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddNavItem}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#4e1c80] font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer border border-purple-200/60"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Name</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {(settings.headerNav || []).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative group"
                >
                  <span className="text-xs font-black text-[#4e1c80] bg-purple-100 px-2.5 py-1 rounded-md shrink-0 self-start sm:self-auto">
                    #{idx + 1}
                  </span>

                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mango, Home Appliance, Baby Toys..."
                      value={item.name}
                      onChange={(e) => handleUpdateNavItem(idx, "name", e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Target Link / URL
                    </label>
                    <input
                      type="text"
                      placeholder="/category/Mango or /shop"
                      value={item.href}
                      onChange={(e) => handleUpdateNavItem(idx, "href", e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveNavItem(idx)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 self-end sm:self-auto cursor-pointer shrink-0"
                    title="Remove this category name from header"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}

              {(!settings.headerNav || settings.headerNav.length === 0) && (
                <div className="py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400">No navigation items added yet. Header bar will only show &quot;Shop By Category&quot;.</p>
                  <button
                    type="button"
                    onClick={handleAddNavItem}
                    className="mt-1 text-xs font-bold text-[#4e1c80] hover:underline cursor-pointer"
                  >
                    + Add your first navigation name
                  </button>
                </div>
              )}

              {/* Quick Save Bar inside Header Navigation section */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-semibold">
                  Items: <b className="text-[#1d0741]">{settings.headerNav?.length || 0}</b> category links in header bar
                </span>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-[#1d0741] hover:bg-[#2d0c5f] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>{saving ? "Saving..." : "Save Navigation"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section: Homepage "Popular Category" Showcase Header */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-purple-50 gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#ea9219] flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1d0741]">
                    Homepage &quot;Popular Category&quot; Showcase Header
                  </h3>
                  <p className="text-xs text-slate-400">
                    Customize the main title, badge text, and subtitle shown above popular products on the homepage
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    popularCategory: defaultSettings.popularCategory,
                  }))
                }
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer border border-slate-200 self-start sm:self-auto shrink-0"
                title="Reset showcase header to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Section Main Title
                  </label>
                  <input
                    type="text"
                    value={settings.popularCategory?.title || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        popularCategory: {
                          ...(settings.popularCategory || defaultSettings.popularCategory),
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    placeholder="e.g. Popular Category"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Badge Pill Text <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={settings.popularCategory?.badge || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        popularCategory: {
                          ...(settings.popularCategory || defaultSettings.popularCategory),
                          badge: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    placeholder="e.g. জনপ্রিয় পণ্যসমূহ"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  value={settings.popularCategory?.subtitle || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      popularCategory: {
                        ...(settings.popularCategory || defaultSettings.popularCategory),
                        subtitle: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  placeholder="e.g. আম, খেজুর, লিচু ও অন্যান্য জনপ্রিয় ক্যাটাগরির সেরা পণ্যসমূহ"
                />
              </div>

              {/* Section Quick Save */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  Updates will appear live on the homepage upon saving
                </span>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-[#1d0741] hover:bg-[#2d0c5f] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>{saving ? "Saving..." : "Save Showcase Header"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Contact Us Tab Info */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-purple-50">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#ea9219] flex items-center justify-center">
                <Phone className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1d0741]">
                  Product Page &quot;Contact Us&quot; Tab Details
                </h3>
                <p className="text-xs text-slate-400">
                  Displayed under the &quot;Contact Us&quot; tab on every product page (unless overridden per product)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Heading / Prompt
                </label>
                <input
                  type="text"
                  value={settings.contact.heading}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, heading: e.target.value },
                    })
                  }
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
                    value={settings.contact.phone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contact: { ...settings.contact, phone: e.target.value },
                      })
                    }
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
                    value={settings.contact.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contact: { ...settings.contact, email: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    placeholder="e.g. info@demo21.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Number (with or without +88)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.contact.whatsapp}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contact: { ...settings.contact, whatsapp: e.target.value },
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    placeholder="e.g. 01834498477"
                  />
                  <div className="absolute left-3 top-3 text-[#25D366]">
                    <MessageSquare className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  This WhatsApp number is used when customers click &quot;Contact us on WhatsApp&quot; on product pages.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Q&A FAQs */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1d0741]">
                    Product Page &quot;Q&amp;A&quot; Tab FAQs
                  </h3>
                  <p className="text-xs text-slate-400">
                    Frequently asked questions shown in the Q&amp;A tab of product pages
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddQA}
                className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#4e1c80] font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {/* Q&A List */}
            <div className="space-y-4 pt-1">
              {settings.qaList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#4e1c80] bg-purple-100/70 px-2.5 py-0.5 rounded-md">
                      Question #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQA(idx)}
                      title="Delete Question"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Enter question, e.g. How long does delivery take?"
                      value={item.question}
                      onChange={(e) => handleUpdateQA(idx, "question", e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      placeholder="Enter answer for this question..."
                      value={item.answer}
                      onChange={(e) => handleUpdateQA(idx, "answer", e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                    />
                  </div>
                </div>
              ))}

              {settings.qaList.length === 0 && (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-medium">No Q&amp;A items added yet.</p>
                  <button
                    type="button"
                    onClick={handleAddQA}
                    className="mt-2 text-xs font-bold text-[#4e1c80] hover:underline"
                  >
                    + Click here to add your first question
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Footer Settings (Important Links, Customer Service, Contact & Social Links) */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-purple-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2D0C5F] text-amber-400 flex items-center justify-center">
                  <Globe className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1d0741]">
                    Footer Settings (Customer Service, Important Links &amp; Contacts)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Customize footer navigation columns, Customer Service policies, Important links, hotline &amp; socials
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#1d0741] hover:bg-[#2d0c5f] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5 text-amber-400" />
                <span>{saving ? "Saving..." : "Save Footer"}</span>
              </button>
            </div>

            {/* 2-Column Grid for Links: Important Links vs Customer Service */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column A: Important Links */}
              <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#4E1C80]" />
                    <span className="text-xs font-black text-[#1d0741] uppercase tracking-wider">
                      Important Links
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleResetImportantLinks}
                      title="Reset Important Links to defaults"
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleAddImportantLink}
                      className="px-2.5 py-1 bg-[#4E1C80] hover:bg-[#3B1463] text-white font-bold text-[11px] rounded-lg transition flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Link</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Column Title
                  </label>
                  <input
                    type="text"
                    value={settings.footer?.importantLinksTitle || ""}
                    onChange={(e) => handleUpdateFooterField("importantLinksTitle", e.target.value)}
                    placeholder="e.g. Important Links"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>

                {/* List of Important Links */}
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {(settings.footer?.importantLinks || []).map((link, idx) => (
                    <div
                      key={link.id || idx}
                      className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          Link #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImportantLink(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                          title="Remove link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleUpdateImportantLink(idx, "label", e.target.value)}
                          placeholder="Label (e.g. About Us)"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ea9219]"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleUpdateImportantLink(idx, "url", e.target.value)}
                          placeholder="URL (e.g. /about)"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#ea9219]"
                        />
                      </div>
                    </div>
                  ))}

                  {(settings.footer?.importantLinks || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">
                      No important links added. Click &quot;Add Link&quot; above.
                    </p>
                  )}
                </div>
              </div>

              {/* Column B: Customer Service */}
              <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Headphones className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-black text-[#1d0741] uppercase tracking-wider">
                      Customer Service
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleResetCustomerServiceLinks}
                      title="Reset Customer Service links to defaults"
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCustomerServiceLink}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Link</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Column Title
                  </label>
                  <input
                    type="text"
                    value={settings.footer?.customerServiceTitle || ""}
                    onChange={(e) => handleUpdateFooterField("customerServiceTitle", e.target.value)}
                    placeholder="e.g. Customer Service"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>

                {/* List of Customer Service Links */}
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {(settings.footer?.customerServiceLinks || []).map((link, idx) => (
                    <div
                      key={link.id || idx}
                      className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          Link #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomerServiceLink(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                          title="Remove link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleUpdateCustomerServiceLink(idx, "label", e.target.value)}
                          placeholder="Label (e.g. Return Policy)"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ea9219]"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleUpdateCustomerServiceLink(idx, "url", e.target.value)}
                          placeholder="URL (e.g. /returns)"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#ea9219]"
                        />
                      </div>
                    </div>
                  ))}

                  {(settings.footer?.customerServiceLinks || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">
                      No customer service links added. Click &quot;Add Link&quot; above.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Subsection C: Hotline & Contact Details */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-4">
              <div className="flex items-center space-x-2 pb-1">
                <Phone className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-black text-[#1d0741] uppercase tracking-wider">
                  Hotline Call Box &amp; Footer Contact Details
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Call Pill Box Label
                  </label>
                  <input
                    type="text"
                    value={settings.footer?.callText || ""}
                    onChange={(e) => handleUpdateFooterField("callText", e.target.value)}
                    placeholder="e.g. Call Us 24/7"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Call Pill Box Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={settings.footer?.callPhone || ""}
                    onChange={(e) => handleUpdateFooterField("callPhone", e.target.value)}
                    placeholder="e.g. 01611939511"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Footer Address
                  </label>
                  <input
                    type="text"
                    value={settings.footer?.address || ""}
                    onChange={(e) => handleUpdateFooterField("address", e.target.value)}
                    placeholder="e.g. 363, North pirerbag, Mirpur, Dhaka 1216"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Footer Email
                  </label>
                  <input
                    type="email"
                    value={settings.footer?.email || ""}
                    onChange={(e) => handleUpdateFooterField("email", e.target.value)}
                    placeholder="e.g. dreammarthouse@gmail.com"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
              </div>
            </div>

            {/* Subsection D: Social Media Links */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-4">
              <div className="flex items-center space-x-2 pb-1">
                <Share2 className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-black text-[#1d0741] uppercase tracking-wider">
                  Social Media Links (Icons in Column 1) &amp; Copyright
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Facebook URL</label>
                  <input
                    type="text"
                    value={settings.footer?.socialLinks?.facebook || ""}
                    onChange={(e) => handleUpdateFooterSocial("facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Twitter / X URL</label>
                  <input
                    type="text"
                    value={settings.footer?.socialLinks?.twitter || ""}
                    onChange={(e) => handleUpdateFooterSocial("twitter", e.target.value)}
                    placeholder="https://x.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={settings.footer?.socialLinks?.instagram || ""}
                    onChange={(e) => handleUpdateFooterSocial("instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">YouTube URL</label>
                  <input
                    type="text"
                    value={settings.footer?.socialLinks?.youtube || ""}
                    onChange={(e) => handleUpdateFooterSocial("youtube", e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={settings.footer?.socialLinks?.linkedin || ""}
                    onChange={(e) => handleUpdateFooterSocial("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Copyright Line</label>
                  <input
                    type="text"
                    value={settings.footer?.copyrightText || ""}
                    onChange={(e) => handleUpdateFooterField("copyrightText", e.target.value)}
                    placeholder="Dream Mart. All rights reserved."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save bar */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Previews (cols 5) */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50 mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#ea9219]" />
                  <h3 className="text-sm font-black text-[#1d0741]">Live Preview</h3>
                </div>
                <span className="text-[10px] font-bold uppercase bg-amber-50 text-[#ea9219] px-2 py-0.5 rounded-full border border-amber-200">
                  Customer View
                </span>
              </div>

              {/* Preview Tab Selector */}
              <div className="flex border-b border-slate-100 gap-2 sm:gap-3 mb-4 text-xs font-bold overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("popularCategory")}
                  className={`pb-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                    activePreviewTab === "popularCategory"
                      ? "border-[#4E1C80] text-[#4E1C80]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Popular Showcase
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("headerNav")}
                  className={`pb-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                    activePreviewTab === "headerNav"
                      ? "border-[#4E1C80] text-[#4E1C80]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Header Bar
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("contact")}
                  className={`pb-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                    activePreviewTab === "contact"
                      ? "border-[#4E1C80] text-[#4E1C80]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Contact Us
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("qa")}
                  className={`pb-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                    activePreviewTab === "qa"
                      ? "border-[#4E1C80] text-[#4E1C80]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Q&amp;A
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("footer")}
                  className={`pb-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                    activePreviewTab === "footer"
                      ? "border-[#4E1C80] text-[#4E1C80]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Footer
                </button>
              </div>

              {/* Active Tab Preview Body */}
              <div className="bg-[#F5F2F7] p-3 rounded-xl mb-4">
                {activePreviewTab === "popularCategory" && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-slate-600">Homepage Showcase Header Preview:</p>
                    <div className="bg-white rounded-xl p-4 shadow-2xs border border-slate-200/80">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4E1C80] flex items-center justify-center shrink-0">
                          <Flame className="w-5 h-5 text-[#ea9219]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-slate-900 tracking-tight">
                              {settings.popularCategory?.title || defaultSettings.popularCategory.title}
                            </h4>
                            {settings.popularCategory?.badge ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
                                {settings.popularCategory.badge}
                              </span>
                            ) : null}
                          </div>
                          {settings.popularCategory?.subtitle ? (
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {settings.popularCategory.subtitle}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewTab === "headerNav" && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-slate-600">Top Header Bar Preview:</p>
                    <div className="bg-[#2D0C5F] p-2.5 rounded-xl flex items-center gap-2.5 overflow-x-auto text-white text-xs shadow-xs">
                      <div className="bg-[#4E1C80] px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 shrink-0">
                        <Menu className="w-3.5 h-3.5" />
                        <span>Shop By Category</span>
                      </div>
                      <div className="flex items-center gap-3 overflow-x-auto text-[11px] font-bold text-slate-200 whitespace-nowrap scrollbar-none py-1">
                        {(settings.headerNav || []).map((item, idx) => (
                          <span key={idx} className="hover:text-amber-300 transition-colors">
                            {item.name || "Untitled"}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewTab === "contact" && (
                  <div className="bg-white rounded-xl p-4 shadow-2xs border border-slate-200/60 space-y-3 text-xs">
                    <p className="font-bold text-slate-900">
                      {settings.contact.heading || "Have questions or want bulk orders?"}
                    </p>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 font-semibold block text-[10px]">PHONE</span>
                      <span className="font-bold text-slate-800">{settings.contact.phone || "Not set"}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 font-semibold block text-[10px]">EMAIL</span>
                      <span className="font-bold text-slate-800">{settings.contact.email || "Not set"}</span>
                    </div>
                    <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-emerald-700 font-semibold block text-[10px]">WHATSAPP</span>
                      <span className="font-bold text-emerald-900">{settings.contact.whatsapp || "Not set"}</span>
                    </div>
                  </div>
                )}

                {activePreviewTab === "qa" && (
                  <div className="bg-white rounded-xl p-4 shadow-2xs border border-slate-200/60 space-y-3 text-xs">
                    {settings.qaList.length > 0 ? (
                      settings.qaList.slice(0, 3).map((item, idx) => (
                        <div key={idx} className={idx > 0 ? "border-t border-slate-100 pt-2" : ""}>
                          <p className="font-bold text-slate-900">
                            <span className="text-[#4E1C80]">Q{idx + 1}: </span>
                            {item.question || "Sample question"}
                          </p>
                          <p className="text-slate-600 text-[11px] mt-0.5 pl-4">
                            <span className="font-semibold text-slate-700">A: </span>
                            {item.answer || "Sample answer"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic py-2 text-center">No questions added</p>
                    )}
                  </div>
                )}

                {activePreviewTab === "footer" && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-slate-600">Footer Customer View Preview:</p>
                    <div className="bg-[#15131F] text-slate-300 p-4 rounded-xl space-y-4 text-xs border border-purple-900/40">
                      {/* Hotline pill */}
                      <div className="inline-flex items-center gap-2 border border-slate-700 bg-[#2D0C5F] px-3 py-1.5 rounded-full">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-slate-400">{settings.footer?.callText || "Call Us 24/7"}</span>
                        <span className="text-xs font-bold text-white">{settings.footer?.callPhone || "01611939511"}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800">
                        {/* Important links preview */}
                        <div>
                          <h5 className="font-bold text-white text-[11px] mb-1.5">
                            {settings.footer?.importantLinksTitle || "Important Links"}
                          </h5>
                          <ul className="space-y-1 text-[10px] text-slate-400">
                            {(settings.footer?.importantLinks || []).map((l, i) => (
                              <li key={i} className="hover:text-white truncate">
                                • {l.label || "Untitled"}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Customer service preview */}
                        <div>
                          <h5 className="font-bold text-white text-[11px] mb-1.5">
                            {settings.footer?.customerServiceTitle || "Customer Service"}
                          </h5>
                          <ul className="space-y-1 text-[10px] text-slate-400">
                            {(settings.footer?.customerServiceLinks || []).map((l, i) => (
                              <li key={i} className="hover:text-white truncate">
                                • {l.label || "Untitled"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                        <span>© {new Date().getFullYear()} {settings.footer?.copyrightText || "Dream Mart"}</span>
                        <span className="text-amber-400 font-bold">SSL Secure</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 bg-purple-50/60 p-3 rounded-xl border border-purple-100">
                💡 <span className="font-bold text-[#4e1c80]">Tip:</span> Click <span className="font-bold">Import Categories</span> to automatically fill the header bar with your active database categories, or type any custom names you want!
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
