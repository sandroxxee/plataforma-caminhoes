import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { TruckCard } from "@/components/theme/TruckCard";
import type { TruckCardData } from "@/components/theme/TruckCard";

export const dynamic = "force-dynamic";

export const metadata = { title: "Meus Favoritos" };

export default async function FavoritosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/painel/favoritos");

  const { data } = await supabase
    .from("favoritos")
    .select(`
      truck_id,
      trucks (
        id, titulo, marca, modelo, ano_modelo, ano_fabricacao,
        preco, cidade, estado, carroceria, tracao,
        whatsapp, destaque, created_at,
        truck_images ( image_url, principal, ordem )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const trucks = (data || [])
    .flatMap((f) => (Array.isArray(f.trucks) ? f.trucks : f.trucks ? [f.trucks] : []))
    .filter(Boolean) as unknown as TruckCardData[];

  return (
    <PanelLayout>
      <div className="painel-wrap">
        <div>
          <h1 className="painel-greeting">Meus favoritos</h1>
          <p className="meus-anuncios-sub">
            {trucks.length === 0
              ? "Você ainda não salvou nenhum anúncio."
              : `Você tem ${trucks.length} anúncio${trucks.length !== 1 ? "s" : ""} salvo${trucks.length !== 1 ? "s" : ""} nos favoritos.`}
          </p>
        </div>

        {trucks.length > 0 ? (
          <div className="meus-anuncios-grid">
            {trucks.map((truck) => (
              <TruckCard key={truck.id} truck={truck} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "var(--surface)", borderRadius: "var(--radius)",
            border: "1.5px solid var(--line)", boxShadow: "var(--shadow)"
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🤍</div>
            <strong style={{ fontSize: 16, fontWeight: 900, color: "var(--text)" }}>Nenhum favorito ainda</strong>
            <p style={{ color: "var(--muted)", marginTop: 8, fontSize: 14, fontWeight: 700 }}>
              Clique no ícone de ❤️ em qualquer anúncio do site para salvá-lo aqui.
            </p>
          </div>
        )}
      </div>
    </PanelLayout>
  );
}
