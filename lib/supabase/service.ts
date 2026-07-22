import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./config";

export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!serviceKey) {
    throw new Error("Nenhuma chave Supabase (SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY) configurada no ambiente.");
  }
  return createClient(getSupabaseUrl(), serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}