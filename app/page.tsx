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
          <span className="pill">Modelo marketplace para loja ou revenda</span>
          <h1><span>SUA MARCA AQUI</span> com caminhões à venda e contato direto.</h1>
          <p>Uma vitrine clara, azul e comercial para mostrar caminhões, implementos, vendedores, localização e WhatsApp da loja.</p>
          <div className="hero-actions">
            <Link className="btn primary" href="/anuncios">Ver anúncios</Link>
            <Link className="btn ghost" href="/anunciar">Anunciar caminhão</Link>
          </div>
          <div className="replace-box">
            <div><strong>SUA MARCA AQUI</strong><span>Nome da loja, garagem ou revenda.</span></div>
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
          <span className="pill">Estoque real</span>
          <h2>Caminhões disponíveis</h2>
          <p>Cards estilo marketplace usando os anúncios reais aprovados no Supabase.</p>
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

      <section className="wrap seller-section">
        <div className="section-title-row compact">
          <div>
            <span className="pill">Vendedores</span>
            <h2>Equipe comercial da loja</h2>
            <p>Área para passar confiança e mostrar quem atende o comprador.</p>
          </div>
        </div>
        <div className="seller-grid">
          <article className="seller-card">
            <div className="avatar">SM</div>
            <h3>SEU NOME AQUI</h3>
            <p>Atendimento para caminhões, trucks, cavalos mecânicos e implementos.</p>
            <div className="chips"><span>Vendedor da loja</span><span>WhatsApp rápido</span></div>
            <Link href="/anuncios">Ver anúncios</Link>
          </article>
          <article className="seller-card">
            <div className="avatar">V2</div>
            <h3>VENDEDOR 2</h3>
            <p>Responsável por fotos, vídeos, propostas, troca e negociação.</p>
            <div className="chips"><span>Fotos e vídeos</span><span>Propostas</span></div>
            <Link href="/anunciar">Anunciar com a loja</Link>
          </article>
          <article className="seller-card highlight-seller">
            <div className="avatar">LG</div>
            <h3>LOJA / GARAGEM</h3>
            <p>Contato principal para consultar disponibilidade, estoque e oportunidades.</p>
            <div className="chips"><span>Estoque atualizado</span><span>Atendimento geral</span></div>
            <Link href="/sobre">Conhecer a loja</Link>
          </article>
        </div>
      </section>

      <section className="wrap about-location">
        <article className="about-card">
          <span className="pill">Quem somos</span>
          <h2>Uma vitrine digital para caminhões usados.</h2>
          <p>Aqui entra a história da loja: tempo de mercado, cidade, especialidade, atendimento e compromisso com informação clara.</p>
          <div className="about-list">
            <div><b>Especialidade</b><span>Cavalos mecânicos, trucks, tocos, bitrucks e implementos.</span></div>
            <div><b>Atendimento</b><span>Fotos, vídeos, disponibilidade e negociação pelo WhatsApp.</span></div>
            <div><b>Confiança</b><span>Anúncios com dados claros para o comprador não perder tempo.</span></div>
          </div>
        </article>

        <article className="location-card">
          <div className="map-visual"><span>📍</span></div>
          <div>
            <span className="pill">Localização</span>
            <h2>SUA LOCALIZAÇÃO AQUI</h2>
            <p>Exemplo: BR-000, Bairro, Cidade - UF. Substitua pelo endereço da loja, garagem ou pátio de atendimento.</p>
            <div className="contact-lines">
              <strong>SEU NÚMERO AQUI</strong>
              <small>Segunda a sexta, 08h às 18h • Sábado, 08h às 12h</small>
            </div>
          </div>
        </article>
      </section>

      <section className="wrap offer-section">
        <div className="offer-card">
          <div>
            <span className="pill">Para oferecer a uma loja</span>
            <h2>Sua loja com cara de marketplace.</h2>
            <p>Esse visual permite trocar marca, número, localização, vendedores e fotos, mantendo o site como uma vitrine comercial pronta para gerar contatos.</p>
          </div>
          <div className="offer-points">
            <div><strong>SUA MARCA AQUI</strong><span>Identidade da loja no topo.</span></div>
            <div><strong>SEU CAMINHÃO AQUI</strong><span>Anúncios reais do estoque.</span></div>
            <div><strong>SEU NÚMERO AQUI</strong><span>WhatsApp direto com vendedor.</span></div>
          </div>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .market-home{min-height:100vh;background:var(--site-bg);color:var(--site-text);padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 28px));margin:0 auto}.home-hero{display:grid;grid-template-columns:1.06fr .94fr;gap:18px;padding-top:24px}.hero-main-card,.featured-card,.quick-market a,.store-info article,.truck-card,.seller-card,.about-card,.location-card,.offer-card{background:var(--site-surface);border:1px solid var(--site-line);border-radius:var(--site-radius-lg);box-shadow:var(--site-shadow-soft)}.hero-main-card{position:relative;overflow:hidden;min-height:430px;padding:clamp(24px,4vw,48px);background:linear-gradient(135deg,#fff 0%,#eef5ff 58%,#dcecff 100%)}html[data-theme="dark"] .hero-main-card{background:linear-gradient(135deg,var(--site-surface),#172033 58%,#1e3a5f)}.pill{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:var(--site-blue-soft);color:var(--site-blue);font-size:12px;font-weight:950;letter-spacing:.055em;text-transform:uppercase}.hero-main-card h1{max-width:760px;margin:16px 0 12px;font-size:clamp(38px,5.5vw,68px);line-height:.95;letter-spacing:-.065em}.hero-main-card h1 span{color:var(--site-blue)}.hero-main-card p{max-width:630px;margin:0;color:var(--site-muted);font-size:18px;font-weight:720}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.replace-box{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:24px}.replace-box div{border:1px dashed color-mix(in srgb,var(--site-blue) 38%,var(--site-line));background:rgba(255,255,255,.64);border-radius:16px;padding:13px}html[data-theme="dark"] .replace-box div{background:rgba(255,255,255,.05)}.replace-box strong{display:block;color:var(--site-blue);font-size:14px}.replace-box span{display:block;color:var(--site-muted);font-size:12px;margin-top:3px}.featured-card{overflow:hidden;color:var(--site-text);text-decoration:none;display:grid;grid-template-rows:minmax(280px,1fr) auto}.featured-photo{position:relative;background:var(--site-surface-2);display:grid;place-items:center;overflow:hidden}.featured-photo span,.photo-box span{position:absolute;left:12px;top:12px;z-index:2;background:rgba(5,5,5,.78);color:#fff;border-radius:999px;padding:6px 9px;font-size:12px;font-weight:900}.featured-photo img,.photo-box img{width:100%;height:100%;object-fit:cover;object-position:center center;display:block}.featured-photo b,.photo-box i{color:var(--site-muted);font-weight:900;font-style:normal}.featured-info{padding:15px}.featured-info strong{display:block;font-size:24px;line-height:1.05}.featured-info small{display:block;color:var(--site-muted);font-weight:800;margin:7px 0}.featured-info em{font-style:normal;color:var(--site-text);font-size:24px;font-weight:950}.empty-featured{display:grid;place-items:center;min-height:320px;padding:22px;color:var(--site-muted)}.quick-market{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:16px}.quick-market a{min-height:82px;padding:16px;text-decoration:none;display:grid;align-content:center;gap:3px}.quick-market b{font-size:18px}.quick-market span{color:var(--site-muted);font-size:13px;font-weight:750}.store-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}.store-info article{padding:18px}.store-info span{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--site-blue-soft);color:var(--site-blue);font-weight:950;margin-bottom:10px}.store-info strong{display:block;font-size:16px}.store-info p{margin:5px 0 0;color:var(--site-muted);font-size:14px}.section-title-row{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-top:30px;margin-bottom:16px}.section-title-row.compact{margin-top:0}.section-title-row h2{margin:10px 0 6px;font-size:clamp(28px,3vw,44px);line-height:1;letter-spacing:-.05em}.section-title-row p{margin:0;color:var(--site-muted);font-weight:720}.section-title-row>a{min-height:42px;border-radius:999px;padding:0 16px;background:var(--site-surface);border:1px solid var(--site-line);font-weight:900;color:var(--site-text);display:inline-flex;align-items:center}.truck-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.truck-card{overflow:hidden;transition:.18s ease}.truck-card:hover,.seller-card:hover{transform:translateY(-3px);box-shadow:var(--site-shadow)}.photo-box{position:relative;aspect-ratio:1/1;background:var(--site-surface-2);display:grid;place-items:center;overflow:hidden;text-decoration:none}.card-info{padding:12px}.card-info>strong{display:block;font-size:20px;line-height:1.1;margin-bottom:6px;color:var(--site-text)}.title{display:block;color:var(--site-text);font-size:16px;font-weight:950;line-height:1.15;text-decoration:none}.card-info p{margin:7px 0 12px;color:var(--site-muted);font-size:13px;font-weight:800}.card-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.card-actions a{min-height:39px;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:0 10px;font-size:12px;font-weight:950;text-decoration:none}.card-actions a:first-child{background:var(--site-surface-2);border:1px solid var(--site-line);color:var(--site-text)}.card-actions a:last-child{background:var(--site-green);color:#fff}.empty{grid-column:1/-1;padding:28px;border-radius:20px;background:var(--site-surface);border:1px solid var(--site-line);text-align:center;color:var(--site-muted);font-weight:900}.seller-section{margin-top:34px}.seller-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.seller-card{padding:20px;transition:.18s ease}.avatar{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,var(--site-blue),#65adff);color:#fff;font-weight:950;font-size:20px;margin-bottom:12px}.seller-card h3{margin:0 0 6px;font-size:20px}.seller-card p{margin:0 0 13px;color:var(--site-muted);font-size:14px}.chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px}.chips span{display:inline-flex;min-height:30px;align-items:center;border-radius:999px;background:var(--site-surface-2);border:1px solid var(--site-line);padding:0 10px;color:var(--site-muted);font-size:12px;font-weight:850}.seller-card>a{min-height:42px;border-radius:12px;background:var(--site-blue);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:950}.highlight-seller{background:linear-gradient(135deg,var(--site-surface),var(--site-blue-soft))}.about-location{display:grid;grid-template-columns:.95fr 1.05fr;gap:14px;margin-top:34px}.about-card,.location-card{padding:24px}.about-card h2,.location-card h2,.offer-card h2{margin:12px 0 10px;font-size:clamp(28px,3vw,42px);line-height:1;letter-spacing:-.05em}.about-card p,.location-card p,.offer-card p{margin:0;color:var(--site-muted);font-size:15px;font-weight:700}.about-list{display:grid;gap:10px;margin-top:16px}.about-list div{padding:13px;border-radius:16px;background:var(--site-surface-2);border:1px solid var(--site-line)}.about-list b{display:block}.about-list span{display:block;color:var(--site-muted);font-size:13px;margin-top:2px}.location-card{display:grid;grid-template-columns:200px 1fr;gap:18px;align-items:center}.map-visual{min-height:250px;border-radius:22px;background:linear-gradient(90deg,rgba(24,119,242,.08) 1px,transparent 1px),linear-gradient(rgba(24,119,242,.08) 1px,transparent 1px),#eef5ff;background-size:30px 30px;display:grid;place-items:center}.map-visual span{width:76px;height:76px;border-radius:50% 50% 50% 8px;background:var(--site-blue);color:#fff;display:grid;place-items:center;font-size:30px;transform:rotate(-45deg);box-shadow:0 12px 25px rgba(24,119,242,.28)}.map-visual span::first-letter{transform:rotate(45deg)}.contact-lines{display:grid;gap:4px;margin-top:16px;padding:14px;border-radius:16px;background:var(--site-surface-2);border:1px solid var(--site-line)}.contact-lines strong{color:var(--site-text)}.contact-lines small{color:var(--site-muted);font-weight:800}.offer-section{margin-top:34px}.offer-card{display:grid;grid-template-columns:1fr .95fr;gap:20px;align-items:center;padding:clamp(22px,4vw,38px);background:linear-gradient(135deg,var(--site-blue),#0d5fd4);color:#fff}.offer-card .pill{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);color:#fff}.offer-card p{color:rgba(255,255,255,.84)}.offer-points{display:grid;gap:10px}.offer-points div{border:1px dashed rgba(255,255,255,.34);background:rgba(255,255,255,.12);border-radius:16px;padding:14px}.offer-points strong{display:block;color:#fff}.offer-points span{display:block;color:rgba(255,255,255,.78);font-size:13px;margin-top:3px}@media(max-width:1080px){.home-hero,.about-location,.offer-card{grid-template-columns:1fr}.featured-card{grid-template-rows:320px auto}.truck-grid,.quick-market{grid-template-columns:repeat(2,1fr)}.location-card{grid-template-columns:1fr}.map-visual{min-height:210px}.seller-grid{grid-template-columns:1fr 1fr}}@media(max-width:760px){.wrap{width:min(100% - 22px,1240px)}.home-hero{padding-top:16px}.hero-main-card{min-height:auto;padding:22px;border-radius:22px}.hero-main-card h1{font-size:38px;letter-spacing:-.05em}.hero-main-card p{font-size:16px}.replace-box,.store-info,.truck-grid,.quick-market,.seller-grid{grid-template-columns:1fr}.hero-actions .btn{width:100%;min-height:48px}.featured-card{grid-template-rows:240px auto}.section-title-row{align-items:flex-start;flex-direction:column}.section-title-row>a{width:100%;display:flex;align-items:center;justify-content:center}.card-actions{grid-template-columns:1fr}.card-actions a{width:100%}.about-card,.location-card{padding:20px}.offer-card{padding:22px}.map-visual{min-height:180px}}
      `}</style>
    </main>
  );
}
