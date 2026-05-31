import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  whatsapp: string | null;
  truck_images?: TruckImage[];
};

function formatMoney(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function normalizeCity(city: string | null) {
  const value = (city || "").trim();
  if (!value) return "Cidade";
  const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (normalized === "xanxere") return "Xanxerê";
  if (normalized === "florianopolis") return "Florianópolis";
  return value;
}

function getLocation(truck: Truck) {
  const city = normalizeCity(truck.cidade);
  return truck.estado ? `${city} - ${truck.estado}` : city;
}

function getImage(truck: Truck) {
  const images = [...(truck.truck_images || [])]
    .filter((img) => img.image_url)
    .sort((a, b) => {
      if (a.principal && !b.principal) return -1;
      if (!a.principal && b.principal) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    });
  return images[0]?.image_url || "";
}

function getTitle(truck: Truck) {
  return truck.titulo || `${truck.marca || ""} ${truck.modelo || ""}`.trim() || "Caminhão anunciado";
}

function getCardTitle(truck: Truck) {
  const title = getTitle(truck);
  const ano = truck.ano_modelo || truck.ano_fabricacao;
  if (!ano) return title;
  return title
    .replace(new RegExp(`\\s*[-–—]?\\s*ano\\s*${ano}\\b`, "i"), "")
    .replace(new RegExp(`\\s*[-–—]\\s*${ano}\\b`, "i"), "")
    .replace(/\s{2,}/g, " ")
    .trim() || title;
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
    .limit(12);

  const trucks = (data || []) as Truck[];
  const featured = trucks[0];
  const featuredImage = featured ? getImage(featured) : "";

  return (
    <main className="market-home">
      <PublicHeader />

      <section className="wrap home-hero">
        <div className="hero-main-card">
          <span className="pill">Marketplace de caminhões usados</span>
          <h1>Caminhões à venda com visual de loja e contato direto.</h1>
          <p>Veja anúncios organizados, fotos, cidade, configuração, valor e chame no WhatsApp para confirmar disponibilidade.</p>
          <div className="hero-actions">
            <Link className="btn primary" href="/anuncios">Ver anúncios</Link>
            <Link className="btn ghost" href="/anunciar">Anunciar caminhão</Link>
          </div>
          <div className="replace-box">
            <div><strong>SUA MARCA AQUI</strong><span>Nome da loja ou vitrine digital.</span></div>
            <div><strong>SEU CAMINHÃO AQUI</strong><span>Fotos reais do estoque.</span></div>
            <div><strong>SEU NÚMERO AQUI</strong><span>WhatsApp do vendedor.</span></div>
          </div>
        </div>

        {featured ? (
          <Link className="featured-card" href={`/anuncios/${featured.id}`}>
            <div className="featured-photo">
              <span>Destaque</span>
              {featuredImage ? <img src={featuredImage} alt={getTitle(featured)} /> : <b>Sem foto</b>}
            </div>
            <div className="featured-info">
              <strong>{getCardTitle(featured)}</strong>
              <small>{featured.ano_modelo || featured.ano_fabricacao || "Ano"} • {featured.tracao || featured.carroceria || "Configuração"} • {getLocation(featured)}</small>
              <em>{formatMoney(featured.preco)}</em>
            </div>
          </Link>
        ) : (
          <div className="featured-card empty-featured"><strong>Os anúncios aprovados aparecerão aqui.</strong></div>
        )}
      </section>

      <section className="wrap quick-market">
        <Link href="/anuncios"><b>Anúncios</b><span>Ver estoque completo</span></Link>
        <Link href="/anuncios?perfil=Implementos"><b>Implementos</b><span>Carretas e carrocerias</span></Link>
        <Link href="/anunciar"><b>Anunciar</b><span>Enviar caminhão para análise</span></Link>
        <Link href="/sobre"><b>Quem somos</b><span>Conheça a plataforma</span></Link>
      </section>

      <section className="wrap store-info">
        <article><span>✓</span><strong>Informação clara</strong><p>Preço, cidade, ano e configuração no card.</p></article>
        <article><span>✓</span><strong>Fotos centralizadas</strong><p>Imagem do caminhão com aparência limpa.</p></article>
        <article><span>✓</span><strong>WhatsApp direto</strong><p>Menos formulário, mais conversa com comprador.</p></article>
      </section>

      <section className="wrap section-title-row">
        <div>
          <span className="pill">Estoque</span>
          <h2>Caminhões disponíveis</h2>
          <p>Exibição em cards estilo marketplace, usando os anúncios reais aprovados no Supabase.</p>
        </div>
        <Link href="/anuncios">Ver todos</Link>
      </section>

      <section className="wrap truck-grid">
        {trucks.length > 0 ? trucks.map((truck) => {
          const image = getImage(truck);
          const title = getTitle(truck);
          const year = truck.ano_modelo || truck.ano_fabricacao || "Ano";
          const config = truck.tracao || truck.carroceria || "Configuração";

          return (
            <article className="truck-card" key={truck.id}>
              <Link className="photo-box" href={`/anuncios/${truck.id}`}>
                <span>{truck.carroceria || truck.tracao || "Caminhão"}</span>
                {image ? <img src={image} alt={title} /> : <i>Sem foto</i>}
              </Link>
              <div className="card-info">
                <strong>{formatMoney(truck.preco)}</strong>
                <Link className="title" href={`/anuncios/${truck.id}`}>{getCardTitle(truck)}</Link>
                <p>{year} • {config} • {getLocation(truck)}</p>
                <div className="card-actions">
                  <Link href={`/anuncios/${truck.id}`}>Ver detalhes</Link>
                  {truck.whatsapp ? <a href={getWhatsappLink(truck)} target="_blank" rel="noreferrer">WhatsApp</a> : null}
                </div>
              </div>
            </article>
          );
        }) : (
          <div className="empty">Os anúncios aprovados aparecerão aqui.</div>
        )}
      </section>

      <SiteFooter />

      <style>{`
        .market-home{min-height:100vh;background:var(--site-bg);color:var(--site-text);padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 28px));margin:0 auto}.home-hero{display:grid;grid-template-columns:1.06fr .94fr;gap:18px;padding-top:24px}.hero-main-card,.featured-card,.quick-market a,.store-info article,.truck-card{background:var(--site-surface);border:1px solid var(--site-line);border-radius:var(--site-radius-lg);box-shadow:var(--site-shadow-soft)}.hero-main-card{position:relative;overflow:hidden;min-height:410px;padding:clamp(24px,4vw,48px);background:linear-gradient(135deg,#fff 0%,#eef5ff 58%,#dcecff 100%)}html[data-theme="dark"] .hero-main-card{background:linear-gradient(135deg,var(--site-surface),#172033 58%,#1e3a5f)}.pill{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:var(--site-blue-soft);color:var(--site-blue);font-size:12px;font-weight:950;letter-spacing:.055em;text-transform:uppercase}.hero-main-card h1{max-width:760px;margin:16px 0 12px;font-size:clamp(38px,5.5vw,68px);line-height:.95;letter-spacing:-.065em}.hero-main-card p{max-width:630px;margin:0;color:var(--site-muted);font-size:18px;font-weight:720}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.replace-box{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:24px}.replace-box div{border:1px dashed color-mix(in srgb,var(--site-blue) 38%,var(--site-line));background:rgba(255,255,255,.64);border-radius:16px;padding:13px}html[data-theme="dark"] .replace-box div{background:rgba(255,255,255,.05)}.replace-box strong{display:block;color:var(--site-blue);font-size:14px}.replace-box span{display:block;color:var(--site-muted);font-size:12px;margin-top:3px}.featured-card{overflow:hidden;color:var(--site-text);text-decoration:none;display:grid;grid-template-rows:minmax(280px,1fr) auto}.featured-photo{position:relative;background:var(--site-surface-2);display:grid;place-items:center;overflow:hidden}.featured-photo span,.photo-box span{position:absolute;left:12px;top:12px;z-index:2;background:rgba(5,5,5,.78);color:#fff;border-radius:999px;padding:6px 9px;font-size:12px;font-weight:900}.featured-photo img,.photo-box img{width:100%;height:100%;object-fit:cover;object-position:center center;display:block}.featured-photo b,.photo-box i{color:var(--site-muted);font-weight:900;font-style:normal}.featured-info{padding:15px}.featured-info strong{display:block;font-size:24px;line-height:1.05}.featured-info small{display:block;color:var(--site-muted);font-weight:800;margin:7px 0}.featured-info em{font-style:normal;color:var(--site-text);font-size:24px;font-weight:950}.empty-featured{display:grid;place-items:center;min-height:320px;padding:22px;color:var(--site-muted)}.quick-market{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:16px}.quick-market a{min-height:82px;padding:16px;text-decoration:none;display:grid;align-content:center;gap:3px}.quick-market b{font-size:18px}.quick-market span{color:var(--site-muted);font-size:13px;font-weight:750}.store-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}.store-info article{padding:18px}.store-info span{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--site-blue-soft);color:var(--site-blue);font-weight:950;margin-bottom:10px}.store-info strong{display:block;font-size:16px}.store-info p{margin:5px 0 0;color:var(--site-muted);font-size:14px}.section-title-row{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-top:30px;margin-bottom:16px}.section-title-row h2{margin:10px 0 6px;font-size:clamp(28px,3vw,44px);line-height:1;letter-spacing:-.05em}.section-title-row p{margin:0;color:var(--site-muted);font-weight:720}.section-title-row>a{min-height:42px;border-radius:999px;padding:0 16px;background:var(--site-surface);border:1px solid var(--site-line);font-weight:900;color:var(--site-text)}.truck-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.truck-card{overflow:hidden;transition:.18s ease}.truck-card:hover{transform:translateY(-3px);box-shadow:var(--site-shadow)}.photo-box{position:relative;aspect-ratio:1/1;background:var(--site-surface-2);display:grid;place-items:center;overflow:hidden;text-decoration:none}.card-info{padding:12px}.card-info>strong{display:block;font-size:20px;line-height:1.1;margin-bottom:6px;color:var(--site-text)}.title{display:block;color:var(--site-text);font-size:16px;font-weight:950;line-height:1.15;text-decoration:none}.card-info p{margin:7px 0 12px;color:var(--site-muted);font-size:13px;font-weight:800}.card-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.card-actions a{min-height:39px;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:0 10px;font-size:12px;font-weight:950;text-decoration:none}.card-actions a:first-child{background:var(--site-surface-2);border:1px solid var(--site-line);color:var(--site-text)}.card-actions a:last-child{background:var(--site-green);color:#fff}.empty{grid-column:1/-1;padding:28px;border-radius:20px;background:var(--site-surface);border:1px solid var(--site-line);text-align:center;color:var(--site-muted);font-weight:900}@media(max-width:1080px){.home-hero{grid-template-columns:1fr}.featured-card{grid-template-rows:320px auto}.truck-grid,.quick-market{grid-template-columns:repeat(2,1fr)}}@media(max-width:760px){.wrap{width:min(100% - 22px,1240px)}.home-hero{padding-top:16px}.hero-main-card{min-height:auto;padding:22px;border-radius:22px}.hero-main-card h1{font-size:38px;letter-spacing:-.05em}.hero-main-card p{font-size:16px}.replace-box,.store-info,.truck-grid,.quick-market{grid-template-columns:1fr}.hero-actions .btn{width:100%;min-height:48px}.featured-card{grid-template-rows:240px auto}.section-title-row{align-items:flex-start;flex-direction:column}.section-title-row>a{width:100%;display:flex;align-items:center;justify-content:center}.card-actions{grid-template-columns:1fr}.card-actions a{width:100%}}
      `}</style>
    </main>
  );
}
