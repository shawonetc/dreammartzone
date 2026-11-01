"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import FeaturesBanner from "../components/FeaturesBanner";
import Footer from "../components/Footer";
import AdminEditBar from "../components/AdminEditBar";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { getPageContent, fetchCustomPages, CustomPageData } from "../data/pages";

export default function ContactPage() {
  const [page, setPage] = useState<CustomPageData>(() => {
    return getPageContent("contact");
  });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Product Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchCustomPages()
      .then((data) => {
        if (data.contact) {
          setPage(data.contact);
        }
      })
      .catch(() => {});

    const handleUpdate = (e: any) => {
      if (e.detail?.contact) {
        setPage(e.detail.contact);
      } else {
        setPage(getPageContent("contact"));
      }
    };

    window.addEventListener("dream_pages_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("dream_pages_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
    setFormData({
      name: "",
      phone: "",
      email: "",
      subject: "Product Inquiry",
      message: "",
    });
    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  const contactInfo = page.contactInfo || {
    address: "363, North pirerbag, Mirpur, Dhaka 1216",
    email: "dreammarthouse@gmail.com",
    phone: "01611939511",
    whatsapp: "01834498477",
    businessHours: "Saturday - Thursday: 9:00 AM - 10:00 PM | Friday: 2:00 PM - 10:00 PM",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F7] text-slate-800 font-sans">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-purple-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{page.title || "Contact Us"}</span>
        </nav>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-10 mb-8 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#4E1C80] bg-purple-50 px-3 py-1 rounded-full inline-block">
            {page.badge || "Contact & Customer Care"}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#1d0741] tracking-tight">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-2xl">
              {page.subtitle}
            </p>
          )}
        </div>

        {/* 2-Column Grid: Contact Information Cards vs Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Address Card */}
            <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-xs flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4E1C80] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-sm">Our Location</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {contactInfo.address}
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-xs flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-sm">Official Email</h3>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-xs sm:text-sm text-emerald-700 hover:underline font-bold"
                >
                  {contactInfo.email}
                </a>
                <p className="text-[11px] text-slate-400">We respond within 2-4 hours</p>
              </div>
            </div>

            {/* Phone & Hotline Card */}
            <div className="bg-white rounded-2xl border border-purple-100 p-6 shadow-xs flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-sm">Customer Hotline</h3>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                  className="text-base font-black text-[#1d0741] hover:text-[#ea9219] transition-colors"
                >
                  {contactInfo.phone}
                </a>
                <p className="text-[11px] text-slate-400">Available 24/7 for urgent inquiries</p>
              </div>
            </div>

            {/* WhatsApp Quick Chat */}
            {contactInfo.whatsapp && (
              <a
                href={`https://wa.me/88${contactInfo.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Chat on WhatsApp ({contactInfo.whatsapp})</span>
              </a>
            )}

            {/* Business Hours */}
            {contactInfo.businessHours && (
              <div className="bg-purple-50/60 rounded-2xl border border-purple-100 p-4 flex items-center space-x-3 text-xs text-purple-900 font-medium">
                <Clock className="w-4 h-4 text-[#4E1C80] shrink-0" />
                <span>{contactInfo.businessHours}</span>
              </div>
            )}

            {/* Dynamic Custom Sections (Bulk orders, etc.) */}
            {(page.sections || []).map((sec, idx) => (
              <div
                key={sec.id || idx}
                className="bg-white rounded-2xl border border-purple-100 p-5 shadow-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{sec.title}</h4>
                  {sec.badge && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {sec.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-10 space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block mb-2">
                Send Us a Message
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#1d0741]">
                How can we assist you today?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Leave your details below and our customer support team will get in touch shortly.
              </p>
            </div>

            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold flex items-center space-x-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Thank you! Your message has been received. Our team will contact you shortly.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. customer@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                  >
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Order Tracking">Order Tracking &amp; Delivery</option>
                    <option value="Corporate / Bulk Order">Corporate / Bulk Order</option>
                    <option value="Return / Refund Request">Return / Refund Request</option>
                    <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message / Order Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you need or mention your Order ID..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ea9219]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] font-black text-sm rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <AdminEditBar pageSlug="contact" pageTitle="Contact Us" />
      <FeaturesBanner />
      <Footer />
    </div>
  );
}
