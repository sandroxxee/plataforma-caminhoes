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

const categories = [
  {
    title: "Cavalos mecânicos",
    text: "Scania, Volvo, Mercedes-Benz, DAF e outras opções para estrada.",
    href: "/anuncios?perfil=Cavalo%20mec%C3%A2nico",
  },
  {
    title: "Trucks e tocos",
    text: "Caminhões para operação urbana, regional e serviço pesado.",
    href: "/anuncios?perfil=Truck",
  },
  {
    title: "Caçambas e tanques",
    text: "Opções para obra, agro, combustível, água e transporte dedicado.",
    href: "/anuncios?busca=ca%C3%A7amba",
  },
  {
    title: "Implementos",
    text: "Carretas, baús, pranchas, plataformas e carrocerias.",
    href: "/anuncios?perfil=Implementos",
  },
];

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

      <section className="wrap hero-shell">
        <div className="hero-card" style={heroImage ? { backgroundImage: `linear-gradient(105deg, rgba(2,7,5,.96), rgba(2,7,5,.83) 48%, rgba(2,7,5,.30)), linear-gradient(180deg, rgba(2,7,5,.18), rgba(2,7,5,.84)), url(${heroImage})` } : undefined}>
          <div className="hero-content">
            <span className="mini">Caminhões, implementos e oportunidades</span>
            <h1>Encontre caminhões com informação clara e contato direto.</h1>
            <p>Veja valor, cidade, configuração e chame no WhatsApp para confirmar disponibilidade, pedir fotos, vídeo e negociar.</p>
            <div className="hero-actions">
              <Link className="btn primary" href="/anuncios">Ver caminhões</Link>
              <Link className="btn ghost" href="/anunciar">Anunciar caminhão</Link>
              {heroTruck?.whatsapp ? <a className="btn whatsapp" href={getWhatsappLink(heroTruck)} target="_blank" rel="noreferrer">WhatsApp</a> : <Link className="btn whatsapp" href="/anuncios">WhatsApp</Link>}
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="truck-art">
              <span className="speed-line one" />
              <span className="speed-line two" />
              <span className="truck-body" />
              <span className="truck-cab" />
              <span className="wheel a" />
              <span className="wheel b" />
              <span className="wheel c" />
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

      <section className="wrap premium-grid" aria-label="Áreas principais">
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

      <section className="wrap section-head">
        <div>
          <span className="mini">Destaque do estoque</span>
          <h2>Anúncio com chamada forte, sem parecer demonstração.</h2>
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

      <section className="wrap section-head" id="categorias">
        <div>
          <span className="mini">Categorias rápidas</span>
          <h2>Entrada simples para quem procura por tipo.</h2>
        </div>
      </section>

      <section className="wrap categories-grid">
        {categories.map((category) => (
          <Link className="category-card" href={category.href} key={category.title}>
            <div className="category-photo"><span>{category.title}</span></div>
            <div>
              <strong>{category.title}</strong>
              <p>{category.text}</p>
            </div>
          </Link>
        ))}
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

      <section className="wrap section-head">
        <div>
          <span className="mini">Confiança comercial</span>
          <h2>O que deixa o site com cara de plataforma real.</h2>
        </div>
      </section>

      <section className="wrap benefits-grid">
        <div><i>🔎</i><strong>Para quem compra</strong><span>Encontra caminhões com dados claros antes de chamar no WhatsApp.</span></div>
        <div><i>📣</i><strong>Para quem vende</strong><span>Ganha uma vitrine mais organizada para divulgar melhor o caminhão.</span></div>
        <div><i>🛡️</i><strong>Mais segurança</strong><span>Informação objetiva, contato humano e anúncio com aparência profissional.</span></div>
      </section>

      <section className="wrap trust-strip">
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
          --home-bg:#050b08;
          --home-bg-2:#08140f;
          --home-card:rgba(11,23,17,.86);
          --home-card-solid:#0b1711;
          --home-soft:#10231a;
          --home-text:#eefaf3;
          --home-muted:#a9b8b0;
          --home-line:rgba(255,255,255,.105);
          --home-green:#22d37d;
          --home-green-2:#10a763;
          --home-shadow:0 28px 80px rgba(0,0,0,.36);
          min-height:100vh;
          color:var(--home-text);
          background:radial-gradient(circle at 82% -12%,rgba(34,211,125,.18),transparent 34%),radial-gradient(circle at 8% 4%,rgba(240,198,107,.10),transparent 27%),linear-gradient(180deg,var(--home-bg),var(--home-bg-2));
          overflow-x:hidden;
          padding-bottom:30px;
        }
        .home-page::after{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;opacity:.20;background-image:linear-gradient(120deg,transparent 0 72%,rgba(34,211,125,.13) 73%,transparent 74%),linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:180px 180px,56px 56px,56px 56px}
        .wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}
        .mini{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:rgba(34,211,125,.13);border:1px solid rgba(34,211,125,.28);color:#bbf7d0;font-size:12px;font-weight:950;letter-spacing:.07em;text-transform:uppercase}
        .hero-shell{padding-top:18px}
        .hero-card{position:relative;overflow:hidden;min-height:350px;border-radius:28px;background:linear-gradient(115deg,rgba(7,17,13,.96),rgba(7,17,13,.75) 54%,rgba(34,211,125,.25));background-size:cover;background-position:center;border:1px solid rgba(255,255,255,.13);box-shadow:var(--home-shadow);display:grid;grid-template-columns:1.04fr .78fr;align-items:center;gap:20px;padding:34px}
        .hero-card::before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 0 58%,rgba(34,211,125,.16) 59%,transparent 60%),linear-gradient(130deg,transparent 0 70%,rgba(255,255,255,.09) 71%,transparent 72%);pointer-events:none}
        .hero-content{position:relative;z-index:2;max-width:710px}.hero-content h1{margin:16px 0 12px;font-size:clamp(35px,4.4vw,58px);line-height:.98;letter-spacing:-.06em;text-wrap:balance}.hero-content p{margin:0;max-width:640px;color:rgba(238,250,243,.82);font-size:16px;line-height:1.55;font-weight:700}
        .hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}.btn{min-height:50px;display:inline-flex;align-items:center;justify-content:center;padding:0 20px;border-radius:999px;border:1px solid rgba(255,255,255,.14);font-weight:950;text-decoration:none;text-transform:uppercase;font-size:12px;letter-spacing:.045em;transition:.18s ease}.btn:hover{transform:translateY(-2px)}.primary{background:linear-gradient(135deg,var(--home-green),var(--home-green-2));color:#03220f;border-color:transparent;box-shadow:0 14px 34px rgba(34,211,125,.24)}.ghost{background:rgba(255,255,255,.08);color:white}.whatsapp{background:#19c56f;color:#042713;border-color:transparent}
        .hero-visual{position:relative;z-index:2;display:grid;place-items:center;min-height:230px}.truck-art{width:min(420px,100%);height:195px;position:relative;filter:drop-shadow(0 28px 42px rgba(0,0,0,.42))}.truck-body{position:absolute;right:0;bottom:44px;width:78%;height:88px;border-radius:16px 28px 12px 12px;background:linear-gradient(135deg,#31423a,#14231c);border:1px solid rgba(255,255,255,.16)}.truck-cab{position:absolute;left:8px;bottom:44px;width:120px;height:110px;border-radius:22px 24px 12px 12px;background:linear-gradient(135deg,var(--home-green),var(--home-green-2));border:1px solid rgba(255,255,255,.24)}.truck-cab::after{content:"";position:absolute;left:24px;top:20px;width:62px;height:34px;border-radius:10px;background:linear-gradient(135deg,rgba(255,255,255,.82),rgba(255,255,255,.16))}.wheel{position:absolute;bottom:16px;width:62px;height:62px;border-radius:50%;border:6px solid #0c1511;background:radial-gradient(circle,#c6d3cc 0 13%,#15231d 14% 100%)}.wheel.a{left:44px}.wheel.b{right:66px}.wheel.c{right:152px}.speed-line{position:absolute;left:0;right:60px;height:5px;border-radius:999px;background:linear-gradient(90deg,transparent,var(--home-green),transparent);opacity:.55}.speed-line.one{top:52px}.speed-line.two{top:118px;left:70px;opacity:.35}
        .trust-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:14px}.trust-row div{padding:15px 16px;border-radius:20px;background:rgba(11,23,17,.76);border:1px solid var(--home-line);box-shadow:0 16px 42px rgba(0,0,0,.22);backdrop-filter:blur(14px)}.trust-row strong{display:block;font-size:18px;margin-bottom:4px}.trust-row span{display:block;color:var(--home-muted);font-size:12px;font-weight:850}
        .premium-grid{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:14px;margin-top:16px}.market-card{position:relative;overflow:hidden;min-height:150px;padding:22px;border-radius:22px;background:linear-gradient(135deg,rgba(16,35,26,.95),rgba(7,13,10,.92));border:1px solid var(--home-line);box-shadow:0 18px 45px rgba(0,0,0,.22);display:flex;flex-direction:column;justify-content:flex-end;color:white;text-decoration:none;transition:.2s ease}.market-card:hover{transform:translateY(-3px)}.market-card::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 18% 15%,rgba(34,211,125,.22),transparent 30%),linear-gradient(135deg,rgba(255,255,255,.08),transparent 55%);pointer-events:none}.market-card.large{min-height:180px;background-image:linear-gradient(135deg,rgba(34,211,125,.18),rgba(255,255,255,.04))}.market-card span,.market-card strong,.market-card small{position:relative}.market-card span{color:#86efac;font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}.market-card strong{font-size:clamp(24px,2.6vw,36px);line-height:1;letter-spacing:-.04em}.market-card small{margin-top:8px;color:#cbd5e1;font-size:14px;font-weight:800}
        .section-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin:38px auto 18px}.section-head h2{margin:10px 0 0;font-size:clamp(28px,3vw,42px);line-height:1.05;letter-spacing:-.045em;max-width:760px}.section-head a{min-height:44px;border-radius:999px;border:1px solid var(--home-line);background:rgba(255,255,255,.065);color:white;padding:0 16px;display:inline-flex;align-items:center;text-decoration:none;font-weight:900;white-space:nowrap}
        .feature-zone{display:grid;grid-template-columns:1.25fr .75fr;gap:16px}.main-feature{display:grid;grid-template-columns:1.04fr .96fr;border-radius:26px;background:var(--home-card);border:1px solid var(--home-line);box-shadow:var(--home-shadow);overflow:hidden}.feature-photo{min-height:300px;background:linear-gradient(145deg,#1b2a23,#070f0b);display:grid;place-items:center;color:#94a3b8;text-decoration:none;font-weight:950;overflow:hidden}.feature-photo img{width:100%;height:100%;object-fit:cover;display:block}.feature-info{padding:24px;align-self:center}.badge{display:inline-flex;align-items:center;min-height:30px;padding:0 11px;border-radius:999px;background:rgba(34,211,125,.13);border:1px solid rgba(34,211,125,.24);color:#bbf7d0;font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.06em}.feature-info h3{margin:12px 0 8px;font-size:clamp(26px,3vw,36px);line-height:1.05;letter-spacing:-.045em}.feature-info p{margin:0;color:var(--home-muted);line-height:1.5;font-weight:750}.feature-specs{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 16px}.feature-specs span{padding:8px 10px;border-radius:999px;background:var(--home-soft);border:1px solid var(--home-line);color:var(--home-muted);font-size:12px;font-weight:900}.feature-info>strong{display:block;color:var(--home-green);font-size:30px;line-height:1;margin-bottom:16px}.feature-actions{display:flex;gap:10px;flex-wrap:wrap}.side-stack{display:grid;gap:16px}.side-stack div{padding:20px;border-radius:24px;background:var(--home-card);border:1px solid var(--home-line);box-shadow:0 16px 42px rgba(0,0,0,.22)}.side-stack b{display:block;font-size:20px;margin-bottom:8px}.side-stack span{display:block;color:var(--home-muted);line-height:1.45;font-weight:720}
        .categories-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.category-card{overflow:hidden;border-radius:22px;background:var(--home-card);border:1px solid var(--home-line);box-shadow:0 16px 42px rgba(0,0,0,.22);color:white;text-decoration:none;transition:.2s ease}.category-card:hover{transform:translateY(-4px)}.category-photo{position:relative;aspect-ratio:1/.62;background:radial-gradient(circle at 72% 26%,rgba(34,211,125,.28),transparent 30%),linear-gradient(145deg,#1b2a23,#070f0b);display:grid;place-items:center;overflow:hidden}.category-photo::before{content:"";position:absolute;width:70%;height:40%;bottom:28px;border-radius:18px;background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.12);transform:skewX(-9deg)}.category-photo span{position:relative;z-index:2;padding:7px 10px;border-radius:999px;background:rgba(0,0,0,.36);font-size:11px;font-weight:950;text-transform:uppercase}.category-card div:last-child{padding:15px}.category-card strong{font-size:18px}.category-card p{margin:6px 0 0;color:var(--home-muted);font-size:13px;line-height:1.4;font-weight:720}
        .slider-wrap{margin-bottom:34px}.recent-head{margin-top:16px}.highlight-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-bottom:36px}.truck-card{overflow:hidden;border-radius:24px;background:var(--home-card);border:1px solid var(--home-line);box-shadow:0 18px 45px rgba(0,0,0,.22);transition:.2s ease}.truck-card:hover{transform:translateY(-4px);box-shadow:var(--home-shadow)}.card-photo{position:relative;aspect-ratio:1.42/1;display:block;overflow:hidden;background:#111827;color:#94a3b8;text-decoration:none}.card-photo img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(1.04) contrast(1.03)}.card-photo i{height:100%;display:grid;place-items:center;font-style:normal;font-weight:900}.card-photo span{position:absolute;left:12px;top:12px;z-index:2;min-height:26px;padding:0 10px;border-radius:999px;background:rgba(34,211,125,.94);color:#052e16;font-size:10px;font-weight:950;text-transform:uppercase}.card-body{padding:16px}.card-title{display:block;min-height:44px;color:white;text-decoration:none;font-size:19px;line-height:1.16;font-weight:950;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.card-meta{margin:10px 0}.card-meta b{display:block;color:#cbd5e1;font-size:12px;font-weight:850;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.card-body p{margin:0 0 12px;color:var(--home-muted);font-size:14px;line-height:1.45;font-weight:680}.card-body>strong{display:block;color:var(--home-green);font-size:24px;margin-bottom:12px}.card-actions{display:grid;grid-template-columns:1fr auto;gap:8px}.card-actions a{min-height:44px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;font-weight:950}.card-actions a:first-child{background:rgba(255,255,255,.08);color:white;border:1px solid var(--home-line)}.card-actions a:last-child{background:#19c56f;color:#052e16;font-size:12px;padding:0 12px;text-transform:uppercase;letter-spacing:.03em}.empty{grid-column:1/-1;padding:28px;border-radius:16px;background:rgba(255,255,255,.055);border:1px solid var(--home-line)}
        .benefits-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.benefits-grid div{padding:22px;border-radius:24px;background:var(--home-card);border:1px solid var(--home-line);box-shadow:0 16px 42px rgba(0,0,0,.22)}.benefits-grid i{font-style:normal;width:46px;height:46px;display:grid;place-items:center;border-radius:16px;background:rgba(34,211,125,.13);font-size:23px;margin-bottom:15px}.benefits-grid strong{display:block;font-size:20px;margin-bottom:8px}.benefits-grid span{display:block;color:var(--home-muted);line-height:1.5;font-weight:680}.trust-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:16px;border-radius:24px;background:var(--home-card);border:1px solid var(--home-line);box-shadow:0 16px 42px rgba(0,0,0,.22);margin-top:18px}.trust-strip div{padding:14px;border-radius:18px;background:var(--home-soft);border:1px solid var(--home-line)}.trust-strip b{display:block;margin-bottom:5px}.trust-strip span{color:var(--home-muted);font-size:13px;line-height:1.35;font-weight:700}
        .sell-zone{display:grid;grid-template-columns:.9fr 1.1fr;gap:16px;margin-top:42px}.sell-copy,.sell-panel{padding:24px;border-radius:26px;background:var(--home-card);border:1px solid var(--home-line);box-shadow:0 16px 42px rgba(0,0,0,.22)}.sell-copy h2{margin:12px 0 10px;font-size:clamp(28px,3vw,40px);letter-spacing:-.045em}.sell-copy p,.sell-panel p{margin:0;color:var(--home-muted);line-height:1.5;font-weight:700}.sell-list{display:grid;gap:10px;margin-top:18px}.sell-list span{padding:12px;border-radius:16px;background:var(--home-soft);border:1px solid var(--home-line);font-weight:850}.sell-panel{display:flex;flex-direction:column;justify-content:center}.sell-panel strong{font-size:30px;line-height:1.05;letter-spacing:-.04em;margin-bottom:10px}
        .final-cta{padding:clamp(22px,3vw,34px);border-radius:26px;background:linear-gradient(135deg,rgba(34,211,125,.18),rgba(255,255,255,.055));border:1px solid rgba(34,211,125,.22);display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:42px;margin-bottom:34px;box-shadow:0 18px 45px rgba(0,0,0,.22)}.final-cta h2{margin:12px 0 10px;font-size:clamp(28px,3.6vw,44px);line-height:1.03;letter-spacing:-.045em}.final-cta .hero-actions{margin-top:0}
        @media (prefers-color-scheme: light){.home-page{--home-bg:#f4f7f5;--home-bg-2:#eaf1ed;--home-card:rgba(255,255,255,.86);--home-card-solid:#fff;--home-soft:#eef4f1;--home-text:#102018;--home-muted:#5d6f66;--home-line:rgba(16,32,24,.12);--home-green:#16b86e;--home-green-2:#087f4d;--home-shadow:0 20px 55px rgba(16,32,24,.12)}.home-page::after{opacity:.12}.trust-row div,.filters{background:rgba(255,255,255,.72)}.section-head a,.ghost{color:var(--home-text);background:rgba(255,255,255,.72)}.card-title,.category-card,.market-card{color:var(--home-text)}.market-card{background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(240,245,242,.92))}.market-card small,.card-meta b{color:var(--home-muted)}.feature-photo,.category-photo{background:radial-gradient(circle at 72% 26%,rgba(22,184,110,.30),transparent 30%),linear-gradient(145deg,#23352c,#102018)}}
        @media(max-width:1100px){.premium-grid{grid-template-columns:1fr}.feature-zone,.main-feature,.sell-zone{grid-template-columns:1fr}.highlight-grid{grid-template-columns:repeat(2,1fr)}.categories-grid,.trust-row,.trust-strip{grid-template-columns:repeat(2,1fr)}.benefits-grid{grid-template-columns:1fr}.hero-card{grid-template-columns:1fr}.hero-visual{min-height:180px}.final-cta{display:block}.final-cta .hero-actions{margin-top:18px}}
        @media(max-width:640px){.wrap{width:calc(100vw - 22px)}.hero-shell{padding-top:10px}.hero-card{min-height:auto;border-radius:22px;padding:26px 18px;background-position:center}.hero-card::before{opacity:.5}.hero-content h1{font-size:38px}.hero-content p{font-size:15px}.hero-actions{display:grid;grid-template-columns:1fr}.btn{width:100%}.trust-row,.categories-grid,.highlight-grid,.trust-strip{grid-template-columns:1fr}.market-card,.market-card.large{min-height:140px;padding:18px}.section-head{display:block}.section-head a{margin-top:14px}.feature-photo{min-height:220px}.truck-art{height:165px}.truck-body{height:72px}.truck-cab{width:98px;height:92px}.wheel{width:50px;height:50px}.wheel.c{display:none}.card-photo{aspect-ratio:1.35/1}.card-actions{grid-template-columns:1fr}.sell-panel strong{font-size:26px}}
      `}</style>
    </main>
  );
}
