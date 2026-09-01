import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oshrozyekhvnkaranlwi.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_S43yC6RLKlkLdO_AJjdPXw_hF1X0ltn";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
