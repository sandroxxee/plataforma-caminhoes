import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { CSSProperties } from "react";

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
  destaque: boolean | null;
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

function getMainImage(truck: Truck) {
  const images = truck.truck_images || [];
  const principal = images.find((img) => img.principal && img.image_url);
  const first = [...images]
    .filter((img) => img.image_url)
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))[0];

  return principal?.image_url || first?.image_url || "";
}

function getWhatsappLink(truck: Truck) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(`Olá, tenho interesse no caminhão ${truck.titulo || ""}.`);
  return `https://wa.me/${phone}?text=${text}`;
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data, error } = await supabase
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
      destaque,
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("created_at", { ascending: false })
    .limit(6);

  const trucks = (data || []) as Truck[];

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <Link href="/" style={styles.logoBox}>
          <span style={styles.logoIcon}>🚛</span>
          <span>
            <strong>CAMINHÕES EM OFERTA</strong>
            <small style={styles.logoSmall}>Plataforma de anúncios de caminhões</small>
          </span>
        </Link>

        <nav style={styles.nav}>
          <Link href="/anuncios" style={styles.navLink}>Ver anúncios</Link>
          <Link href="/login" style={styles.outlineButton}>Entrar</Link>
          <Link href="/cadastro" style={styles.primaryButton}>Anunciar</Link>
        </nav>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroText}>
          <span style={styles.badge}>COMPRA • VENDA • TROCA</span>
          <h1 style={styles.heroTitle}>
            Caminhões reais, aprovados e prontos para negociação.
          </h1>
          <p style={styles.heroSubtitle}>
            Encontre caminhões com procedência, veja detalhes e fale direto no WhatsApp.
          </p>

          <div style={styles.heroActions}>
            <Link href="/anuncios" style={styles.bigButton}>Ver caminhões</Link>
            <Link href="/cadastro" style={styles.bigOutline}>Quero anunciar</Link>
          </div>
        </div>

        <div style={styles.heroCard}>
          <span style={styles.heroCardBadge}>Estoque aprovado</span>
          <strong style={styles.heroNumber}>{trucks.length}</strong>
          <p style={styles.heroCardText}>últimos anúncios reais carregados do Supabase</p>
        </div>
      </section>

      {error && (
        <div style={styles.errorBox}>
          Erro ao carregar anúncios do Supabase: {error.message}
        </div>
      )}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.badge}>DESTAQUES</span>
            <h2 style={styles.sectionTitle}>Últimos caminhões aprovados</h2>
          </div>

          <Link href="/anuncios" style={styles.seeAll}>Ver todos</Link>
        </div>

        {trucks.length === 0 && (
          <div style={styles.emptyBox}>
            Nenhum anúncio aprovado no momento.
          </div>
        )}

        <div style={styles.grid}>
          {trucks.map((truck) => {
            const image = getMainImage(truck);

            return (
              <article key={truck.id} style={styles.card}>
                <div style={styles.imageWrap}>
                  {truck.destaque && <span style={styles.tag}>destaque</span>}

                  {image ? (
                    <img src={image} alt={truck.titulo || "Caminhão"} style={styles.image} />
                  ) : (
                    <div style={styles.noImage}>Sem foto</div>
                  )}
                </div>

                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{truck.titulo || `${truck.marca} ${truck.modelo}`}</h3>
                  <strong style={styles.price}>{formatMoney(truck.preco)}</strong>

                  <div style={styles.infoLine}>
                    <span>{truck.ano_modelo || truck.ano_fabricacao || "Ano não informado"}</span>
                    <span>{truck.cidade || "Cidade"}{truck.estado ? `/${truck.estado}` : ""}</span>
                  </div>

                  <div style={styles.chips}>
                    {truck.carroceria && <span>{truck.carroceria}</span>}
                    {truck.tracao && <span>{truck.tracao}</span>}
                  </div>

                  <div style={styles.cardActions}>
                    <Link href={`/anuncios/${truck.id}`} style={styles.detailsButton}>Ver detalhes</Link>
                    {truck.whatsapp && (
                      <a href={getWhatsappLink(truck)} target="_blank" style={styles.whatsappButton}>
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#020617 0%,#071f1b 55%,#020617 100%)",
    color: "white",
    paddingBottom: 54,
  },
  header: {
    minHeight: 82,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 9vw",
    borderBottom: "1px solid rgba(255,255,255,.10)",
    background: "rgba(2,6,23,.74)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "white",
    textDecoration: "none",
  },
  logoSmall: {
    display: "block",
    color: "#94a3b8",
    fontSize: 12,
  },
  logoIcon: {
    width: 44,
    height: 44,
    display: "grid",
    placeItems: "center",
    borderRadius: 13,
    background: "#22c55e",
  },
  nav: {
    display: "flex",
    gap: 16,
    alignItems: "center",
  },
  navLink: {
    color: "#cbd5e1",
    textDecoration: "none",
    fontWeight: 800,
  },
  primaryButton: {
    background: "#22c55e",
    color: "#052e16",
    padding: "12px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 900,
  },
  outlineButton: {
    border: "1px solid rgba(255,255,255,.16)",
    color: "white",
    padding: "12px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 900,
  },
  hero: {
    maxWidth: 1180,
    margin: "42px auto 26px",
    display: "grid",
    gridTemplateColumns: "1.3fr .7fr",
    gap: 24,
    alignItems: "stretch",
  },
  heroText: {
    padding: 38,
    borderRadius: 30,
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.10)",
  },
  badge: {
    display: "inline-flex",
    padding: "8px 14px",
    borderRadius: 999,
    color: "#86efac",
    background: "rgba(34,197,94,.12)",
    border: "1px solid rgba(34,197,94,.22)",
    fontWeight: 900,
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 52,
    lineHeight: 1.02,
    margin: "20px 0 14px",
    maxWidth: 780,
  },
  heroSubtitle: {
    color: "#cbd5e1",
    fontSize: 19,
    lineHeight: 1.55,
    margin: 0,
  },
  heroActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 26,
  },
  bigButton: {
    background: "#22c55e",
    color: "#052e16",
    padding: "15px 20px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 900,
  },
  bigOutline: {
    border: "1px solid rgba(255,255,255,.16)",
    color: "white",
    padding: "15px 20px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 900,
  },
  heroCard: {
    padding: 30,
    borderRadius: 30,
    background: "linear-gradient(145deg,rgba(34,197,94,.18),rgba(15,23,42,.76))",
    border: "1px solid rgba(34,197,94,.22)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heroCardBadge: {
    color: "#86efac",
    fontWeight: 900,
  },
  heroNumber: {
    fontSize: 78,
    lineHeight: 1,
    marginTop: 14,
  },
  heroCardText: {
    color: "#cbd5e1",
    lineHeight: 1.5,
    marginBottom: 0,
  },
  section: {
    maxWidth: 1180,
    margin: "0 auto",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "end",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 34,
    margin: "12px 0 0",
  },
  seeAll: {
    color: "#86efac",
    textDecoration: "none",
    fontWeight: 900,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
    gap: 20,
  },
  card: {
    overflow: "hidden",
    borderRadius: 24,
    background: "rgba(15,23,42,.76)",
    border: "1px solid rgba(255,255,255,.12)",
  },
  imageWrap: {
    position: "relative",
    height: 220,
    background: "rgba(2,6,23,.75)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  noImage: {
    height: "100%",
    display: "grid",
    placeItems: "center",
    color: "#94a3b8",
    fontWeight: 900,
  },
  tag: {
    position: "absolute",
    top: 14,
    left: 14,
    zIndex: 2,
    padding: "7px 12px",
    borderRadius: 999,
    background: "rgba(234,179,8,.20)",
    color: "#fde68a",
    border: "1px solid rgba(234,179,8,.35)",
    fontWeight: 900,
    fontSize: 12,
  },
  cardBody: {
    padding: 18,
  },
  cardTitle: {
    margin: 0,
    fontSize: 19,
    lineHeight: 1.25,
  },
  price: {
    display: "block",
    marginTop: 12,
    color: "#86efac",
    fontSize: 25,
  },
  infoLine: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 12,
  },
  chips: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 14,
  },
  cardActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 16,
  },
  detailsButton: {
    padding: "12px",
    borderRadius: 13,
    color: "white",
    textAlign: "center",
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,.14)",
    fontWeight: 900,
  },
  whatsappButton: {
    padding: "12px",
    borderRadius: 13,
    background: "#22c55e",
    color: "#052e16",
    textAlign: "center",
    textDecoration: "none",
    fontWeight: 900,
  },
  emptyBox: {
    padding: 30,
    borderRadius: 24,
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.10)",
  },
  errorBox: {
    maxWidth: 1180,
    margin: "0 auto 20px",
    padding: 16,
    borderRadius: 16,
    color: "#fecaca",
    background: "rgba(239,68,68,.12)",
    border: "1px solid rgba(239,68,68,.25)",
  },
};
