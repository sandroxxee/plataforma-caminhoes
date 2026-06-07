import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { createClient } from "@/lib/supabase/server";
import { SiteFooter } from "@/components/SiteFooter";
import { IMPLEMENTO_TIPOS } from "@/lib/implementos";
import { SearchMarketplace } from "@/components/theme/SearchMarketplace";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Caminhões à venda",
  description:
    "Consulte anúncios aprovados de caminhões usados, seminovos, cavalos mecânicos, trucks, bitrucks e implementos com contato direto pelo WhatsApp.",
  alternates: { canonical: "/anuncios" },
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
const IMPLEMENTOS = IMPLEMENTO_TIPOS.map((implemento) => implemento.nome);

const TERMOS_IMPLEMENTO_REAL = [
  "implemento",
  "implementos",
  "carreta",
  "carretas",
  "semirreboque",
  "semi reboque",
  "reboque",
  "julieta",
  "bitrem",
  "bi cacamba",
  "bicacamba",
  "rodotrem",
  "dolly",
  "randon",
  "guerra",
  "facchini",
  "librelato",
  "noma",
  "rossetti",
  "pastre",
  "rodofort",
  "truckvan",
  "4truck",
  "prancha",
  "plataforma",
  "sider",
  "graneleira",
  "graneleiro",
  "bau seco",
  "bau frigorifico",
  "tanque",
  "silo",
  "silo graneleiro",
  "cacamba",
  "caçamba",
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

function searchableText(truck: TruckCardData) {
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

function isImplementoReal(truck: TruckCardData) {
  const tituloModeloCarroceria = normalize([truck.titulo, truck.modelo, truck.carroceria].filter(Boolean).join(" "));
  const marca = normalize(truck.marca);
  const tracao = normalize(truck.tracao);
  const textoCompleto = searchableText(truck);

  const temTermoDeImplemento = containsAny(tituloModeloCarroceria, TERMOS_IMPLEMENTO_REAL) || containsAny(marca, ["randon", "guerra", "facchini", "librelato", "noma", "rossetti", "pastre", "rodofort", "truckvan", "4truck"]);
  const pareceCaminhao = containsAny(textoCompleto, TERMOS_CAMINHAO) || Boolean(tracao);

  return temTermoDeImplemento && !pareceCaminhao;
}

function matchesPerfil(truck: TruckCardData, perfil: string) {
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

function matchesTracao(truck: TruckCardData, tracao: string) {
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

  const allTrucks = (data || []) as TruckCardData[];
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
    <main className="market-page">
      <PublicHeader />

      <section className="market-container stock-toolbar">
        <div className="stock-head">
          <div>
            <span className="stock-eyebrow">{temFiltro ? "Resultado da busca" : "Anúncios disponíveis"}</span>
            <h1>Caminhões à venda</h1>
          </div>
        </div>

        <SearchMarketplace
          busca={busca}
          marca={marca}
          perfil={perfil}
          tracao={tracao}
          implemento={implemento}
          perfis={PERFIS}
          tracoes={TRACOES}
          implementos={IMPLEMENTOS}
        />
      </section>

      <section className="market-container stock-grid">
        {trucks.length > 0 ? (
          trucks.map((truck) => <TruckCard key={truck.id} truck={truck} />)
        ) : (
          <div className="market-empty">
            Nenhum anúncio encontrado. Tente buscar por marca, modelo, tração, implemento ou cidade.
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
