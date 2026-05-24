import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AuthDebugPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  let role = "";

  if (user?.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    role = profile?.role || "";
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#020617",
      color: "white",
      padding: 24,
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: 24,
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,.14)",
        background: "rgba(255,255,255,.06)"
      }}>
        <h1>Status da sessão</h1>

        <p><strong>Logado:</strong> {user ? "SIM" : "NÃO"}</p>
        <p><strong>Email:</strong> {user?.email || "-"}</p>
        <p><strong>ID:</strong> {user?.id || "-"}</p>
        <p><strong>Role:</strong> {role || "-"}</p>
        <p><strong>Erro Supabase:</strong> {error?.message || "-"}</p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
          <Link href="/login" style={link}>Login</Link>
          <Link href="/painel" style={link}>Painel</Link>
          <Link href="/admin/pendentes" style={link}>Admin</Link>
          <Link href="/logout" style={link}>Sair</Link>
          <Link href="/" style={link}>Home</Link>
        </div>
      </div>
    </main>
  );
}

const link = {
  minHeight: 42,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 14px",
  borderRadius: 12,
  background: "#22c55e",
  color: "#052e16",
  fontWeight: 900,
  textDecoration: "none",
};
