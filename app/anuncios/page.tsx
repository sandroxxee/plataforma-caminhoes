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
    busca?: string;
    marca?: string;
    perfil?: string;
    tracao?: string;
    implemento?: string;
  }>;
};

const PERFIS = ["3/4", "Toco", "Truck", "Bitruck", "Cavalo mecânico", "Implementos"];
const TRACOES = ["Simples", "Traçado"];
const IMPLEMENTOS = [
  "Graneleira",
  "Baú seco",
  "Baú frigorífico",
  "Sider",
  "Tanque",
  "Silo graneleiro",
  "Chassis",
  "Munck",
  "Cabine suplementar",
  "Comboio",
  "Betoneira",
  "Bomba lança",
  "Caçamba agrícola",
  "Caçamba meia-cana",
  "Caçamba basculante",
  "Prancha",
  "Plataforma",
];

const TERMOS_IMPLEMENTO_REAL = [
  "implemento",
  "implementos",
  "carreta",
  "carretas",
  "semirreboque",
  "semi reboque",
  "reboque",
  "bitrem",
  "rodotrem",
  "dolly",
  "randon",
  "guerra",
  "facchini",
  "librelato",
  "noma",
  "pastre",
  "prancha",
  "plataforma",
  "sider",
  "graneleira",
  "bau seco",
  "bau frigorifico",
  "tanque",
  "silo graneleiro",
];

const TERMOS_CAMINHAO = [
  "caminhao",
  "caminhoes",
  "cavalo",
  "cavalo mecanico",
  "toco",
  "truck",
  "bitruck",
  "vw",
  "volkswagen",
  "volvo",
  "scania",
  "mercedes",
  "mercedes benz",
  "ford",
  "iveco",
  "daf",
  "constellation",
  "cargo",
  "atego",
  "actros",
  "fh",
  "vm",
  "r440",
  "p310",
  "p340",
  "p360",
  "4x2",
  "6x2",
  "6x4",
  "8x2",
  "8x4",
  "tracado",
];

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

function containsAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(normalize(term)));
}

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

function isImplementoReal(truck: Truck) {
  const tituloModeloCarroceria = normalize([truck.titulo, truck.modelo, truck.carroceria].filter(Boolean).join(" "));
  const marca = normalize(truck.marca);
  const tracao = normalize(truck.tracao);
  const textoCompleto = searchableText(truck);

  const temTermoDeImplemento = containsAny(tituloModeloCarroceria, TERMOS_IMPLEMENTO_REAL) || containsAny(marca, ["randon", "guerra", "facchini", "librelato", "noma", "pastre"]);
  const pareceCaminhao = containsAny(textoCompleto, TERMOS_CAMINHAO) || Boolean(tracao);

  return temTermoDeImplemento && !pareceCaminhao;
}

function matchesPerfil(truck: Truck, perfil: string) {
  if (!perfil) return true;
  const text = searchableText(truck);
  const perfilNormalizado = normalize(perfil);

  if (perfilNormalizado === "3 4") return containsAny(text, ["3/4", "3 4", "VUC", "leve"]);
  if (perfilNormalizado === "toco") return containsAny(text, ["toco", "4x2"]);
  if (perfilNormalizado === "truck") return containsAny(text, ["truck", "6x2", "6x4"]);
  if (perfilNormalizado === "bitruck") return containsAny(text, ["bitruck", "bi truck", "8x2", "8x4"]);
  if (perfilNormalizado === "cavalo mecanico") return containsAny(text, ["cavalo", "cavalo mecanico", "quinta roda"]);
  if (perfilNormalizado === "implementos") return isImplementoReal(truck);

  return text.includes(perfilNormalizado);
}

function matchesTracao(truck: Truck, tracao: string) {
  if (!tracao) return true;
  const text = searchableText(truck);
  const tracaoNormalizada = normalize(tracao);

  if (tracaoNormalizada === "simples") return containsAny(text, ["4x2", "6x2", "toco", "truck", "simples"]);
  if (tracaoNormalizada === "tracado") return containsAny(text, ["6x4", "8x4", "traçado", "tracado"]);

  return text.includes(tracaoNormalizada);
}

export default async function AnunciosPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const busca = clean(params.busca);
  const marca = clean(params.marca);
  const perfil = clean(params.perfil);
  const tracao = clean(params.tracao);
  const implemento = clean(params.implemento);

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
  const implementoFiltro = normalize(implemento);
  const buscaFiltro = normalize(busca);

  const trucks = allTrucks.filter((truck) => {
    const texto = searchableText(truck);
    const marcaOk = !marcaFiltro || normalize(truck.marca).includes(marcaFiltro);
    const perfilOk = matchesPerfil(truck, perfil);
    const tracaoOk = matchesTracao(truck, tracao);
    const implementoOk = !implementoFiltro || (isImplementoReal(truck) && normalize(`${truck.carroceria || ""} ${truck.titulo || ""} ${truck.modelo || ""}`).includes(implementoFiltro));
    const buscaOk = !buscaFiltro || buscaFiltro.split(" ").every((word) => texto.includes(word));
    return marcaOk && perfilOk && tracaoOk && implementoOk && buscaOk;
  });

  const temFiltro = Boolean(busca || marca || perfil || tracao || implemento);

  return (
    <main className="stock-page">
      <PublicHeader />

      <section className="wrap stock-hero">
        <div>
          <span className="mini">Estoque de caminhões</span>
          <h1>Caminhões, implementos e carrocerias com informação clara.</h1>
          <p>Use os filtros para encontrar por marca, configuração, tração, implemento ou cidade. Depois chame direto no WhatsApp para confirmar disponibilidade.</p>
        </div>
        <aside>
          <strong>{trucks.length}</strong>
          <span>{temFiltro ? "resultado(s) encontrado(s)" : "anúncio(s) disponível(is)"}</span>
        </aside>
      </section>

      <form className="wrap stock-filters" action="/anuncios">
        <div className="field searchField">
          <label>Caminhão</label>
          <input name="busca" defaultValue={busca} placeholder="Digite modelo, cidade, ano, carroceria..." />
        </div>

        <div className="field">
          <label>Marca</label>
          <select name="marca" defaultValue={marca}>
            <option value="">Todas</option>
            <option>DAF</option>
            <option>Ford</option>
            <option>Iveco</option>
            <option>Mercedes-Benz</option>
            <option>Scania</option>
            <option>Volkswagen</option>
            <option>Volvo</option>
          </select>
        </div>

        <div className="field">
          <label>Perfil</label>
          <select name="perfil" defaultValue={perfil}>
            <option value="">Todos</option>
            {PERFIS.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Tração</label>
          <select name="tracao" defaultValue={tracao}>
            <option value="">Todas</option>
            {TRACOES.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Implemento</label>
          <select name="implemento" defaultValue={implemento}>
            <option value="">Todos</option>
            {IMPLEMENTOS.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>

        <div className="filterActions">
          <button type="submit">Buscar</button>
          {temFiltro && <Link href="/anuncios">Limpar</Link>}
        </div>
      </form>

      <section className="wrap stock-title-row">
        <div>
          <span className="mini">{temFiltro ? "Resultado da busca" : "Disponíveis"}</span>
          <h2>{temFiltro ? "Anúncios encontrados" : "Caminhões anunciados"}</h2>
        </div>
        <Link href="/anunciar">Anunciar caminhão</Link>
      </section>

      <section className="wrap stock-grid">
        {trucks.length > 0 ? trucks.map((truck) => {
          const title = getTitle(truck);
          const cardTitle = getCardTitle(truck);
          const image = getImage(truck);
          const year = truck.ano_modelo || truck.ano_fabricacao || "Ano";
          const configuration = truck.tracao || truck.carroceria || "Configuração";

          return (
            <article className="stock-card" key={truck.id}>
              <Link href={`/anuncios/${truck.id}`} className="stock-photo">
                <span>{truck.carroceria || truck.tracao || "Caminhão"}</span>
                {image ? <img src={image} alt={title} /> : <i>Sem foto</i>}
              </Link>

              <div className="stock-card-body">
                <Link href={`/anuncios/${truck.id}`} className="stock-card-title">{cardTitle}</Link>
                <div className="stock-card-meta"><b>{year} • {configuration} • {getLocation(truck)}</b></div>
                <p>{truck.marca || "Caminhão"}{truck.modelo ? ` ${truck.modelo}` : ""} com dados claros e contato direto pelo WhatsApp.</p>
                <strong>{formatMoney(truck.preco)}</strong>
                <div className="stock-card-actions">
                  <Link href={`/anuncios/${truck.id}`}>Ver detalhes →</Link>
                  {truck.whatsapp && <a href={getWhatsappLink(truck)} target="_blank" rel="noreferrer" aria-label="Chamar no WhatsApp">WhatsApp</a>}
                </div>
              </div>
            </article>
          );
        }) : (
          <div className="empty-stock">
            <h3>Nenhum caminhão encontrado.</h3>
            <p>Tente buscar por marca, modelo, tração, implemento, cidade ou uma palavra do anúncio.</p>
            <Link href="/anuncios">Limpar busca</Link>
          </div>
        )}
      </section>

      <SiteFooter />

      <style>{`
        .stock-page{min-height:100vh;color:var(--site-text);background:radial-gradient(circle at 82% -12%,color-mix(in srgb,var(--site-green) 18%,transparent),transparent 34%),radial-gradient(circle at 8% 4%,color-mix(in srgb,var(--site-gold) 10%,transparent),transparent 27%),linear-gradient(180deg,var(--site-bg),var(--site-bg-2));overflow-x:hidden;padding-bottom:30px}.wrap{width:min(1240px,calc(100vw - 32px));margin:0 auto}.mini{display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 28%,transparent);color:var(--site-green);font-size:12px;font-weight:950;letter-spacing:.06em;text-transform:uppercase}.stock-hero{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:20px;align-items:stretch;margin-top:10px;padding:30px;border-radius:30px;background:linear-gradient(115deg,var(--site-surface),color-mix(in srgb,var(--site-surface) 70%,transparent)),radial-gradient(circle at 82% 18%,color-mix(in srgb,var(--site-green) 22%,transparent),transparent 28%);border:1px solid var(--site-line);box-shadow:var(--site-shadow);overflow:hidden}.stock-hero h1{margin:14px 0 10px;max-width:840px;font-size:clamp(34px,4.4vw,58px);line-height:.98;letter-spacing:-.06em}.stock-hero p{margin:0;max-width:760px;color:var(--site-muted);font-size:16px;line-height:1.55;font-weight:720}.stock-hero aside{display:flex;flex-direction:column;justify-content:flex-end;padding:20px;border-radius:24px;background:var(--site-surface-2);border:1px solid var(--site-line)}.stock-hero aside strong{font-size:56px;line-height:.9;color:var(--site-green);letter-spacing:-.06em}.stock-hero aside span{margin-top:8px;color:var(--site-muted);font-weight:900}.stock-filters{position:relative;z-index:5;margin:16px auto 30px;padding:12px;border-radius:24px;display:grid;grid-template-columns:minmax(220px,1.35fr) minmax(130px,.65fr) minmax(150px,.75fr) minmax(120px,.58fr) minmax(180px,.95fr) auto;gap:10px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft);backdrop-filter:blur(16px)}.field{display:grid;gap:7px}.field label{font-size:12px;color:var(--site-muted);font-weight:950;letter-spacing:.04em;text-transform:uppercase}.field input,.field select{width:100%;min-height:48px;border-radius:16px;border:1px solid var(--site-line);background:var(--site-surface-2);color:var(--site-text);outline:0;padding:0 13px;font-weight:800}.filterActions{display:grid;grid-template-rows:1fr 1fr;gap:8px;align-self:end}.filterActions button,.filterActions a{min-width:96px;min-height:40px;border-radius:999px;border:0;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;font-weight:950}.filterActions button{background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16}.filterActions a{background:var(--site-surface-2);color:var(--site-text);border:1px solid var(--site-line)}.stock-title-row{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:16px}.stock-title-row h2{margin:10px 0 0;font-size:clamp(28px,3vw,42px);line-height:1.05;letter-spacing:-.045em}.stock-title-row>a{min-height:44px;border-radius:999px;background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;padding:0 16px;display:inline-flex;align-items:center;text-decoration:none;font-weight:950}.stock-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.stock-card{overflow:hidden;border-radius:24px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft);transition:.2s ease}.stock-card:hover{transform:translateY(-4px);box-shadow:var(--site-shadow)}.stock-photo{position:relative;aspect-ratio:1/.72;background:linear-gradient(145deg,#1b2a23,#070f0b);display:grid;place-items:center;overflow:hidden;color:var(--site-muted);text-decoration:none;font-weight:950}.stock-photo img{width:100%;height:100%;object-fit:cover;display:block}.stock-photo span{position:absolute;top:14px;left:14px;z-index:2;padding:7px 10px;border-radius:999px;background:rgba(34,211,125,.92);color:#052e16;font-size:11px;font-weight:950}.stock-photo i{font-style:normal}.stock-card-body{padding:16px}.stock-card-title{display:block;color:var(--site-text);font-size:19px;font-weight:950;line-height:1.15;text-decoration:none;letter-spacing:-.02em}.stock-card-meta{margin:8px 0 10px;color:var(--site-muted);font-size:13px}.stock-card-body p{margin:0 0 12px;color:var(--site-muted);font-size:14px;line-height:1.42;font-weight:680}.stock-card-body>strong{display:block;color:var(--site-green);font-size:20px;margin-bottom:12px}.stock-card-actions{display:grid;grid-template-columns:1fr auto;gap:10px}.stock-card-actions a{min-height:40px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;padding:0 12px;text-decoration:none;font-weight:950;font-size:12px}.stock-card-actions a:first-child{background:var(--site-surface-2);border:1px solid var(--site-line);color:var(--site-text)}.stock-card-actions a:last-child{background:#19c56f;color:#052e16}.empty-stock{grid-column:1/-1;padding:30px;border-radius:24px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft);text-align:center}.empty-stock h3{margin:0 0 8px;font-size:24px}.empty-stock p{margin:0 auto 16px;max-width:560px;color:var(--site-muted)}.empty-stock a{min-height:44px;border-radius:999px;background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;padding:0 16px;display:inline-flex;align-items:center;text-decoration:none;font-weight:950}@media(max-width:1080px){.stock-hero{grid-template-columns:1fr}.stock-filters{grid-template-columns:1fr 1fr}.filterActions{grid-template-columns:1fr 1fr;grid-template-rows:auto}.stock-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:640px){.wrap{width:min(100% - 22px,1240px)}.stock-hero{padding:22px;border-radius:24px}.stock-hero h1{font-size:34px;letter-spacing:-.045em}.stock-filters,.stock-grid,.stock-title-row{grid-template-columns:1fr}.stock-title-row{align-items:stretch;flex-direction:column}.stock-title-row>a{justify-content:center}.filterActions{grid-template-columns:1fr}.stock-card-actions{grid-template-columns:1fr}.stock-card-actions a{width:100%}}
      `}</style>
    </main>
  );
}
