import { redirect } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminDivulgacaoBox } from "@/components/AdminDivulgacaoBox";
import { gerarSlugComId } from "@/lib/slug";
import { formatImageUrl } from "@/lib/truck-utils";

export const dynamic = "force-dynamic";

const siteUrl = "https://caminhoesavenda.com";

type TruckImage = { image_url: string | null; principal: boolean | null; ordem: number | null };
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
  quilometragem: number | null;
  motor: string | null;
  cambio: string | null;
  combustivel: string | null;
  cor: string | null;
  descricao: string | null;
  status: string | null;
  truck_images?: TruckImage[];
};

type PageProps = { params: Promise<{ id: string }> };

function money(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function getTitle(truck: Truck) {
  const parts = [truck.marca, truck.modelo || truck.titulo, truck.ano_modelo || truck.ano_fabricacao].filter(Boolean);
  return parts.length ? parts.join(" ") : truck.titulo || "Anúncio Caminhões à Venda";
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

function getMainImage(truck: Truck) {
  const images = truck.truck_images || [];
  const principal = images.find((img) => img.principal);
  const first = [...images].sort((a, b) => (a.ordem || 0) - (b.ordem || 0))[0];
  return formatImageUrl(principal?.image_url || first?.image_url || "");
}

function buildTexts(truck: Truck) {
  const title = getTitle(truck);
  const price = money(truck.preco);
  const location = [truck.cidade, truck.estado].filter(Boolean).join("/");
  const details = [truck.carroceria, truck.tracao].filter(Boolean).join(" • ");
  const description = String(truck.descricao || "").trim();
  const link = getAdUrl(truck);

  // 1. TEXTO COMPLETO
  const textoCompleto = [
    `🚛 *${title} à venda*`,
    "",
    location ? `📍 ${location}` : "",
    `💰 ${price}`,
    "",
    details ? `Configuração: ${details}` : "",
    "",
    description || "Caminhão disponível para negociação.",
    "",
    "Consulte fotos, condições e detalhes completos no link:",
    link,
    "",
    "📲 Chame no WhatsApp para atendimento.",
  ].filter((line, i, arr) => line !== "" || (arr[i - 1] !== "" && i > 0)).join("\n");

  // 2. TEXTO CURTO
  const textoCurto = [
    `🚛 ${title}`,
    location ? `📍 ${location}` : "",
    `💰 ${price}`,
    `📲 Fotos e detalhes: ${link}`,
  ].filter(Boolean).join("\n");

  // 3. TEXTO TÉCNICO
  const specs: string[] = [];
  if (truck.carroceria) specs.push(`Configuração: ${truck.carroceria}`);
  if (truck.tracao) specs.push(`Tração: ${truck.tracao}`);
  if (truck.quilometragem) specs.push(`Quilometragem: ${Number(truck.quilometragem).toLocaleString("pt-BR")} km`);
  if (truck.motor) specs.push(`Motor: ${truck.motor}`);
  if (truck.cambio) specs.push(`Câmbio: ${truck.cambio}`);
  if (truck.combustivel) specs.push(`Combustível: ${truck.combustivel}`);
  if (truck.cor) specs.push(`Cor: ${truck.cor}`);

  const textoTecnico = [
    `*${truck.marca || ""} ${truck.modelo || ""}, ano ${truck.ano_modelo || truck.ano_fabricacao || ""}*`,
    location ? `Localização: ${location}` : "",
    `Valor: ${price}`,
    "",
    ...specs,
    "",
    `Consulte opcionais, conservação, fotos e negociação: ${link}`,
  ].filter((line, i, arr) => line !== "" || (arr[i - 1] !== "" && i > 0)).join("\n");

  return { title, link, textoCompleto, textoCurto, textoTecnico };
}

export default async function AdminDivulgacaoPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  const { data: truck } = await supabase
    .from("trucks")
    .select(`
      id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao,
      quilometragem, motor, cambio, combustivel, cor, descricao, status,
      truck_images ( image_url, principal, ordem )
    `)
    .eq("id", id)
    .single();

  if (!truck) redirect("/admin/anuncios");

  const ad = truck as Truck;
  if (ad.status !== "aprovado") redirect("/admin/anuncios");

  const { title, link, textoCompleto, textoCurto, textoTecnico } = buildTexts(ad);
  const mainImage = getMainImage(ad);
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;

  return (
    <AdminLayout
      title="Divulgação do Anúncio"
      subtitle="Prepare artes premium e envie legendas estruturadas para acelerar as vendas."
      badge="Admin"
      actions={<Link href="/admin/anuncios" style={styles.topButton}>Voltar aos anúncios</Link>}
    >
      <AdminDivulgacaoBox
        titulo={title}
        preco={money(ad.preco)}
        cidade={ad.cidade || ""}
        estado={ad.estado || ""}
        textoCompleto={textoCompleto}
        textoCurto={textoCurto}
        textoTecnico={textoTecnico}
        linkAnuncio={link}
        mainImage={mainImage}
        facebookShareUrl={facebookShareUrl}
      />
    </AdminLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  topButton: { padding: "12px 16px", borderRadius: 14, background: "#2a2f34", border: "1px solid #343a40", color: "#e8eaed", textDecoration: "none", fontWeight: 900 },
};
