import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { createClient } from "@/lib/supabase/server";
import { SiteFooter } from "@/components/SiteFooter";

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

function getImage(truck: Truck) {
  const images = [...(truck.truck_images || [])]
    .filter((img) => img.image_url)
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  return images.find((img) => img.principal)?.image_url || images[0]?.image_url || "";
}

function getTitle(truck: Truck) {
  return truck.titulo || `${truck.marca || ""} ${truck.modelo || ""}`.trim() || "Caminhão anunciado";
}

function getWhatsappLink(truck: Truck) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(`Olá, tenho interesse no caminhão ${getTitle(truck)}.`);
  return phone ? `https://wa.me/${phone}?text=${text}` : `/anuncios/${truck.id}`;
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data } = await supabase
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
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("created_at", { ascending: false })
    .limit(6);

  const trucks = (data || []) as Truck[];
  const featured = trucks[0];
  const featuredImage = featured ? getImage(featured) : "";

  return (
    <main className="home-page">
      <PublicHeader />

      <section className="hero">
        <div className="hero-bg">
          {featuredImage && <img src={featuredImage} alt={featured ? getTitle(featured) : "Caminhão em destaque"} />}
        </div>

        <div className="hero-content">
          <span className="stock-pill">Estoque atualizado</span>
          <h1>
            Caminhões selecionados para o <span>seu negócio.</span>
          </h1>
          <p>
            Cavalos mecânicos, trucks, tocos e muito mais. Encontre o caminhão ideal com negociação direta.
          </p>

          <div className="hero-actions">
            <Link href="/anuncios" className="btn primary">Ver estoque</Link>
            <Link href="/anunciar" className="btn ghost">Anunciar caminhão</Link>
          </div>
        </div>
      </section>

      <form className="quick-filter" action="/anuncios">
        <label>
          <small>Marca</small>
          <select name="marca" aria-label="Marca">
            <option value="">Todas as marcas</option>
            <option>Mercedes-Benz</option>
            <option>Volkswagen</option>
            <option>Volvo</option>
            <option>Scania</option>
            <option>Ford</option>
            <option>Iveco</option>
            <option>DAF</option>
          </select>
        </label>

        <label>
          <small>Tipo</small>
          <select name="carroceria" aria-label="Tipo">
            <option value="">Todos os tipos</option>
            <option>Cavalo mecânico</option>
            <option>Truck</option>
            <option>Toco</option>
            <option>Prancha</option>
            <option>Caçamba</option>
          </select>
        </label>

        <label>
          <small>Tração</small>
          <select name="tracao" aria-label="Tração">
            <option value="">Todas as trações</option>
            <option>4x2</option>
            <option>6x2</option>
            <option>6x4</option>
            <option>8x2</option>
            <option>8x4</option>
          </select>
        </label>

        <input name="modelo" placeholder="Buscar modelo, marca..." aria-label="Buscar" />
        <button type="submit">Buscar</button>
      </form>

      <section className="section-head">
        <div>
          <span className="section-icon">▱</span>
          <h2>Caminhões disponíveis</h2>
        </div>
        <Link href="/anuncios">Ver todos</Link>
      </section>

      <section className="truck-grid">
        {trucks.length > 0 ? (
          trucks.map((truck) => {
            const image = getImage(truck);
            const title = getTitle(truck);

            return (
              <article className="truck-card" key={truck.id}>
                <Link href={`/anuncios/${truck.id}`} className="photo">
                  {image ? <img src={image} alt={title} /> : <span>Sem foto</span>}
                  <em>{truck.carroceria || "Caminhão"}</em>
                </Link>

                <div className="card-content">
                  <Link href={`/anuncios/${truck.id}`} className="truck-title">{title}</Link>

                  <div className="meta-row">
                    <span>{truck.ano_modelo || truck.ano_fabricacao || "Ano"}</span>
                    <span>{truck.tracao || "Tração"}</span>
                    <span>{truck.cidade || "Cidade"}</span>
                  </div>

                  <strong className="price">{formatMoney(truck.preco)}</strong>
                  <small className="pay-info">À vista</small>

                  <div className="card-actions">
                    <Link href={`/anuncios/${truck.id}`} className="details">Ver detalhes</Link>
                    {truck.whatsapp && <a href={getWhatsappLink(truck)} target="_blank" className="whats">WhatsApp</a>}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty">
            <h3>Nenhum caminhão aprovado ainda.</h3>
            <p>Assim que os anúncios forem aprovados, eles aparecem aqui automaticamente.</p>
          </div>
        )}
      </section>

      <section className="trust-band">
        <div><strong>Negociação segura</strong><span>Contato direto com o vendedor</span></div>
        <div><strong>Documentação verificada</strong><span>Mais segurança para o seu negócio</span></div>
        <div><strong>Estoque atualizado</strong><span>Novos caminhões todos os dias</span></div>
        <div><strong>Fale no WhatsApp</strong><span>Atendimento rápido e direto</span></div>
      </section>

      <SiteFooter />

      <style>{`
        .home-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 4%, rgba(34,197,94,.15), transparent 30%),
            linear-gradient(135deg, #020617 0%, #07110f 55%, #020617 100%);
          color: white;
          overflow-x: hidden;
        }

        .hero {
          position: relative;
          min-height: 470px;
          margin-top: -1px;
          display: flex;
          align-items: center;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(2,6,23,.96) 0%, rgba(2,6,23,.76) 42%, rgba(2,6,23,.24) 100%),
            radial-gradient(circle at 10% 40%, rgba(34,197,94,.14), transparent 34%);
          z-index: 1;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, #111827, #020617),
            radial-gradient(circle at 70% 40%, rgba(34,197,94,.12), transparent 30%);
        }

        .hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: .58;
          filter: contrast(1.08) saturate(1.02);
        }

        .hero-content {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto;
          position: relative;
          z-index: 2;
          padding: 70px 0 44px;
        }

        .stock-pill {
          min-height: 32px;
          display: inline-flex;
          align-items: center;
          padding: 0 14px;
          border-radius: 999px;
          color: #bbf7d0;
          background: rgba(34,197,94,.13);
          border: 1px solid rgba(34,197,94,.28);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        h1 {
          max-width: 650px;
          margin: 18px 0 14px;
          font-size: clamp(42px, 5vw, 68px);
          line-height: 1.04;
          letter-spacing: -.055em;
        }

        h1 span { color: #22c55e; }

        .hero p {
          max-width: 560px;
          margin: 0;
          color: #d1d5db;
          font-size: 18px;
          line-height: 1.5;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .btn {
          min-height: 52px;
          padding: 0 22px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: .04em;
          font-size: 13px;
        }

        .btn.primary { background: #22c55e; color: #052e16; }
        .btn.ghost { border: 1px solid rgba(255,255,255,.24); color: white; background: rgba(255,255,255,.05); }

        .quick-filter {
          width: min(1240px, calc(100vw - 32px));
          margin: -36px auto 30px;
          position: relative;
          z-index: 4;
          padding: 14px;
          border-radius: 16px;
          background: rgba(15,23,42,.86);
          border: 1px solid rgba(255,255,255,.10);
          box-shadow: 0 22px 60px rgba(0,0,0,.30);
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1.25fr auto;
          gap: 12px;
          align-items: end;
        }

        .quick-filter label { display: grid; gap: 6px; }
        .quick-filter small { color: #94a3b8; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }

        .quick-filter select,
        .quick-filter input,
        .quick-filter button {
          min-height: 48px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(2,6,23,.70);
          color: white;
          padding: 0 13px;
          outline: none;
          font-weight: 850;
        }

        .quick-filter button { background: #22c55e; color: #052e16; border-color: transparent; cursor: pointer; font-weight: 950; }

        .section-head {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .section-head div { display: flex; align-items: center; gap: 12px; }
        .section-icon { color: #22c55e; font-size: 28px; }
        .section-head h2 { margin: 0; font-size: clamp(26px, 3vw, 34px); letter-spacing: -.035em; }
        .section-head a { color: #86efac; font-weight: 950; text-decoration: none; }

        .truck-grid {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .truck-card {
          border-radius: 16px;
          background: rgba(255,255,255,.065);
          border: 1px solid rgba(255,255,255,.10);
          overflow: hidden;
          min-width: 0;
        }

        .photo { height: 230px; display: block; position: relative; overflow: hidden; background: #111827; color: #94a3b8; }
        .photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .photo em { position: absolute; left: 12px; top: 12px; padding: 6px 10px; border-radius: 5px; background: rgba(34,197,94,.88); color: #052e16; font-style: normal; font-size: 11px; font-weight: 950; text-transform: uppercase; }
        .photo span { height: 100%; display: grid; place-items: center; font-weight: 900; }

        .card-content { padding: 15px; }
        .truck-title { display: block; color: white; text-decoration: none; font-size: 19px; line-height: 1.18; font-weight: 950; margin-bottom: 12px; }
        .meta-row { display: flex; flex-wrap: wrap; gap: 12px; color: #cbd5e1; font-size: 12px; font-weight: 850; margin-bottom: 13px; }
        .price { display: block; color: #22c55e; font-size: 26px; line-height: 1; margin-bottom: 4px; }
        .pay-info { display: block; color: #94a3b8; font-size: 13px; margin-bottom: 14px; }
        .card-actions { display: grid; grid-template-columns: 1fr 48px; gap: 10px; }
        .details, .whats { min-height: 46px; border-radius: 8px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-weight: 950; text-transform: uppercase; font-size: 12px; }
        .details { color: white; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); }
        .whats { color: #052e16; background: #22c55e; font-size: 0; }
        .whats::before { content: "☎"; font-size: 18px; }

        .empty { grid-column: 1 / -1; padding: 34px; border-radius: 16px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.10); }

        .trust-band {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto 34px;
          padding: 18px 22px;
          border-radius: 16px;
          background: rgba(255,255,255,.055);
          border: 1px solid rgba(255,255,255,.10);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .trust-band div { display: grid; gap: 4px; }
        .trust-band strong { color: white; font-size: 15px; }
        .trust-band span { color: #cbd5e1; font-size: 13px; }

        @media (max-width: 1000px) {
          .quick-filter { grid-template-columns: 1fr 1fr; }
          .quick-filter button { grid-column: 1 / -1; }
          .truck-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .trust-band { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 640px) {
          .hero { min-height: 520px; }
          .hero-content, .quick-filter, .section-head, .truck-grid, .trust-band { width: calc(100vw - 24px); }
          h1 { font-size: 39px; }
          .hero-actions, .quick-filter, .truck-grid, .trust-band { grid-template-columns: 1fr; display: grid; }
          .btn, .quick-filter button { width: 100%; }
          .section-head { align-items: flex-start; }
        }
      `}</style>
    </main>
  );
}
