import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_TARIMART_SUPABASE_URL;

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_TARIMART_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing TariMart Supabase URL");
}

if (!supabasePublishableKey) {
  throw new Error("Missing TariMart Supabase Publishable Key");
}

export const supabase = createClient(
  supabaseUrl.trim().replace(/\/+$/, ""),
  supabasePublishableKey.trim()
);
