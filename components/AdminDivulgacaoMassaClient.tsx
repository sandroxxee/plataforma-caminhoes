"use client";

import { useState, useEffect, type CSSProperties } from "react";
import { Eye, Copy, Share2, Smartphone, Landmark, RotateCcw, Download, Search, CheckSquare, Square, ExternalLink, Sparkles, Filter, ListFilter, Trash2 } from "lucide-react";
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

type TemplateKey = "estoque" | "descontos" | "novidades";

const TEMPLATES: Record<TemplateKey, { label: string; template: (items: string[], destaqueStr: string) => string }> = {
  estoque: {
    label: "📋 Estoque do Dia",
    template: (items: string[], destaqueStr: string) => {
      const dataAbreviada = new Date().toLocaleDateString("pt-BR");
      let txt = `🚛 *ESTOQUE DE OFERTAS DO DIA - ${dataAbreviada}* 🚛\n\n`;
      if (destaqueStr) txt += `${destaqueStr}\n\n`;
      txt += `Confira as melhores oportunidades em nosso estoque:\n\n`;
      txt += items.join("\n\n");
      txt += `\n\n📲 Chame no WhatsApp ou fale conosco diretamente nos anúncios!`;
      return txt;
    }
  },
  descontos: {
    label: "🔥 Feirão de Descontos",
    template: (items: string[], destaqueStr: string) => {
      let txt = `💥 *SUPER FEIRÃO DE CAMINHÕES & IMPLEMENTOS* 💥\n`;
      txt += `Preços imperdíveis e taxas especiais para fechar negócio hoje!\n\n`;
      if (destaqueStr) txt += `👉 ${destaqueStr}\n\n`;
      txt += `Veja a lista completa:\n\n`;
      txt += items.join("\n\n");
      txt += `\n\n💬 Faça sua proposta diretamente pelo link ou nos chame no WhatsApp!`;
      return txt;
    }
  },
  novidades: {
    label: "✨ Novidades da Semana",
    template: (items: string[], destaqueStr: string) => {
      let txt = `✨ *NOVIDADES EXCLUSIVAS NO ESTOQUE* ✨\n`;
      txt += `Acabaram de chegar na nossa plataforma. Veículos revisados e prontos para trabalhar!\n\n`;
      if (destaqueStr) txt += `🌟 ${destaqueStr}\n\n`;
      txt += `Confira os modelos:\n\n`;
      txt += items.join("\n\n");
      txt += `\n\nTrabalhe com o melhor! Fale conosco no privado ou acesse os detalhes nos links acima.`;
      return txt;
    }
  }
};

export function AdminDivulgacaoMassaClient({ anuncios }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
  const [copiado, setCopiado] = useState<string | null>(null);
  
  // Novo tema para as artes geradas
  const [tema, setTema] = useState("neon");
  
  // Seleção de template ativo
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>("estoque");
  
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

  // Encontra o veículo mais barato do lote selecionado
  const obterVeiculoMaisBarato = (ids: string[]): Truck | null => {
    const selecionados = anuncios.filter((a) => ids.includes(a.id));
    const comPrecoValido = selecionados.filter((a) => a.preco && a.preco > 0);
    if (comPrecoValido.length === 0) return null;
    return comPrecoValido.reduce((min, current) => (current.preco! < min.preco! ? current : min), comPrecoValido[0]);
  };

  // Gerar o texto consolidado padrão das seleções
  const gerarTextoPadrao = (ids: string[], templateKey: TemplateKey) => {
    const selecionados = anuncios.filter((a) => ids.includes(a.id));
    if (selecionados.length === 0) {
      return "Nenhum caminhão selecionado. Marque os caminhões na lista à esquerda para gerar o post consolidado.";
    }

    // Identificar veículo mais barato para destaque
    const maisBarato = obterVeiculoMaisBarato(ids);
    let destaqueStr = "";
    if (maisBarato) {
      const tituloMaisBarato = getAdTitle(maisBarato);
      const precoMaisBarato = money(maisBarato.preco);
      destaqueStr = `⭐ *Destaque do Lote:* ${tituloMaisBarato} por apenas *${precoMaisBarato}*!`;
    }

    const itemsText = selecionados.map((a, idx) => {
      const title = getAdTitle(a);
      const precoStr = money(a.preco);
      const local = [a.cidade, a.estado].filter(Boolean).join("/");
      
      // Gerando link encurtado fake com parâmetros de rastreamento UTM
      const linkBase = getAdUrl(a);
      const linkComUtm = `${linkBase}?utm_source=whatsapp&utm_medium=lote-divulgacao&utm_campaign=admin-dashboard`;

      let itemTxt = `${idx + 1}️⃣ *${title}*\n`;
      itemTxt += `💰 Valor: ${precoStr}\n`;
      if (local) itemTxt += `📍 Local: ${local}\n`;
      itemTxt += `🔗 Fotos e detalhes: ${linkComUtm}`;
      return itemTxt;
    });

    return TEMPLATES[templateKey].template(itemsText, destaqueStr);
  };

  // Atualizar o texto de lote quando as seleções mudam
  useEffect(() => {
    if (!hasManuallyEdited) {
      setEditedText(gerarTextoPadrao(selectedIds, activeTemplate));
    }
  }, [selectedIds, activeTemplate, hasManuallyEdited]);

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

  // Funções de filtros/seleções rápidas
  const selecionarCincoMaisBaratos = () => {
    const ordenados = [...anunciosFiltrados]
      .filter((a) => a.preco && a.preco > 0)
      .sort((a, b) => (a.preco || 0) - (b.preco || 0))
      .slice(0, 5);
    
    setSelectedIds(ordenados.map((a) => a.id));
    setHasManuallyEdited(false);
  };

  const selecionarCincoMaisRecentes = () => {
    const recentes = anunciosFiltrados.slice(0, 5);
    setSelectedIds(recentes.map((a) => a.id));
    setHasManuallyEdited(false);
  };

  const limparSelecao = () => {
    setSelectedIds([]);
    setHasManuallyEdited(false);
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

  const primeiroSelecionado = anuncios.find((a) => selectedIds.includes(a.id));

  const getArteUrl = (id: string, tipo: "feed" | "story" | "whatsapp") => {
    return `/api/admin/gerar-arte/${id}?formato=${tipo}&tema=${tema}`;
  };

  return (
    <div className="admin-grid" style={{ gap: 20 }}>
      {copiado && (
        <div style={styles.toast}>
          <span>✨</span> <span>{copiado}</span>
        </div>
      )}

      {/* BARRA DE FILTROS E BUSCA (USANDO CLASSES DE ADMIN.CSS) */}
      <section className="admin-toolbar" style={{ margin: 0, padding: 12 }}>
        <div className="admin-search-box" style={{ flex: 1, minWidth: 260, height: 42 }}>
          <Search size={18} style={{ color: "var(--blue)" }} />
          <input
            type="text"
            placeholder="Filtrar por marca, modelo, cidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="admin-search-input"
          />
        </div>
        
        {/* BOTÕES DE SELEÇÃO RÁPIDA (USANDO CLASSES DE ADMIN.CSS) */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={selecionarCincoMaisBaratos} className="admin-btn admin-btn-edit" style={{ height: 42, padding: "0 12px", borderRadius: 12, gap: 6 }} title="Selecionar os 5 anúncios com menor valor">
            <Filter size={13} />
            5 Mais Baratos
          </button>
          
          <button onClick={selecionarCincoMaisRecentes} className="admin-btn admin-btn-edit" style={{ height: 42, padding: "0 12px", borderRadius: 12, gap: 6 }} title="Selecionar os 5 anúncios cadastrados mais recentemente">
            <ListFilter size={13} />
            5 Mais Recentes
          </button>

          <button onClick={limparSelecao} className="admin-btn admin-btn-delete" style={{ height: 42, padding: "0 12px", borderRadius: 12, gap: 6 }} title="Limpar seleção atual">
            <Trash2 size={13} />
            Limpar
          </button>

          <button onClick={toggleSelectAll} className="admin-btn admin-btn-approve" style={{ height: 42, padding: "0 16px", borderRadius: 12 }}>
            {selectedIds.length === anunciosFiltrados.length ? (
              <> Desmarcar Todos ({selectedIds.length})</>
            ) : (
              <> Selecionar Filtrados ({anunciosFiltrados.length})</>
            )}
          </button>
        </div>
      </section>

      {/* LAYOUT PRINCIPAL DE DUAS COLUNAS */}
      <div style={styles.mainLayout}>
        
        {/* COLUNA ESQUERDA: LISTAGEM DE VEÍCULOS */}
        <div style={styles.leftCol}>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 60, textAlign: "center" }}>Sel.</th>
                  <th>Veículo</th>
                  <th>Preço</th>
                  <th>Localidade</th>
                  <th style={{ textAlign: "right", width: 220 }}>Ações Rápidas</th>
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
                      <tr key={a.id} style={isSelected ? { background: "var(--blueSoft)" } : undefined}>
                        <td style={{ textAlign: "center" }}>
                          <button onClick={() => toggleSelectOne(a.id)} style={styles.checkboxBtn}>
                            {isSelected ? (
                              <CheckSquare size={22} style={{ color: "var(--blue)", filter: "drop-shadow(0 0 4px var(--blueSoft))" }} />
                            ) : (
                              <Square size={22} style={{ color: "var(--muted)" }} />
                            )}
                          </button>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={styles.thumbWrapper}>
                              {thumb ? (
                                <img src={thumb} alt={title} style={styles.thumbImg} />
                              ) : (
                                <div style={styles.thumbEmpty}>FOTO</div>
                              )}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <strong style={{ color: "var(--text)", fontSize: 14, fontWeight: 700 }}>{title}</strong>
                              <span style={{ color: "var(--muted)", fontSize: 11 }}>Configuração: {[a.carroceria, a.tracao].filter(Boolean).join(" • ")}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: "var(--blue)", fontWeight: 800, fontSize: 14 }}>{money(a.preco)}</td>
                        <td style={{ color: "var(--text)", fontSize: 13 }}>{a.cidade}/{a.estado}</td>
                        <td style={{ textAlign: "right" }}>
                          <div style={styles.rowActions}>
                            <button
                              title="Copiar legenda individual"
                              onClick={() => {
                                const textoCurto = `... ${title}\n.. ${a.cidade || ""}/${a.estado || ""}\n.. ${money(a.preco)}\n.. Fotos: ${link}`;
                                copiar(textoCurto, "Legenda copiada!");
                              }}
                              className="admin-btn admin-btn-edit"
                              style={{ height: 30, width: 30, padding: 0, borderRadius: 8 }}
                            >
                              <Copy size={13} />
                            </button>
                            <a
                              title="WhatsApp Individual"
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`... ${title}\n.. ${a.cidade}/${a.estado}\n.. ${money(a.preco)}\n.. Detalhes: ${link}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="admin-btn admin-btn-edit"
                              style={{ height: 30, width: 30, padding: 0, borderRadius: 8 }}
                            >
                              <Share2 size={13} />
                            </a>
                            <a
                              title="Ver anúncio público"
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              className="admin-btn admin-btn-edit"
                              style={{ height: 30, width: 30, padding: 0, borderRadius: 8 }}
                            >
                              <ExternalLink size={13} />
                            </a>
                            <a
                              title="Baixar Feed IA"
                              href={getArteUrl(a.id, "feed")}
                              download={`feed-${a.id}.png`}
                              target="_blank"
                              rel="noreferrer"
                              className="admin-btn admin-btn-approve"
                              style={{ height: 30, padding: "0 10px", borderRadius: 8, fontSize: 11 }}
                            >
                              Feed
                            </a>
                            <a
                              title="Baixar Story IA"
                              href={getArteUrl(a.id, "story")}
                              download={`story-${a.id}.png`}
                              target="_blank"
                              rel="noreferrer"
                              className="admin-btn"
                              style={{ height: 30, padding: "0 10px", borderRadius: 8, background: "#eab308", color: "#000", fontSize: 11 }}
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

        {/* COLUNA DIREITA: EDITOR DE LOTE E PRÉVIAS IA */}
        <div style={styles.rightCol}>
          
          {/* Caixa do Editor de Lote */}
          <section className="admin-card" style={{ display: "block", padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ ...styles.sectionTitle, margin: 0 }}>📋 Post de Estoque</h3>
                
                {/* SELETOR DE TEMPLATE */}
                <select
                  value={activeTemplate}
                  onChange={(e) => {
                    setActiveTemplate(e.target.value as TemplateKey);
                    setHasManuallyEdited(false);
                  }}
                  className="admin-select"
                  style={{
                    height: 30,
                    borderRadius: 8,
                    fontSize: 12,
                    padding: "0 8px",
                  }}
                >
                  {Object.entries(TEMPLATES).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setHasManuallyEdited(false);
                  setEditedText(gerarTextoPadrao(selectedIds, activeTemplate));
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
          <section className="admin-card" style={{ display: "block", padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <Sparkles size={16} style={{ color: "var(--success)" }} />
              <h3 style={{ ...styles.sectionTitle, margin: 0 }}>🖼️ Arte Gráfica Inteligente (IA)</h3>
            </div>

            {primeiroSelecionado ? (
              <div style={styles.previewContent}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <strong style={{ color: "var(--blue)", fontSize: 13, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1, margin: 0 }}>
                    Foco: {getAdTitle(primeiroSelecionado)}
                  </strong>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--soft)", padding: "2px 8px", borderRadius: 8, border: "1px solid var(--line)" }}>
                    <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 800 }}>Modelo:</span>
                    <select
                      value={tema}
                      onChange={(e) => setTema(e.target.value)}
                      style={{
                        background: "transparent",
                        color: "var(--text)",
                        border: 0,
                        fontSize: 11,
                        fontWeight: 800,
                        outline: "none",
                        cursor: "pointer",
                        paddingRight: 4
                      }}
                    >
                      <option value="neon" style={{ background: "var(--surface)", color: "var(--text)" }}>🔵 Neon</option>
                      <option value="gold" style={{ background: "var(--surface)", color: "var(--text)" }}>🟡 Ouro</option>
                      <option value="glass" style={{ background: "var(--surface)", color: "var(--text)" }}>🌸 Glass</option>
                      <option value="light" style={{ background: "var(--surface)", color: "var(--text)" }}>⚪ Light</option>
                    </select>
                  </div>
                </div>
                
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
  checkboxBtn: { border: 0, background: "transparent", cursor: "pointer", display: "flex", padding: 0 },
  thumbWrapper: { width: 56, height: 42, borderRadius: 6, overflow: "hidden", background: "var(--soft)", flexShrink: 0 },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  thumbEmpty: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--muted)", fontSize: 9 },
  rowActions: { display: "flex", gap: 5, justifyContent: "flex-end", alignItems: "center" },
  emptyCell: { padding: "40px 20px", textAlign: "center", color: "var(--muted)", fontSize: 13 },
  mainLayout: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "100%",
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

  sectionTitle: { fontSize: 14, color: "var(--text)", fontWeight: 800 },
  textarea: {
    width: "100%",
    minHeight: 180,
    resize: "vertical",
    borderRadius: 10,
    border: "1px solid var(--line)",
    background: "var(--soft)",
    color: "var(--text)",
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
    color: "var(--blue)",
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
    border: "1px solid var(--line)",
    borderRadius: 8,
    background: "var(--soft)",
    color: "var(--text)",
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

  previewPlaceholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    border: "2px dashed var(--line)",
    borderRadius: 12,
    color: "var(--muted)",
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
    background: "var(--soft)",
    padding: 10,
    borderRadius: 10,
    border: "1px solid var(--line)",
  },
  mediaLabel: { fontSize: 10, color: "var(--muted)", fontWeight: 800, textTransform: "uppercase" },
  mediaBox: { width: "100%", aspectRatio: "1", borderRadius: 6, overflow: "hidden", background: "var(--bg)", border: "1px solid var(--line)" },
  mediaBoxStory: { width: "100%", aspectRatio: "9/16", borderRadius: 6, overflow: "hidden", background: "var(--bg)", border: "1px solid var(--line)" },
  mediaImg: { width: "100%", height: "100%", objectFit: "contain" },
  mediaDownloadFeed: {
    height: 30,
    borderRadius: 6,
    background: "var(--blue)",
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
    background: "var(--surface)",
    color: "var(--text)",
    border: "1px solid var(--line)",
    boxShadow: "var(--shadow)",
    fontWeight: 800,
    fontSize: 12,
  },
};
