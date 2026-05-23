import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DebugBancoPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trucks")
    .select(`
      id,
      titulo,
      status,
      vendido,
      preco,
      created_at,
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: 30, fontFamily: "Arial", background: "#020617", color: "white", minHeight: "100vh" }}>
      <h1>Debug do banco</h1>
      <p>Essa página mostra exatamente o que o site está lendo da tabela trucks.</p>

      {error && (
        <pre style={{ background: "#7f1d1d", padding: 16, borderRadius: 12 }}>
          {error.message}
        </pre>
      )}

      <pre style={{ whiteSpace: "pre-wrap", background: "#111827", padding: 16, borderRadius: 12 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
