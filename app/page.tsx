import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { createClient } from "@/lib/supabase/server";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeFeaturedSlider } from "@/components/HomeFeaturedSlider";

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
  return `R$ ${Math.round(value).toLocaleString("pt-BR")}`;
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
    .limit(9);

  const trucks = (data || []) as Truck[];
  const heroTruck = trucks[0];
  const heroImage = heroTruck ? getImage(heroTruck) : "";
  const featuredTrucks = trucks.slice(0, 5).map((truck) => ({
    id: truck.id,
    title: getTitle(truck),
    image: getImage(truck),
    price: formatMoney(truck.preco),
    location: getLocation(truck),
    meta: `${truck.ano_modelo || truck.ano_fabricacao || "Ano"} • ${truck.tracao || truck.carroceria || "Configuração"}`,
  }));

  return (
    <main className="home-page">
      <PublicHeader />

      <section className="wrap home-hero">
        <div className="hero-card" style={heroImage ? { backgroundImage: `linear-gradient(105deg, rgba(2,7,5,.96), rgba(2,7,5,.82) 48%, rgba(2,7,5,.38)), linear-gradient(180deg, rgba(2,7,5,.18), rgba(2,7,5,.84)), url(${heroImage})` } : undefined}>
          <div className="hero-content">
            <h1>Encontre caminhões com informação clara e contato direto.</h1>
            <p>Veja valor, cidade, configuração e chame no WhatsApp para confirmar disponibilidade, pedir fotos, vídeo e negociar.</p>
            <div className="hero-actions">
              <Link className="btn primary" href="/anuncios">Ver caminhões</Link>
              <Link className="btn ghost" href="/anunciar">Anunciar caminhão</Link>
              {heroTruck?.whatsapp ? <a className="btn whatsapp" href={getWhatsappLink(heroTruck)} target="_blank" rel="noreferrer">WhatsApp</a> : <Link className="btn whatsapp" href="/anuncios">WhatsApp</Link>}
            </div>
          </div>
        </div>

        <div className="trust-row">
          <div><strong>Contato direto</strong><span>Negociação pelo WhatsApp</span></div>
          <div><strong>Anúncios claros</strong><span>Valor, cidade e configuração</span></div>
          <div><strong>Mais visibilidade</strong><span>Para quem quer vender</span></div>
          <div><strong>Estoque organizado</strong><span>Leitura rápida no celular</span></div>
        </div>
      </section>

      <section className="wrap quick-market" aria-label="Áreas principais">
        <Link className="market-card large" href="/anuncios">
          <span>Caminhões</span>
          <strong>Estoque atualizado</strong>
          <small>Cavalos, trucks, tocos, bitrucks e oportunidades reais.</small>
        </Link>
        <Link className="market-card" href="/anuncios?perfil=Implementos">
          <span>Implementos</span>
          <strong>Carretas e carrocerias</strong>
          <small>Baú, tanque, prancha, caçamba e mais.</small>
        </Link>
        <Link className="market-card" href="/anunciar">
          <span>Anunciar</span>
          <strong>Venda com apresentação</strong>
          <small>Fotos, dados e contato mais organizados.</small>
        </Link>
      </section>

      <section className="wrap section-head compact-head">
        <div>
          <span className="mini">Destaque do estoque</span>
          <h2>Anúncio forte, visual limpo e informação rápida.</h2>
        </div>
        <Link href="/anuncios">Ver estoque completo</Link>
      </section>

      <section className="wrap feature-zone">
        <article className="main-feature">
          <Link href={heroTruck ? `/anuncios/${heroTruck.id}` : "/anuncios"} className="feature-photo">
            {heroImage ? <img src={heroImage} alt={heroTruck ? getTitle(heroTruck) : "Caminhão em destaque"} /> : <span>Foto principal do anúncio</span>}
          </Link>
          <div className="feature-info">
            <span className="badge">Oportunidade em destaque</span>
            <h3>{heroTruck ? getTitle(heroTruck) : "Caminhão em destaque"}</h3>
            <p>{heroTruck ? `${heroTruck.ano_modelo || heroTruck.ano_fabricacao || "Ano"} • ${heroTruck.tracao || heroTruck.carroceria || "Configuração"} • ${getLocation(heroTruck)}` : "Os anúncios aprovados aparecem aqui automaticamente."}</p>
            <div className="feature-specs">
              <span>{heroTruck?.ano_modelo || heroTruck?.ano_fabricacao || "Ano"}</span>
              <span>{heroTruck?.tracao || "Tração"}</span>
              <span>{heroTruck?.carroceria || "Carroceria"}</span>
              <span>{heroTruck ? getLocation(heroTruck) : "Cidade"}</span>
            </div>
            <strong>{heroTruck ? formatMoney(heroTruck.preco) : "Sob consulta"}</strong>
            <div className="feature-actions">
              <Link className="btn primary" href={heroTruck ? `/anuncios/${heroTruck.id}` : "/anuncios"}>Ver detalhes</Link>
              {heroTruck?.whatsapp ? <a className="btn whatsapp" href={getWhatsappLink(heroTruck)} target="_blank" rel="noreferrer">Chamar no WhatsApp</a> : null}
            </div>
          </div>
        </article>

        <aside className="side-stack">
          <div><b>Para quem compra</b><span>Informação objetiva antes de chamar. Menos enrolação e mais clareza.</span></div>
          <div><b>Para quem vende</b><span>Vitrine organizada para divulgar melhor o caminhão e gerar contato.</span></div>
          <div><b>Atendimento</b><span>WhatsApp em destaque para continuar a negociação com interessado real.</span></div>
        </aside>
      </section>

      <section className="wrap section-head">
        <div>
          <span className="mini">Destaques</span>
          <h2>Anúncios em destaque</h2>
        </div>
        <Link href="/anuncios">Ver todos</Link>
      </section>

      <section className="wrap slider-wrap">
        <HomeFeaturedSlider trucks={featuredTrucks} />
      </section>

      <section className="wrap section-head recent-head">
        <div>
          <span className="mini">Recentes</span>
          <h2>Caminhões disponíveis</h2>
        </div>
        <Link href="/anuncios">Estoque completo</Link>
      </section>

      <section className="wrap highlight-grid">
        {trucks.length > 0 ? trucks.slice(0, 6).map((truck) => {
          const title = getTitle(truck);
          const cardTitle = getCardTitle(truck);
          const image = getImage(truck);
          const year = truck.ano_modelo || truck.ano_fabricacao || "Ano";
          const configuration = truck.tracao || truck.carroceria || "Configuração";

          return (
            <article className="truck-card" key={truck.id}>
              <Link href={`/anuncios/${truck.id}`} className="card-photo">
                <span>{truck.carroceria || truck.tracao || "Caminhão"}</span>
                {image ? <img src={image} alt={title} /> : <i>Sem foto</i>}
              </Link>

              <div className="card-body">
                <Link href={`/anuncios/${truck.id}`} className="card-title">{cardTitle}</Link>
                <div className="card-meta"><b>{year} • {configuration} • {getLocation(truck)}</b></div>
                <p>{truck.marca || "Caminhão"}{truck.modelo ? ` ${truck.modelo}` : ""} anunciado com dados claros e contato direto.</p>
                <strong>{formatMoney(truck.preco)}</strong>
                <div className="card-actions">
                  <Link href={`/anuncios/${truck.id}`}>Ver detalhes →</Link>
                  {truck.whatsapp && <a href={getWhatsappLink(truck)} target="_blank" rel="noreferrer" aria-label="Chamar no WhatsApp">WhatsApp</a>}
                </div>
              </div>
            </article>
          );
        }) : (
          <div className="empty">Os caminhões aprovados aparecerão aqui.</div>
        )}
      </section>

      <section className="wrap benefits-grid">
        <div><i>🔎</i><strong>Para quem compra</strong><span>Encontra caminhões com dados claros antes de chamar no WhatsApp.</span></div>
        <div><i>📣</i><strong>Para quem vende</strong><span>Ganha uma vitrine mais organizada para divulgar melhor o caminhão.</span></div>
        <div><i>🛡️</i><strong>Mais segurança</strong><span>Informação objetiva, contato humano e anúncio com aparência profissional.</span></div>
      </section>

      <section className="wrap trust-strip home-trust-strip">
        <div><b>Fotos organizadas</b><span>Imagem principal forte e galeria clara.</span></div>
        <div><b>Dados essenciais</b><span>Ano, modelo, cidade, tração e carroceria.</span></div>
        <div><b>Descrição objetiva</b><span>Sem texto repetido e sem promessa exagerada.</span></div>
        <div><b>WhatsApp visível</b><span>Contato rápido para confirmar disponibilidade.</span></div>
      </section>

      <section className="wrap sell-zone">
        <div className="sell-copy">
          <span className="mini">Anunciar caminhão</span>
          <h2>Venda com mais apresentação.</h2>
          <p>Um anúncio bem organizado passa mais confiança e ajuda o comprador chamar já sabendo o básico do caminhão.</p>
          <div className="sell-list">
            <span>Card bonito para o estoque</span>
            <span>Texto comercial sem exagero</span>
            <span>Dados claros para comprador sério</span>
            <span>Botão direto para negociação</span>
          </div>
        </div>
        <div className="sell-panel">
          <strong>Pronto para anunciar?</strong>
          <p>Use a página de anúncio do próprio site para enviar as informações do caminhão com mais organização.</p>
          <div className="hero-actions">
            <Link className="btn primary" href="/anunciar">Começar anúncio</Link>
            <Link className="btn ghost" href="/login">Entrar na conta</Link>
          </div>
        </div>
      </section>

      <section className="wrap final-cta">
        <div>
          <span className="mini">Caminhões à venda</span>
          <h2>Veja o estoque completo ou anuncie seu caminhão.</h2>
        </div>
        <div className="hero-actions">
          <Link className="btn primary" href="/anuncios">Ver caminhões</Link>
          <Link className="btn ghost" href="/anunciar">Anunciar</Link>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .home-page{
          min-height:100vh;
          color:var(--site-text,#eefaf3);
          background:radial-gradient(circle at 82% -12%,color-mix(in srgb,var(--site-green,#22d37d) 18%,transparent),transparent 34%),radial-gradient(circle at 8% 4%,color-mix(in srgb,var(--site-gold,#f1c86c) 10%,transparent),transparent 27%),linear-gradient(180deg,var(--site-bg,#050b08),var(--site-bg-2,#08140f));
          overflow-x:hidden;
          padding-bottom:30px;
        }
        .wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}
        .mini{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:var(--site-green-soft,rgba(34,211,125,.13));border:1px solid color-mix(in srgb,var(--site-green,#22d37d) 28%,transparent);color:var(--site-green,#22d37d);font-size:12px;font-weight:950;letter-spacing:.06em;text-transform:uppercase}
        .home-hero{padding-top:10px}
        .hero-card{position:relative;overflow:hidden;min-height:318px;border-radius:30px;background:linear-gradient(115deg,rgba(7,17,13,.96),rgba(7,17,13,.72) 54%,rgba(34,211,125,.26));background-size:cover;background-position:center;border:1px solid var(--site-line,rgba(255,255,255,.13));box-shadow:var(--site-shadow,0 28px 80px rgba(0,0,0,.36));display:grid;grid-template-columns:1fr;align-items:end;gap:20px;padding:30px}
        .hero-card::before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 0 58%,rgba(34,211,125,.15) 59%,transparent 60%),linear-gradient(130deg,transparent 0 70%,rgba(255,255,255,.09) 71%,transparent 72%);pointer-events:none}
        .hero-content{position:relative;z-index:2;max-width:720px}.hero-content h1{margin:15px 0 12px;font-size:clamp(34px,4.2vw,58px);line-height:.98;letter-spacing:-.06em;text-wrap:balance}.hero-content p{margin:0;max-width:640px;color:rgba(238,250,243,.82);font-size:16px;line-height:1.55;font-weight:720}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
        .trust-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:14px}.trust-row div{padding:15px 16px;border-radius:20px;background:var(--site-surface,rgba(11,23,17,.76));border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft);backdrop-filter:blur(14px)}.trust-row strong{display:block;font-size:18px;margin-bottom:4px}.trust-row span{display:block;color:var(--site-muted);font-size:12px;font-weight:850}
        .quick-market{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:14px;margin-top:16px}.market-card{position:relative;overflow:hidden;min-height:142px;padding:22px;border-radius:24px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft);display:flex;flex-direction:column;justify-content:flex-end;color:var(--site-text);text-decoration:none;transition:.2s ease}.market-card:hover{transform:translateY(-3px)}.market-card::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 18% 15%,color-mix(in srgb,var(--site-green) 22%,transparent),transparent 30%),linear-gradient(135deg,rgba(255,255,255,.08),transparent 55%);pointer-events:none}.market-card.large{min-height:170px}.market-card span,.market-card strong,.market-card small{position:relative}.market-card span{color:var(--site-green);font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}.market-card strong{font-size:clamp(23px,2.5vw,34px);line-height:1;letter-spacing:-.04em}.market-card small{margin-top:8px;color:var(--site-muted);font-size:14px;font-weight:800}
        .section-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin:36px auto 16px}.section-head h2{margin:10px 0 0;font-size:clamp(27px,2.9vw,40px);line-height:1.05;letter-spacing:-.045em;max-width:760px}.section-head a{min-height:44px;border-radius:999px;border:1px solid var(--site-line);background:var(--site-surface);color:var(--site-text);padding:0 16px;display:inline-flex;align-items:center;text-decoration:none;font-weight:900;white-space:nowrap}.compact-head{margin-top:34px}
        .feature-zone{display:grid;grid-template-columns:1.25fr .75fr;gap:16px}.main-feature{display:grid;grid-template-columns:1.04fr .96fr;border-radius:26px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow);overflow:hidden}.feature-photo{min-height:290px;background:linear-gradient(145deg,#1b2a23,#070f0b);display:grid;place-items:center;color:var(--site-muted);text-decoration:none;font-weight:950;overflow:hidden}.feature-photo img{width:100%;height:100%;object-fit:cover;display:block}.feature-info{padding:24px;align-self:center}.badge{display:inline-flex;align-items:center;min-height:30px;padding:0 11px;border-radius:999px;background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 24%,transparent);color:var(--site-green);font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.06em}.feature-info h3{margin:12px 0 8px;font-size:clamp(26px,3vw,36px);line-height:1.05;letter-spacing:-.045em}.feature-info p{margin:0;color:var(--site-muted);line-height:1.5;font-weight:750}.feature-specs{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 16px}.feature-specs span{padding:8px 10px;border-radius:999px;background:var(--site-surface-2);border:1px solid var(--site-line);color:var(--site-muted);font-size:12px;font-weight:900}.feature-info>strong{display:block;color:var(--site-green);font-size:30px;line-height:1;margin-bottom:16px}.feature-actions{display:flex;gap:10px;flex-wrap:wrap}.side-stack{display:grid;gap:16px}.side-stack div{padding:20px;border-radius:24px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft)}.side-stack b{display:block;font-size:20px;margin-bottom:8px}.side-stack span{display:block;color:var(--site-muted);line-height:1.45;font-weight:720}
        .slider-wrap{border-radius:26px;overflow:hidden}.highlight-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.truck-card{overflow:hidden;border-radius:24px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft);transition:.2s ease}.truck-card:hover{transform:translateY(-4px);box-shadow:var(--site-shadow)}.card-photo{position:relative;aspect-ratio:1/.72;background:linear-gradient(145deg,#1b2a23,#070f0b);display:grid;place-items:center;overflow:hidden;color:var(--site-muted);text-decoration:none;font-weight:950}.card-photo img{width:100%;height:100%;object-fit:cover;display:block}.card-photo span{position:absolute;top:14px;left:14px;z-index:2;padding:7px 10px;border-radius:999px;background:rgba(34,211,125,.92);color:#052e16;font-size:11px;font-weight:950}.card-photo i{font-style:normal}.card-body{padding:16px}.card-title{display:block;color:var(--site-text);font-size:19px;font-weight:950;line-height:1.15;text-decoration:none;letter-spacing:-.02em}.card-meta{margin:8px 0 10px;color:var(--site-muted);font-size:13px}.card-body p{margin:0 0 12px;color:var(--site-muted);font-size:14px;line-height:1.42;font-weight:680}.card-body>strong{display:block;color:var(--site-green);font-size:20px;margin-bottom:12px}.card-actions{display:grid;grid-template-columns:1fr auto;gap:10px}.card-actions a{min-height:40px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;padding:0 12px;text-decoration:none;font-weight:950;font-size:12px}.card-actions a:first-child{background:var(--site-surface-2);border:1px solid var(--site-line);color:var(--site-text)}.card-actions a:last-child{background:#19c56f;color:#052e16}.empty{grid-column:1/-1;padding:28px;border-radius:24px;background:var(--site-surface);border:1px solid var(--site-line);color:var(--site-muted);font-weight:800;text-align:center}
        .benefits-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:36px}.benefits-grid div{padding:22px;border-radius:24px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft)}.benefits-grid i{font-style:normal;width:46px;height:46px;display:grid;place-items:center;border-radius:16px;background:var(--site-green-soft);color:var(--site-green);font-size:23px;margin-bottom:15px}.benefits-grid strong{display:block;font-size:20px;margin-bottom:8px}.benefits-grid span{display:block;color:var(--site-muted);line-height:1.5;font-weight:680}.home-trust-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:16px;padding:16px;border-radius:24px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft)}.home-trust-strip div{padding:14px;border-radius:18px;background:var(--site-surface-2);border:1px solid var(--site-line)}.home-trust-strip b{display:block;margin-bottom:5px}.home-trust-strip span{display:block;color:var(--site-muted);font-size:13px;line-height:1.35;font-weight:700}
        .sell-zone{display:grid;grid-template-columns:.9fr 1.1fr;gap:16px;margin-top:36px}.sell-copy,.sell-panel{padding:24px;border-radius:26px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft)}.sell-copy h2{margin:10px 0;font-size:clamp(28px,3vw,40px);line-height:1.05;letter-spacing:-.045em}.sell-copy p,.sell-panel p{margin:0;color:var(--site-muted);line-height:1.5;font-weight:700}.sell-list{display:grid;gap:10px;margin-top:18px}.sell-list span{padding:12px;border-radius:16px;background:var(--site-surface-2);border:1px solid var(--site-line);font-weight:850}.sell-panel{display:flex;flex-direction:column;justify-content:center}.sell-panel strong{font-size:28px;letter-spacing:-.035em;margin-bottom:8px}.final-cta{margin-top:36px;padding:28px;border-radius:26px;background:linear-gradient(135deg,var(--site-green-2),var(--site-green));color:#fff;display:flex;align-items:center;justify-content:space-between;gap:18px;box-shadow:0 20px 54px color-mix(in srgb,var(--site-green) 26%,transparent);overflow:hidden}.final-cta h2{margin:8px 0 0;font-size:28px;letter-spacing:-.035em}.final-cta .mini{background:rgba(255,255,255,.18)!important;border-color:rgba(255,255,255,.24)!important;color:#fff!important}.final-cta .ghost{background:#fff!important;color:#102018!important;border-color:transparent!important}
        html[data-theme="light"] .hero-card{background:linear-gradient(105deg,rgba(246,249,247,.96),rgba(246,249,247,.86) 48%,rgba(22,184,110,.18))!important}.home-page:has(.hero-card[style]) .hero-content h1,.home-page:has(.hero-card[style]) .hero-content p{color:#fff}html[data-theme="light"] .home-page:has(.hero-card[style]) .hero-content h1,html[data-theme="light"] .home-page:has(.hero-card[style]) .hero-content p{color:#fff}
        @media(max-width:1020px){.hero-card,.feature-zone,.main-feature,.sell-zone{grid-template-columns:1fr}.quick-market{grid-template-columns:1fr 1fr}.quick-market .large{grid-column:1/-1}.trust-row,.home-trust-strip{grid-template-columns:repeat(2,1fr)}.highlight-grid,.benefits-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.wrap{width:min(100% - 22px,1240px)}.home-hero{padding-top:4px}.hero-card{min-height:auto;border-radius:24px;padding:22px;gap:18px}.hero-content h1{font-size:34px;letter-spacing:-.045em}.hero-content p{font-size:15px}.hero-actions .btn{width:100%;min-height:48px}.trust-row,.quick-market,.highlight-grid,.benefits-grid,.home-trust-strip{grid-template-columns:1fr}.section-head{align-items:flex-start;flex-direction:column;margin-top:32px}.section-head a{width:100%;justify-content:center}.feature-photo{min-height:220px}.card-actions{grid-template-columns:1fr}.sell-panel strong{font-size:24px}.final-cta{align-items:stretch;flex-direction:column;padding:22px}.final-cta .hero-actions .btn{width:100%}}
      `}</style>
    </main>
  );
}
