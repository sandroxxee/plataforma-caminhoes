"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { aprovarAnuncio, reprovarAnuncio, excluirAnuncioAdmin, vincularAnunciosParceiroAction, toggleSeloAction } from "../actions";
import { Loader2, CheckCircle2, AlertTriangle, Landmark, CheckSquare, Square, Search, Handshake } from "lucide-react";

type TruckImage = { image_url: string | null; principal: boolean | null; ordem: number | null };
type Truck = {
  id: string;
  titulo: string | null;
  status: string | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
  marca: string | null;
  modelo: string | null;
  whatsapp?: string | null;
  destaque?: boolean | null;
  verificado?: boolean | null;
  abaixo_fipe?: boolean | null;
  truck_images?: TruckImage[];
};

type Parceiro = {
  id: string;
  nome: string;
  celular: string;
};

import { formatImageUrl } from "@/lib/truck-utils";

function getMainImage(truck: Truck) {
  const images = truck.truck_images || [];
  const principal = images.find((img) => img.principal);
  const first = [...images].sort((a, b) => (a.ordem || 0) - (b.ordem || 0))[0];
  return formatImageUrl(principal?.image_url || first?.image_url || "");
}

function money(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function statusLabel(status: string | null) {
  if (status === "aprovado") return "Aprovado";
  if (status === "reprovado") return "Reprovado";
  if (status === "pendente") return "Pendente";
  return status || "Sem status";
}

type Props = {
  initialTrucks: Truck[];
  parceiros: Parceiro[];
};

export default function AdminAnunciosClient({ initialTrucks, parceiros }: Props) {
  const searchParams = useSearchParams();
  const targetWhatsApp = searchParams.get("whatsapp") || "";
  const targetNome = searchParams.get("nome") || "";

  const [trucks, setTrucks] = useState<Truck[]>(initialTrucks);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedParceiroWa, setSelectedParceiroWa] = useState(targetWhatsApp);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Pré-selecionar o parceiro na URL se houver
  useEffect(() => {
    if (targetWhatsApp) {
      setSelectedParceiroWa(targetWhatsApp);
    }
  }, [targetWhatsApp]);

  // Filtra anúncios por termo de busca
  const filteredTrucks = trucks.filter((t) => {
    const s = searchTerm.toLowerCase();
    return (
      (t.titulo || "").toLowerCase().includes(s) ||
      (t.marca || "").toLowerCase().includes(s) ||
      (t.modelo || "").toLowerCase().includes(s) ||
      (t.cidade || "").toLowerCase().includes(s)
    );
  });

  // Mapeia o WhatsApp do anúncio ao nome do parceiro correspondente
  function obterParceiroDoAnuncio(truckWa: string | null) {
    if (!truckWa) return null;
    const cleanWa = truckWa.replace(/\D/g, "");
    const match = parceiros.find((p) => p.celular.replace(/\D/g, "") === cleanWa);
    return match ? match.nome : null;
  }

  // Alterna a seleção de um anúncio individual
  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  // Alterna a seleção de todos os anúncios filtrados
  function toggleSelectAll() {
    if (selectedIds.length === filteredTrucks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTrucks.map((t) => t.id));
    }
  }

  // Envia a vinculação em lote
  async function handleVincularLote() {
    setErrorMsg("");
    setSuccessMsg("");

    if (selectedIds.length === 0) {
      setErrorMsg("Nenhum anúncio selecionado.");
      return;
    }

    if (!selectedParceiroWa) {
      setErrorMsg("Selecione um parceiro/loja para vincular.");
      return;
    }

    const parceiroNome = parceiros.find((p) => p.celular.replace(/\D/g, "") === selectedParceiroWa.replace(/\D/g, ""))?.nome || "parceiro";

    if (!confirm(`Deseja mover os ${selectedIds.length} anúncios selecionados para o estoque da loja "${parceiroNome}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await vincularAnunciosParceiroAction(selectedIds, selectedParceiroWa);

      if (res.error) {
        throw new Error(res.error);
      }

      setSuccessMsg(`Sucesso! Os anúncios foram vinculados à loja "${parceiroNome}".`);
      
      // Atualiza o estado local do WhatsApp dos caminhões vinculados
      setTrucks((prev) =>
        prev.map((t) =>
          selectedIds.includes(t.id) ? { ...t, whatsapp: selectedParceiroWa } : t
        )
      );
      setSelectedIds([]);
    } catch (err: any) {
      setErrorMsg(err?.message || "Erro ao vincular anúncios.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleSelo(id: string, campo: "destaque" | "verificado" | "abaixo_fipe", valorAtual: boolean) {
    // Atualização otimista
    setTrucks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, [campo]: !valorAtual } : t
      )
    );

    try {
      const res = await toggleSeloAction(id, campo, valorAtual);
      if (res.error) {
        throw new Error(res.error);
      }
      setSuccessMsg("Selo atualizado com sucesso!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao atualizar selo.");
      // Desfaz alteração em caso de falha
      setTrucks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, [campo]: valorAtual } : t
        )
      );
    }
  }


  return (
    <div className="admin-grid" style={{ gap: 16 }}>
      
      {/* MODO VINCULAÇÃO ATIVO */}
      {targetWhatsApp && targetNome && (
        <div className="admin-alert admin-alert-warning">
          <Handshake size={20} />
          <div>
            <strong>Modo Vinculação Ativo:</strong> Vinculando estoque para a loja <strong>{targetNome}</strong>.
            <div style={{ fontSize: 13, marginTop: 4, opacity: 0.9 }}>
              Marque os checkboxes dos caminhões abaixo e depois clique no botão <strong>"Aplicar ao Estoque da Loja"</strong> no painel de lote abaixo.
            </div>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="admin-alert admin-alert-success">
          <CheckCircle2 size={18} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="admin-alert admin-alert-error">
          <AlertTriangle size={18} />
          {errorMsg}
        </div>
      )}

      {/* FERRAMENTAS DE BUSCA E LOTE */}
      <div className="admin-toolbar">
        
        {/* BUSCA RAPIDA */}
        <div className="admin-search-box">
          <Search size={18} style={{ color: "var(--muted)" }} />
          <input 
            type="text" 
            placeholder="Pesquisar por título, marca ou cidade..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="admin-search-input"
          />
        </div>

        {/* CONTROLE EM LOTE */}
        <div className="admin-lote-box">
          <select 
            value={selectedParceiroWa} 
            onChange={(e) => setSelectedParceiroWa(e.target.value)}
            className="admin-select"
          >
            <option value="">-- Selecione a Loja Parceira --</option>
            {parceiros.map((p) => (
              <option key={p.id} value={p.celular}>
                {p.nome}
              </option>
            ))}
          </select>

          <button 
            onClick={handleVincularLote}
            disabled={loading || selectedIds.length === 0}
            className="admin-lote-btn"
            style={selectedIds.length === 0 ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
          >
            {loading ? (
              <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Aplicando...</>
            ) : (
              `Aplicar ao Estoque (${selectedIds.length})`
            )}
          </button>
        </div>

      </div>

      {/* LISTAGEM */}
      <div className="admin-grid" style={{ gap: 12 }}>
        
        {/* CABEÇALHO SELECT ALL */}
        {filteredTrucks.length > 0 && (
          <div className="admin-select-all-header" onClick={toggleSelectAll}>
            <button className="admin-checkbox-btn">
              {selectedIds.length === filteredTrucks.length ? (
                <CheckSquare size={20} style={{ color: "var(--blue)" }} />
              ) : (
                <Square size={20} style={{ color: "var(--muted)" }} />
              )}
            </button>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--muted)" }}>
              {selectedIds.length === filteredTrucks.length ? "Desmarcar todos" : `Marcar todos (${filteredTrucks.length} anúncios)`}
            </span>
          </div>
        )}

        {filteredTrucks.map((truck) => {
          const image = getMainImage(truck);
          const lojaVinculada = obterParceiroDoAnuncio(truck.whatsapp || null);
          const isSelected = selectedIds.includes(truck.id);

          return (
            <article key={truck.id} className="admin-list-row" style={isSelected ? { borderColor: "var(--blue)", background: "var(--blueSoft)" } : undefined}>
              
              {/* CHECKBOX SELEÇÃO */}
              <button onClick={() => toggleSelect(truck.id)} className="admin-checkbox-btn">
                {isSelected ? (
                  <CheckSquare size={22} style={{ color: "var(--blue)" }} />
                ) : (
                  <Square size={22} style={{ color: "var(--muted)" }} />
                )}
              </button>

              <div className="admin-list-thumb">
                {image ? <img src={image} alt={truck.titulo || "Caminhão"} className="admin-card-image" /> : <span>Sem foto</span>}
              </div>

              <div className="admin-card-body" style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 4, padding: 0 }}>
                <strong className="admin-card-title" style={{ margin: 0, fontSize: 16 }}>{truck.titulo}</strong>
                <p className="admin-card-desc" style={{ margin: 0, color: "var(--muted)", fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {truck.marca} {truck.modelo} • {truck.cidade}/{truck.estado} • {money(truck.preco)}
                </p>
                
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                  {/* TAG DA LOJA PARCEIRA */}
                  {lojaVinculada ? (
                    <span className="admin-card-status" style={{ background: "var(--blueSoft)", color: "var(--blue)", border: 0, padding: "3px 8px", width: "fit-content", textTransform: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Landmark size={11} /> Estoque: {lojaVinculada}
                    </span>
                  ) : (
                    <span className="admin-card-status" style={{ background: "var(--soft)", color: "var(--muted)", border: 0, padding: "3px 8px", width: "fit-content", textTransform: "none" }}>
                      Particular / Sem Loja
                    </span>
                  )}

                  {/* CONTROLES DE SELOS */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--soft)", padding: "2px 6px", borderRadius: 8, border: "1px solid var(--line)" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", marginRight: 4 }}>Selos:</span>
                    
                    <button
                      onClick={() => handleToggleSelo(truck.id, "destaque", !!truck.destaque)}
                      style={{
                        border: 0,
                        background: truck.destaque ? "rgba(234, 179, 8, 0.15)" : "transparent",
                        color: truck.destaque ? "#d97706" : "var(--muted)",
                        fontSize: 11,
                        fontWeight: 900,
                        padding: "3px 8px",
                        borderRadius: 6,
                        cursor: "pointer"
                      }}
                      title="Alternar selo de Destaque"
                    >
                      ★ Destaque
                    </button>

                    <button
                      onClick={() => handleToggleSelo(truck.id, "verificado", !!truck.verificado)}
                      style={{
                        border: 0,
                        background: truck.verificado ? "rgba(34, 197, 94, 0.15)" : "transparent",
                        color: truck.verificado ? "#166534" : "var(--muted)",
                        fontSize: 11,
                        fontWeight: 900,
                        padding: "3px 8px",
                        borderRadius: 6,
                        cursor: "pointer"
                      }}
                      title="Alternar selo de Verificado"
                    >
                      ✓ Verificado
                    </button>

                    <button
                      onClick={() => handleToggleSelo(truck.id, "abaixo_fipe", !!truck.abaixo_fipe)}
                      style={{
                        border: 0,
                        background: truck.abaixo_fipe ? "rgba(6, 182, 212, 0.15)" : "transparent",
                        color: truck.abaixo_fipe ? "#0891b2" : "var(--muted)",
                        fontSize: 11,
                        fontWeight: 900,
                        padding: "3px 8px",
                        borderRadius: 6,
                        cursor: "pointer"
                      }}
                      title="Alternar selo Abaixo da Tabela FIPE"
                    >
                      📉 Abaixo Fipe
                    </button>
                  </div>
                </div>
              </div>

              <span className={`admin-card-status ${truck.status === "aprovado" ? "admin-btn-approve" : truck.status === "reprovado" ? "admin-btn-reject" : "admin-btn-edit"}`} style={{ display: "inline-flex", padding: "6px 12px", border: 0, width: "fit-content", textTransform: "uppercase", fontSize: 11 }}>
                {statusLabel(truck.status)}
              </span>

              <div className="admin-card-actions" style={{ margin: 0, justifyContent: "flex-end", alignItems: "center" }}>
                {truck.status === "aprovado" && (
                  <Link href={`/admin/divulgacao/${truck.id}`} className="admin-btn" style={{ background: "var(--wa)", color: "#fff" }}>Divulgar</Link>
                )}

                <a href={`/api/admin/ia-anuncios/${truck.id}`} download className="admin-btn" style={{ background: "#f59e0b", color: "#ffffff" }}>Central IA</a>
                <Link href={`/admin/laudo/${truck.id}`} className="admin-btn" style={{ background: "#7c3aed", color: "#ffffff" }}>Laudo</Link>

                {truck.status !== "aprovado" && (
                  <form action={aprovarAnuncio} style={{ margin: 0 }}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button className="admin-btn admin-btn-approve">Aprovar</button>
                  </form>
                )}

                {truck.status !== "reprovado" && (
                  <form action={reprovarAnuncio} style={{ margin: 0 }}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button className="admin-btn admin-btn-reject">Reprovar</button>
                  </form>
                )}

                <Link href={`/painel/anuncios/${truck.id}/editar`} className="admin-btn admin-btn-edit">Editar</Link>

                <form action={excluirAnuncioAdmin} style={{ margin: 0 }}>
                  <input type="hidden" name="id" value={truck.id} />
                  <ConfirmDeleteButton message={`Confirma remover o anúncio ${truck.titulo || "selecionado"}?`} />
                </form>
              </div>
            </article>
          );
        })}

        {filteredTrucks.length === 0 && <div className="admin-empty">Nenhum anúncio correspondente encontrado.</div>}
      </div>

    </div>
  );
}
