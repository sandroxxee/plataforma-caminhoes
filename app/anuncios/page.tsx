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
  searchParams?: Promise<{
    marca?: string;
    modelo?: string;
    tracao?: string;
    busca?: string;
  }>;
};

function clean(value?: string) {
  return String(value || "").trim();
}

function normalize(value: string | number | null | undefined) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function formatMoney(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
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

function getWhatsappLink(truck: Truck) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(`Olá, tenho interesse no caminhão ${getTitle(truck)}.`);
  return phone ? `https://wa.me/${phone}?text=${text}` : `/anuncios/${truck.id}`;
}

function searchableText(truck: Truck) {
  return normalize([
    truck.titulo,
    truck.marca,
    truck.modelo,
    truck.ano_modelo,
    truck.ano_fabricacao,
    truck.cidade,
    truck.estado,
    truck.carroceria,
    truck.tracao,
  ].filter(Boolean).join(" "));
}

export default async function AnunciosPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const marca = clean(params.marca);
  const modelo = clean(params.modelo);
  const tracao = clean(params.tracao);
  const busca = clean(params.busca);

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
    .order("created_at", { ascending: false });

  const allTrucks = (data || []) as Truck[];
  const marcaFiltro = normalize(marca);
  const modeloFiltro = normalize(modelo);
  const tracaoFiltro = normalize(tracao);
  const buscaFiltro = normalize(busca);

  const trucks = allTrucks.filter((truck) => {
    const texto = searchableText(truck);
    const marcaOk = !marcaFiltro || normalize(truck.marca).includes(marcaFiltro);
    const modeloOk = !modeloFiltro || normalize(`${truck.modelo || ""} ${truck.titulo || ""}`).includes(modeloFiltro);
    const tracaoOk = !tracaoFiltro || normalize(truck.tracao).includes(tracaoFiltro);
    const buscaOk = !buscaFiltro || buscaFiltro.split(" ").every((word) => texto.includes(word));
    return marcaOk && modeloOk && tracaoOk && buscaOk;
  });

  const temFiltro = Boolean(marca || modelo || tracao || busca);

  return (
    <main className="page">
      <PublicHeader />

      <section className="hero">
        <div className="wrap heroContent">
          <h1>Caminhões disponíveis para <span>negociação.</span></h1>
          <p>Busque por marca, modelo ou tração. Menos filtro, mais rapidez para achar o caminhão certo.</p>
        </div>
      </section>

      <form className="wrap filters" action="/anuncios">
        <div className="search">
          <label>Buscar caminhão</label>
          <div>
            <input name="busca" defaultValue={busca} placeholder="Ex: Volvo VM, 24.280, caçamba, Xanxerê..." />
            <button type="submit">Buscar</button>
          </div>
        </div>

        <div className="field">
          <label>Marca</label>
          <select name="marca" defaultValue={marca}>
            <option value="">Todas</option>
            <option>Mercedes-Benz</option>
            <option>Volkswagen</option>
            <option>Volvo</option>
            <option>Scania</option>
            <option>Ford</option>
            <option>Iveco</option>
            <option>DAF</option>
          </select>
        </div>

        <div className="field">
          <label>Modelo</label>
          <input name="modelo" defaultValue={modelo} placeholder="Ex: R440, FH, 24.280" />
        </div>

        <div className="field">
          <label>Tração</label>
          <select name="tracao" defaultValue={tracao}>
            <option value="">Todas</option>
            <option>4x2</option>
            <option>6x2</option>
            <option>6x4</option>
            <option>8x2</option>
            <option>8x4</option>
            <option>Truck</option>
            <option>Bitruck</option>
            <option>Traçado</option>
          </select>
        </div>

        <div className="filterActions">
          <button type="submit">Filtrar</button>
          {temFiltro && <Link href="/anuncios">Limpar</Link>}
        </div>
      </form>

      <section className="wrap titleRow">
        <h2><span>▱</span> {temFiltro ? "Resultado da busca" : "Caminhões anunciados"}</h2>
      </section>

      <section className="wrap grid">
        {trucks.length > 0 ? trucks.map((truck) => {
          const title = getTitle(truck);
          const image = getImage(truck);

          return (
            <article className="card" key={truck.id}>
              <Link href={`/anuncios/${truck.id}`} className="photo">
                <em>{truck.tracao || truck.carroceria || "Caminhão"}</em>
                {image ? <img src={image} alt={title} /> : <i>Sem foto</i>}
              </Link>

              <div className="body">
                <Link href={`/anuncios/${truck.id}`} className="truckTitle">{title}</Link>
                <div className="meta">
                  <span>{truck.ano_modelo || truck.ano_fabricacao || "Ano"}</span>
                  <span>{truck.tracao || "Tração"}</span>
                  <span>{truck.cidade || "Cidade"}{truck.estado ? ` - ${truck.estado}` : ""}</span>
                </div>
                <strong>{formatMoney(truck.preco)}</strong>
                <small>Contato direto pelo WhatsApp</small>
                <div className="actions">
                  <Link href={`/anuncios/${truck.id}`}>Ver detalhes</Link>
                  {truck.whatsapp && <a href={getWhatsappLink(truck)} target="_blank" rel="noreferrer">WhatsApp</a>}
                </div>
              </div>
            </article>
          );
        }) : (
          <div className="empty">
            <h3>Nenhum caminhão encontrado.</h3>
            <p>Tente buscar só por uma palavra, como marca, modelo, cidade ou tração.</p>
            <Link href="/anuncios">Limpar busca</Link>
          </div>
        )}
      </section>

      <SiteFooter />

      <style>{`
        .page{--green:#22c55e;min-height:100vh;color:#f8fafc;background:radial-gradient(circle at 8% 5%,rgba(34,197,94,.17),transparent 28%),radial-gradient(circle at 82% 12%,rgba(34,197,94,.10),transparent 24%),linear-gradient(135deg,#020506 0%,#06110e 48%,#030608 100%);overflow-x:hidden;padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}.hero{margin-top:-90px;min-height:340px;display:flex;align-items:end;background:linear-gradient(90deg,rgba(2,6,8,.96),rgba(2,6,8,.72) 45%,rgba(2,6,8,.25));border-bottom:1px solid rgba(255,255,255,.08)}.heroContent{padding:145px 0 56px}h1{margin:18px 0 12px;font-size:clamp(36px,5vw,62px);line-height:1.02;letter-spacing:-.055em;max-width:760px}h1 span,.titleRow h2 span{color:var(--green)}.hero p{margin:0;max-width:660px;color:#d7dee8;font-size:17px;line-height:1.55}.filters{position:relative;z-index:5;margin:-34px auto 34px;padding:14px;border-radius:18px;display:grid;grid-template-columns:minmax(280px,1.6fr) minmax(130px,.7fr) minmax(150px,.8fr) minmax(130px,.7fr) auto;gap:10px;background:linear-gradient(180deg,rgba(14,20,22,.94),rgba(9,14,16,.9));border:1px solid rgba(255,255,255,.12);box-shadow:0 22px 54px rgba(0,0,0,.30);backdrop-filter:blur(16px)}.field,.search{display:grid;gap:6px}.field label,.search label{color:#9ca3af;font-size:11px;font-weight:950;letter-spacing:.08em;text-transform:uppercase}.field select,.field input,.search input{width:100%;min-height:52px;border-radius:12px;border:1px solid rgba(255,255,255,.12);outline:0;background:rgba(255,255,255,.06);color:#f8fafc;font-size:14px;font-weight:850;padding:0 13px;box-sizing:border-box}.field option{background:#0b1114;color:white}.search div{display:grid;grid-template-columns:1fr 108px}.search input{border-radius:12px 0 0 12px;border-right:0}.search button,.filterActions button{min-height:52px;border:0;border-radius:0 12px 12px 0;background:var(--green);color:#042913;font-weight:950;cursor:pointer}.filterActions{display:grid;gap:8px;align-content:end}.filterActions button{border-radius:12px;padding:0 18px}.filterActions a{min-height:42px;padding:0 12px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;color:#fecaca;text-decoration:none;font-weight:950;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.18)}.titleRow{margin:22px auto 18px}.titleRow h2{margin:0;display:flex;flex-wrap:wrap;align-items:center;gap:12px;font-size:clamp(26px,3vw,36px);letter-spacing:-.035em}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:28px}.card{overflow:hidden;border-radius:14px;background:linear-gradient(180deg,rgba(16,23,26,.94),rgba(8,13,15,.94));border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 45px rgba(0,0,0,.22)}.photo{position:relative;aspect-ratio:1.45/1;overflow:hidden;background:#111827;display:block;color:#94a3b8;text-decoration:none}.photo img{width:100%;height:100%;object-fit:cover;display:block}.photo i{height:100%;display:grid;place-items:center;font-style:normal;font-weight:900}.photo em{position:absolute;left:10px;top:10px;z-index:2;min-height:24px;padding:0 9px;border-radius:999px;background:rgba(34,197,94,.92);color:#052e16;font-size:10px;font-weight:950;text-transform:uppercase;font-style:normal}.body{padding:14px}.truckTitle{display:block;color:#f8fafc;text-decoration:none;font-size:17px;font-weight:950;line-height:1.22;margin-bottom:10px}.meta{display:grid;gap:6px;margin-bottom:12px}.meta span{color:#cbd5e1;font-size:13px;font-weight:800}.body strong{display:block;color:var(--green);font-size:22px;margin-bottom:3px}.body small{display:block;color:#94a3b8;font-weight:750;margin-bottom:12px}.actions{display:grid;grid-template-columns:1fr auto;gap:8px}.actions a{min-height:42px;padding:0 12px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;font-weight:950}.actions a:first-child{background:rgba(255,255,255,.08);color:white;border:1px solid rgba(255,255,255,.12)}.actions a:last-child{background:rgba(34,197,94,.14);color:#86efac;border:1px solid rgba(34,197,94,.22)}.empty{grid-column:1/-1;text-align:center;padding:44px 20px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)}.empty h3{margin:0 0 8px;font-size:28px}.empty p{margin:0 0 18px;color:#cbd5e1}.empty a{min-height:46px;padding:0 18px;border-radius:12px;background:var(--green);color:#042913;text-decoration:none;font-weight:950;display:inline-flex;align-items:center}@media(max-width:1100px){.filters{grid-template-columns:1fr 1fr}.search{grid-column:1/-1}.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.wrap{width:calc(100vw - 22px)}.hero{margin-top:-152px;min-height:420px}.heroContent{padding:230px 0 42px}h1{font-size:34px}.filters{grid-template-columns:1fr;margin-top:-28px}.search div{grid-template-columns:1fr}.search input{border-radius:12px;border-right:1px solid rgba(255,255,255,.12);margin-bottom:8px}.search button{border-radius:12px}.filterActions{grid-template-columns:1fr 1fr}.grid{grid-template-columns:1fr}.photo{aspect-ratio:1.35/1}}
      `}</style>
    </main>
  );
}
