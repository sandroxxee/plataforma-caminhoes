"use client";

import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { aprovarAnuncio, reprovarAnuncio, excluirAnuncioAdmin, vincularAnunciosParceiroAction } from "../actions";
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
  truck_images?: TruckImage[];
};

type Parceiro = {
  id: string;
  nome: string;
  celular: string;
};

type Props = {
  initialTrucks: Truck[];
  parceiros: Parceiro[];
  getMainImage: (truck: Truck) => string;
  money: (value: number | null) => string;
  statusLabel: (status: string | null) => string;
};

export default function AdminAnunciosClient({ initialTrucks, parceiros, getMainImage, money, statusLabel }: Props) {
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

  return (
    <div style={c.container}>
      
      {/* MODO VINCULAÇÃO ATIVO */}
      {targetWhatsApp && targetNome && (
        <div style={c.vinculoAlert}>
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
        <div style={c.successAlert}>
          <CheckCircle2 size={18} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={c.errorAlert}>
          <AlertTriangle size={18} />
          {errorMsg}
        </div>
      )}

      {/* FERRAMENTAS DE BUSCA E LOTE */}
      <div style={c.toolbar}>
        
        {/* BUSCA RAPIDA */}
        <div style={c.searchBox}>
          <Search size={18} style={{ color: "#94a3b8" }} />
          <input 
            type="text" 
            placeholder="Pesquisar por título, marca ou cidade..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={c.searchInput}
          />
        </div>

        {/* CONTROLE EM LOTE */}
        <div style={c.loteBox}>
          <select 
            value={selectedParceiroWa} 
            onChange={(e) => setSelectedParceiroWa(e.target.value)}
            style={c.selectParceiro}
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
            style={selectedIds.length === 0 ? { ...c.loteBtn, opacity: 0.5, cursor: "not-allowed" } : c.loteBtn}
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
      <div style={c.list}>
        
        {/* CABEÇALHO SELECT ALL */}
        {filteredTrucks.length > 0 && (
          <div style={c.selectAllHeader} onClick={toggleSelectAll}>
            <button style={c.checkboxBtn}>
              {selectedIds.length === filteredTrucks.length ? (
                <CheckSquare size={20} style={{ color: "#1877f2" }} />
              ) : (
                <Square size={20} style={{ color: "#cbd5e1" }} />
              )}
            </button>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#64748b" }}>
              {selectedIds.length === filteredTrucks.length ? "Desmarcar todos" : `Marcar todos (${filteredTrucks.length} anúncios)`}
            </span>
          </div>
        )}

        {filteredTrucks.map((truck) => {
          const image = getMainImage(truck);
          const lojaVinculada = obterParceiroDoAnuncio(truck.whatsapp || null);
          const isSelected = selectedIds.includes(truck.id);

          return (
            <article key={truck.id} style={isSelected ? { ...c.row, border: "1.5px solid #1877f2", background: "#f8fafc" } : c.row}>
              
              {/* CHECKBOX SELEÇÃO */}
              <button onClick={() => toggleSelect(truck.id)} style={c.checkboxBtn}>
                {isSelected ? (
                  <CheckSquare size={22} style={{ color: "#1877f2" }} />
                ) : (
                  <Square size={22} style={{ color: "#cbd5e1" }} />
                )}
              </button>

              <div style={c.thumb}>
                {image ? <img src={image} alt={truck.titulo || "Caminhão"} style={c.image} /> : <span>Sem foto</span>}
              </div>

              <div style={c.info}>
                <strong style={c.title}>{truck.titulo}</strong>
                <p style={c.meta}>{truck.marca} {truck.modelo} • {truck.cidade}/{truck.estado} • {money(truck.preco)}</p>
                
                {/* TAG DA LOJA PARCEIRA */}
                {lojaVinculada ? (
                  <span style={c.tagLoja}>
                    <Landmark size={11} /> Estoque: {lojaVinculada}
                  </span>
                ) : (
                  <span style={c.tagParticular}>Particular / Sem Loja</span>
                )}
              </div>

              <span style={truck.status === "aprovado" ? c.statusApproved : truck.status === "reprovado" ? c.statusRejected : c.statusPending}>
                {statusLabel(truck.status)}
              </span>

              <div style={c.actions}>
                {truck.status === "aprovado" && (
                  <Link href={`/admin/divulgacao/${truck.id}`} style={c.share}>Divulgar</Link>
                )}

                <Link href={`/admin/ia-anuncios/${truck.id}`} style={c.aiPackage}>Central IA</Link>
                <Link href={`/admin/laudo/${truck.id}`} style={c.laudo}>Laudo</Link>

                {truck.status !== "aprovado" && (
                  <form action={aprovarAnuncio} style={c.formButton}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button style={c.approve}>Aprovar</button>
                  </form>
                )}

                {truck.status !== "reprovado" && (
                  <form action={reprovarAnuncio} style={c.formButton}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button style={c.reject}>Reprovar</button>
                  </form>
                )}

                <Link href={`/painel/anuncios/${truck.id}/editar`} style={c.edit}>Editar</Link>

                <form action={excluirAnuncioAdmin} style={c.formButton}>
                  <input type="hidden" name="id" value={truck.id} />
                  <ConfirmDeleteButton message={`Confirma remover o anúncio ${truck.titulo || "selecionado"}?`} />
                </form>
              </div>
            </article>
          );
        })}

        {filteredTrucks.length === 0 && <div style={c.empty}>Nenhum anúncio correspondente encontrado.</div>}
      </div>

    </div>
  );
}

const buttonBase: CSSProperties = {
  border: 0,
  padding: "10px 16px",
  borderRadius: 12,
  fontWeight: 800,
  fontFamily: "inherit",
  cursor: "pointer",
  textDecoration: "none",
  lineHeight: 1,
  fontSize: 13,
  transition: "all 0.2s",
};

const statusBase: CSSProperties = {
  padding: "6px 12px",
  borderRadius: 999,
  textAlign: "center",
  fontWeight: 800,
  fontSize: 11,
  whiteSpace: "nowrap",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const c: Record<string, CSSProperties> = {
  container: { display: "flex", flexDirection: "column", gap: 16 },
  vinculoAlert: { display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 20px", borderRadius: 16, background: "rgba(245,158,11,0.08)", border: "1.5px solid #f59e0b", color: "#d97706", fontWeight: 800, fontSize: 14 },
  successAlert: { display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", borderRadius: 14, background: "#dcfce7", border: "1px solid #22c55e", color: "#15803d", fontWeight: 800, fontSize: 14 },
  errorAlert: { display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", borderRadius: 14, background: "#fee2e2", border: "1px solid #ef4444", color: "#b91c1c", fontWeight: 800, fontSize: 14 },
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", background: "#f8fafc", padding: 16, borderRadius: 20, border: "1px solid rgba(148,163,184,0.12)" },
  searchBox: { display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #cbd5e1", borderRadius: 14, height: 46, padding: "0 16px", flex: "1 1 300px" },
  searchInput: { border: 0, outline: "none", fontSize: 14, fontWeight: 700, color: "#1e293b", width: "100%" },
  loteBox: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  selectParceiro: { height: 46, padding: "0 14px", borderRadius: 14, border: "1px solid #cbd5e1", background: "#fff", color: "#1e293b", fontSize: 14, fontWeight: 700, outline: "none" },
  loteBtn: { height: 46, padding: "0 20px", borderRadius: 14, border: 0, background: "#1877f2", color: "#fff", fontWeight: 900, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  list: { display: "grid", gap: 12 },
  selectAllHeader: { display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", cursor: "pointer", userSelect: "none" },
  checkboxBtn: { background: "none", border: 0, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  row: { display: "grid", gridTemplateColumns: "36px 104px minmax(220px, 1fr) 112px auto", gap: 16, alignItems: "center", padding: 16, borderRadius: 20, background: "#ffffff", border: "1px solid rgba(148,163,184,0.12)", boxShadow: "0 4px 12px rgba(15,23,42,0.03)", transition: "all 0.2s" },
  thumb: { width: 104, height: 78, borderRadius: 12, overflow: "hidden", background: "#f8fafc", display: "grid", placeItems: "center", color: "#94a3b8", fontSize: 11, fontWeight: 800 },
  image: { width: "100%", height: "100%", objectFit: "contain", display: "block" },
  info: { minWidth: 0, display: "flex", flexDirection: "column" as const, gap: 4 },
  title: { display: "block", fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  meta: { margin: 0, color: "#64748b", fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  tagLoja: { display: "inline-flex", alignItems: "center", gap: 4, width: "fit-content", padding: "3px 8px", borderRadius: 6, background: "rgba(24,119,242,0.08)", color: "#1877f2", fontSize: 11, fontWeight: 900 },
  tagParticular: { display: "inline-flex", width: "fit-content", padding: "3px 8px", borderRadius: 6, background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 800 },
  statusApproved: { ...statusBase, background: "#dcfce7", color: "#166534" },
  statusRejected: { ...statusBase, background: "#fee2e2", color: "#991b1b" },
  statusPending: { ...statusBase, background: "#fef3c7", color: "#92400e" },
  actions: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" },
  formButton: { margin: 0 },
  approve: { ...buttonBase, background: "#1877f2", color: "#ffffff" },
  reject: { ...buttonBase, background: "#fee2e2", color: "#ef4444" },
  edit: { ...buttonBase, background: "#f1f5f9", color: "#475569", border: "1px solid rgba(148,163,184,0.1)" },
  share: { ...buttonBase, background: "#22c55e", color: "#ffffff" },
  aiPackage: { ...buttonBase, background: "#f59e0b", color: "#ffffff" },
  laudo: { ...buttonBase, background: "#7c3aed", color: "#ffffff" },
  empty: { padding: 32, borderRadius: 20, background: "#ffffff", border: "1px solid rgba(148,163,184,0.12)", color: "#64748b", fontWeight: 700, textAlign: "center" },
};
