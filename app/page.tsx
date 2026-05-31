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
    .limit(12);

  const trucks = (data || []) as Truck[];
  const featured = trucks[0];
  const featuredImage = featured ? getImage(featured) : "";

  return (
    <main className="market-home">
      <PublicHeader />

      <section className="wrap hero-market">
        <div className="hero-copy">
          <span>Anúncios</span>
          <h1>Caminhões à venda</h1>
          <p>Veja fotos, valor, cidade e chame direto no WhatsApp.</p>
          <div className="hero-actions">
            <Link className="btn primary" href="/anuncios">Ver anúncios</Link>
            <Link className="btn ghost" href="/anunciar">Anunciar</Link>
          </div>
        </div>

        {featured ? (
          <Link className="hero-photo" href={`/anuncios/${featured.id}`}>
            {featuredImage ? <img src={featuredImage} alt={getTitle(featured)} /> : <b>Sem foto</b>}
            <div>
              <strong>{getCardTitle(featured)}</strong>
              <small>{featured.ano_modelo || featured.ano_fabricacao || "Ano"} • {featured.tracao || featured.carroceria || "Configuração"} • {getLocation(featured)}</small>
              <em>{formatMoney(featured.preco)}</em>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="wrap market-shortcuts">
        <Link href="/anuncios">Caminhões</Link>
        <Link href="/anuncios?perfil=Implementos">Implementos</Link>
        <Link href="/anunciar">Anunciar</Link>
      </section>

      <section className="wrap stock-head">
        <div>
          <span>Anúncios</span>
          <h2>Caminhões disponíveis</h2>
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
                {image ? <img src={image} alt={title} /> : <span>Sem foto</span>}
              </Link>
              <div className="card-info">
                <Link className="title" href={`/anuncios/${truck.id}`}>{getCardTitle(truck)}</Link>
                <p>{year} • {config} • {getLocation(truck)}</p>
                <strong>{formatMoney(truck.preco)}</strong>
                <div className="card-actions">
                  <Link href={`/anuncios/${truck.id}`}>Detalhes</Link>
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
        .market-home{min-height:100vh;background:var(--site-bg,#06100b);color:var(--site-text,#eefaf3);padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}.hero-market{display:grid;grid-template-columns:.85fr 1.15fr;gap:18px;margin-top:10px}.hero-copy,.hero-photo,.truck-card,.market-shortcuts a{border:1px solid var(--site-line,rgba(255,255,255,.12));background:var(--site-surface,rgba(11,23,17,.82));box-shadow:var(--site-shadow-soft,0 16px 48px rgba(0,0,0,.22));border-radius:24px}.hero-copy{padding:28px;display:flex;flex-direction:column;justify-content:center;min-height:300px}.hero-copy span,.stock-head span{color:var(--site-green,#22d37d);font-size:12px;font-weight:950;text-transform:uppercase;letter-spacing:.08em}.hero-copy h1{margin:10px 0 8px;font-size:clamp(38px,5vw,66px);line-height:.95;letter-spacing:-.06em}.hero-copy p{margin:0;color:var(--site-muted,#9fb4aa);font-size:17px;font-weight:760}.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}.hero-photo{overflow:hidden;text-decoration:none;color:var(--site-text);display:grid;grid-template-rows:minmax(260px,1fr) auto}.hero-photo img{width:100%;height:100%;object-fit:cover;object-position:center center;background:#07110c;display:block}.hero-photo b{display:grid;place-items:center;min-height:260px;color:var(--site-muted)}.hero-photo div{padding:16px}.hero-photo strong{display:block;font-size:24px;line-height:1.05}.hero-photo small{display:block;margin:7px 0;color:var(--site-muted);font-weight:800}.hero-photo em{font-style:normal;color:var(--site-green);font-size:24px;font-weight:950}.market-shortcuts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}.market-shortcuts a{min-height:68px;display:flex;align-items:center;justify-content:center;text-decoration:none;color:var(--site-text);font-weight:950;font-size:18px}.stock-head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin:28px auto 14px}.stock-head h2{margin:8px 0 0;font-size:clamp(28px,3vw,42px);line-height:1;letter-spacing:-.045em}.stock-head a{min-height:42px;border-radius:999px;padding:0 16px;display:inline-flex;align-items:center;text-decoration:none;color:var(--site-text);background:var(--site-surface);border:1px solid var(--site-line);font-weight:900}.truck-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.truck-card{overflow:hidden}.photo-box{height:260px;background:#07110c;display:grid;place-items:center;text-decoration:none;color:var(--site-muted);overflow:hidden}.photo-box img{width:100%;height:100%;object-fit:cover;object-position:center center;display:block}.card-info{padding:15px}.title{display:block;color:var(--site-text);text-decoration:none;font-size:19px;font-weight:950;line-height:1.15}.card-info p{margin:8px 0 10px;color:var(--site-muted);font-size:13px;font-weight:800}.card-info strong{display:block;color:var(--site-green);font-size:21px;margin-bottom:12px}.card-actions{display:grid;grid-template-columns:1fr auto;gap:10px}.card-actions a{min-height:40px;border-radius:999px;display:flex;align-items:center;justify-content:center;padding:0 14px;text-decoration:none;font-size:12px;font-weight:950}.card-actions a:first-child{background:var(--site-surface-2,rgba(255,255,255,.06));color:var(--site-text);border:1px solid var(--site-line)}.card-actions a:last-child{background:#19c56f;color:#052e16}.empty{grid-column:1/-1;padding:28px;border-radius:20px;background:var(--site-surface);border:1px solid var(--site-line);text-align:center;color:var(--site-muted);font-weight:900}@media(max-width:980px){.hero-market,.truck-grid{grid-template-columns:1fr 1fr}.hero-copy{min-height:230px}.hero-photo{grid-column:1/-1}.photo-box{height:240px}}@media(max-width:640px){.wrap{width:min(100% - 22px,1240px)}.hero-market,.truck-grid,.market-shortcuts{grid-template-columns:1fr}.hero-copy{min-height:auto;padding:22px}.hero-actions .btn{width:100%;min-height:48px}.stock-head{align-items:flex-start;flex-direction:column}.stock-head a{width:100%;justify-content:center}.photo-box{height:225px}.hero-photo{grid-template-rows:240px auto}}
      `}</style>
    </main>
  );
}
