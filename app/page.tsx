import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { createClient } from "@/lib/supabase/server";
import { SiteFooter } from "@/components/SiteFooter";

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

  return (
    <main className="home-page" id="topo">
      <PublicHeader />

      <section className="hero" style={heroImage ? { backgroundImage: `linear-gradient(90deg, rgba(2,6,8,.96), rgba(2,6,8,.72) 40%, rgba(2,6,8,.20)), linear-gradient(180deg, rgba(2,6,8,.20), rgba(2,6,8,.95)), url(${heroImage})` } : undefined}>
        <div className="wrap hero-content">
          <h1>Caminhões selecionados para o <span>seu negócio.</span></h1>
          <p>Cavalos mecânicos, trucks, tocos e implementos. Encontre caminhões anunciados com dados claros e contato direto pelo WhatsApp.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/anuncios">🔎 Ver estoque</Link>
            <Link className="btn btn-ghost" href="/#contato">Falar com atendimento</Link>
          </div>
        </div>
      </section>

      <form className="wrap filter-panel" action="/anuncios" aria-label="Filtros do estoque">
        <div className="filter-field">
          <label>Marca</label>
          <select name="marca" defaultValue="">
            <option value="">Todas as marcas</option>
            <option>Mercedes-Benz</option>
            <option>Scania</option>
            <option>Volvo</option>
            <option>Volkswagen</option>
            <option>Ford</option>
            <option>Iveco</option>
            <option>DAF</option>
          </select>
        </div>

        <div className="filter-field">
          <label>Tipo</label>
          <select name="carroceria" defaultValue="">
            <option value="">Todos os tipos</option>
            <option>Cavalo mecânico</option>
            <option>Truck</option>
            <option>Toco</option>
            <option>Implemento</option>
          </select>
        </div>

        <div className="filter-field">
          <label>Tração</label>
          <select name="tracao" defaultValue="">
            <option value="">Todas as trações</option>
            <option>4x2</option>
            <option>6x2</option>
            <option>6x4</option>
            <option>8x4</option>
          </select>
        </div>

        <div className="filter-field">
          <label>Localização</label>
          <select name="estado" defaultValue="">
            <option value="">Todas as regiões</option>
            <option value="SC">Santa Catarina</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="PR">Paraná</option>
          </select>
        </div>

        <div className="search-box">
          <input name="busca" placeholder="Buscar modelo, marca..." />
          <button type="submit" aria-label="Buscar">⌕</button>
        </div>
      </form>

      <section className="wrap section-title" id="estoque">
        <h2><span>▱</span> Caminhões disponíveis <small className="pill">{trucks.length} anúncios</small></h2>
        <Link href="/anuncios" className="view-all">Ver todos</Link>
      </section>

      <section className="wrap truck-grid">
        {trucks.length > 0 ? (
          trucks.map((truck) => {
            const title = getTitle(truck);
            const image = getImage(truck);

            return (
              <article className="truck-card" key={truck.id}>
                <Link href={`/anuncios/${truck.id}`} className="truck-photo">
                  <span className="badge">{truck.carroceria || "Caminhão"}</span>
                  <span className="heart">♡</span>
                  {image ? <img src={image} alt={title} /> : <i>Sem foto</i>}
                </Link>
                <div className="card-body">
                  <Link className="truck-title" href={`/anuncios/${truck.id}`}>{title}</Link>
                  <div className="meta">
                    <span>▣ {truck.ano_modelo || truck.ano_fabricacao || "Ano"}</span>
                    <span>⚙ {truck.tracao || "Tração"}</span>
                    <span>⌖ {truck.cidade || "Cidade"}{truck.estado ? ` - ${truck.estado}` : ""}</span>
                  </div>
                  <strong className="price">{formatMoney(truck.preco)}</strong>
                  <small className="payment">À vista / negociação direta</small>
                  <div className="card-actions">
                    <Link className="details" href={`/anuncios/${truck.id}`}>◉ Ver detalhes</Link>
                    {truck.whatsapp && <a className="whats" href={getWhatsappLink(truck)} target="_blank" rel="noreferrer">☘</a>}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            <h3>Nenhum caminhão aprovado ainda.</h3>
            <p>Assim que os anúncios forem aprovados, eles aparecem aqui automaticamente.</p>
          </div>
        )}
      </section>

      <section className="wrap trust-bar" aria-label="Diferenciais">
        <div className="trust-item"><span className="trust-icon">▱</span><span><strong>Negociação direta</strong><small>Contato pelo WhatsApp</small></span></div>
        <div className="trust-item"><span className="trust-icon">▤</span><span><strong>Dados organizados</strong><small>Foto, valor, cidade e detalhes</small></span></div>
        <div className="trust-item"><span className="trust-icon">▰</span><span><strong>Estoque atualizado</strong><small>Anúncios aprovados</small></span></div>
        <div className="trust-item"><span className="trust-icon">☘</span><span><strong>Atendimento rápido</strong><small>Compra e venda sem complicar</small></span></div>
      </section>

      <section className="wrap sell-section" id="anunciar">
        <div>
          <span className="kicker">Para vendedores</span>
          <h2>Anuncie seu caminhão com aparência profissional.</h2>
          <p>Envie dados, fotos e localização. A troca entra como uma opção marcada dentro do anúncio, não como uma aba separada.</p>
          <div className="hero-actions"><Link className="btn btn-primary" href="/anunciar">Começar anúncio</Link></div>
        </div>
        <div className="steps"><div className="step"><b>1</b> Dados e fotos</div><div className="step"><b>2</b> Revisão do anúncio</div><div className="step"><b>3</b> Publicação e contatos</div></div>
      </section>

      <section className="wrap about-section" id="sobre">
        <span className="kicker">Sobre a plataforma</span>
        <h2>Um espaço simples para anunciar e encontrar caminhões.</h2>
        <p>A Caminhões em Oferta aproxima compradores e vendedores com anúncios organizados, contato direto e visual profissional para valorizar cada veículo.</p>
      </section>

      <section className="wrap contact-section" id="contato">
        <div>
          <span className="kicker">Atendimento</span>
          <h2>Precisa de ajuda para anunciar?</h2>
          <p>Fale com nosso atendimento para tirar dúvidas sobre cadastro, fotos e publicação do anúncio.</p>
        </div>
        <a className="btn btn-primary" href="https://wa.me/5549999362681" target="_blank" rel="noreferrer">Chamar no WhatsApp</a>
      </section>

      <SiteFooter />
    </main>
  );
}
