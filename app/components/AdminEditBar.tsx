"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Edit3, ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

interface AdminEditBarProps {
  pageSlug: string;
  pageTitle: string;
}

export default function AdminEditBar({ pageSlug, pageTitle }: AdminEditBarProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const demoAuth = typeof window !== "undefined" && localStorage.getItem("dream_admin_auth");
      if (demoAuth === "true") {
        setIsAdmin(true);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setIsAdmin(true);
      }
    };
    checkAuth();
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 bg-[#1d0741] text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-amber-400/50 flex items-center space-x-3 text-xs font-bold animate-in fade-in">
      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span>Admin: {pageTitle}</span>
      <Link
        href={`/admin/pages?slug=${pageSlug}`}
        className="px-3 py-1 bg-gradient-to-r from-[#ea9219] to-[#f2b51d] text-[#1d0741] rounded-xl font-extrabold flex items-center space-x-1 hover:opacity-90 transition cursor-pointer"
      >
        <Edit3 className="w-3.5 h-3.5" />
        <span>Edit Content</span>
      </Link>
    </div>
  );
}
