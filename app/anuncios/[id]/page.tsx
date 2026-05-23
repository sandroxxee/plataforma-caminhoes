import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TruckGallery } from "@/components/TruckGallery";
import type { CSSProperties } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TruckImage = {
  image_url: string | null;
  principal: boolean | null;
  ordem: number | null;
};

type Truck = {
  id: string;
  titulo: string | null;
  marca: string | null;
  modelo: string | null;
  ano_modelo: number | null;
  ano_fabricacao: number | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
  carroceria: string | null;
  tracao: string | null;
  descricao: string | null;
  whatsapp: string | null;
  truck_images?: TruckImage[];
};

function formatMoney(value: number | null) {
  if (!value) return "Sob consulta";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function getWhatsappLink(truck: Truck) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(`Olá, tenho interesse no caminhão ${truck.titulo || ""}.`);
  return `https://wa.me/${phone}?text=${text}`;
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AnuncioDetalhePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trucks")
    .select(`
      id,
      titulo,
      marca,
      modelo,
      ano_modelo,
      ano_fabricacao,
      preco,
      cidade,
      estado,
      carroceria,
      tracao,
      descricao,
      whatsapp,
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .eq("id", id)
    .eq("status", "aprovado")
    .single();

  if (error || !data) {
    notFound();
  }

  const truck = data as Truck;
  const title = truck.titulo || `${truck.marca || ""} ${truck.modelo || ""}`.trim() || "Caminhão";

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/anuncios" style={styles.backButton}>← Voltar aos anúncios</Link>
        <Link href="/cadastro" style={styles.primaryButton}>Anunciar</Link>
      </header>

      <section style={styles.container}>
        <TruckGallery title={title} images={truck.truck_images || []} />

        <aside style={styles.infoCard}>
          <span style={styles.badge}>Disponível</span>
          <h1 style={styles.title}>{title}</h1>
          <strong style={styles.price}>{formatMoney(truck.preco)}</strong>

          <div style={styles.ficha}>
            <div style={styles.fichaItem}>
              <span>Marca</span>
              <strong>{truck.marca || "-"}</strong>
            </div>

            <div style={styles.fichaItem}>
              <span>Modelo</span>
              <strong>{truck.modelo || "-"}</strong>
            </div>

            <div style={styles.fichaItem}>
              <span>Ano</span>
              <strong>{truck.ano_modelo || truck.ano_fabricacao || "-"}</strong>
            </div>

            <div style={styles.fichaItem}>
              <span>Cidade</span>
              <strong>{truck.cidade || "-"}{truck.estado ? `/${truck.estado}` : ""}</strong>
            </div>

            <div style={styles.fichaItem}>
              <span>Carroceria</span>
              <strong>{truck.carroceria || "-"}</strong>
            </div>

            <div style={styles.fichaItem}>
              <span>Tração</span>
              <strong>{truck.tracao || "-"}</strong>
            </div>
          </div>

          {truck.whatsapp && (
            <a href={getWhatsappLink(truck)} target="_blank" style={styles.whatsappButton}>
              Chamar no WhatsApp
            </a>
          )}
        </aside>
      </section>

      <section style={styles.descriptionCard}>
        <span style={styles.descriptionBadge}>Descrição completa</span>
        <h2 style={styles.descriptionTitle}>Informações do anúncio</h2>
        <p style={styles.descriptionText}>
          {truck.descricao?.trim() || "Este anúncio ainda não possui descrição cadastrada."}
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#020617 0%,#071f1b 55%,#020617 100%)",
    color: "white",
    paddingBottom: 50,
  },
  header: {
    height: 82,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 9vw",
    borderBottom: "1px solid rgba(255,255,255,.10)",
    background: "rgba(2,6,23,.72)",
  },
  backButton: {
    color: "white",
    textDecoration: "none",
    fontWeight: 900,
  },
  primaryButton: {
    background: "#22c55e",
    color: "#052e16",
    padding: "12px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 900,
  },
  container: {
    maxWidth: 1180,
    margin: "42px auto 24px",
    display: "grid",
    gridTemplateColumns: "1.25fr .75fr",
    gap: 24,
  },
  infoCard: {
    padding: 28,
    borderRadius: 28,
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.10)",
    alignSelf: "start",
    position: "sticky",
    top: 100,
  },
  badge: {
    display: "inline-flex",
    padding: "8px 14px",
    borderRadius: 999,
    color: "#86efac",
    background: "rgba(34,197,94,.12)",
    border: "1px solid rgba(34,197,94,.22)",
    fontWeight: 900,
    fontSize: 12,
  },
  title: {
    fontSize: 34,
    lineHeight: 1.1,
    margin: "18px 0 12px",
  },
  price: {
    display: "block",
    color: "#86efac",
    fontSize: 34,
    marginBottom: 22,
  },
  ficha: {
    display: "grid",
    gap: 10,
    marginBottom: 22,
  },
  fichaItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    paddingBottom: 9,
    borderBottom: "1px solid rgba(255,255,255,.08)",
  },
  whatsappButton: {
    display: "block",
    width: "100%",
    padding: "15px",
    borderRadius: 16,
    background: "#22c55e",
    color: "#052e16",
    textAlign: "center",
    textDecoration: "none",
    fontWeight: 900,
  },
  descriptionCard: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: 30,
    borderRadius: 28,
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.10)",
  },
  descriptionBadge: {
    display: "inline-flex",
    padding: "8px 14px",
    borderRadius: 999,
    color: "#86efac",
    background: "rgba(34,197,94,.12)",
    border: "1px solid rgba(34,197,94,.22)",
    fontWeight: 900,
    fontSize: 12,
  },
  descriptionTitle: {
    margin: "16px 0 10px",
    fontSize: 28,
  },
  descriptionText: {
    margin: 0,
    color: "#dbeafe",
    fontSize: 18,
    lineHeight: 1.75,
    whiteSpace: "pre-line",
  },
};
