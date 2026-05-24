import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TruckGallery } from "@/components/TruckGallery";
import { ShareAdButton } from "@/components/ShareAdButton";

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

function getWhatsappLink(truck: Truck, title: string) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(
    `Olá, tenho interesse no caminhão ${title}${truck.ano_modelo ? ` ano ${truck.ano_modelo}` : ""}. Pode me passar mais informações?`
  );

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
  const whatsappLink = truck.whatsapp ? getWhatsappLink(truck, title) : "";
  const shareText = `Confira esse anúncio: ${title}${truck.ano_modelo ? ` ano ${truck.ano_modelo}` : ""}${truck.cidade ? ` em ${truck.cidade}` : ""}.`;

  return (
    <main className="detail-page">
      <header className="detail-header">
        <Link href="/anuncios" className="detail-back">← Voltar ao estoque</Link>
        <Link href="/cadastro" className="detail-primary">Anunciar caminhão</Link>
      </header>

      <section className="detail-container">
        <TruckGallery title={title} images={truck.truck_images || []} />

        <aside className="detail-info-card">
          <div className="status-row">
            <span className="detail-badge">Disponível</span>
            <span className="safe-badge">Anúncio revisado</span>
          </div>

          <h1>{title}</h1>

          <span className="price-label">Valor anunciado</span>
          <strong className="detail-price">{formatMoney(truck.preco)}</strong>

          <div className="trust-note">
            <strong>Negociação direta com o anunciante</strong>
            <p>Confira os dados, veja as fotos e chame no WhatsApp para tirar dúvidas ou negociar.</p>
          </div>

          <div className="detail-ficha">
            <div><span>Marca</span><strong>{truck.marca || "-"}</strong></div>
            <div><span>Modelo</span><strong>{truck.modelo || "-"}</strong></div>
            <div><span>Ano</span><strong>{truck.ano_modelo || truck.ano_fabricacao || "-"}</strong></div>
            <div><span>Cidade</span><strong>{truck.cidade || "-"}{truck.estado ? `/${truck.estado}` : ""}</strong></div>
            <div><span>Carroceria</span><strong>{truck.carroceria || "-"}</strong></div>
            <div><span>Tração</span><strong>{truck.tracao || "-"}</strong></div>
          </div>

          {truck.whatsapp && (
            <a href={whatsappLink} target="_blank" className="detail-whatsapp">
              Tenho interesse nesse caminhão
            </a>
          )}

          <ShareAdButton title={title} text={shareText} />
        </aside>
      </section>

      <section className="detail-description">
        <div className="description-head">
          <span>Descrição completa</span>
          <h2>Informações do anúncio</h2>
        </div>

        <p>{truck.descricao?.trim() || "Este anúncio ainda não possui descrição cadastrada."}</p>
      </section>

      <section className="bottom-cta">
        <div>
          <span>Gostou desse caminhão?</span>
          <strong>Fale com o anunciante e confirme disponibilidade.</strong>
        </div>

        {truck.whatsapp ? (
          <a href={whatsappLink} target="_blank">Chamar no WhatsApp</a>
        ) : (
          <Link href="/anuncios">Ver outros caminhões</Link>
        )}
      </section>

      <style>{`
        .detail-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 18% 8%, rgba(34,197,94,.14), transparent 30%),
            linear-gradient(135deg,#020617 0%,#071f1b 55%,#020617 100%);
          color: white;
          padding-bottom: 50px;
          overflow-x: hidden;
        }

        .detail-header {
          min-height: 74px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 9vw;
          border-bottom: 1px solid rgba(255,255,255,.10);
          background: rgba(2,6,23,.84);
          position: sticky;
          top: 0;
          z-index: 30;
          backdrop-filter: blur(14px);
        }

        .detail-back,
        .detail-primary {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 900;
          white-space: nowrap;
        }

        .detail-back {
          color: white;
          border: 1px solid rgba(255,255,255,.14);
          padding: 10px 14px;
        }

        .detail-primary {
          background: #22c55e;
          color: #052e16;
          padding: 10px 18px;
        }

        .detail-container {
          width: min(1180px, calc(100vw - 32px));
          margin: 32px auto 22px;
          display: grid;
          grid-template-columns: minmax(0,1.25fr) minmax(340px,.75fr);
          gap: 22px;
          align-items: start;
        }

        .detail-info-card,
        .detail-description,
        .bottom-cta {
          border-radius: 28px;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.10);
        }

        .detail-info-card {
          padding: 26px;
          position: sticky;
          top: 94px;
        }

        .status-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .detail-badge,
        .safe-badge,
        .detail-description span,
        .bottom-cta span {
          display: inline-flex;
          padding: 8px 14px;
          border-radius: 999px;
          font-weight: 950;
          font-size: 12px;
        }

        .detail-badge {
          color: #052e16;
          background: #22c55e;
        }

        .safe-badge {
          color: #fde68a;
          background: rgba(234,179,8,.12);
          border: 1px solid rgba(234,179,8,.22);
        }

        .detail-info-card h1 {
          font-size: 34px;
          line-height: 1.08;
          margin: 18px 0 14px;
          overflow-wrap: anywhere;
        }

        .price-label {
          display: block;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 850;
          margin-bottom: 5px;
        }

        .detail-price {
          display: block;
          color: #86efac;
          font-size: 38px;
          margin-bottom: 18px;
          line-height: 1.05;
        }

        .trust-note {
          padding: 16px;
          border-radius: 18px;
          background: rgba(34,197,94,.10);
          border: 1px solid rgba(34,197,94,.22);
          margin-bottom: 20px;
        }

        .trust-note strong {
          color: white;
          display: block;
          margin-bottom: 5px;
          font-size: 15px;
        }

        .trust-note p {
          margin: 0;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.45;
        }

        .detail-ficha {
          display: grid;
          gap: 10px;
          margin-bottom: 22px;
        }

        .detail-ficha div {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .detail-ficha span {
          color: #94a3b8;
        }

        .detail-ficha strong {
          text-align: right;
          overflow-wrap: anywhere;
        }

        .detail-whatsapp {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 56px;
          padding: 15px;
          border-radius: 16px;
          background: #22c55e;
          color: #052e16;
          text-align: center;
          text-decoration: none;
          font-weight: 950;
          font-size: 16px;
          box-shadow: 0 18px 45px rgba(34,197,94,.22);
        }

        .detail-description {
          width: min(1180px, calc(100vw - 32px));
          margin: 0 auto 22px;
          padding: 28px;
        }

        .description-head span {
          color: #86efac;
          background: rgba(34,197,94,.12);
          border: 1px solid rgba(34,197,94,.22);
        }

        .detail-description h2 {
          margin: 16px 0 10px;
          font-size: 30px;
          line-height: 1.1;
        }

        .detail-description p {
          margin: 0;
          color: #dbeafe;
          font-size: 18px;
          line-height: 1.75;
          white-space: pre-line;
        }

        .bottom-cta {
          width: min(1180px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .bottom-cta span {
          color: #86efac;
          background: rgba(34,197,94,.12);
          border: 1px solid rgba(34,197,94,.22);
          margin-bottom: 10px;
        }

        .bottom-cta strong {
          display: block;
          font-size: 24px;
          line-height: 1.2;
        }

        .bottom-cta a {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 22px;
          border-radius: 16px;
          background: #22c55e;
          color: #052e16;
          text-decoration: none;
          font-weight: 950;
          white-space: nowrap;
        }

        @media (max-width: 900px) {
          .detail-header {
            padding: 10px 12px;
            min-height: auto;
          }

          .detail-container {
            width: calc(100vw - 24px);
            margin: 16px auto;
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .detail-info-card {
            position: static;
            padding: 20px;
            border-radius: 22px;
          }

          .detail-info-card h1 {
            font-size: 27px;
            margin-top: 14px;
          }

          .detail-price {
            font-size: 32px;
          }

          .detail-ficha div {
            display: grid;
            grid-template-columns: 95px 1fr;
            align-items: start;
          }

          .detail-ficha strong {
            text-align: left;
          }

          .detail-description,
          .bottom-cta {
            width: calc(100vw - 24px);
            padding: 20px;
            border-radius: 22px;
          }

          .detail-description h2 {
            font-size: 24px;
          }

          .detail-description p {
            font-size: 16px;
            line-height: 1.65;
          }

          .bottom-cta {
            display: grid;
          }

          .bottom-cta strong {
            font-size: 21px;
          }

          .bottom-cta a {
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .detail-back,
          .detail-primary {
            min-height: 40px;
            padding: 9px 12px;
            font-size: 13px;
          }

          .detail-info-card h1 {
            font-size: 24px;
          }

          .detail-price {
            font-size: 29px;
          }
        }
      `}</style>
    </main>
  );
}
