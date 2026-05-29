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

type PageProps = {
  searchParams?: Promise<{ marca?: string; modelo?: string; tracao?: string; busca?: string }>;
};

function clean(value?: string) {
  return String(value || "").trim();
}

function formatMoney(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
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

export default async function AnunciosPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const marca = clean(params.marca);
  const modelo = clean(params.modelo);
  const tracao = clean(params.tracao);
  const busca = clean(params.busca);

  const supabase = await createClient();

  let query = supabase
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
    .order("created_at", { ascending: false });

  if (marca) query = query.ilike("marca", `%${marca}%`);
  if (modelo) query = query.or(`modelo.ilike.%${modelo}%,titulo.ilike.%${modelo}%`);
  if (tracao) query = query.ilike("tracao", `%${tracao}%`);
  if (busca) query = query.ilike("titulo", `%${busca}%`);

  const { data } = await query;
  const trucks = (data || []) as Truck[];
  const temFiltro = Boolean(marca || modelo || tracao || busca);

  return (
    <main className="page">
      <PublicHeader />

      <section className="hero">
        <div className="wrap heroContent">
          <h1>Caminhões disponíveis para <span>negociação.</span></h1>
          <p>Filtre por marca, modelo ou tração e fale direto pelo WhatsApp.</p>
        </div>
      </section>

      <form className="wrap filters" action="/anuncios">
        <div className="field"><label>Marca</label><select name="marca" defaultValue={marca}><option value="">Todas as marcas</option><option>Mercedes-Benz</option><option>Volkswagen</option><option>Volvo</option><option>Scania</option><option>Ford</option><option>Iveco</option><option>DAF</option></select></div>
        <div className="field"><label>Modelo</label><select name="modelo" defaultValue={modelo}><option value="">Todos os modelos</option><option>3/4</option><option>Toco</option><option>Truck</option><option value="Bi Truck">Bi Truck</option><option>Cavalo mecânico</option></select></div>
        <div className="field"><label>Tração</label><select name="tracao" defaultValue={tracao}><option value="">Todas as trações</option><option>4x2</option><option>6x2</option><option>6x4</option><option>8x2</option><option>8x4</option><option>Truck</option><option>Bitruck</option><option>Traçado</option></select></div>
        <div className="search"><input name="busca" defaultValue={busca} placeholder="Buscar caminhão..." /><button type="submit">⌕</button></div>
        {temFiltro && <Link href="/anuncios" className="clear">Limpar</Link>}
      </form>

      <section className="wrap titleRow">
        <h2><span>▱</span> {temFiltro ? "Resultado da pesquisa" : "Todos os caminhões"} <small>{trucks.length} encontrados</small></h2>
      </section>

      <section className="wrap grid">
        {trucks.length > 0 ? trucks.map((truck) => {
          const title = getTitle(truck);
          const image = getImage(truck);

          return (
            <article className="card" key={truck.id}>
              <Link href={`/anuncios/${truck.id}`} className="photo">
                <em>{truck.carroceria || "Caminhão"}</em>
                <b>♡</b>
                {image ? <img src={image} alt={title} /> : <i>Sem foto</i>}
              </Link>
              <div className="body">
                <Link href={`/anuncios/${truck.id}`} className="truckTitle">{title}</Link>
                <div className="meta"><span>▣ {truck.ano_modelo || truck.ano_fabricacao || "Ano"}</span><span>⚙ {truck.tracao || "Tração"}</span><span>⌖ {truck.cidade || "Cidade"}{truck.estado ? ` - ${truck.estado}` : ""}</span></div>
                <strong>{formatMoney(truck.preco)}</strong>
                <small>À vista / negociação direta</small>
                <div className="actions"><Link href={`/anuncios/${truck.id}`}>◉ Ver detalhes</Link>{truck.whatsapp && <a href={getWhatsappLink(truck)} target="_blank" rel="noreferrer">☘</a>}</div>
              </div>
            </article>
          );
        }) : (
          <div className="empty"><h3>Nenhum caminhão encontrado.</h3><p>Limpe os filtros ou tente outra busca.</p><Link href="/anuncios">Ver caminhões</Link></div>
        )}
      </section>

      <SiteFooter />

      <style>{`
        .page{--green:#22c55e;min-height:100vh;color:#f8fafc;background:radial-gradient(circle at 8% 5%,rgba(34,197,94,.17),transparent 28%),radial-gradient(circle at 82% 12%,rgba(34,197,94,.10),transparent 24%),linear-gradient(135deg,#020506 0%,#06110e 48%,#030608 100%);overflow-x:hidden;padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}.hero{margin-top:-90px;min-height:360px;display:flex;align-items:end;background:linear-gradient(90deg,rgba(2,6,8,.96),rgba(2,6,8,.72) 45%,rgba(2,6,8,.25));border-bottom:1px solid rgba(255,255,255,.08)}.heroContent{padding:150px 0 62px}.kicker{display:inline-flex;align-items:center;min-height:34px;padding:0 13px;border-radius:999px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.32);color:#bbf7d0;font-size:12px;font-weight:950;letter-spacing:.07em;text-transform:uppercase}h1{margin:18px 0 12px;font-size:clamp(38px,5vw,64px);line-height:1.02;letter-spacing:-.055em;max-width:760px}h1 span,.titleRow h2 span{color:var(--green)}.hero p{margin:0;max-width:620px;color:#d7dee8;font-size:17px;line-height:1.55}.filters{position:relative;z-index:5;margin:-38px auto 34px;padding:14px;border-radius:16px;display:grid;grid-template-columns:1fr 1fr 1fr minmax(220px,1.3fr) auto;background:linear-gradient(180deg,rgba(14,20,22,.92),rgba(9,14,16,.86));border:1px solid rgba(255,255,255,.12);box-shadow:0 22px 54px rgba(0,0,0,.30);backdrop-filter:blur(16px);overflow:hidden}.field{min-height:68px;display:grid;align-content:center;gap:6px;padding:0 18px;border-right:1px solid rgba(255,255,255,.09)}.field label{color:#9ca3af;font-size:11px;font-weight:950;letter-spacing:.08em;text-transform:uppercase}.field select,.field input,.search input{width:100%;border:0;outline:0;background:transparent;color:#f8fafc;font-size:14px;font-weight:850}.field option{background:#0b1114;color:white}.search{display:grid;grid-template-columns:1fr 58px;align-items:center;padding-left:18px}.search input{min-height:54px;padding:0 16px;border-radius:8px 0 0 8px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.11);border-right:0}.search button{min-height:54px;border:0;border-radius:0 8px 8px 0;background:var(--green);color:#042913;font-size:22px;cursor:pointer}.clear{min-height:54px;padding:0 14px;display:inline-flex;align-items:center;justify-content:center;color:#fecaca;text-decoration:none;font-weight:950}.titleRow{margin:22px auto 18px}.titleRow h2{margin:0;display:flex;flex-wrap:wrap;align-items:center;gap:12px;font-size:clamp(26px,3vw,36px);letter-spacing:-.035em}.titleRow small{min-height:28px;padding:0 13px;border-radius:999px;background:rgba(34,197,94,.13);border:1px solid rgba(34,197,94,.28);color:#86efac;font-size:12px;display:inline-flex;align-items:center}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:28px}.card{overflow:hidden;border-radius:10px;background:linear-gradient(180deg,rgba(16,23,26,.94),rgba(8,13,15,.94));border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 45px rgba(0,0,0,.22)}.photo{position:relative;aspect-ratio:1.55/1;overflow:hidden;background:#111827;display:block;color:#94a3b8;text-decoration:none}.photo img{width:100%;height:100%;object-fit:cover;display:block}.photo i{height:100%;display:grid;place-items:center;font-style:normal;font-weight:900}.photo em{position:absolute;left:10px;top:10px;z-index:2;min-height:24px;padding:0 9px;border-radius:5px;background:rgba(34,197,94,.92);color:#052e16;font-size:10px;font-weight:950;text-transform:uppercase;font-style:normal}.photo b{position:absolute;right:10px;top:10px;z-index:2;width:31px;height:31px;border-radius:999px;display:grid;place-items:center;background:rgba(2,6,8,.42);border:1px solid rgba(255,255,255,.14);color:white}.body{padding:14px}.truckTitle{display:block;min-height:42px;color:white;text-decoration:none;font-size:17px;line-height:1.18;font-weight:950}.meta{display:flex;flex-wrap:wrap;gap:9px 12px;margin:10px 0 12px;color:#cbd5e1;font-size:12px;font-weight:800}.body strong{display:block;margin-bottom:4px;color:var(--green);font-size:22px}.body small{color:#aeb7c3;font-size:12px;font-weight:800}.actions{display:grid;grid-template-columns:1fr 44px;gap:10px;margin-top:13px}.actions a{min-height:42px;display:inline-flex;align-items:center;justify-content:center;border-radius:7px;font-size:12px;font-weight:950;text-transform:uppercase;text-decoration:none}.actions a:first-child{background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.12);color:white}.actions a:last-child{background:var(--green);color:#042913}.empty{grid-column:1/-1;padding:28px;border-radius:16px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.10);color:#dbeafe}.empty a{color:#86efac;font-weight:950}@media(max-width:1120px){.filters{grid-template-columns:repeat(2,minmax(0,1fr))}.search{grid-column:1/-1;padding:10px 0 0}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:640px){.wrap{width:calc(100vw - 22px)}.hero{margin-top:-152px;min-height:440px}.heroContent{padding:235px 0 44px}h1{font-size:38px}.filters{margin-top:-22px;grid-template-columns:1fr}.field{border-right:0;border-bottom:1px solid rgba(255,255,255,.08)}.search{grid-template-columns:1fr 54px}.grid{grid-template-columns:1fr}}
      `}</style>
    </main>
  );
}
