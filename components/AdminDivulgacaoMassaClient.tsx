"use client";

import { useState, useEffect, type CSSProperties } from "react";
import { Eye, Copy, Share2, Smartphone, Landmark, RotateCcw, Download, Search, CheckSquare, Square, ExternalLink } from "lucide-react";
import { gerarSlugComId } from "@/lib/slug";
import { formatImageUrl } from "@/lib/truck-utils";

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
  status: string | null;
  created_at: string | null;
  truck_images?: TruckImage[];
};

type Props = {
  anuncios: Truck[];
};

export function AdminDivulgacaoMassaClient({ anuncios }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
  const [copiado, setCopiado] = useState<string | null>(null);
  
  // Texto editável da divulgação em lote
  const [editedText, setEditedText] = useState("");
  const [hasManuallyEdited, setHasManuallyEdited] = useState(false);

  // Filtrar anúncios com base na busca
  const anunciosFiltrados = anuncios.filter((a) => {
    const term = busca.toLowerCase();
    const titulo = (a.titulo || "").toLowerCase();
    const marca = (a.marca || "").toLowerCase();
    const modelo = (a.modelo || "").toLowerCase();
    const cidade = (a.cidade || "").toLowerCase();
    return titulo.includes(term) || marca.includes(term) || modelo.includes(term) || cidade.includes(term);
  });

  const getAdUrl = (truck: Truck) => {
    const slug = gerarSlugComId({
      id: truck.id,
      marca: truck.marca,
      modelo: truck.modelo,
      ano_modelo: truck.ano_modelo,
      ano_fabricacao: truck.ano_fabricacao,
      cidade: truck.cidade,
      estado: truck.estado,
    });
    return `https://caminhoesavenda.com/anuncios/${slug}`;
  };

  const getAdTitle = (truck: Truck) => {
    const parts = [truck.marca, truck.modelo || truck.titulo, truck.ano_modelo || truck.ano_fabricacao].filter(Boolean);
    return parts.length ? parts.join(" ") : truck.titulo || "Veículo à venda";
  };

  const money = (value: number | null) => {
    if (!value) return "Sob consulta";
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  };

  // Gerar o texto consolidado padrão das seleções
  const gerarTextoPadrao = (ids: string[]) => {
    const selecionados = anuncios.filter((a) => ids.includes(a.id));
    if (selecionados.length === 0) {
      return "Nenhum caminhão selecionado. Marque os caminhões na lista acima para gerar o post consolidado.";
    }

    const dataAbreviada = new Date().toLocaleDateString("pt-BR");
    let txt = `🚛 *ESTOQUE DE OFERTAS DO DIA - ${dataAbreviada}* 🚛\n\n`;
    txt += `Confira as melhores oportunidades em nossa loja:\n\n`;

    selecionados.forEach((a, idx) => {
      const title = getAdTitle(a);
      const precoStr = money(a.preco);
      const local = [a.cidade, a.estado].filter(Boolean).join("/");
      const link = getAdUrl(a);

      txt += `${idx + 1}️⃣ *${title}*\n`;
      txt += `💰 Valor: ${precoStr}\n`;
      if (local) txt += `📍 Local: ${local}\n`;
      txt += `🔗 Fotos e detalhes: ${link}\n\n`;
    });

    txt += `📲 Chame no WhatsApp ou fale conosco diretamente nos anúncios!`;
    return txt;
  };

  // Atualizar o texto de lote quando as seleções mudam (se o usuário não tiver feito edições manuais livres)
  useEffect(() => {
    if (!hasManuallyEdited) {
      setEditedText(gerarTextoPadrao(selectedIds));
    }
  }, [selectedIds, hasManuallyEdited]);

  const toggleSelectAll = () => {
    if (selectedIds.length === anunciosFiltrados.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(anunciosFiltrados.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  async function copiar(valor: string, label: string) {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(label);
      window.setTimeout(() => setCopiado(null), 2500);
    } catch {
      setCopiado("Erro ao copiar");
    }
  }

  const handleWhatsappShareLote = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(editedText)}`;
    window.open(url, "_blank");
  };

  // Primeiro anúncio selecionado para prévia de artes na lateral
  const primeiroSelecionado = anuncios.find((a) => selectedIds.includes(a.id));

  // Reta de API do servidor para geração de artes
  const getArteUrl = (id: string, tipo: "feed" | "story" | "whatsapp") => {
    return `/api/admin/gerar-arte/${id}?formato=${tipo}`;
  };

  return (
    <div style={styles.container}>
      {copiado && (
        <div style={styles.toast}>
          <span>✨</span> <span>{copiado}</span>
        </div>
      )}

      {/* BARRA DE FILTROS E BUSCA */}
      <section style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={{ color: "#64748b" }} />
          <input
            type="text"
            placeholder="Buscar por marca, modelo, cidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <button onClick={toggleSelectAll} style={styles.selectAllBtn}>
          {selectedIds.length === anunciosFiltrados.length ? (
            <> Desmarcar Todos ({selectedIds.length})</>
          ) : (
            <> Selecionar Filtrados ({anunciosFiltrados.length})</>
          )}
        </button>
      </section>

      {/* TABELA DE VEÍCULOS */}
      <section style={styles.tableCard}>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={{ ...styles.th, width: 50 }}>Sel.</th>
                <th style={styles.th}>Veículo</th>
                <th style={styles.th}>Preço</th>
                <th style={styles.th}>Localidade</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Ações Rápidas</th>
              </tr>
            </thead>
            <tbody>
              {anunciosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.emptyCell}>
                    Nenhum anúncio ativo encontrado.
                  </td>
                </tr>
              ) : (
                anunciosFiltrados.map((a) => {
                  const isSelected = selectedIds.includes(a.id);
                  const title = getAdTitle(a);
                  const images = a.truck_images || [];
                  const mainImageRaw = images.find((i) => i.principal)?.image_url ?? images[0]?.image_url ?? "";
                  const thumb = formatImageUrl(mainImageRaw);
                  const link = getAdUrl(a);

                  return (
                    <tr key={a.id} style={isSelected ? styles.trSelected : styles.trNormal}>
                      <td style={styles.td}>
                        <button onClick={() => toggleSelectOne(a.id)} style={styles.checkboxBtn}>
                          {isSelected ? (
                            <CheckSquare size={20} style={{ color: "#10b981" }} />
                          ) : (
                            <Square size={20} style={{ color: "#475569" }} />
                          )}
                        </button>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={styles.thumbWrapper}>
                            {thumb ? (
                              <img src={thumb} alt={title} style={styles.thumbImg} />
                            ) : (
                              <div style={styles.thumbEmpty}>FOTO</div>
                            )}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <strong style={{ color: "#fff", fontSize: 15 }}>{title}</strong>
                            <span style={{ color: "#64748b", fontSize: 12 }}>Configuração: {[a.carroceria, a.tracao].filter(Boolean).join(" • ")}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...styles.td, color: "#10b981", fontWeight: 800 }}>{money(a.preco)}</td>
                      <td style={{ ...styles.td, color: "#94a3b8" }}>{a.cidade}/{a.estado}</td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <div style={styles.rowActions}>
                          <button
                            title="Copiar texto curto"
                            onClick={() => {
                              const textoCurto = `🚛 ${title}\n📍 ${a.cidade || ""}/${a.estado || ""}\n💰 ${money(a.preco)}\n📲 Fotos: ${link}`;
                              copiar(textoCurto, "Texto copiado!");
                            }}
                            style={styles.rowBtn}
                          >
                            <Copy size={13} />
                          </button>
                          <a
                            title="Enviar WhatsApp"
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🚛 ${title}\n📍 ${a.cidade}/${a.estado}\n💰 ${money(a.preco)}\n📲 Detalhes: ${link}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.rowLinkBtn}
                          >
                            <Share2 size={13} />
                          </a>
                          <a
                            title="Ver anúncio público"
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.rowLinkBtn}
                          >
                            <ExternalLink size={13} />
                          </a>
                          <a
                            title="Baixar Feed"
                            href={getArteUrl(a.id, "feed")}
                            download={`feed-${a.id}.png`}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.rowLinkDownload}
                          >
                            Feed
                          </a>
                          <a
                            title="Baixar Story"
                            href={getArteUrl(a.id, "story")}
                            download={`story-${a.id}.png`}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.rowLinkDownload}
                          >
                            Story
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SEÇÃO INFERIOR DIVIDIDA */}
      <div style={styles.bottomLayout}>
        {/* Editor de Texto Consolidado em Lote */}
        <section style={styles.editorCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Oferta em Lote</h3>
            <button
              onClick={() => {
                setHasManuallyEdited(false);
                setEditedText(gerarTextoPadrao(selectedIds));
              }}
              style={styles.resetBtn}
            >
              <RotateCcw size={13} /> Forçar Texto Padrão
            </button>
          </div>
          <p style={styles.sectionDesc}>Texto unificado dos caminhões marcados na lista para divulgar estoque de uma só vez.</p>

          <textarea
            value={editedText}
            onChange={(e) => {
              setEditedText(e.target.value);
              setHasManuallyEdited(true);
            }}
            style={styles.textarea}
          />

          <div style={styles.batchActions}>
            <button
              onClick={handleWhatsappShareLote}
              disabled={selectedIds.length === 0}
              style={{ ...styles.btnWhatsapp, opacity: selectedIds.length === 0 ? 0.5 : 1 }}
            >
              <Share2 size={16} /> Compartilhar no WhatsApp
            </button>
            <button
              onClick={() => copiar(editedText, "Estoque copiado!")}
              disabled={selectedIds.length === 0}
              style={{ ...styles.btnCopiaLote, opacity: selectedIds.length === 0 ? 0.5 : 1 }}
            >
              <Copy size={16} /> Copiar Texto Consolidado
            </button>
          </div>
        </section>

        {/* Prévia de Artes Rápidas do primeiro item selecionado */}
        <section style={styles.previewCard}>
          <h3 style={styles.sectionTitle}>Mídias Rápidas</h3>
          <p style={styles.sectionDesc}>Prévia de mídias dinâmicas do primeiro veículo selecionado do lote.</p>

          {primeiroSelecionado ? (
            <div style={styles.previewContent}>
              <strong style={{ color: "#fff", display: "block", marginBottom: 10 }}>{getAdTitle(primeiroSelecionado)}</strong>
              <div style={styles.mediaRow}>
                <div style={styles.miniMediaCard}>
                  <span style={styles.mediaLabel}>Feed (1:1)</span>
                  <div style={styles.mediaBox}>
                    <img src={getArteUrl(primeiroSelecionado.id, "feed")} alt="Preview" style={styles.mediaImg} loading="lazy" />
                  </div>
                  <a href={getArteUrl(primeiroSelecionado.id, "feed")} download={`feed-${primeiroSelecionado.id}.png`} target="_blank" rel="noreferrer" style={styles.mediaDownload}>
                    <Download size={13} /> Feed
                  </a>
                </div>

                <div style={styles.miniMediaCard}>
                  <span style={styles.mediaLabel}>Story (9:16)</span>
                  <div style={styles.mediaBoxStory}>
                    <img src={getArteUrl(primeiroSelecionado.id, "story")} alt="Preview" style={styles.mediaImg} loading="lazy" />
                  </div>
                  <a href={getArteUrl(primeiroSelecionado.id, "story")} download={`story-${primeiroSelecionado.id}.png`} target="_blank" rel="noreferrer" style={styles.mediaDownload}>
                    <Download size={13} /> Story
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.previewPlaceholder}>
              Selecione ao menos um caminhão na tabela para visualizar e baixar as mídias prontas do estoque.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { display: "flex", flexDirection: "column", gap: 20 },
  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderRadius: 20,
    background: "rgba(30, 41, 59, 0.4)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    flexWrap: "wrap",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#0f172a",
    padding: "0 16px",
    borderRadius: 12,
    flex: 1,
    minWidth: 260,
    height: 44,
    border: "1px solid #1e293b",
  },
  searchInput: {
    border: 0,
    background: "transparent",
    color: "#fff",
    outline: "none",
    width: "100%",
    fontSize: 14,
  },
  selectAllBtn: {
    border: "1px solid rgba(255,255,255,0.08)",
    height: 44,
    padding: "0 16px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
  },

  tableCard: {
    borderRadius: 24,
    background: "rgba(17, 24, 39, 0.45)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
  },
  table: { width: "100%", borderCollapse: "collapse", color: "#e2e8f0" },
  thRow: { background: "#0f172a", borderBottom: "1px solid #1e293b" },
  th: { padding: "16px 20px", textTransform: "uppercase", fontSize: 11, color: "#64748b", fontWeight: 800, textAlign: "left" },
  td: { padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)", verticalAlign: "middle" },
  trNormal: { transition: "all 0.15s" },
  trSelected: { background: "rgba(16, 185, 129, 0.05)", transition: "all 0.15s" },
  emptyCell: { padding: "40px 20px", textAlign: "center", color: "#64748b", fontSize: 14 },
  checkboxBtn: { border: 0, background: "transparent", cursor: "pointer", display: "flex" },
  thumbWrapper: { width: 68, height: 48, borderRadius: 8, overflow: "hidden", background: "#334155", flexShrink: 0 },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  thumbEmpty: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b", fontSize: 10 },
  rowActions: { display: "flex", gap: 6, justifyContent: "flex-end", alignItems: "center" },
  rowBtn: {
    border: "1px solid rgba(255,255,255,0.08)",
    height: 32,
    width: 32,
    borderRadius: 8,
    background: "rgba(255,255,255,0.03)",
    color: "#94a3b8",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLinkBtn: {
    border: "1px solid rgba(255,255,255,0.08)",
    height: 32,
    width: 32,
    borderRadius: 8,
    background: "rgba(255,255,255,0.03)",
    color: "#94a3b8",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
  rowLinkDownload: {
    height: 32,
    padding: "0 10px",
    borderRadius: 8,
    background: "#1e293b",
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: 800,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  bottomLayout: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, flexWrap: "wrap" },
  editorCard: {
    padding: 24,
    borderRadius: 24,
    background: "rgba(17, 24, 39, 0.45)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  sectionTitle: { fontSize: 16, color: "#ffffff", fontWeight: 850, marginBottom: 4 },
  sectionDesc: { fontSize: 12, color: "#64748b", margin: "0 0 16px" },
  textarea: {
    width: "100%",
    minHeight: 250,
    resize: "vertical",
    borderRadius: 14,
    border: "1px solid #374151",
    background: "#1f2937",
    color: "#e5e7eb",
    padding: 16,
    fontFamily: "inherit",
    fontSize: 13,
    lineHeight: 1.45,
    outline: "none",
  },
  resetBtn: {
    border: 0,
    background: "transparent",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
  batchActions: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" },
  btnWhatsapp: {
    height: 48,
    border: 0,
    borderRadius: 12,
    background: "#25d366",
    color: "#fff",
    fontWeight: 900,
    fontSize: 13,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "0 16px",
    flex: 1,
    minWidth: 180,
  },
  btnCopiaLote: {
    height: 48,
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 13,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "0 16px",
    flex: 1,
    minWidth: 180,
  },

  previewCard: {
    padding: 24,
    borderRadius: 24,
    background: "rgba(17, 24, 39, 0.45)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  previewPlaceholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    border: "2px dashed rgba(255,255,255,0.06)",
    borderRadius: 16,
    color: "#64748b",
    textAlign: "center",
    padding: 24,
    fontSize: 14,
    lineHeight: 1.5,
  },
  previewContent: { display: "flex", flexDirection: "column" },
  mediaRow: { display: "flex", gap: 16 },
  miniMediaCard: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: 1,
    background: "#1f2937",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #374151",
  },
  mediaLabel: { fontSize: 11, color: "#64748b", fontWeight: 800, textTransform: "uppercase" },
  mediaBox: { width: "100%", aspectRatio: "1", borderRadius: 8, overflow: "hidden", background: "#080c16" },
  mediaBoxStory: { width: "100%", aspectRatio: "9/16", borderRadius: 8, overflow: "hidden", background: "#080c16" },
  mediaImg: { width: "100%", height: "100%", objectFit: "contain" },
  mediaDownload: {
    height: 32,
    borderRadius: 8,
    background: "#1e293b",
    color: "#fff",
    fontSize: 12,
    fontWeight: 800,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    border: "1px solid rgba(255,255,255,0.06)",
  },

  toast: {
    position: "fixed",
    top: 24,
    right: 24,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 20px",
    borderRadius: 16,
    background: "#1e293b",
    color: "#f8fafc",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    fontWeight: 800,
    fontSize: 13,
    animation: "slideDown 0.3s ease-out",
  },
};
