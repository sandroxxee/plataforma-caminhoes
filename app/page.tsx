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
    .limit(8);

  const trucks = (data || []) as Truck[];
  const heroImage = trucks[0] ? getImage(trucks[0]) : "";
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

      <section className="wrap visualBanner" style={heroImage ? { backgroundImage: `linear-gradient(90deg, rgba(2,6,8,.95), rgba(2,6,8,.78) 42%, rgba(2,6,8,.25)), linear-gradient(180deg, rgba(2,6,8,.08), rgba(2,6,8,.88)), url(${heroImage})` } : undefined}>
        <div className="bannerContent">
          <span className="mini">Marketplace de caminhões</span>
          <h1>Anúncios recentes em um só lugar.</h1>
          <p>Arte, imagem, destaque e anúncio organizado para quem compra ou vende caminhões, implementos e carrocerias.</p>
          <div className="heroActions">
            <Link className="btn primary" href="/anuncios">Ver caminhões</Link>
            <Link className="btn ghost" href="/anuncios?perfil=Implementos">Implementos</Link>
            <Link className="btn ghost" href="/anunciar">Anunciar</Link>
          </div>
        </div>
      </section>

      <section className="wrap marketArts" aria-label="Áreas do marketplace">
        <Link className="marketArt large" href="/anuncios">
          <span>Caminhões</span>
          <strong>Estoque atualizado</strong>
          <small>Cavalos, trucks, tocos e bitrucks</small>
        </Link>
        <Link className="marketArt" href="/anuncios?perfil=Implementos">
          <span>Implementos</span>
          <strong>Carretas e carrocerias</strong>
          <small>Baú, tanque, prancha, caçamba e mais</small>
        </Link>
        <Link className="marketArt" href="/anunciar">
          <span>Anunciar</span>
          <strong>Venda com apresentação</strong>
          <small>Fotos, dados e contato organizados</small>
        </Link>
      </section>

      <section className="wrap sectionHead">
        <div>
          <span className="mini">Destaques</span>
          <h2>Anúncios em destaque</h2>
        </div>
        <Link href="/anuncios">Ver estoque completo</Link>
      </section>

      <section className="wrap sliderWrap">
        <HomeFeaturedSlider trucks={featuredTrucks} />
      </section>

      <section className="wrap sectionHead recentHead">
        <div>
          <span className="mini">Recentes</span>
          <h2>Últimos anúncios</h2>
        </div>
        <Link href="/anuncios">Ver todos</Link>
      </section>

      <section className="wrap highlightGrid">
        {trucks.length > 0 ? trucks.slice(0, 4).map((truck) => {
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
        .home-page{--green:#22c55e;min-height:100vh;color:#f8fafc;background:radial-gradient(circle at 8% 5%,rgba(34,197,94,.17),transparent 28%),radial-gradient(circle at 82% 12%,rgba(34,197,94,.10),transparent 24%),linear-gradient(135deg,#020506 0%,#06110e 48%,#030608 100%);overflow-x:hidden;padding-bottom:30px}
        .wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}
        .kicker,.mini{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.30);color:#bbf7d0;font-size:12px;font-weight:950;letter-spacing:.07em;text-transform:uppercase}
        .visualBanner{position:relative;overflow:hidden;margin-top:18px;min-height:360px;border-radius:28px;background:linear-gradient(135deg,rgba(10,18,20,.96),rgba(4,8,10,.88));background-size:cover;background-position:center;border:1px solid rgba(255,255,255,.13);box-shadow:0 28px 80px rgba(0,0,0,.34)}
        .visualBanner::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 18% 25%,rgba(34,197,94,.20),transparent 28%),linear-gradient(120deg,rgba(34,197,94,.13),transparent 35%,rgba(255,255,255,.06) 52%,transparent 70%);pointer-events:none}
        .visualBanner::after{content:"";position:absolute;right:28px;bottom:24px;width:170px;height:170px;border-radius:999px;border:1px solid rgba(34,197,94,.18);box-shadow:inset 0 0 50px rgba(34,197,94,.13);pointer-events:none}
        .bannerContent{position:relative;z-index:2;max-width:760px;padding:clamp(28px,5vw,58px)}
        .bannerContent h1{margin:18px 0 12px;font-size:clamp(38px,5.4vw,72px);line-height:.98;letter-spacing:-.06em;text-wrap:balance}
        .bannerContent p{margin:0;max-width:620px;color:#d7dee8;font-size:18px;line-height:1.55}
        .heroActions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
        .btn{min-height:52px;display:inline-flex;align-items:center;justify-content:center;padding:0 22px;border-radius:10px;border:1px solid rgba(255,255,255,.16);font-weight:950;text-decoration:none;text-transform:uppercase;font-size:13px;letter-spacing:.04em}
        .primary{background:var(--green);color:#03220f;border-color:transparent;box-shadow:0 12px 28px rgba(34,197,94,.22)}
        .ghost{background:rgba(2,6,8,.55);color:white}
        .marketArts{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:14px;margin-top:16px;margin-bottom:20px}
        .marketArt{position:relative;overflow:hidden;min-height:150px;padding:22px;border-radius:20px;background:linear-gradient(135deg,rgba(16,23,26,.95),rgba(7,13,14,.92));border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 45px rgba(0,0,0,.22);display:flex;flex-direction:column;justify-content:flex-end;color:white;text-decoration:none}
        .marketArt::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 18% 15%,rgba(34,197,94,.20),transparent 30%),linear-gradient(135deg,rgba(255,255,255,.08),transparent 55%);pointer-events:none}
        .marketArt.large{min-height:180px;background-image:linear-gradient(135deg,rgba(34,197,94,.18),rgba(255,255,255,.04))}
        .marketArt span{position:relative;color:#86efac;font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}
        .marketArt strong{position:relative;font-size:clamp(24px,2.6vw,36px);line-height:1;letter-spacing:-.04em}
        .marketArt small{position:relative;margin-top:8px;color:#cbd5e1;font-size:14px;font-weight:800}
        .sectionHead{display:flex;align-items:end;justify-content:space-between;gap:18px;margin:28px auto 18px}
        .sectionHead h2{margin:10px 0 0;font-size:clamp(28px,3vw,42px);letter-spacing:-.045em}
        .sectionHead a{min-height:44px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.055);color:white;padding:0 14px;display:inline-flex;align-items:center;text-decoration:none;font-weight:900}
        .sliderWrap{margin-bottom:34px}
        .recentHead{margin-top:16px}
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
        .stepsTitle{margin:8px auto 14px}
        .stepsTitle h2{margin:10px 0 0;font-size:clamp(28px,3vw,42px);letter-spacing:-.045em}
        .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px}
        .step{padding:20px;border-radius:16px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.10);display:grid;gap:8px}
        .step b{width:34px;height:34px;border-radius:999px;background:var(--green);color:#052e16;display:grid;place-items:center}
        .step strong{font-size:18px}
        .step span{color:#cbd5e1;line-height:1.5}
        .finalCta{padding:clamp(22px,3vw,34px);border-radius:18px;background:linear-gradient(135deg,rgba(34,197,94,.12),rgba(255,255,255,.045));border:1px solid rgba(34,197,94,.20);display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:34px}
        .finalCta h2{margin:12px 0 10px;font-size:clamp(28px,3.6vw,44px);line-height:1.03;letter-spacing:-.045em}
        .finalCta .heroActions{margin-top:0}
        @media(max-width:1100px){.marketArts{grid-template-columns:1fr}.highlightGrid{grid-template-columns:repeat(2,1fr)}.steps{grid-template-columns:1fr}.finalCta{display:block}.finalCta .heroActions{margin-top:18px}}
        @media(max-width:640px){.wrap{width:calc(100vw - 22px)}.visualBanner{margin-top:10px;min-height:370px;border-radius:22px;background-position:center}.visualBanner::after{display:none}.bannerContent{padding:26px 18px}.bannerContent h1{font-size:40px}.bannerContent p{font-size:15px}.heroActions{display:grid;grid-template-columns:1fr}.btn{width:100%}.marketArts{gap:10px}.marketArt,.marketArt.large{min-height:140px;padding:18px}.sectionHead{display:block}.sectionHead a{margin-top:14px}.highlightGrid{grid-template-columns:1fr}.photo{aspect-ratio:1.35/1}}
      `}</style>
    </main>
  );
}
