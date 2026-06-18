/**
 * Configuração centralizada do Supabase.
 * Todos os clientes importam daqui — sem duplicação.
 */

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
  return url;
}

export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; // fallback legado
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada.");
  return key;
}
