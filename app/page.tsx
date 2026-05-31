import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { createClient } from "@/lib/supabase/server";
import { SiteFooter } from "@/components/SiteFooter";

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
    .limit(4);

  const trucks = (data || []) as Truck[];
  const heroImage = trucks[0] ? getImage(trucks[0]) : "";

  return (
    <main className="home-page">
      <PublicHeader />

      <section className="hero" style={heroImage ? { backgroundImage: `linear-gradient(90deg, rgba(2,6,8,.96), rgba(2,6,8,.82) 45%, rgba(2,6,8,.42)), linear-gradient(180deg, rgba(2,6,8,.16), rgba(2,6,8,.95)), url(${heroImage})` } : undefined}>
        <div className="wrap heroGrid">
          <div className="heroCopy">
            <span className="kicker">Caminhões à venda no Brasil</span>
            <h1>Mais visibilidade para quem vende. Mais opções para quem procura caminhões.</h1>
            <p>Caminhões, implementos e carrocerias com dados claros, fotos organizadas e contato direto pelo WhatsApp.</p>

            <div className="heroActions">
              <Link className="btn primary" href="/anuncios">Ver caminhões</Link>
              <Link className="btn ghost" href="/anunciar">Anunciar caminhão</Link>
            </div>
          </div>

          <aside className="trustCard">
            <strong>Negociação direta</strong>
            <h2>Caminhões reais, anúncios revisados e contato rápido.</h2>
            <p>A plataforma organiza os anúncios para facilitar a vida de quem compra e de quem vende.</p>
          </aside>
        </div>
      </section>

      <form className="wrap quickSearch" action="/anuncios">
        <label>
          <span>Buscar caminhão</span>
          <input name="busca" placeholder="Ex: Scania, Volvo VM, caçamba, bitruck, Xanxerê..." />
        </label>
        <button type="submit">Buscar no estoque</button>
      </form>

      <section className="wrap sectionHead">
        <div>
          <span className="mini">Destaques recentes</span>
          <h2>Alguns caminhões disponíveis</h2>
        </div>
        <Link href="/anuncios">Ver estoque completo</Link>
      </section>

      <section className="wrap highlightGrid">
        {trucks.length > 0 ? trucks.map((truck) => {
          const title = getTitle(truck);
          const cardTitle = getCardTitle(truck);
          const image = getImage(truck);
          const year = truck.ano_modelo || truck.ano_fabricacao || "Ano";
          const configuration = truck.tracao || truck.carroceria || "Configuração";

          return (
            <article className="card" key={truck.id}>
              <Link href={`/anuncios/${truck.id}`} className="photo">
                <span>{truck.carroceria || truck.tracao || "Caminhão"}</span>
                {image ? <img src={image} alt={title} /> : <i>Sem foto</i>}
              </Link>

              <div className="cardBody">
                <Link href={`/anuncios/${truck.id}`} className="cardTitle">{cardTitle}</Link>
                <div className="meta">
                  <b>{year} • {configuration} • {getLocation(truck)}</b>
                </div>
                <strong>{formatMoney(truck.preco)}</strong>
                <div className="cardActions">
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

      <section className="wrap audienceGrid">
        <div className="audienceCard">
          <span className="mini">Para quem compra</span>
          <h2>Encontre caminhões com informação clara.</h2>
          <p>Veja fotos, valor, cidade, configuração e chame direto no WhatsApp para confirmar disponibilidade e negociar.</p>
          <Link href="/anuncios">Procurar caminhões</Link>
        </div>

        <div className="audienceCard">
          <span className="mini">Para quem vende</span>
          <h2>Anuncie com mais organização e alcance.</h2>
          <p>Cadastre dados, fotos, valor e contato. O anúncio passa por revisão antes de aparecer publicamente.</p>
          <Link href="/anunciar">Quero anunciar</Link>
        </div>
      </section>

      <section className="wrap stepsTitle">
        <span className="mini">Processo simples</span>
        <h2>Como funciona</h2>
      </section>

      <section className="wrap steps">
        <div className="step"><b>1</b><strong>Cadastre ou encontre</strong><span>Comprador busca no estoque. Vendedor cria o anúncio.</span></div>
        <div className="step"><b>2</b><strong>Veja dados claros</strong><span>Fotos, valor, cidade, tração, tipo e descrição organizada.</span></div>
        <div className="step"><b>3</b><strong>Negocie no WhatsApp</strong><span>Contato direto para tirar dúvidas, enviar vídeo e fechar negócio.</span></div>
      </section>

      <section className="wrap finalCta">
        <div>
          <span className="mini">Caminhões à venda</span>
          <h2>Veja o estoque completo ou anuncie seu caminhão.</h2>
        </div>
        <div className="heroActions">
          <Link className="btn primary" href="/anuncios">Ver caminhões</Link>
          <Link className="btn ghost" href="/anunciar">Anunciar</Link>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .home-page{--green:#22c55e;--panel:rgba(9,15,17,.78);min-height:100vh;color:#f8fafc;background:radial-gradient(circle at 8% 5%,rgba(34,197,94,.17),transparent 28%),radial-gradient(circle at 82% 12%,rgba(34,197,94,.10),transparent 24%),linear-gradient(135deg,#020506 0%,#06110e 48%,#030608 100%);overflow-x:hidden;padding-bottom:30px}
        .wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}
        .hero{position:relative;margin-top:-90px;min-height:560px;display:flex;align-items:end;background-size:cover;background-position:center;overflow:hidden;border-bottom:1px solid rgba(255,255,255,.08)}
        .hero::before{content:"";position:absolute;inset:110px 24px 54px;border-radius:34px;background:linear-gradient(135deg,rgba(255,255,255,.075),rgba(255,255,255,.025));border:1px solid rgba(255,255,255,.12);box-shadow:0 34px 90px rgba(0,0,0,.34);backdrop-filter:blur(6px);opacity:.88;pointer-events:none}
        .hero::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 18% 32%,rgba(34,197,94,.20),transparent 25%),linear-gradient(120deg,rgba(34,197,94,.16),transparent 28%,rgba(255,255,255,.06) 43%,transparent 58%)}
        .heroGrid{position:relative;z-index:2;padding:165px 0 86px;display:grid;grid-template-columns:minmax(0,760px) minmax(300px,390px);gap:22px;align-items:stretch}
        .heroCopy{position:relative;padding:28px 30px 30px;border-radius:26px;background:linear-gradient(135deg,rgba(3,10,11,.76),rgba(3,10,11,.38));border:1px solid rgba(255,255,255,.10);box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
        .heroCopy::before{content:"";position:absolute;left:0;top:24px;bottom:24px;width:4px;border-radius:999px;background:linear-gradient(180deg,var(--green),rgba(34,197,94,.18))}
        .kicker,.mini{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.30);color:#bbf7d0;font-size:12px;font-weight:950;letter-spacing:.07em;text-transform:uppercase}
        .heroCopy h1{margin:18px 0 14px;max-width:760px;font-size:clamp(38px,5.2vw,72px);line-height:.98;letter-spacing:-.06em;text-wrap:balance}
        .heroCopy p{margin:0;max-width:620px;color:#d7dee8;font-size:18px;line-height:1.55}
        .heroActions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
        .btn{min-height:52px;display:inline-flex;align-items:center;justify-content:center;padding:0 22px;border-radius:10px;border:1px solid rgba(255,255,255,.16);font-weight:950;text-decoration:none;text-transform:uppercase;font-size:13px;letter-spacing:.04em}
        .primary{background:var(--green);color:#03220f;border-color:transparent;box-shadow:0 12px 28px rgba(34,197,94,.22)}
        .ghost{background:rgba(2,6,8,.55);color:white}
        .trustCard{position:relative;overflow:hidden;padding:24px;border-radius:26px;background:linear-gradient(180deg,rgba(8,14,16,.82),rgba(2,6,8,.64));border:1px solid rgba(34,197,94,.28);box-shadow:0 24px 70px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(14px);display:flex;flex-direction:column;justify-content:flex-end;min-height:100%}
        .trustCard::before{content:"";position:absolute;right:-40px;top:-45px;width:155px;height:155px;border-radius:999px;background:radial-gradient(circle,rgba(34,197,94,.34),transparent 62%)}
        .trustCard::after{content:"✓";position:absolute;right:20px;top:18px;width:44px;height:44px;border-radius:16px;background:rgba(34,197,94,.14);border:1px solid rgba(34,197,94,.28);display:grid;place-items:center;color:#86efac;font-weight:950;font-size:24px}
        .trustCard strong{display:inline-flex;align-self:flex-start;margin-bottom:12px;color:#86efac;font-size:12px;font-weight:950;text-transform:uppercase;letter-spacing:.08em}
        .trustCard h2{margin:0 0 10px;font-size:clamp(24px,2.3vw,32px);line-height:1.04;letter-spacing:-.04em;text-wrap:balance}
        .trustCard p{margin:0;color:#cbd5e1;line-height:1.55}
        .quickSearch{position:relative;z-index:5;margin:-38px auto 38px;padding:14px;border-radius:18px;background:linear-gradient(180deg,rgba(14,20,22,.95),rgba(9,14,16,.90));border:1px solid rgba(255,255,255,.12);box-shadow:0 22px 54px rgba(0,0,0,.30);display:grid;grid-template-columns:1fr 190px;gap:12px}
        .quickSearch label{display:grid;gap:6px}
        .quickSearch span{color:#9ca3af;font-size:11px;font-weight:950;letter-spacing:.08em;text-transform:uppercase}
        .quickSearch input{min-height:54px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);outline:0;color:white;padding:0 16px;font-size:15px;font-weight:850}
        .quickSearch button{border:0;border-radius:12px;background:var(--green);color:#042913;font-weight:950;cursor:pointer;text-transform:uppercase}
        .sectionHead{display:flex;align-items:end;justify-content:space-between;gap:18px;margin:22px auto 18px}
        .sectionHead h2{margin:10px 0 0;font-size:clamp(28px,3vw,42px);letter-spacing:-.045em}
        .sectionHead a{min-height:44px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.055);color:white;padding:0 14px;display:inline-flex;align-items:center;text-decoration:none;font-weight:900}
        .highlightGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:36px}
        .card{overflow:hidden;border-radius:14px;background:linear-gradient(180deg,rgba(16,23,26,.94),rgba(8,13,15,.94));border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 45px rgba(0,0,0,.22)}
        .photo{position:relative;aspect-ratio:1.45/1;display:block;overflow:hidden;background:#111827;color:#94a3b8;text-decoration:none}
        .photo img{width:100%;height:100%;object-fit:cover;display:block}
        .photo i{height:100%;display:grid;place-items:center;font-style:normal;font-weight:900}
        .photo span{position:absolute;left:10px;top:10px;z-index:2;min-height:24px;padding:0 9px;border-radius:999px;background:rgba(34,197,94,.92);color:#052e16;font-size:10px;font-weight:950;text-transform:uppercase}
        .cardBody{padding:14px}
        .cardTitle{display:block;min-height:42px;color:white;text-decoration:none;font-size:17px;line-height:1.18;font-weight:950}
        .meta{margin:10px 0 12px}
        .meta b{display:block;color:#cbd5e1;font-size:12px;font-weight:800;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .cardBody strong{display:block;color:var(--green);font-size:24px;margin-bottom:12px}
        .cardActions{display:grid;grid-template-columns:1fr auto;gap:8px}
        .cardActions a{min-height:44px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;font-weight:950}
        .cardActions a:first-child{background:rgba(255,255,255,.08);color:white;border:1px solid rgba(255,255,255,.12)}
        .cardActions a:last-child{background:var(--green);color:#052e16;font-size:12px;padding:0 12px;text-transform:uppercase;letter-spacing:.03em}
        .empty{grid-column:1/-1;padding:28px;border-radius:16px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.10)}
        .audienceGrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
        .audienceCard,.finalCta{padding:clamp(22px,3vw,34px);border-radius:18px;background:linear-gradient(135deg,rgba(34,197,94,.12),rgba(255,255,255,.045));border:1px solid rgba(34,197,94,.20)}
        .audienceCard h2,.finalCta h2{margin:12px 0 10px;font-size:clamp(28px,3.6vw,44px);line-height:1.03;letter-spacing:-.045em}
        .audienceCard p{margin:0 0 18px;color:#d6dee8;line-height:1.6;font-size:17px}
        .audienceCard a{min-height:46px;padding:0 16px;border-radius:10px;background:var(--green);color:#052e16;text-decoration:none;font-weight:950;display:inline-flex;align-items:center}
        .stepsTitle{margin:8px auto 14px}
        .stepsTitle h2{margin:10px 0 0;font-size:clamp(28px,3vw,42px);letter-spacing:-.045em}
        .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px}
        .step{padding:20px;border-radius:16px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.10);display:grid;gap:8px}
        .step b{width:34px;height:34px;border-radius:999px;background:var(--green);color:#052e16;display:grid;place-items:center}
        .step strong{font-size:18px}
        .step span{color:#cbd5e1;line-height:1.5}
        .finalCta{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:34px}
        .finalCta .heroActions{margin-top:0}
        @media(max-width:1100px){.heroGrid{grid-template-columns:1fr}.trustCard{max-width:520px}.highlightGrid{grid-template-columns:repeat(2,1fr)}.steps{grid-template-columns:1fr}.audienceGrid{grid-template-columns:1fr}.finalCta{display:block}.finalCta .heroActions{margin-top:18px}}
        @media(max-width:640px){.wrap{width:calc(100vw - 22px)}.hero{margin-top:-152px;min-height:650px}.hero::before{inset:178px 10px 34px;border-radius:24px}.heroGrid{padding:240px 0 52px;gap:14px}.heroCopy{padding:22px 18px 20px;border-radius:22px}.heroCopy h1{font-size:38px}.heroCopy p{font-size:15px}.heroActions{display:grid;grid-template-columns:1fr}.btn{width:100%}.trustCard{padding:20px;border-radius:22px}.trustCard::after{right:14px;top:14px}.quickSearch{grid-template-columns:1fr;margin-top:-26px}.quickSearch button{min-height:52px}.sectionHead{display:block}.sectionHead a{margin-top:14px}.highlightGrid{grid-template-columns:1fr}.photo{aspect-ratio:1.35/1}}
      `}</style>
    </main>
  );
}
