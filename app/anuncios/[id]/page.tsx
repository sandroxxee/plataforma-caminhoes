import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShareAdButton } from "@/components/ShareAdButton";
import { SiteFooter } from "@/components/SiteFooter";
import { AdGallery } from "@/components/theme/AdGallery";
import { formatMoney, getLocation, getTitle, type TruckCardData, type TruckImage } from "@/components/theme/TruckCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const siteUrl = "https://caminhoesavenda.com";
const defaultOgImage = "/og-caminhoesavenda.png";

type Truck = TruckCardData & {
  descricao: string | null;
  quilometragem?: number | null;
  km?: number | null;
  truck_images?: TruckImage[];
};

function getWhatsappLink(truck: Truck, title: string) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(`Olá, tenho interesse no caminhão ${title}${truck.ano_modelo ? ` ano ${truck.ano_modelo}` : ""}. Pode me passar mais informações?`);
  return phone ? `https://wa.me/${phone}?text=${text}` : "";
}

function formatKm(value?: number | null) {
  if (!value) return "Não informado";
  return `${value.toLocaleString("pt-BR")} km`;
}

async function getApprovedTruck(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,descricao,whatsapp,truck_images(image_url,principal,ordem)`)
    .eq("id", id)
    .eq("status", "aprovado")
    .single();

  if (error || !data) return null;
  return data as Truck;
}

function getMainImage(truck: Truck) {
  const images = truck.truck_images || [];
  const main = images.find((image) => image.principal)?.image_url || images[0]?.image_url;
  return main || defaultOgImage;
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const truck = await getApprovedTruck(id);

  if (!truck) {
    return {
      title: "Anúncio não encontrado",
      robots: { index: false, follow: false },
    };
  }

  const title = getTitle(truck);
  const location = getLocation(truck);
  const price = formatMoney(truck.preco);
  const description = `${title}${truck.ano_modelo ? ` ano ${truck.ano_modelo}` : ""}${location ? ` em ${location}` : ""}. ${price}. Veja fotos, detalhes e contato direto pelo WhatsApp.`;
  const url = `${siteUrl}/anuncios/${truck.id}`;
  const image = getMainImage(truck);

  return {
    title: `${title}${truck.ano_modelo ? ` ${truck.ano_modelo}` : ""} - ${price}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: "Caminhões à Venda",
      title: `${title} - ${price}`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${price}`,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function AnuncioDetalhePage({ params }: PageProps) {
  const { id } = await params;
  const truck = await getApprovedTruck(id);

  if (!truck) notFound();

  const title = getTitle(truck);
  const location = getLocation(truck);
  const whatsappLink = getWhatsappLink(truck, title);
  const shareText = `🚛 ${title}${truck.ano_modelo ? ` ano ${truck.ano_modelo}` : ""}${truck.cidade ? ` em ${truck.cidade}` : ""}.\n\n${truck.descricao?.trim() || "Caminhão anunciado com fotos e contato direto pelo WhatsApp."}`;

  return (
    <main className="market-page">
      <PublicHeader />

      <section className="market-container detail-layout">
        <div className="detail-card">
          <div className="detail-title">
            <Link href="/anuncios" className="detail-eyebrow">← Voltar ao estoque</Link>
            <h1>{title}</h1>
            <p>{location || "Localização não informada"}</p>
          </div>

          <AdGallery title={title} images={truck.truck_images || []} />

          <div className="detail-description">
            <h2>Descrição do caminhão</h2>
            <p>{truck.descricao?.trim() || "Este anúncio ainda não possui descrição cadastrada. Fale pelo WhatsApp para confirmar estado do veículo, disponibilidade e condições de negociação."}</p>
          </div>
        </div>

        <aside className="detail-card">
          <span className="detail-eyebrow">Anúncio disponível</span>
          <strong className="detail-price">{formatMoney(truck.preco)}</strong>
          <p className="stock-count">Fale direto pelo WhatsApp para confirmar disponibilidade, estado do caminhão e forma de negociação.</p>

          <div className="detail-specs">
            <div><span>Marca</span><b>{truck.marca || "-"}</b></div>
            <div><span>Modelo</span><b>{truck.modelo || "-"}</b></div>
            <div><span>Ano/modelo</span><b>{truck.ano_modelo || truck.ano_fabricacao || "-"}</b></div>
            <div><span>Km</span><b>{formatKm(truck.quilometragem || truck.km)}</b></div>
            <div><span>Tração</span><b>{truck.tracao || "-"}</b></div>
            <div><span>Carroceria</span><b>{truck.carroceria || "-"}</b></div>
            <div><span>Cidade</span><b>{location || "-"}</b></div>
          </div>

          {whatsappLink ? <a href={whatsappLink} target="_blank" rel="noreferrer" className="detail-whatsapp">Tenho interesse neste caminhão</a> : null}
          <ShareAdButton title={title} text={shareText} />

          <div className="detail-description">
            <h2>Contato e negociação</h2>
            <p>Anúncio revisado antes de aparecer no site. O contato é direto pelo WhatsApp para facilitar a conversa com o interessado.</p>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </main>
  );
}
