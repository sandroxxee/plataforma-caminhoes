import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { gerarSlugComId } from "@/lib/slug";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };
type TruckImage = { image_url: string | null; principal: boolean | null; ordem: number | null };
type Truck = {
  id: string;
  titulo: string | null;
  marca: string | null;
  modelo: string | null;
  ano_fabricacao: number | null;
  ano_modelo: number | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
  carroceria: string | null;
  tracao: string | null;
  descricao: string | null;
  whatsapp: string | null;
  status: string | null;
  truck_images?: TruckImage[];
};

const siteUrl = "https://caminhoesavenda.com";
const whatsappPrincipal = "5549999362681";

function money(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function cleanPhone(value: string | null | undefined) {
  return String(value || "").replace(/\D/g, "");
}

function getAdPath(truck: Truck) {
  return `/anuncios/${gerarSlugComId({
    id: truck.id,
    marca: truck.marca,
    modelo: truck.modelo,
    ano_modelo: truck.ano_modelo,
    ano_fabricacao: truck.ano_fabricacao,
    cidade: truck.cidade,
    estado: truck.estado,
  })}`;
}

function getImages(truck: Truck) {
  return [...(truck.truck_images || [])]
    .filter((image) => image.image_url)
    .sort((a, b) => {
      if (a.principal && !b.principal) return -1;
      if (!a.principal && b.principal) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    });
}

function buildDescription(truck: Truck, adUrl: string, quickWhatsapp: string) {
  return [
    truck.titulo || `${truck.marca || "Caminhão"} ${truck.modelo || ""}`.trim(),
    "",
    `Marca: ${truck.marca || "Não informado"}`,
    `Modelo: ${truck.modelo || "Não informado"}`,
    `Ano: ${truck.ano_modelo || truck.ano_fabricacao || "Não informado"}`,
    `Valor: ${money(truck.preco)}`,
    `Cidade/UF: ${[truck.cidade, truck.estado].filter(Boolean).join("/") || "Não informado"}`,
    truck.carroceria ? `Carroceria: ${truck.carroceria}` : "",
    truck.tracao ? `Tração: ${truck.tracao}` : "",
    "",
    "Descrição:",
    truck.descricao || "Não informado",
    "",
    `Ver anúncio no site: ${adUrl}`,
    `Link rápido WhatsApp: ${quickWhatsapp}`,
    "",
    "Caminhões à Venda",
  ].filter(Boolean).join("\n");
}

export default async function AdminIaAnuncioPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  const { data: truck, error } = await supabase
    .from("trucks")
    .select(`
      id,
      titulo,
      marca,
      modelo,
      ano_fabricacao,
      ano_modelo,
      preco,
      cidade,
      estado,
      carroceria,
      tracao,
      descricao,
      whatsapp,
      status,
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error || !truck) notFound();

  const item = truck as Truck;
  const title = item.titulo || `${item.marca || "Anúncio"} ${item.modelo || ""}`.trim();
  const adUrl = `${siteUrl}${getAdPath(item)}`;
  const phone = cleanPhone(item.whatsapp) || whatsappPrincipal;
  const quickWhatsapp = `https://wa.me/${phone}`;
  const description = buildDescription(item, adUrl, quickWhatsapp);
  const images = getImages(item);

  return (
    <AdminLayout
      title="Central IA do anúncio"
      subtitle="Copie a descrição e baixe todas as fotos em um botão para divulgar mais rápido."
      badge="Admin IA"
      actions={<Link href="/admin/anuncios" style={styles.topButton}>Voltar aos anúncios</Link>}
    >
      <section style={styles.card}>
        <span style={styles.label}>Título do anúncio</span>
        <h2 style={styles.folderName}>{title}</h2>
      </section>

      <section style={styles.card}>
        <div style={styles.sectionHead}>
          <div>
            <span style={styles.label}>Descrição pronta</span>
            <h3 style={styles.sectionTitle}>Clique dentro da caixa e use Ctrl+A / Ctrl+C</h3>
          </div>
        </div>

        <textarea readOnly value={description} style={styles.textarea} />

        <div style={styles.quickLinks}>
          <a href={`/api/admin/ia-anuncios/${item.id}`} style={styles.downloadPhotosButton}>Baixar fotos</a>
          <a href={adUrl} target="_blank" rel="noreferrer" style={styles.linkButton}>Abrir anúncio no site</a>
          <a href={quickWhatsapp} target="_blank" rel="noreferrer" style={styles.whatsappButton}>Abrir WhatsApp rápido</a>
        </div>
      </section>

      <section style={styles.card}>
        <span style={styles.label}>Prévia das fotos</span>
        <h3 style={styles.sectionTitle}>Confira antes de baixar</h3>

        <div style={styles.gallery}>
          {images.map((image, index) => (
            <a key={`${image.image_url}-${index}`} href={image.image_url || "#"} target="_blank" rel="noreferrer" style={styles.photoCard}>
              <img src={image.image_url || ""} alt={`Foto ${index + 1} - ${title}`} style={styles.photo} />
              <span style={styles.photoLabel}>Foto {String(index + 1).padStart(2, "0")}</span>
            </a>
          ))}

          {images.length === 0 && <p style={styles.help}>Nenhuma foto cadastrada neste anúncio.</p>}
        </div>
      </section>
    </AdminLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  topButton: { padding: "12px 16px", borderRadius: 14, background: "#2a2f34", color: "#e8eaed", textDecoration: "none", fontWeight: 900, border: "1px solid #343a40" },
  card: { padding: 18, borderRadius: 20, background: "#1f2327", border: "1px solid #343a40", boxShadow: "0 16px 34px rgba(0,0,0,.18)", marginBottom: 14 },
  label: { display: "block", color: "#f59e0b", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 },
  folderName: { margin: 0, color: "#f4f4f5", fontSize: 28, lineHeight: 1.15 },
  help: { margin: "8px 0 0", color: "#a7afb7", lineHeight: 1.5, fontWeight: 700 },
  sectionHead: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 },
  sectionTitle: { margin: 0, color: "#f4f4f5", fontSize: 20, lineHeight: 1.2 },
  textarea: { width: "100%", minHeight: 360, resize: "vertical", borderRadius: 16, border: "1px solid #3f464d", background: "#101214", color: "#f4f4f5", padding: 16, fontSize: 16, lineHeight: 1.55, fontFamily: "Arial, sans-serif", outline: "none" },
  quickLinks: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 },
  downloadPhotosButton: { padding: "12px 14px", borderRadius: 14, background: "#f59e0b", color: "#1f1300", textDecoration: "none", fontWeight: 900 },
  linkButton: { padding: "12px 14px", borderRadius: 14, background: "#1877f2", color: "#ffffff", textDecoration: "none", fontWeight: 900 },
  whatsappButton: { padding: "12px 14px", borderRadius: 14, background: "#22c55e", color: "#06140b", textDecoration: "none", fontWeight: 900 },
  gallery: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 12 },
  photoCard: { display: "grid", gap: 8, padding: 10, borderRadius: 16, background: "#15181b", border: "1px solid #343a40", textDecoration: "none" },
  photo: { width: "100%", height: 150, objectFit: "contain", background: "#0d0f11", borderRadius: 12 },
  photoLabel: { color: "#e8eaed", fontWeight: 900, fontSize: 13 },
};