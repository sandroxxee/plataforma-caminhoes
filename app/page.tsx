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
  const featuredTruck = trucks[0];
  const featuredTitle = featuredTruck ? getTitle(featuredTruck) : "Caminhão em destaque";
  const featuredImage = featuredTruck ? getImage(featuredTruck) : "";

  return (
    <main className="home-v2" id="inicio">
      <PublicHeader />

      <section className="hero-v2">
        <div className="wrap hero-layout">
          <div className="hero-copy">
            <span className="label">Caminhões à venda</span>
            <h1>Compre, venda ou troque caminhões com atendimento direto.</h1>
            <p>
              Uma vitrine organizada para caminhões, implementos e veículos comerciais, com foco em oportunidade real e contato rápido pelo WhatsApp.
            </p>

            <div className="hero-actions">
              <Link className="btn btn-main" href="/anuncios">Ver caminhões disponíveis</Link>
              <Link className="btn btn-soft" href="/anunciar">Quero anunciar</Link>
            </div>

            <div className="mini-stats" aria-label="Diferenciais">
              <div><strong>Compra</strong><span>Filtros simples</span></div>
              <div><strong>Venda</strong><span>Anúncio organizado</span></div>
              <div><strong>Troca</strong><span>Contato direto</span></div>
            </div>
          </div>

          <aside className="showcase-card">
            <div className="showcase-photo">
              {featuredImage ? <img src={featuredImage} alt={featuredTitle} /> : <span>Foto do caminhão</span>}
            </div>
            <div className="showcase-info">
              <span className="status-pill">Destaque do estoque</span>
              <h2>{featuredTitle}</h2>
              <div className="showcase-row">
                <strong>{featuredTruck ? formatMoney(featuredTruck.preco) : "Sob consulta"}</strong>
                <Link href={featuredTruck ? `/anuncios/${featuredTruck.id}` : "/anuncios"}>Ver detalhes</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="wrap action-strip">
        <Link href="/anuncios"><b>Comprar caminhão</b><span>Consultar estoque</span></Link>
        <Link href="/anunciar"><b>Vender ou trocar</b><span>Enviar dados do veículo</span></Link>
        <a href="#contato"><b>WhatsApp</b><span>Atendimento direto</span></a>
      </section>

      <section className="wrap stock-area" id="comprar">
        <div className="section-title">
          <div>
            <span className="label small">Estoque atualizado</span>
            <h2>Caminhões disponíveis</h2>
            <p>Fotos, valor, cidade e informações principais para decidir rápido.</p>
          </div>
          <Link href="/anuncios" className="all-link">Ver todos</Link>
        </div>

        <form className="filters-v2" action="/anuncios" aria-label="Filtros de estoque">
          <input name="busca" placeholder="Buscar por modelo, marca ou cidade" />
          <select name="marca" defaultValue="">
            <option value="">Marca</option>
            <option>Mercedes-Benz</option>
            <option>Scania</option>
            <option>Volvo</option>
            <option>Volkswagen</option>
            <option>Ford</option>
            <option>Iveco</option>
            <option>DAF</option>
          </select>
          <select name="carroceria" defaultValue="">
            <option value="">Tipo</option>
            <option>Cavalo mecânico</option>
            <option>Truck</option>
            <option>Toco</option>
            <option>Caçamba</option>
            <option>Plataforma</option>
            <option>Implemento</option>
          </select>
          <select name="tracao" defaultValue="">
            <option value="">Tração</option>
            <option>4x2</option>
            <option>6x2</option>
            <option>6x4</option>
            <option>8x4</option>
          </select>
          <button type="submit">Buscar</button>
        </form>

        <div className="truck-grid-v2">
          {trucks.length > 0 ? (
            trucks.map((truck) => {
              const title = getTitle(truck);
              const image = getImage(truck);

              return (
                <article className="ad-v2" key={truck.id}>
                  <Link href={`/anuncios/${truck.id}`} className="ad-photo-v2">
                    {image ? <img src={image} alt={title} /> : <i>Sem foto</i>}
                    <span>{truck.carroceria || "Caminhão"}</span>
                  </Link>

                  <div className="ad-content-v2">
                    <Link className="ad-title-v2" href={`/anuncios/${truck.id}`}>{title}</Link>
                    <div className="ad-tags-v2">
                      <small>{truck.ano_modelo || truck.ano_fabricacao || "Ano"}</small>
                      <small>{truck.tracao || "Tração"}</small>
                      <small>{truck.cidade || "Cidade"}{truck.estado ? ` - ${truck.estado}` : ""}</small>
                    </div>
                    <div className="ad-bottom-v2">
                      <strong>{formatMoney(truck.preco)}</strong>
                      <div>
                        <Link href={`/anuncios/${truck.id}`}>Detalhes</Link>
                        {truck.whatsapp && <a href={getWhatsappLink(truck)} target="_blank" rel="noreferrer">WhatsApp</a>}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-box">
              <h3>Nenhum caminhão aprovado ainda.</h3>
              <p>Quando houver anúncios aprovados, eles aparecem automaticamente nesta área.</p>
            </div>
          )}
        </div>
      </section>

      <section className="wrap sell-v2" id="vender">
        <div>
          <span className="label small">Venda com organização</span>
          <h2>Quer vender seu caminhão?</h2>
          <p>Envie dados, fotos, valor, localização e condições. A ideia é apresentar seu caminhão de forma clara para comprador interessado.</p>
        </div>
        <Link className="btn btn-whats" href="/anunciar">Anunciar caminhão</Link>
      </section>

      <section className="wrap how-v2" id="como-funciona">
        <div className="step-v2"><b>01</b><h3>Compra simples</h3><p>O comprador encontra o caminhão, vê os dados e chama direto.</p></div>
        <div className="step-v2"><b>02</b><h3>Venda organizada</h3><p>O anúncio fica com foto, valor, cidade e informações comerciais.</p></div>
        <div className="step-v2"><b>03</b><h3>Contato direto</h3><p>WhatsApp em destaque para negociação rápida e objetiva.</p></div>
      </section>

      <section className="wrap contact-v2" id="contato">
        <div>
          <h2>Atendimento pelo WhatsApp</h2>
          <p>Consulte caminhões disponíveis, envie proposta ou solicite a divulgação do seu caminhão.</p>
        </div>
        <a className="btn btn-whats" href="https://wa.me/5549999999999" target="_blank" rel="noreferrer">Chamar agora</a>
      </section>

      <SiteFooter />

      <style>{`
        :global(html) { scroll-behavior: smooth; }
        .home-v2 {
          --dark: #17212b;
          --text: #1f2933;
          --muted: #677381;
          --line: #e7e9ee;
          --soft: #f5f6f8;
          --white: #ffffff;
          --green: #17a25b;
          --yellow: #f4b325;
          background: #fff;
          color: var(--text);
          overflow-x: hidden;
        }
        .home-v2 a { text-decoration: none; }
        .wrap { width: min(1180px, calc(100vw - 32px)); margin: 0 auto; }

        .hero-v2 {
          padding: 54px 0 30px;
          background:
            linear-gradient(180deg, #ffffff 0%, #f8f9fb 100%);
          border-bottom: 1px solid var(--line);
        }
        .hero-layout {
          display: grid;
          grid-template-columns: 1.04fr .96fr;
          gap: 34px;
          align-items: center;
        }
        .label {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          border-radius: 999px;
          padding: 8px 12px;
          background: #fff4d8;
          border: 1px solid #ffe2a0;
          color: #805200;
          font-size: 13px;
          font-weight: 900;
          margin-bottom: 16px;
        }
        .label.small { margin-bottom: 12px; font-size: 12px; }
        .hero-copy h1 {
          max-width: 760px;
          color: var(--dark);
          font-size: clamp(38px, 5.5vw, 66px);
          line-height: .99;
          letter-spacing: -2.3px;
        }
        .hero-copy p {
          max-width: 650px;
          margin-top: 18px;
          color: var(--muted);
          font-size: 19px;
        }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
        .btn {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 18px;
          font-weight: 900;
          border: 1px solid transparent;
          color: inherit;
        }
        .btn-main { color: #fff; background: var(--dark); box-shadow: 0 14px 30px rgba(23,33,43,.18); }
        .btn-soft { color: var(--dark); background: #fff; border-color: #d7dce3; }
        .btn-whats { color: #fff; background: var(--green); box-shadow: 0 14px 30px rgba(23,162,91,.18); }
        .mini-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 30px; max-width: 650px; }
        .mini-stats div { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 14px; box-shadow: 0 8px 20px rgba(15,23,42,.04); }
        .mini-stats strong { display: block; color: var(--dark); font-size: 15px; }
        .mini-stats span { display: block; color: var(--muted); font-size: 13px; margin-top: 2px; }

        .showcase-card { background: #fff; border: 1px solid var(--line); border-radius: 28px; overflow: hidden; box-shadow: 0 20px 45px rgba(15,23,42,.10); }
        .showcase-photo { aspect-ratio: 4 / 3; background: var(--soft); display: grid; place-items: center; color: var(--muted); font-weight: 800; overflow: hidden; }
        .showcase-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .showcase-info { padding: 20px; }
        .status-pill { display: inline-flex; background: #ecfdf3; color: #087a3b; border-radius: 999px; padding: 7px 10px; font-size: 12px; font-weight: 900; margin-bottom: 10px; }
        .showcase-info h2 { color: var(--dark); font-size: 26px; line-height: 1.12; letter-spacing: -.7px; }
        .showcase-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 16px; border-top: 1px solid var(--line); padding-top: 16px; }
        .showcase-row strong { color: var(--dark); font-size: 23px; }
        .showcase-row a { color: var(--green); font-weight: 900; }

        .action-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 20px 0; }
        .action-strip a { display: flex; align-items: center; justify-content: space-between; gap: 14px; min-height: 86px; border-radius: 18px; border: 1px solid var(--line); background: #fff; padding: 18px; box-shadow: 0 10px 25px rgba(15,23,42,.05); }
        .action-strip b { display: block; color: var(--dark); font-size: 17px; }
        .action-strip span { display: block; color: var(--muted); font-size: 13px; margin-top: 3px; }

        .stock-area { padding: 36px 0 52px; }
        .section-title { display: flex; align-items: end; justify-content: space-between; gap: 22px; margin-bottom: 20px; }
        .section-title h2, .sell-v2 h2, .contact-v2 h2 { color: var(--dark); font-size: clamp(30px, 4vw, 42px); line-height: 1.05; letter-spacing: -1.2px; }
        .section-title p, .sell-v2 p, .contact-v2 p { color: var(--muted); margin-top: 7px; max-width: 610px; }
        .all-link { color: var(--dark); background: #fff; border: 1px solid #d7dce3; border-radius: 999px; padding: 10px 15px; font-weight: 900; }

        .filters-v2 { display: grid; grid-template-columns: 1.7fr repeat(3, 1fr) auto; gap: 10px; margin-bottom: 22px; padding: 12px; border-radius: 18px; border: 1px solid var(--line); background: var(--soft); }
        .filters-v2 input, .filters-v2 select, .filters-v2 button { height: 46px; border-radius: 13px; border: 1px solid #d8dde5; background: #fff; color: var(--dark); padding: 0 12px; font-size: 14px; outline: none; }
        .filters-v2 button { background: var(--dark); color: #fff; font-weight: 900; border-color: var(--dark); padding: 0 18px; cursor: pointer; }

        .truck-grid-v2 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .ad-v2 { border: 1px solid var(--line); border-radius: 22px; background: #fff; overflow: hidden; box-shadow: 0 14px 30px rgba(15,23,42,.06); transition: .2s ease; }
        .ad-v2:hover { transform: translateY(-3px); box-shadow: 0 22px 42px rgba(15,23,42,.10); }
        .ad-photo-v2 { position: relative; display: grid; place-items: center; aspect-ratio: 1 / 1; overflow: hidden; background: var(--soft); color: var(--muted); }
        .ad-photo-v2 img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ad-photo-v2 i { font-style: normal; font-weight: 800; }
        .ad-photo-v2 span { position: absolute; top: 12px; left: 12px; background: rgba(255,255,255,.94); color: var(--dark); border-radius: 999px; padding: 7px 10px; font-size: 12px; font-weight: 900; box-shadow: 0 8px 18px rgba(0,0,0,.12); }
        .ad-content-v2 { padding: 16px; }
        .ad-title-v2 { display: block; color: var(--dark); font-size: 20px; font-weight: 950; letter-spacing: -.5px; margin-bottom: 10px; }
        .ad-tags-v2 { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
        .ad-tags-v2 small { background: var(--soft); color: var(--muted); border-radius: 999px; padding: 6px 8px; font-size: 13px; font-weight: 750; }
        .ad-bottom-v2 { display: flex; justify-content: space-between; gap: 12px; align-items: center; border-top: 1px solid var(--line); padding-top: 14px; }
        .ad-bottom-v2 strong { color: var(--dark); font-size: 18px; }
        .ad-bottom-v2 div { display: flex; gap: 8px; align-items: center; }
        .ad-bottom-v2 a { color: var(--dark); background: var(--soft); border-radius: 999px; padding: 8px 10px; font-size: 12px; font-weight: 900; }
        .ad-bottom-v2 a:last-child { color: #fff; background: var(--green); }
        .empty-box { grid-column: 1 / -1; background: var(--soft); border: 1px solid var(--line); border-radius: 18px; padding: 28px; color: var(--dark); }
        .empty-box p { color: var(--muted); margin-top: 6px; }

        .sell-v2 { margin: 4px auto 28px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 22px; border-radius: 28px; padding: 34px; background: linear-gradient(135deg, #17212b, #233140); color: #fff; box-shadow: 0 24px 50px rgba(23,33,43,.18); }
        .sell-v2 .label { background: rgba(244,179,37,.18); color: #ffe2a0; border-color: rgba(244,179,37,.30); }
        .sell-v2 h2 { color: #fff; }
        .sell-v2 p { color: rgba(255,255,255,.78); }

        .how-v2 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 24px 0 52px; }
        .step-v2 { border: 1px solid var(--line); border-radius: 20px; background: #fff; padding: 22px; }
        .step-v2 b { display: inline-grid; place-items: center; height: 42px; min-width: 42px; border-radius: 999px; background: #fff4d8; color: #805200; margin-bottom: 14px; }
        .step-v2 h3 { color: var(--dark); font-size: 20px; margin-bottom: 8px; }
        .step-v2 p { color: var(--muted); font-size: 15px; }

        .contact-v2 { display: flex; align-items: center; justify-content: space-between; gap: 22px; margin-bottom: 52px; border: 1px solid var(--line); border-radius: 24px; background: var(--soft); padding: 28px; }

        @media (max-width: 930px) {
          .hero-layout, .sell-v2 { grid-template-columns: 1fr; }
          .action-strip, .how-v2 { grid-template-columns: 1fr; }
          .filters-v2 { grid-template-columns: 1fr 1fr; }
          .filters-v2 button { grid-column: 1 / -1; }
          .truck-grid-v2 { grid-template-columns: repeat(2, 1fr); }
          .contact-v2 { align-items: flex-start; flex-direction: column; }
        }
        @media (max-width: 620px) {
          .wrap { width: min(100vw - 22px, 1180px); }
          .hero-v2 { padding: 34px 0 20px; }
          .hero-copy h1 { letter-spacing: -1.4px; }
          .hero-copy p { font-size: 16px; }
          .hero-actions { display: grid; grid-template-columns: 1fr; }
          .mini-stats, .filters-v2, .truck-grid-v2 { grid-template-columns: 1fr; }
          .section-title { display: block; }
          .all-link { display: inline-flex; margin-top: 14px; }
          .sell-v2, .contact-v2 { padding: 24px; }
          .ad-bottom-v2 { align-items: flex-start; flex-direction: column; }
        }
      `}</style>
    </main>
  );
}
