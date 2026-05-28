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
    .limit(8);

  const trucks = (data || []) as Truck[];
  const heroImage = trucks[0] ? getImage(trucks[0]) : "";

  return (
    <main className="home-page" id="topo">
      <PublicHeader />

      <section className="hero" style={heroImage ? { backgroundImage: `linear-gradient(90deg, rgba(2,6,8,.96), rgba(2,6,8,.72) 40%, rgba(2,6,8,.20)), linear-gradient(180deg, rgba(2,6,8,.20), rgba(2,6,8,.95)), url(${heroImage})` } : undefined}>
        <div className="wrap hero-content">
          <div className="hero-copy">
            <h1>Caminhões selecionados para o <span>seu negócio.</span></h1>
            <p>Cavalos mecânicos, trucks, tocos e implementos. Encontre caminhões anunciados com dados claros e contato direto pelo WhatsApp.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/anuncios">🔎 Ver estoque</Link>
              <Link className="btn btn-ghost" href="/#contato">Falar com atendimento</Link>
            </div>
          </div>

          <aside className="hero-card" aria-label="Mensagem para compradores e vendedores">
            <span>Classificados do transporte</span>
            <h2>Oportunidades para quem compra, resultado para quem vende.</h2>
            <p>Anuncie seu caminhão, acompanhe ofertas e encontre compradores do ramo em um só lugar.</p>
            <div className="hero-card-points">
              <small>Compra direta</small>
              <small>Anúncios organizados</small>
              <small>Contato pelo WhatsApp</small>
            </div>
          </aside>
        </div>
      </section>

      <form className="wrap filter-panel" action="/anuncios" aria-label="Filtros do estoque">
        <div className="filter-field">
          <label>Marca</label>
          <select name="marca" defaultValue="">
            <option value="">Todas as marcas</option>
            <option>Mercedes-Benz</option>
            <option>Scania</option>
            <option>Volvo</option>
            <option>Volkswagen</option>
            <option>Ford</option>
            <option>Iveco</option>
            <option>DAF</option>
          </select>
        </div>

        <div className="filter-field">
          <label>Tipo</label>
          <select name="carroceria" defaultValue="">
            <option value="">Todos os tipos</option>
            <option>Cavalo mecânico</option>
            <option>Truck</option>
            <option>Toco</option>
            <option>Implemento</option>
          </select>
        </div>

        <div className="filter-field">
          <label>Tração</label>
          <select name="tracao" defaultValue="">
            <option value="">Todas as trações</option>
            <option>4x2</option>
            <option>6x2</option>
            <option>6x4</option>
            <option>8x4</option>
          </select>
        </div>

        <div className="filter-field">
          <label>Localização</label>
          <select name="estado" defaultValue="">
            <option value="">Todas as regiões</option>
            <option value="SC">Santa Catarina</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="PR">Paraná</option>
          </select>
        </div>

        <div className="search-box">
          <input name="busca" placeholder="Buscar modelo, marca..." />
          <button type="submit" aria-label="Buscar">⌕</button>
        </div>
      </form>

      <section className="wrap section-title" id="estoque">
        <h2><span>▱</span> Caminhões disponíveis <small className="pill">{trucks.length} anúncios</small></h2>
        <Link href="/anuncios" className="view-all">Ver todos</Link>
      </section>

      <section className="wrap truck-grid">
        {trucks.length > 0 ? (
          trucks.map((truck) => {
            const title = getTitle(truck);
            const image = getImage(truck);

            return (
              <article className="truck-card" key={truck.id}>
                <Link href={`/anuncios/${truck.id}`} className="truck-photo">
                  <span className="badge">{truck.carroceria || "Caminhão"}</span>
                  <span className="heart">♡</span>
                  {image ? <img src={image} alt={title} /> : <i>Sem foto</i>}
                </Link>
                <div className="card-body">
                  <Link className="truck-title" href={`/anuncios/${truck.id}`}>{title}</Link>
                  <div className="meta">
                    <span>▣ {truck.ano_modelo || truck.ano_fabricacao || "Ano"}</span>
                    <span>⚙ {truck.tracao || "Tração"}</span>
                    <span>⌖ {truck.cidade || "Cidade"}{truck.estado ? ` - ${truck.estado}` : ""}</span>
                  </div>
                  <strong className="price">{formatMoney(truck.preco)}</strong>
                  <small className="payment">À vista / negociação direta</small>
                  <div className="card-actions">
                    <Link className="details" href={`/anuncios/${truck.id}`}>◉ Ver detalhes</Link>
                    {truck.whatsapp && <a className="whats" href={getWhatsappLink(truck)} target="_blank" rel="noreferrer">☘</a>}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            <h3>Nenhum caminhão aprovado ainda.</h3>
            <p>Assim que os anúncios forem aprovados, eles aparecem aqui automaticamente.</p>
          </div>
        )}
      </section>

      <section className="wrap trust-bar" aria-label="Diferenciais">
        <div className="trust-item"><span className="trust-icon">▱</span><span><strong>Negociação direta</strong><small>Contato pelo WhatsApp</small></span></div>
        <div className="trust-item"><span className="trust-icon">▤</span><span><strong>Dados organizados</strong><small>Foto, valor, cidade e detalhes</small></span></div>
        <div className="trust-item"><span className="trust-icon">▰</span><span><strong>Estoque atualizado</strong><small>Anúncios aprovados</small></span></div>
        <div className="trust-item"><span className="trust-icon">☘</span><span><strong>Atendimento rápido</strong><small>Compra e venda sem complicar</small></span></div>
      </section>

      <section className="wrap sell-section" id="anunciar">
        <div>
          <span className="kicker">Para vendedores</span>
          <h2>Quer vender seu caminhão?</h2>
          <p>Crie sua conta e comece o cadastro do anúncio. Depois você informa os dados, fotos, valor e contato pelo WhatsApp.</p>
          <div className="hero-actions"><Link className="btn btn-primary" href="/anunciar">Quero anunciar meu caminhão</Link></div>
        </div>
        <div className="steps"><div className="step"><b>1</b> Dados e fotos</div><div className="step"><b>2</b> Revisão do anúncio</div><div className="step"><b>3</b> Publicação e contatos</div></div>
      </section>

      <section className="wrap about-section" id="sobre">
        <span className="kicker">Sobre a plataforma</span>
        <h2>Oportunidades para quem compra,<br />resultado para quem vende.</h2>
        <p>Anuncie seu caminhão, acompanhe ofertas e encontre compradores do ramo em um só lugar.</p>
      </section>

      <section className="wrap contact-section" id="contato">
        <div>
          <span className="kicker">Atendimento</span>
          <h2>Precisa de ajuda para anunciar?</h2>
          <p>Fale com nosso atendimento para tirar dúvidas sobre cadastro, fotos e publicação do anúncio.</p>
        </div>
        <a className="btn btn-primary" href="https://wa.me/5549999362681" target="_blank" rel="noreferrer">Chamar no WhatsApp</a>
      </section>

      <SiteFooter />

      <style>{`
        :global(html) { scroll-behavior: smooth; }
        .home-page {
          --green: #22c55e;
          --text: #f8fafc;
          --muted: #cbd5e1;
          min-height: 100vh;
          color: var(--text);
          background:
            radial-gradient(circle at 8% 5%, rgba(34,197,94,.17), transparent 28%),
            radial-gradient(circle at 82% 12%, rgba(34,197,94,.10), transparent 24%),
            linear-gradient(135deg, #020506 0%, #06110e 48%, #030608 100%);
          overflow-x: hidden;
        }
        .home-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .16;
          background-image: linear-gradient(rgba(34,197,94,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,.10) 1px, transparent 1px);
          background-size: 78px 78px;
          mask-image: linear-gradient(to bottom, black, transparent 74%);
        }
        .wrap { width: min(1240px, calc(100vw - 32px)); margin: 0 auto; }
        .hero {
          position: relative;
          margin-top: -90px;
          min-height: 500px;
          display: flex;
          align-items: end;
          overflow: hidden;
          background:
            linear-gradient(90deg, rgba(2,6,8,.96), rgba(2,6,8,.72) 40%, rgba(2,6,8,.20)),
            linear-gradient(180deg, rgba(2,6,8,.20), rgba(2,6,8,.95));
          background-size: cover;
          background-position: center top;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .hero::after { content:""; position:absolute; inset:0; pointer-events:none; background: radial-gradient(circle at 15% 30%, rgba(34,197,94,.12), transparent 26%), linear-gradient(90deg, rgba(2,6,8,.68), transparent 60%); }
        .hero-content { position:relative; z-index:2; padding:160px 0 84px; display:grid; grid-template-columns:minmax(0, 670px) minmax(320px, 430px); justify-content:space-between; align-items:end; gap:42px; }
        .hero-copy { min-width:0; }
        .hero-card { justify-self:end; width:min(430px,100%); padding:26px; border-radius:22px; background:linear-gradient(180deg, rgba(8,14,16,.70), rgba(2,6,8,.54)); border:1px solid rgba(34,197,94,.26); box-shadow:0 24px 70px rgba(0,0,0,.26); backdrop-filter:blur(14px); }
        .hero-card span { display:inline-flex; margin-bottom:14px; min-height:28px; align-items:center; padding:0 10px; border-radius:999px; background:rgba(34,197,94,.13); border:1px solid rgba(34,197,94,.26); color:#86efac; font-size:11px; font-weight:950; letter-spacing:.08em; text-transform:uppercase; }
        .hero-card h2 { margin:0 0 12px; color:white; font-size:clamp(24px,2.4vw,34px); line-height:1.04; letter-spacing:-.04em; }
        .hero-card p { margin:0; color:#d7dee8; line-height:1.55; font-size:15px; }
        .hero-card-points { display:flex; flex-wrap:wrap; gap:8px; margin-top:18px; }
        .hero-card-points small { min-height:28px; display:inline-flex; align-items:center; padding:0 10px; border-radius:999px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.10); color:#cbd5e1; font-weight:850; }
        .kicker { display:inline-flex; align-items:center; gap:9px; min-height:34px; padding:0 13px; border-radius:999px; background:rgba(34,197,94,.12); border:1px solid rgba(34,197,94,.32); color:#bbf7d0; font-size:12px; font-weight:950; letter-spacing:.07em; text-transform:uppercase; }
        h1 { margin:18px 0 16px; font-size:clamp(38px,5.4vw,68px); line-height:1.02; letter-spacing:-.055em; max-width:640px; }
        h1 span { color:var(--green); }
        .hero p { margin:0; max-width:520px; color:#d7dee8; font-size:17px; line-height:1.55; }
        .hero-card p { max-width:none; font-size:15px; }
        .hero-actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:27px; }
        .btn { min-height:52px; display:inline-flex; align-items:center; justify-content:center; gap:10px; padding:0 22px; border-radius:8px; border:1px solid rgba(255,255,255,.15); font-size:13px; font-weight:950; letter-spacing:.04em; text-transform:uppercase; text-decoration:none; }
        .btn-primary { background:var(--green); color:#03220f; border-color:transparent; }
        .btn-ghost { background:rgba(3,7,10,.58); color:#f8fafc; }
        .filter-panel { position:relative; z-index:5; margin:-38px auto 34px; padding:14px; border-radius:16px; display:grid; grid-template-columns:1fr 1fr 1fr 1fr minmax(220px,1.3fr); gap:0; background:linear-gradient(180deg, rgba(14,20,22,.92), rgba(9,14,16,.86)); border:1px solid rgba(255,255,255,.12); box-shadow:0 22px 54px rgba(0,0,0,.30); backdrop-filter:blur(16px); overflow:hidden; }
        .filter-field { min-height:68px; display:grid; align-content:center; gap:6px; padding:0 18px; border-right:1px solid rgba(255,255,255,.09); color:#f8fafc; }
        .filter-field label { color:#9ca3af; font-size:11px; font-weight:950; letter-spacing:.08em; text-transform:uppercase; }
        .filter-field select, .search-box input { width:100%; border:0; outline:0; background:transparent; color:#f8fafc; font-size:14px; font-weight:850; font-family:inherit; }
        .filter-field select option { background:#0b1114; color:white; }
        .search-box { display:grid; grid-template-columns:1fr 58px; align-items:center; gap:0; padding-left:18px; }
        .search-box input { min-height:54px; padding:0 16px; border-radius:8px 0 0 8px; background:rgba(255,255,255,.055); border:1px solid rgba(255,255,255,.11); border-right:0; }
        .search-box button { min-height:54px; border:0; border-radius:0 8px 8px 0; background:var(--green); color:#042913; font-size:22px; cursor:pointer; }
        .section-title { display:flex; align-items:center; justify-content:space-between; gap:18px; margin:22px auto 18px; }
        .section-title h2 { margin:0; display:flex; align-items:center; gap:12px; font-size:clamp(26px,3vw,36px); letter-spacing:-.035em; }
        .section-title h2 span { color:var(--green); }
        .pill { display:inline-flex; align-items:center; justify-content:center; min-height:28px; padding:0 13px; border-radius:999px; background:rgba(34,197,94,.13); border:1px solid rgba(34,197,94,.28); color:#86efac; font-size:12px; font-weight:950; }
        .view-all { min-height:44px; border-radius:8px; border:1px solid rgba(255,255,255,.14); background:rgba(255,255,255,.055); color:white; padding:0 14px; display:inline-flex; align-items:center; text-decoration:none; font-weight:900; }
        .truck-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; margin-bottom:28px; }
        .truck-card { min-width:0; overflow:hidden; border-radius:10px; background:linear-gradient(180deg, rgba(16,23,26,.94), rgba(8,13,15,.94)); border:1px solid rgba(255,255,255,.12); box-shadow:0 18px 45px rgba(0,0,0,.22); transition:transform .18s ease,border-color .18s ease; }
        .truck-card:hover { transform:translateY(-4px); border-color:rgba(34,197,94,.34); }
        .truck-photo { position:relative; aspect-ratio:1.55/1; overflow:hidden; background:#111827; display:block; color:#94a3b8; text-decoration:none; }
        .truck-photo img { width:100%; height:100%; object-fit:cover; display:block; filter:saturate(.96) contrast(1.04); }
        .truck-photo i { height:100%; display:grid; place-items:center; font-style:normal; font-weight:900; }
        .badge { position:absolute; left:10px; top:10px; z-index:2; min-height:24px; padding:0 9px; border-radius:5px; background:rgba(34,197,94,.92); color:#052e16; font-size:10px; font-weight:950; text-transform:uppercase; }
        .heart { position:absolute; right:10px; top:10px; z-index:2; width:31px; height:31px; border-radius:999px; display:grid; place-items:center; background:rgba(2,6,8,.42); border:1px solid rgba(255,255,255,.14); color:white; }
        .card-body { padding:14px; }
        .truck-title { display:block; min-height:42px; color:white; text-decoration:none; font-size:17px; line-height:1.18; font-weight:950; letter-spacing:-.02em; }
        .meta { display:flex; flex-wrap:wrap; gap:9px 12px; margin:10px 0 12px; color:#cbd5e1; font-size:12px; font-weight:800; }
        .price { display:block; margin-bottom:4px; color:var(--green); font-size:22px; font-weight:950; letter-spacing:-.02em; }
        .payment { color:#aeb7c3; font-size:12px; font-weight:800; }
        .card-actions { display:grid; grid-template-columns:1fr 44px; gap:10px; margin-top:13px; }
        .details,.whats { min-height:42px; display:inline-flex; align-items:center; justify-content:center; border-radius:7px; font-size:12px; font-weight:950; letter-spacing:.04em; text-transform:uppercase; text-decoration:none; }
        .details { background:rgba(255,255,255,.055); border:1px solid rgba(255,255,255,.12); color:white; }
        .whats { background:var(--green); color:#042913; }
        .trust-bar { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:0; margin:10px auto 38px; border-radius:12px; overflow:hidden; background:rgba(255,255,255,.055); border:1px solid rgba(255,255,255,.10); }
        .trust-item { min-height:86px; display:flex; align-items:center; gap:14px; padding:16px 24px; border-right:1px solid rgba(255,255,255,.08); }
        .trust-item:last-child { border-right:0; }
        .trust-icon { color:var(--green); font-size:27px; }
        .trust-item strong { display:block; font-size:16px; margin-bottom:4px; }
        .trust-item small { color:#cbd5e1; font-weight:750; }
        .sell-section,.about-section,.contact-section { margin-bottom:34px; padding:clamp(22px,3.2vw,36px); border-radius:16px; background:linear-gradient(135deg, rgba(34,197,94,.12), rgba(255,255,255,.045)); border:1px solid rgba(34,197,94,.20); display:grid; grid-template-columns:1.1fr .9fr; gap:24px; align-items:center; }
        .sell-section h2,.about-section h2,.contact-section h2 { margin:8px 0 10px; font-size:clamp(28px,4vw,46px); line-height:1.02; letter-spacing:-.045em; }
        .sell-section p,.about-section p,.contact-section p { margin:0; color:#d6dee8; line-height:1.56; font-size:17px; }
        .about-section { grid-template-columns:1fr; text-align:center; justify-items:center; }
        .about-section p { max-width:760px; }
        .steps { display:grid; gap:10px; }
        .step { min-height:55px; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:10px; background:rgba(2,6,8,.44); border:1px solid rgba(255,255,255,.10); color:#dbeafe; font-weight:850; }
        .step b { width:31px; height:31px; border-radius:999px; background:var(--green); color:#042913; display:grid; place-items:center; flex:0 0 auto; }
        .empty-state { grid-column:1/-1; padding:28px; border-radius:16px; background:rgba(255,255,255,.055); border:1px solid rgba(255,255,255,.10); }
        @media (max-width:1120px){ .hero-content{grid-template-columns:1fr;padding-top:145px;} .hero-card{justify-self:start;} .filter-panel{grid-template-columns:repeat(2,minmax(0,1fr));} .filter-field:nth-child(2n){border-right:0;} .search-box{grid-column:1/-1;padding:10px 0 0;} .truck-grid{grid-template-columns:repeat(2,minmax(0,1fr));} .trust-bar{grid-template-columns:repeat(2,minmax(0,1fr));} .trust-item:nth-child(2n){border-right:0;} .sell-section,.about-section,.contact-section{grid-template-columns:1fr;} }
        @media (max-width:640px){ .wrap{width:calc(100vw - 22px);} .hero{margin-top:-152px;min-height:690px;background-position:center top;} .hero-content{padding:245px 0 44px;gap:24px;} .hero-card{padding:18px;border-radius:18px;} .hero-card h2{font-size:24px;} h1{font-size:38px;} .hero p{font-size:15px;} .hero-actions{display:grid;grid-template-columns:1fr;} .btn{width:100%;} .filter-panel{margin-top:-22px;grid-template-columns:1fr;} .filter-field{min-height:58px;border-right:0;border-bottom:1px solid rgba(255,255,255,.08);} .search-box{grid-template-columns:1fr 54px;} .section-title{align-items:flex-start;flex-direction:column;} .truck-grid{grid-template-columns:1fr;} .truck-photo{aspect-ratio:1.35/1;} .trust-bar{grid-template-columns:1fr;} .trust-item{border-right:0;border-bottom:1px solid rgba(255,255,255,.08);} .trust-item:last-child{border-bottom:0;} }
      `}</style>
    </main>
  );
}
