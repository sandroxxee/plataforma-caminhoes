import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./config";

export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não está configurada. O painel administrativo precisa da chave service_role para consultar anúncios de todas as contas.");
  }
  return createClient(getSupabaseUrl(), serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
