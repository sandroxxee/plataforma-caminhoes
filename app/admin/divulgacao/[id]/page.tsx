import { redirect } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminDivulgacaoBox } from "@/components/AdminDivulgacaoBox";
import { gerarSlugComId } from "@/lib/slug";

export const dynamic = "force-dynamic";

const siteUrl = "https://caminhoesavenda.com";

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
  status: string | null;
};

type PageProps = { params: Promise<{ id: string }> };

function money(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function getTitle(truck: Truck) {
  const parts = [truck.marca, truck.modelo || truck.titulo, truck.ano_modelo || truck.ano_fabricacao].filter(Boolean);
  return parts.length ? parts.join(" ") : truck.titulo || "Anuncio Caminhoes a Venda";
}

function getAdUrl(truck: Truck) {
  const slug = gerarSlugComId({
    id: truck.id,
    marca: truck.marca,
    modelo: truck.modelo,
    ano_modelo: truck.ano_modelo,
    ano_fabricacao: truck.ano_fabricacao,
    cidade: truck.cidade,
    estado: truck.estado,
  });

  return `${siteUrl}/anuncios/${slug}`;
}

function buildTexts(truck: Truck) {
  const title = getTitle(truck);
  const price = money(truck.preco);
  const location = [truck.cidade, truck.estado].filter(Boolean).join("/");
  const details = [truck.carroceria, truck.tracao].filter(Boolean).join(" • ");
  const description = String(truck.descricao || "").trim();
  const link = getAdUrl(truck);

  const textoGrupo = [
    `🚛 ${title} a venda`,
    details ? `Configuracao: ${details}` : "",
    location ? `Localizacao: ${location}` : "",
    `Valor: ${price}`,
    "",
    description || "Anuncio com informacoes organizadas, contato direto e detalhes para quem procura caminhao ou implemento.",
    "",
    "Veja fotos e informacoes completas no Caminhoes a Venda:",
    link,
    "",
    "Contato direto pelo anuncio.",
  ].filter(Boolean).join("\n");

  const textoCurto = [
    `🚛 ${title}`,
    location ? `📍 ${location}` : "",
    `💰 ${price}`,
    "Veja detalhes, fotos e contato direto:",
    link,
  ].filter(Boolean).join("\n");

  return { title, link, textoGrupo, textoCurto };
}

export default async function AdminDivulgacaoPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "admin") redirect("/painel");

  const { data: truck } = await supabase
    .from("trucks")
    .select("id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,descricao,status")
    .eq("id", id)
    .single();

  if (!truck) redirect("/admin/anuncios");

  const ad = truck as Truck;

  if (ad.status !== "aprovado") redirect("/admin/anuncios");

  const { title, link, textoGrupo, textoCurto } = buildTexts(ad);
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;

  return (
    <AdminLayout
      title="Divulgacao"
      subtitle="Prepare texto e link para divulgar o anuncio aprovado."
      badge="Admin"
      actions={<Link href="/admin/anuncios" style={styles.topButton}>Voltar aos anuncios</Link>}
    >
      <div style={styles.headerCard}>
        <span style={styles.label}>Anuncio aprovado</span>
        <h2 style={styles.adTitle}>{title}</h2>
        <p style={styles.meta}>{[ad.cidade, ad.estado].filter(Boolean).join("/")} • {money(ad.preco)}</p>
        <p style={styles.warning}>Esta ferramenta nao publica automaticamente. Ela apenas prepara texto e link para revisao manual.</p>
      </div>

      <AdminDivulgacaoBox
        titulo={title}
        textoGrupo={textoGrupo}
        textoCurto={textoCurto}
        linkAnuncio={link}
        facebookShareUrl={facebookShareUrl}
      />
    </AdminLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  topButton: { padding: "12px 16px", borderRadius: 14, background: "#2a2f34", border: "1px solid #343a40", color: "#e8eaed", textDecoration: "none", fontWeight: 900 },
  headerCard: { padding: 22, borderRadius: 24, background: "linear-gradient(135deg, #1f2327, #121416)", border: "1px solid #343a40", marginBottom: 18, boxShadow: "0 16px 34px rgba(0,0,0,.18)" },
  label: { display: "inline-flex", padding: "7px 11px", borderRadius: 999, background: "#14532d", color: "#bbf7d0", fontWeight: 900, fontSize: 12, marginBottom: 12 },
  adTitle: { margin: "0 0 8px", color: "#f4f4f5", fontSize: 28, lineHeight: 1.15 },
  meta: { margin: "0 0 12px", color: "#a7afb7", fontWeight: 800 },
  warning: { margin: 0, color: "#fde68a", lineHeight: 1.5, fontWeight: 800 },
};
