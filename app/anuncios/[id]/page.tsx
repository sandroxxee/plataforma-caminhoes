import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TruckGallery } from "@/components/TruckGallery";
import { ShareAdButton } from "@/components/ShareAdButton";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TruckImage = { image_url: string | null; principal: boolean | null; ordem: number | null };
type Truck = { id: string; titulo: string | null; marca: string | null; modelo: string | null; ano_modelo: number | null; ano_fabricacao: number | null; preco: number | null; cidade: string | null; estado: string | null; carroceria: string | null; tracao: string | null; descricao: string | null; whatsapp: string | null; truck_images?: TruckImage[] };

function formatMoney(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function getWhatsappLink(truck: Truck, title: string) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(`Olá, tenho interesse no caminhão ${title}${truck.ano_modelo ? ` ano ${truck.ano_modelo}` : ""}. Pode me passar mais informações?`);
  return `https://wa.me/${phone}?text=${text}`;
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
  const title = truck.titulo || `${truck.marca || ""} ${truck.modelo || ""}`.trim() || "Caminhão";
  const whatsappLink = truck.whatsapp ? getWhatsappLink(truck, title) : "";
  const shareText = `🚛 ${title}${truck.ano_modelo ? ` ano ${truck.ano_modelo}` : ""}${truck.cidade ? ` em ${truck.cidade}` : ""}.\n\n${truck.descricao?.trim() || "Caminhão anunciado com fotos e contato direto pelo WhatsApp."}`;

  return (
    <main className="detailPage">
      <PublicHeader />

      <section className="hero">
        <div className="wrap heroContent">
          <Link href="/anuncios" className="back">← Voltar ao estoque</Link>
          <span className="kicker">Anúncio disponível</span>
          <h1>{title}</h1>
          <p>{truck.cidade || "Cidade"}{truck.estado ? ` - ${truck.estado}` : ""} · {truck.tracao || "Tração"} · {truck.carroceria || "Tipo"}</p>
        </div>
      </section>

      <section className="wrap detailGrid">
        <div className="galleryBox"><TruckGallery title={title} images={truck.truck_images || []} /></div>

        <aside className="infoCard">
          <div className="status"><span>Disponível</span><span>Anúncio revisado</span></div>
          <small>Valor anunciado</small>
          <strong className="price">{formatMoney(truck.preco)}</strong>
          <div className="note"><b>Negociação direta com o anunciante</b><p>Confira os dados, veja as fotos e chame no WhatsApp para tirar dúvidas ou negociar.</p></div>
          <div className="ficha">
            <div><span>Marca</span><b>{truck.marca || "-"}</b></div>
            <div><span>Modelo</span><b>{truck.modelo || "-"}</b></div>
            <div><span>Ano</span><b>{truck.ano_modelo || truck.ano_fabricacao || "-"}</b></div>
            <div><span>Cidade</span><b>{truck.cidade || "-"}{truck.estado ? `/${truck.estado}` : ""}</b></div>
            <div><span>Carroceria</span><b>{truck.carroceria || "-"}</b></div>
            <div><span>Tração</span><b>{truck.tracao || "-"}</b></div>
          </div>
          {truck.whatsapp && <a href={whatsappLink} target="_blank" rel="noreferrer" className="whatsapp">Tenho interesse nesse caminhão</a>}
          <ShareAdButton title={title} text={shareText} />
        </aside>
      </section>

      <section className="wrap description">
        <span className="kicker">Descrição completa</span>
        <h2>Informações do anúncio</h2>
        <p>{truck.descricao?.trim() || "Este anúncio ainda não possui descrição cadastrada."}</p>
      </section>

      <section className="wrap bottomCta">
        <div><span>Gostou desse caminhão?</span><strong>Fale com o anunciante e confirme disponibilidade.</strong></div>
        {truck.whatsapp ? <a href={whatsappLink} target="_blank" rel="noreferrer">Chamar no WhatsApp</a> : <Link href="/anuncios">Ver outros caminhões</Link>}
      </section>

      <SiteFooter />

      <style>{`
        .detailPage{min-height:100vh;color:var(--site-text);background:radial-gradient(circle at 82% -12%,color-mix(in srgb,var(--site-green) 18%,transparent),transparent 34%),radial-gradient(circle at 8% 4%,color-mix(in srgb,var(--site-gold) 10%,transparent),transparent 27%),linear-gradient(180deg,var(--site-bg),var(--site-bg-2));overflow-x:hidden;padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}.hero{margin:10px auto 0;width:min(1240px,calc(100vw - 32px));min-height:260px;display:flex;align-items:end;padding:28px;border-radius:30px;background:linear-gradient(115deg,var(--site-surface),color-mix(in srgb,var(--site-surface) 70%,transparent)),radial-gradient(circle at 82% 18%,color-mix(in srgb,var(--site-green) 22%,transparent),transparent 28%);border:1px solid var(--site-line);box-shadow:var(--site-shadow);overflow:hidden}.heroContent{padding:0}.back{display:inline-flex;margin-bottom:12px;color:var(--site-muted);text-decoration:none;font-weight:900}.kicker{display:inline-flex;align-items:center;gap:9px;min-height:32px;padding:0 12px;border-radius:999px;background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 28%,transparent);color:var(--site-green);font-size:12px;font-weight:950;letter-spacing:.06em;text-transform:uppercase}h1{margin:16px 0 10px;font-size:clamp(34px,4.8vw,60px);line-height:.98;letter-spacing:-.06em;max-width:900px}.hero p{margin:0;color:var(--site-muted);font-size:17px;font-weight:760}.detailGrid{display:grid;grid-template-columns:minmax(0,1.18fr) minmax(340px,.82fr);gap:22px;margin-top:22px}.galleryBox{min-width:0;overflow:hidden;border-radius:26px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft);padding:10px}.infoCard,.description,.bottomCta{background:var(--site-surface);border:1px solid var(--site-line);border-radius:26px;box-shadow:var(--site-shadow-soft)}.infoCard{padding:22px;position:sticky;top:120px}.status{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}.status span{min-height:30px;padding:0 11px;border-radius:999px;background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 28%,transparent);color:var(--site-green);font-size:12px;font-weight:950}.infoCard small{display:block;color:var(--site-muted);font-weight:900;text-transform:uppercase;letter-spacing:.08em}.price{display:block;margin:6px 0 16px;color:var(--site-green);font-size:clamp(30px,4vw,42px);letter-spacing:-.04em}.note{padding:15px;border-radius:18px;background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 22%,transparent);margin-bottom:16px}.note b{display:block;color:var(--site-text);margin-bottom:5px}.note p{margin:0;color:var(--site-muted);line-height:1.55}.ficha{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}.ficha div{padding:12px;border-radius:16px;background:var(--site-surface-2);border:1px solid var(--site-line)}.ficha span{display:block;color:var(--site-muted);font-size:12px;font-weight:850;margin-bottom:4px}.ficha b{color:var(--site-text)}.whatsapp{min-height:52px;width:100%;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:#19c56f;color:#042913;text-decoration:none;font-weight:950;text-transform:uppercase;margin-bottom:10px}.description{margin-top:22px;padding:24px}.description h2{margin:14px 0 10px;font-size:clamp(26px,4vw,40px);letter-spacing:-.04em}.description p{margin:0;color:var(--site-muted);line-height:1.7;font-size:17px;white-space:pre-line}.bottomCta{margin-top:22px;padding:22px;display:flex;align-items:center;justify-content:space-between;gap:16px;background:linear-gradient(135deg,var(--site-green-2),var(--site-green));color:#fff}.bottomCta span{display:block;color:#fff;font-weight:950;text-transform:uppercase;font-size:12px;letter-spacing:.07em;opacity:.9}.bottomCta strong{display:block;margin-top:5px;font-size:22px}.bottomCta a{min-height:48px;padding:0 18px;border-radius:999px;background:#fff;color:#102018;text-decoration:none;font-weight:950;display:inline-flex;align-items:center}@media(max-width:900px){.detailGrid{grid-template-columns:1fr}.infoCard{position:relative;top:auto}}@media(max-width:640px){.wrap,.hero{width:calc(100vw - 22px)}.hero{padding:22px;border-radius:24px;min-height:auto}.hero h1{font-size:34px}.ficha{grid-template-columns:1fr}.bottomCta{display:block}.bottomCta a{margin-top:14px;width:100%;justify-content:center}}
      `}</style>
    </main>
  );
}
