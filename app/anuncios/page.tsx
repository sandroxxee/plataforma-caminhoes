import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TruckImage = { image_url: string | null; principal: boolean | null; ordem: number | null; };
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
  whatsapp: string | null;
  destaque: boolean | null;
  truck_images?: TruckImage[];
};

function formatMoney(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
function getMainImage(truck: Truck) {
  const images = truck.truck_images || [];
  const principal = images.find((img) => img.principal && img.image_url);
  const first = [...images].filter((img) => img.image_url).sort((a, b) => (a.ordem || 0) - (b.ordem || 0))[0];
  return principal?.image_url || first?.image_url || "";
}
function getWhatsappLink(truck: Truck) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(`Olá, tenho interesse no caminhão ${truck.titulo || ""}.`);
  return `https://wa.me/${phone}?text=${text}`;
}

export default async function AnunciosPage() {
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
      whatsapp,
      destaque,
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("created_at", { ascending: false });
  const trucks = (data || []) as Truck[];

  return (
    <main className="public-page">
      <header className="public-header">
        <Link href="/" className="public-logo">
          <span className="public-logo-icon">🚛</span>
          <span><strong>CAMINHÕES EM OFERTA</strong><small>Anúncios reais do Supabase</small></span>
        </Link>
        <nav className="public-nav">
          <Link href="/anuncios" className="public-nav-link">Anúncios</Link>
          <Link href="/login" className="public-outline">Entrar</Link>
          <Link href="/cadastro" className="public-primary">Anunciar</Link>
        </nav>
      </header>

      <section className="ads-hero">
        <span className="public-badge">SITE PÚBLICO</span>
        <h1>Caminhões à venda</h1>
        <p>Somente anúncios aprovados e prontos para negociação.</p>
      </section>

      {error && <div className="public-error">Erro ao carregar anúncios do Supabase: {error.message}</div>}

      <section className="ads-content">
        <aside className="ads-filters">
          <strong>Filtros</strong>
          <select defaultValue=""><option value="">Todas as marcas</option><option>Mercedes-Benz</option><option>Scania</option><option>Volvo</option><option>Volkswagen</option><option>Ford</option><option>Iveco</option><option>DAF</option></select>
          <select defaultValue=""><option value="">Todas as carrocerias</option><option>Caçamba basculante</option><option>Prancha</option><option>Plataforma</option><option>Baú seco</option><option>Baú frigorífico</option><option>Cavalo mecânico</option></select>
          <select defaultValue=""><option value="">Todas as trações</option><option>4x2</option><option>6x2</option><option>6x4</option><option>8x4</option></select>
          <Link href="/cadastro">Quero anunciar</Link>
        </aside>

        <div className="ads-results">
          <div className="ads-results-header">
            <h2>{trucks.length} caminhões aprovados</h2>
            <span>Dados reais do banco</span>
          </div>

          <div className="truck-grid">
            {trucks.map((truck) => {
              const image = getMainImage(truck);
              return (
                <article key={truck.id} className="truck-card">
                  <div className="truck-image-wrap">
                    {truck.destaque && <span className="truck-tag">destaque</span>}
                    {image ? <img src={image} alt={truck.titulo || "Caminhão"} className="truck-image" /> : <div className="truck-no-image">Sem foto</div>}
                  </div>
                  <div className="truck-body">
                    <h3 className="truck-title">{truck.titulo || `${truck.marca} ${truck.modelo}`}</h3>
                    <strong className="truck-price">{formatMoney(truck.preco)}</strong>
                    <div className="truck-info"><span>{truck.ano_modelo || truck.ano_fabricacao || "Ano não informado"}</span><span>{truck.cidade || "Cidade"}{truck.estado ? `/${truck.estado}` : ""}</span></div>
                    <div className="truck-chips">{truck.carroceria && <span>{truck.carroceria}</span>}{truck.tracao && <span>{truck.tracao}</span>}</div>
                    <div className="truck-actions">
                      <Link href={`/anuncios/${truck.id}`} className="truck-details">Ver detalhes</Link>
                      {truck.whatsapp && <a href={getWhatsappLink(truck)} target="_blank" className="truck-whatsapp">WhatsApp</a>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {trucks.length === 0 && <div className="public-empty">Nenhum anúncio aprovado no banco agora.</div>}
        </div>
      </section>

      <style>{`
        .ads-hero {
          max-width: 1180px;
          margin: 42px auto 22px;
          padding: 34px;
          border-radius: 28px;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.10);
        }
        .ads-hero h1 { font-size: 42px; margin: 18px 0 10px; }
        .ads-hero p { color: #cbd5e1; font-size: 18px; margin: 0; }
        .ads-content {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          padding: 0 18px;
        }
        .ads-filters {
          padding: 22px;
          border-radius: 24px;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.10);
          align-self: start;
          display: grid;
          gap: 14px;
        }
        .ads-filters select {
          padding: 13px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.15);
          background: #111827;
          color: white;
          outline: none;
          width: 100%;
        }
        .ads-filters a {
          background: #22c55e;
          color: #052e16;
          padding: 13px 14px;
          border-radius: 14px;
          text-decoration: none;
          text-align: center;
          font-weight: 900;
        }
        .ads-results { min-width: 0; }
        .ads-results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .ads-results-header h2 { margin: 0; }
        .ads-results-header span { color: #94a3b8; }
        @media (max-width: 900px) {
          .ads-content { grid-template-columns: 1fr; }
          .ads-filters { grid-template-columns: 1fr 1fr; }
          .ads-filters strong { grid-column: 1 / -1; }
        }
        @media (max-width: 680px) {
          .ads-hero {
            margin: 16px 12px 16px;
            padding: 20px;
            border-radius: 22px;
          }
          .ads-hero h1 { font-size: 30px; line-height: 1.08; }
          .ads-hero p { font-size: 16px; }
          .ads-content { padding: 0 12px; gap: 16px; }
          .ads-filters { grid-template-columns: 1fr; padding: 16px; border-radius: 20px; }
          .ads-results-header { display: grid; gap: 4px; }
          .ads-results-header h2 { font-size: 24px; }
        }
      `}</style>

      <style>{`
        .public-page {
          min-height: 100vh;
          background: linear-gradient(135deg,#020617 0%,#071f1b 55%,#020617 100%);
          color: white;
          padding-bottom: 54px;
          overflow-x: hidden;
        }
        .public-header {
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 0 9vw;
          border-bottom: 1px solid rgba(255,255,255,.10);
          background: rgba(2,6,23,.86);
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(14px);
        }
        .public-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
          min-width: 0;
        }
        .public-logo-icon {
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #22c55e;
        }
        .public-logo strong {
          display: block;
          line-height: 1.05;
          letter-spacing: .2px;
        }
        .public-logo small {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          margin-top: 3px;
        }
        .public-nav {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: nowrap;
        }
        .public-nav a {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
          text-decoration: none;
          font-weight: 900;
          border-radius: 14px;
          padding: 12px 18px;
        }
        .public-nav-link { color: #cbd5e1; }
        .public-outline { color: white; border: 1px solid rgba(255,255,255,.16); }
        .public-primary { background: #22c55e; color: #052e16; }
        .public-badge {
          display: inline-flex;
          padding: 8px 14px;
          border-radius: 999px;
          color: #86efac;
          background: rgba(34,197,94,.12);
          border: 1px solid rgba(34,197,94,.22);
          font-weight: 900;
          font-size: 12px;
        }
        .truck-grid {
          display: grid;
          grid-template-columns: repeat(3,minmax(0,1fr));
          gap: 20px;
        }
        .truck-card {
          overflow: hidden;
          border-radius: 24px;
          background: rgba(15,23,42,.76);
          border: 1px solid rgba(255,255,255,.12);
          min-width: 0;
        }
        .truck-image-wrap {
          position: relative;
          height: 220px;
          background: rgba(2,6,23,.75);
        }
        .truck-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .truck-no-image {
          height: 100%;
          display: grid;
          place-items: center;
          color: #94a3b8;
          font-weight: 900;
        }
        .truck-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 2;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(234,179,8,.20);
          color: #fde68a;
          border: 1px solid rgba(234,179,8,.35);
          font-weight: 900;
          font-size: 12px;
        }
        .truck-body { padding: 18px; }
        .truck-title {
          margin: 0;
          font-size: 19px;
          line-height: 1.25;
          overflow-wrap: anywhere;
        }
        .truck-price {
          display: block;
          margin-top: 12px;
          color: #86efac;
          font-size: 25px;
          line-height: 1.1;
        }
        .truck-info {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 12px;
          color: #cbd5e1;
        }
        .truck-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 10px;
          margin-bottom: 14px;
          color: #cbd5e1;
        }
        .truck-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 16px;
        }
        .truck-details,
        .truck-whatsapp {
          padding: 12px;
          border-radius: 13px;
          text-align: center;
          text-decoration: none;
          font-weight: 900;
        }
        .truck-details { color: white; border: 1px solid rgba(255,255,255,.14); }
        .truck-whatsapp { background: #22c55e; color: #052e16; }
        .public-error,
        .public-empty {
          max-width: 1180px;
          margin: 0 auto 20px;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.07);
        }
        .public-error {
          color: #fecaca;
          background: rgba(239,68,68,.12);
          border-color: rgba(239,68,68,.25);
        }
        @media (max-width: 980px) {
          .public-header { padding: 12px 16px; align-items: flex-start; }
          .truck-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }
        @media (max-width: 680px) {
          .public-header {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            min-height: auto;
            padding: 10px 12px 12px;
          }
          .public-logo {
            justify-content: center;
            text-align: center;
          }
          .public-logo-icon {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
          }
          .public-logo strong { font-size: 14px; }
          .public-logo small { display: none; }
          .public-nav {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
          }
          .public-nav a {
            min-height: 42px;
            padding: 9px 8px;
            font-size: 13px;
            border-radius: 12px;
          }
          .truck-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .truck-card { border-radius: 20px; }
          .truck-image-wrap { height: 230px; }
          .truck-body { padding: 16px; }
          .truck-title { font-size: 20px; }
          .truck-price { font-size: 24px; }
          .truck-actions { grid-template-columns: 1fr; }
        }
      `}</style>

    </main>
  );
}
