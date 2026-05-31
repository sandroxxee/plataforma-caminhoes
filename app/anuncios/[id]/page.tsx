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

type PageProps = { params: Promise<{ id: string }> };

export default async function AnuncioDetalhePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trucks")
    .select(`id,titulo,marca,modelo,ano_modelo,ano_fabricacao,preco,cidade,estado,carroceria,tracao,descricao,whatsapp,truck_images(image_url,principal,ordem)`)
    .eq("id", id)
    .eq("status", "aprovado")
    .single();

  if (error || !data) notFound();

  const truck = data as Truck;
  const title = getTitle(truck);
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
            <p>{getLocation(truck)}</p>
          </div>
          <AdGallery title={title} images={truck.truck_images || []} />
        </div>

        <aside className="detail-card">
          <span className="detail-eyebrow">Anúncio disponível</span>
          <strong className="detail-price">{formatMoney(truck.preco)}</strong>

          <div className="detail-specs">
            <div><span>Marca</span><b>{truck.marca || "-"}</b></div>
            <div><span>Modelo</span><b>{truck.modelo || "-"}</b></div>
            <div><span>Ano/modelo</span><b>{truck.ano_modelo || truck.ano_fabricacao || "-"}</b></div>
            <div><span>Km</span><b>{formatKm(truck.quilometragem || truck.km)}</b></div>
            <div><span>Tração</span><b>{truck.tracao || "-"}</b></div>
            <div><span>Carroceria</span><b>{truck.carroceria || "-"}</b></div>
            <div><span>Cidade</span><b>{getLocation(truck)}</b></div>
          </div>

          {whatsappLink ? <a href={whatsappLink} target="_blank" rel="noreferrer" className="detail-whatsapp">Chamar no WhatsApp</a> : null}
          <ShareAdButton title={title} text={shareText} />

          <div className="detail-description">
            <h2>Descrição</h2>
            <p>{truck.descricao?.trim() || "Este anúncio ainda não possui descrição cadastrada."}</p>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </main>
  );
}
