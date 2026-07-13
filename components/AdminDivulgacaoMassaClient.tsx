"use client";

import { useState, useEffect, type CSSProperties } from "react";
import { Eye, Copy, Share2, Smartphone, Landmark, RotateCcw, Download, Search, CheckSquare, Square, ExternalLink, Sparkles } from "lucide-react";
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
      return "Nenhum caminhão selecionado. Marque os caminhões na lista à esquerda para gerar o post consolidado.";
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
          <Search size={18} style={{ color: "#38bdf8" }} />
          <input
            type="text"
            placeholder="Filtrar por marca, modelo, cidade..."
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

      {/* NOVO LAYOUT PRINCIPAL DE DUAS COLUNAS */}
      <div style={styles.mainLayout}>
        
        {/* COLUNA ESQUERDA: LISTAGEM DE VEÍCULOS (ROLAGEM PRÓPRIA) */}
        <div style={styles.leftCol}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={{ ...styles.th, width: 60, textAlign: "center" }}>Sel.</th>
                  <th style={styles.th}>Veículo</th>
                  <th style={styles.th}>Preço</th>
                  <th style={styles.th}>Localidade</th>
                  <th style={{ ...styles.th, textAlign: "right", width: 220 }}>Ações Rápidas</th>
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
                        <td style={{ ...styles.td, textAlign: "center" }}>
                          <button onClick={() => toggleSelectOne(a.id)} style={styles.checkboxBtn}>
                            {isSelected ? (
                              <CheckSquare size={22} style={{ color: "#10b981", filter: "drop-shadow(0 0 4px rgba(16,185,129,0.3))" }} />
                            ) : (
                              <Square size={22} style={{ color: "#64748b" }} />
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
                              <strong style={{ color: "#ffffff", fontSize: 14, fontWeight: 700 }}>{title}</strong>
                              <span style={{ color: "#64748b", fontSize: 11 }}>Configuração: {[a.carroceria, a.tracao].filter(Boolean).join(" • ")}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...styles.td, color: "#10b981", fontWeight: 800, fontSize: 14 }}>{money(a.preco)}</td>
                        <td style={{ ...styles.td, color: "#f8fafc", fontSize: 13 }}>{a.cidade}/{a.estado}</td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          <div style={styles.rowActions}>
                            <button
                              title="Copiar legenda individual"
                              onClick={() => {
                                const textoCurto = `🚛 ${title}\n📍 ${a.cidade || ""}/${a.estado || ""}\n💰 ${money(a.preco)}\n📲 Fotos: ${link}`;
                                copiar(textoCurto, "Legenda copiada!");
                              }}
                              style={styles.rowBtn}
                            >
                              <Copy size={13} />
                            </button>
                            <a
                              title="WhatsApp Individual"
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🚛 ${title}\n📍 ${a.cidade}/${a.estado}\n💰 ${money(a.preco)}\n📲 Detalhes: ${link}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.rowBtn}
                            >
                              <Share2 size={13} />
                            </a>
                            <a
                              title="Ver anúncio público"
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.rowBtn}
                            >
                              <ExternalLink size={13} />
                            </a>
                            <a
                              title="Baixar Feed IA"
                              href={getArteUrl(a.id, "feed")}
                              download={`feed-${a.id}.png`}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.rowLinkDownloadFeed}
                            >
                              Feed
                            </a>
                            <a
                              title="Baixar Story IA"
                              href={getArteUrl(a.id, "story")}
                              download={`story-${a.id}.png`}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.rowLinkDownloadStory}
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
        </div>

        {/* COLUNA DIREITA: EDITOR DE LOTE E PRÉVIAS IA (FIXO/STICKY) */}
        <div style={styles.rightCol}>
          
          {/* Caixa do Editor de Lote */}
          <section style={styles.editorCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ ...styles.sectionTitle, margin: 0 }}>📋 Post de Estoque em Lote</h3>
              <button
                onClick={() => {
                  setHasManuallyEdited(false);
                  setEditedText(gerarTextoPadrao(selectedIds));
                }}
                style={styles.resetBtn}
              >
                <RotateCcw size={12} /> Restaurar Padrão
              </button>
            </div>

            <textarea
              value={editedText}
              onChange={(e) => {
                setEditedText(e.target.value);
                setHasManuallyEdited(true);
              }}
              style={styles.textarea}
              placeholder="Marque os caminhões na lista para criar seu post..."
            />

            <div style={styles.batchActions}>
              <button
                onClick={handleWhatsappShareLote}
                disabled={selectedIds.length === 0}
                style={{ ...styles.btnWhatsapp, opacity: selectedIds.length === 0 ? 0.4 : 1 }}
              >
                <Share2 size={15} /> Disparar WhatsApp
              </button>
              <button
                onClick={() => copiar(editedText, "Post copiado com sucesso!")}
                disabled={selectedIds.length === 0}
                style={{ ...styles.btnCopiaLote, opacity: selectedIds.length === 0 ? 0.4 : 1 }}
              >
                <Copy size={15} /> Copiar Texto
              </button>
            </div>
          </section>

          {/* Prévia de Artes Rápidas com Tagline de IA */}
          <section style={styles.previewCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Sparkles size={16} style={{ color: "#22c55e" }} />
              <h3 style={{ ...styles.sectionTitle, margin: 0 }}>🖼️ Arte Gráfica Inteligente (IA)</h3>
            </div>

            {primeiroSelecionado ? (
              <div style={styles.previewContent}>
                <strong style={{ color: "#38bdf8", display: "block", marginBottom: 12, fontSize: 13, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  Foco: {getAdTitle(primeiroSelecionado)}
                </strong>
                
                <div style={styles.mediaRow}>
                  <div style={styles.miniMediaCard}>
                    <span style={styles.mediaLabel}>Feed 1:1 (IA)</span>
                    <div style={styles.mediaBox}>
                      <img src={getArteUrl(primeiroSelecionado.id, "feed")} alt="Preview Feed" style={styles.mediaImg} loading="lazy" />
                    </div>
                    <a href={getArteUrl(primeiroSelecionado.id, "feed")} download={`feed-${primeiroSelecionado.id}.png`} target="_blank" rel="noreferrer" style={styles.mediaDownloadFeed}>
                      <Download size={12} /> Salvar Feed
                    </a>
                  </div>

                  <div style={styles.miniMediaCard}>
                    <span style={styles.mediaLabel}>Story 9:16 (IA)</span>
                    <div style={styles.mediaBoxStory}>
                      <img src={getArteUrl(primeiroSelecionado.id, "story")} alt="Preview Story" style={styles.mediaImg} loading="lazy" />
                    </div>
                    <a href={getArteUrl(primeiroSelecionado.id, "story")} download={`story-${primeiroSelecionado.id}.png`} target="_blank" rel="noreferrer" style={styles.mediaDownloadStory}>
                      <Download size={12} /> Salvar Story
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.previewPlaceholder}>
                Selecione ao menos um caminhão da lista para carregar e baixar os designs profissionais com taglines comerciais geradas por IA.
              </div>
            )}
          </section>
        </div>
        
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { display: "flex", flexDirection: "column", gap: 16 },
  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    background: "#1e293b",
    border: "1px solid rgba(255,255,255,0.06)",
    flexWrap: "wrap",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#0f172a",
    padding: "0 12px",
    borderRadius: 10,
    flex: 1,
    minWidth: 260,
    height: 40,
    border: "1px solid #334155",
  },
  searchInput: {
    border: 0,
    background: "transparent",
    color: "#fff",
    outline: "none",
    width: "100%",
    fontSize: 13,
  },
  selectAllBtn: {
    border: "1px solid rgba(255,255,255,0.08)",
    height: 40,
    padding: "0 14px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    fontWeight: 800,
    fontSize: 12,
    cursor: "pointer",
  },

  mainLayout: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  leftCol: {
    flex: 1.3,
    minWidth: 480,
    display: "flex",
    flexDirection: "column",
  },
  rightCol: {
    flex: 0.9,
    minWidth: 320,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    position: "sticky",
    top: 20,
  },

  tableWrapper: {
    maxHeight: "72vh",
    overflowY: "auto",
    borderRadius: 16,
    background: "#0f172a",
    border: "1px solid #1e293b",
  },
  table: { width: "100%", borderCollapse: "collapse", color: "#e2e8f0" },
  thRow: { background: "#090d16", borderBottom: "1.5px solid #1e293b", position: "sticky", top: 0, zIndex: 10 },
  th: { padding: "12px 16px", textTransform: "uppercase", fontSize: 11, color: "#64748b", fontWeight: 800, textAlign: "left" },
  td: { padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.03)", verticalAlign: "middle" },
  trNormal: { transition: "all 0.15s", background: "rgba(30, 41, 59, 0.15)" },
  trSelected: { background: "rgba(16, 185, 129, 0.08)", transition: "all 0.15s" },
  emptyCell: { padding: "40px 20px", textAlign: "center", color: "#64748b", fontSize: 13 },
  checkboxBtn: { border: 0, background: "transparent", cursor: "pointer", display: "flex", padding: 0 },
  thumbWrapper: { width: 56, height: 42, borderRadius: 6, overflow: "hidden", background: "#1e293b", flexShrink: 0 },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  thumbEmpty: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#475569", fontSize: 9 },
  rowActions: { display: "flex", gap: 5, justifyContent: "flex-end", alignItems: "center" },
  rowBtn: {
    border: "1px solid rgba(255,255,255,0.08)",
    height: 28,
    width: 28,
    borderRadius: 6,
    background: "rgba(255,255,255,0.03)",
    color: "#cbd5e1",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLinkDownloadFeed: {
    height: 28,
    padding: "0 10px",
    borderRadius: 6,
    background: "#3b82f6",
    color: "#ffffff",
    fontSize: 11,
    fontWeight: 800,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: 0,
    boxShadow: "0 2px 6px rgba(59,130,246,0.2)",
  },
  rowLinkDownloadStory: {
    height: 28,
    padding: "0 10px",
    borderRadius: 6,
    background: "#eab308",
    color: "#000000",
    fontSize: 11,
    fontWeight: 800,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: 0,
    boxShadow: "0 2px 6px rgba(234,179,8,0.2)",
  },

  editorCard: {
    padding: 16,
    borderRadius: 16,
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  sectionTitle: { fontSize: 14, color: "#ffffff", fontWeight: 800 },
  textarea: {
    width: "100%",
    minHeight: 180,
    resize: "vertical",
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    padding: 12,
    fontFamily: "inherit",
    fontSize: 12,
    lineHeight: 1.4,
    outline: "none",
    marginTop: 8,
  },
  resetBtn: {
    border: 0,
    background: "transparent",
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: 800,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
  batchActions: { display: "flex", gap: 8, marginTop: 10 },
  btnWhatsapp: {
    height: 40,
    border: 0,
    borderRadius: 8,
    background: "#22c55e",
    color: "#052e16",
    fontWeight: 900,
    fontSize: 12,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "0 12px",
    flex: 1,
  },
  btnCopiaLote: {
    height: 40,
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 12,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "0 12px",
    flex: 1,
  },

  previewCard: {
    padding: 16,
    borderRadius: 16,
    background: "#1e293b",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  previewPlaceholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    border: "2px dashed rgba(255,255,255,0.05)",
    borderRadius: 12,
    color: "#64748b",
    textAlign: "center",
    padding: 16,
    fontSize: 12,
    lineHeight: 1.4,
  },
  previewContent: { display: "flex", flexDirection: "column" },
  mediaRow: { display: "flex", gap: 10 },
  miniMediaCard: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
    background: "#0f172a",
    padding: 10,
    borderRadius: 10,
    border: "1px solid #334155",
  },
  mediaLabel: { fontSize: 10, color: "#64748b", fontWeight: 800, textTransform: "uppercase" },
  mediaBox: { width: "100%", aspectRatio: "1", borderRadius: 6, overflow: "hidden", background: "#020617", border: "1px solid #1e293b" },
  mediaBoxStory: { width: "100%", aspectRatio: "9/16", borderRadius: 6, overflow: "hidden", background: "#020617", border: "1px solid #1e293b" },
  mediaImg: { width: "100%", height: "100%", objectFit: "contain" },
  mediaDownloadFeed: {
    height: 30,
    borderRadius: 6,
    background: "#3b82f6",
    color: "#ffffff",
    fontSize: 11,
    fontWeight: 800,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    border: 0,
  },
  mediaDownloadStory: {
    height: 30,
    borderRadius: 6,
    background: "#eab308",
    color: "#000000",
    fontSize: 11,
    fontWeight: 800,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    border: 0,
  },

  toast: {
    position: "fixed",
    top: 24,
    right: 24,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    borderRadius: 12,
    background: "#1e293b",
    color: "#f8fafc",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    fontWeight: 800,
    fontSize: 12,
  },
};
