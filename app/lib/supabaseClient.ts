import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lpawmxawuqrddhelcjmy.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_vHb8ktjm3E4Dxd-57TSkig_GuQvwTSH";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
