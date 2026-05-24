import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TruckImage = {
  image_url: string | null;
  principal: boolean | null;
  ordem: number | null;
};

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

function formatMoney(value: number | null) {
  if (!value) return "Sob consulta";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
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
    .order("created_at", { ascending: false });

  if (marca) {
    query = query.ilike("marca", `%${marca}%`);
  }

  if (modelo) {
    query = query.or(`modelo.ilike.%${modelo}%,titulo.ilike.%${modelo}%`);
  }

  if (tracao) {
    query = query.ilike("tracao", `%${tracao}%`);
  }

  if (busca) {
    query = query.or(
      [
        `titulo.ilike.%${busca}%`,
        `marca.ilike.%${busca}%`,
        `modelo.ilike.%${busca}%`,
        `carroceria.ilike.%${busca}%`,
        `tracao.ilike.%${busca}%`,
        `cidade.ilike.%${busca}%`,
      ].join(",")
    );
  }

  const { data } = await query;
  const trucks = (data || []) as Truck[];

  const temFiltro = Boolean(marca || modelo || tracao || busca);

  return (
    <main className="page">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Caminhões em Oferta">
          <Image src="/logo-horizontal.png" alt="Caminhões em Oferta" width={190} height={55} priority />
        </Link>

        <nav>
          <Link href="/">Início</Link>
          <Link href="/login">Entrar</Link>
          <Link href="/cadastro" className="announce">＋ Anunciar</Link>
        </nav>
      </header>

      <section className="hero">
        <span className="eyebrow">Estoque</span>
        <h1>Caminhões disponíveis</h1>
        <p>Filtre por marca, modelo, tração ou busca livre e fale direto pelo WhatsApp.</p>
      </section>

      <form className="filters" action="/anuncios">
        <select name="marca" defaultValue={marca} aria-label="Marca">
          <option value="">Todas as marcas</option>
          <option value="Mercedes-Benz">Mercedes-Benz</option>
          <option value="Volkswagen">Volkswagen</option>
          <option value="Volvo">Volvo</option>
          <option value="Scania">Scania</option>
          <option value="Ford">Ford</option>
          <option value="Iveco">Iveco</option>
          <option value="DAF">DAF</option>
        </select>

        <input name="modelo" defaultValue={modelo} placeholder="Modelo" aria-label="Modelo" />

        <select name="tracao" defaultValue={tracao} aria-label="Tração">
          <option value="">Todas as trações</option>
          <option value="4x2">4x2</option>
          <option value="6x2">6x2</option>
          <option value="6x4">6x4</option>
          <option value="8x2">8x2</option>
          <option value="8x4">8x4</option>
        </select>

        <input name="busca" defaultValue={busca} placeholder="Buscar por cidade, carroceria..." aria-label="Busca" />

        <button type="submit">Buscar</button>

        {temFiltro && (
          <Link href="/anuncios" className="clear">
            Limpar
          </Link>
        )}
      </form>

      <section className="result-head">
        <div>
          <span>{temFiltro ? "Resultado da pesquisa" : "Todos os anúncios"}</span>
          <h2>
            {trucks.length === 1
              ? "1 caminhão encontrado"
              : `${trucks.length} caminhões encontrados`}
          </h2>
        </div>
      </section>

      <section className="grid">
        {trucks.length > 0 ? (
          trucks.map((truck) => {
            const title = getTitle(truck);
            const image = getImage(truck);

            return (
              <article className="card" key={truck.id}>
                <Link href={`/anuncios/${truck.id}`} className="photo">
                  {image ? <img src={image} alt={title} /> : <span>Sem foto</span>}
                </Link>

                <div className="content">
                  <Link href={`/anuncios/${truck.id}`} className="title">
                    {title}
                  </Link>

                  <div className="tags">
                    <span>{truck.ano_modelo || truck.ano_fabricacao || "Ano"}</span>
                    <span>{truck.tracao || "Tração"}</span>
                    <span>{truck.carroceria || "Carroceria"}</span>
                  </div>

                  <strong className="price">{formatMoney(truck.preco)}</strong>

                  <small className="city">
                    {truck.cidade || "Cidade"}{truck.estado ? `/${truck.estado}` : ""}
                  </small>

                  <div className="actions">
                    <Link href={`/anuncios/${truck.id}`} className="details">Ver detalhes</Link>
                    {truck.whatsapp && (
                      <a href={getWhatsappLink(truck)} target="_blank" className="whats">
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty">
            <h3>Nenhum anúncio encontrado.</h3>
            <p>Limpe os filtros ou tente pesquisar por outra marca, modelo ou tração.</p>
            <Link href="/anuncios">Ver todos os anúncios</Link>
          </div>
        )}
      </section>

      <style>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 18% 8%, rgba(34,197,94,.14), transparent 30%),
            linear-gradient(135deg, #020617 0%, #071f1b 55%, #020617 100%);
          color: white;
          overflow-x: hidden;
          padding-bottom: 46px;
        }

        .topbar {
          width: min(1240px, calc(100vw - 32px));
          min-height: 76px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          color: white;
          text-decoration: none;
          min-width: 0;
        }

        .brand img {
          width: 190px;
          height: auto;
          object-fit: contain;
          display: block;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        nav a {
          min-height: 42px;
          padding: 0 14px;
          border-radius: 14px;
          color: white;
          text-decoration: none;
          font-weight: 850;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
          white-space: nowrap;
        }

        nav .announce {
          background: #22c55e;
          color: #052e16;
          border-color: transparent;
        }

        .hero {
          width: min(1240px, calc(100vw - 32px));
          margin: 34px auto 22px;
        }

        .eyebrow,
        .result-head span {
          display: inline-flex;
          min-height: 30px;
          align-items: center;
          padding: 0 12px;
          border-radius: 999px;
          background: rgba(34,197,94,.12);
          color: #86efac;
          border: 1px solid rgba(34,197,94,.22);
          font-size: 12px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .hero h1 {
          margin: 16px 0 8px;
          font-size: clamp(38px, 5vw, 64px);
          line-height: .98;
          letter-spacing: -.06em;
        }

        .hero p {
          max-width: 760px;
          margin: 0;
          color: #cbd5e1;
          font-size: 18px;
          line-height: 1.55;
        }

        .filters {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto 28px;
          padding: 12px;
          border-radius: 22px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.11);
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1.3fr auto auto;
          gap: 10px;
        }

        .filters select,
        .filters input,
        .filters button,
        .filters .clear {
          min-height: 50px;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(2,6,23,.66);
          color: white;
          padding: 0 14px;
          font-size: 15px;
          font-weight: 800;
          outline: none;
          min-width: 0;
          box-sizing: border-box;
        }

        .filters button {
          background: #22c55e;
          color: #052e16;
          border-color: transparent;
          cursor: pointer;
          padding: 0 22px;
        }

        .filters .clear {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          background: rgba(239,68,68,.10);
          color: #fecaca;
          border-color: rgba(239,68,68,.20);
        }

        .result-head {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto 18px;
        }

        .result-head h2 {
          margin: 12px 0 0;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.05;
          letter-spacing: -.04em;
        }

        .grid {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .card {
          border-radius: 24px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.10);
          overflow: hidden;
          min-width: 0;
        }

        .photo {
          height: 220px;
          display: block;
          background: rgba(15,23,42,.92);
          overflow: hidden;
          text-decoration: none;
          color: #94a3b8;
        }

        .photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .photo span {
          height: 100%;
          display: grid;
          place-items: center;
          font-weight: 900;
        }

        .content {
          padding: 16px;
        }

        .title {
          min-height: 48px;
          display: block;
          color: white;
          text-decoration: none;
          font-size: 19px;
          line-height: 1.22;
          font-weight: 950;
          overflow-wrap: anywhere;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 12px 0;
        }

        .tags span {
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 850;
        }

        .price {
          display: block;
          color: #86efac;
          font-size: 24px;
          line-height: 1.1;
          margin-bottom: 6px;
        }

        .city {
          display: block;
          color: #94a3b8;
          font-size: 13px;
          margin-bottom: 14px;
        }

        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .details,
        .whats {
          min-height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          text-decoration: none;
          font-weight: 950;
          padding: 0 10px;
        }

        .details {
          color: white;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
        }

        .whats {
          color: #052e16;
          background: #22c55e;
        }

        .empty {
          grid-column: 1 / -1;
          padding: 34px;
          border-radius: 26px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.10);
        }

        .empty h3 {
          margin: 0 0 8px;
          font-size: 26px;
        }

        .empty p {
          margin: 0 0 18px;
          color: #cbd5e1;
        }

        .empty a {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border-radius: 14px;
          background: #22c55e;
          color: #052e16;
          text-decoration: none;
          font-weight: 950;
        }

        @media (max-width: 1100px) {
          .filters {
            grid-template-columns: 1fr 1fr 1fr;
          }

          .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .filters {
            grid-template-columns: 1fr 1fr;
          }

          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .topbar {
            width: calc(100vw - 24px);
            min-height: auto;
            padding: 10px 0;
            align-items: center;
          }

          .brand img {
            width: 142px;
          }

          nav {
            gap: 7px;
          }

          nav a {
            min-height: 38px;
            padding: 0 10px;
            font-size: 12px;
          }

          nav a:first-child {
            display: none;
          }

          .hero,
          .filters,
          .result-head,
          .grid {
            width: calc(100vw - 24px);
          }

          .hero {
            margin-top: 22px;
          }

          .hero h1 {
            font-size: 38px;
          }

          .hero p {
            font-size: 16px;
          }

          .filters {
            grid-template-columns: 1fr;
            border-radius: 20px;
          }

          .filters button,
          .filters .clear {
            width: 100%;
          }

          .grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .photo {
            height: 255px;
          }

          .title {
            min-height: auto;
            font-size: 21px;
          }

          .price {
            font-size: 27px;
          }
        }
      `}</style>
    </main>
  );
}
