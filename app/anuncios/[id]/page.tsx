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
          <span className="kicker">▣ Anúncio disponível</span>
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
        .detailPage{--green:#22c55e;min-height:100vh;color:#f8fafc;background:radial-gradient(circle at 8% 5%,rgba(34,197,94,.17),transparent 28%),radial-gradient(circle at 82% 12%,rgba(34,197,94,.10),transparent 24%),linear-gradient(135deg,#020506 0%,#06110e 48%,#030608 100%);overflow-x:hidden;padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}.hero{margin-top:-90px;min-height:330px;display:flex;align-items:end;background:linear-gradient(90deg,rgba(2,6,8,.96),rgba(2,6,8,.72) 45%,rgba(2,6,8,.25));border-bottom:1px solid rgba(255,255,255,.08)}.heroContent{padding:145px 0 46px}.back{display:inline-flex;margin-bottom:12px;color:#cbd5e1;text-decoration:none;font-weight:900}.kicker{display:inline-flex;align-items:center;gap:9px;min-height:34px;padding:0 13px;border-radius:999px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.32);color:#bbf7d0;font-size:12px;font-weight:950;letter-spacing:.07em;text-transform:uppercase}h1{margin:18px 0 10px;font-size:clamp(34px,5vw,58px);line-height:1.02;letter-spacing:-.055em;max-width:900px}.hero p{margin:0;color:#d7dee8;font-size:17px}.detailGrid{display:grid;grid-template-columns:minmax(0,1.18fr) minmax(340px,.82fr);gap:22px;margin-top:28px}.galleryBox{min-width:0}.infoCard,.description,.bottomCta{background:linear-gradient(180deg,rgba(16,23,26,.94),rgba(8,13,15,.94));border:1px solid rgba(255,255,255,.12);border-radius:16px;box-shadow:0 18px 45px rgba(0,0,0,.22)}.infoCard{padding:22px;position:sticky;top:120px}.status{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}.status span{min-height:28px;padding:0 10px;border-radius:999px;background:rgba(34,197,94,.13);border:1px solid rgba(34,197,94,.28);color:#86efac;font-size:12px;font-weight:950}.infoCard small{display:block;color:#94a3b8;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.price{display:block;margin:6px 0 16px;color:var(--green);font-size:clamp(30px,4vw,42px);letter-spacing:-.04em}.note{padding:15px;border-radius:12px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.20);margin-bottom:16px}.note b{display:block;color:#f8fafc;margin-bottom:5px}.note p{margin:0;color:#cbd5e1;line-height:1.55}.ficha{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}.ficha div{padding:12px;border-radius:10px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09)}.ficha span{display:block;color:#94a3b8;font-size:12px;font-weight:850;margin-bottom:4px}.ficha b{color:#f8fafc}.whatsapp{min-height:52px;width:100%;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;background:var(--green);color:#042913;text-decoration:none;font-weight:950;text-transform:uppercase;margin-bottom:10px}.description{margin-top:22px;padding:24px}.description h2{margin:14px 0 10px;font-size:clamp(26px,4vw,40px);letter-spacing:-.04em}.description p{margin:0;color:#d6dee8;line-height:1.7;font-size:17px;white-space:pre-line}.bottomCta{margin-top:22px;padding:22px;display:flex;align-items:center;justify-content:space-between;gap:16px}.bottomCta span{display:block;color:#86efac;font-weight:950;text-transform:uppercase;font-size:12px;letter-spacing:.07em}.bottomCta strong{display:block;margin-top:5px;font-size:22px}.bottomCta a{min-height:48px;padding:0 18px;border-radius:8px;background:var(--green);color:#042913;text-decoration:none;font-weight:950;display:inline-flex;align-items:center}@media(max-width:900px){.detailGrid{grid-template-columns:1fr}.infoCard{position:relative;top:auto}}@media(max-width:640px){.wrap{width:calc(100vw - 22px)}.hero{margin-top:-152px;min-height:420px}.heroContent{padding:230px 0 42px}h1{font-size:34px}.ficha{grid-template-columns:1fr}.bottomCta{display:block}.bottomCta a{margin-top:14px;width:100%;justify-content:center}}
      `}</style>
    </main>
  );
}
