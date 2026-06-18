/**
 * Client server-side com service_role — bypassa RLS.
 * Usar APENAS em Server Components/Route Handlers para leituras públicas.
 * NUNCA expor ao browser.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let _client: ReturnType<typeof createSupabaseClient> | null = null;

export function createPublicClient() {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");

  _client = createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return _client;
}
