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
      <div style={{ padding: "24px 0" }}>
        <h1 style={{
          fontSize: 22, fontWeight: 900, marginBottom: 6,
          letterSpacing: "-.025em"
        }}>
          ❤️ Meus Favoritos
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
          {trucks.length === 0
            ? "Você ainda não salvou nenhum anúncio."
            : `${trucks.length} anúncio${trucks.length !== 1 ? "s" : ""} salvo${trucks.length !== 1 ? "s" : ""}.`}
        </p>

        {trucks.length > 0 ? (
          <div className="fav-grid">
            {trucks.map((truck) => (
              <TruckCard key={truck.id} truck={truck} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "var(--surface)", borderRadius: 20,
            border: "1.5px solid var(--line)"
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤍</div>
            <strong style={{ fontSize: 16 }}>Nenhum favorito ainda</strong>
            <p style={{ color: "var(--muted)", marginTop: 8, fontSize: 14 }}>
              Clique no ❤️ em qualquer anúncio para salvar aqui.
            </p>
          </div>
        )}
      </div>
      <style>{`
        .fav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
      `}</style>
    </PanelLayout>
  );
}
