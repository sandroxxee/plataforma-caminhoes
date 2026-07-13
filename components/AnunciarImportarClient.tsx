"use client";

import { useState, type CSSProperties } from "react";
import { Link2, Loader2, X, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

type DadosImportados = {
  titulo: string;
  preco: number | null;
  descricao: string;
  cidade: string;
  estado: string;
  imagens: string[];
  fonte: string;
};

export function AnunciarImportarClient() {
  const [aberto, setAberto] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [preview, setPreview] = useState<DadosImportados | null>(null);

  // Campos de cadastro do usuário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");

  async function handleBuscar() {
    if (!url.trim()) {
      setErro("Por favor, cole um link válido da OLX.");
      return;
    }

    setLoading(true);
    setErro("");
    setPreview(null);

    try {
      const res = await fetch("/api/importar-olx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao tentar ler o anúncio. Certifique-se de que é um link válido da OLX.");
        return;
      }

      setPreview(data);
      setAberto(true);
    } catch {
      setErro("Falha na conexão com o servidor. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalizarCadastro(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !email || !telefone || !senha) {
      setErro("Preencha todos os campos para prosseguir.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    setSubmitting(true);
    setErro("");

    try {
      const res = await fetch("/api/anunciar-importado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          senha,
          dadosOlx: preview,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao criar sua conta.");
        return;
      }

      setSucesso(true);
      window.setTimeout(() => {
        window.location.href = "/painel";
      }, 2500);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>⚡ Importe Grátis do seu Anúncio OLX</h3>
      <p style={styles.desc}>
        Já tem um anúncio ativo na OLX? Cole o link dele abaixo para importar
        toda a ficha cadastral e as fotos do seu caminhão em poucos segundos!
      </p>

      <div style={styles.inputRow}>
        <div style={styles.searchBox}>
          <Link2 size={18} style={{ color: "#64748b" }} />
          <input
            type="url"
            placeholder="Cole o link da OLX (ex: https://www.olx.com.br/item/...)"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setErro("");
            }}
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
          />
        </div>
        <button onClick={handleBuscar} disabled={loading} style={styles.buscarBtn}>
          {loading ? <Loader2 size={16} style={styles.spin} /> : "Importar Anúncio"}
        </button>
      </div>

      {erro && !aberto && (
        <div style={styles.erroText}>
          <AlertCircle size={16} /> {erro}
        </div>
      )}

      {/* MODAL DE CADASTRO + IMPORTAÇÃO COMPLETA */}
      {aberto && (
        <div style={styles.overlay} onClick={() => setAberto(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={20} style={{ color: "#22c55e" }} />
                <h3 style={{ margin: 0, fontSize: 18, color: "#fff", fontWeight: 800 }}>Dados Importados com Sucesso!</h3>
              </div>
              <button onClick={() => setAberto(false)} style={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            {sucesso ? (
              <div style={styles.sucessoWrapper}>
                <CheckCircle size={56} style={{ color: "#22c55e", marginBottom: 14 }} />
                <h4 style={{ color: "#fff", margin: "0 0 6px", fontSize: 18 }}>Anúncio e Perfil Criados!</h4>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: 14, textAlign: "center" }}>
                  Sua conta foi criada. Redirecionando para o seu painel de anúncios pendentes...
                </p>
              </div>
            ) : (
              <div style={styles.modalContent}>
                {/* Visualização dos dados encontrados */}
                {preview && (
                  <div style={styles.previewBox}>
                    <div style={styles.previewThumb}>
                      {preview.imagens[0] ? (
                        <img src={preview.imagens[0]} alt={preview.titulo} style={styles.previewImg} />
                      ) : (
                        <div style={styles.previewNoImg}>Sem foto</div>
                      )}
                    </div>
                    <div style={styles.previewInfo}>
                      <h4 style={styles.previewTitle}>{preview.titulo}</h4>
                      <strong style={styles.previewPrice}>
                        {preview.preco ? `R$ ${preview.preco.toLocaleString("pt-BR")}` : "Preço sob consulta"}
                      </strong>
                      <span style={styles.previewMeta}>📍 {[preview.cidade, preview.estado].filter(Boolean).join("/")}</span>
                    </div>
                  </div>
                )}

                <hr style={{ border: 0, borderTop: "1px solid rgba(255,255,255,0.06)", margin: "16px 0" }} />

                {/* Formulário de Finalização */}
                <form onSubmit={handleFinalizarCadastro} style={styles.form}>
                  <h4 style={styles.formTitle}>Finalize sua conta grátis para publicar</h4>
                  <p style={styles.formDesc}>Insira seus dados para gerenciar o anúncio e receber contatos de compradores.</p>

                  {erro && (
                    <div style={styles.modalErro}>
                      <AlertCircle size={16} /> {erro}
                    </div>
                  )}

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Seu Nome</label>
                    <input
                      type="text"
                      placeholder="Ex: João Silva"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      style={styles.formInput}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Seu E-mail</label>
                    <input
                      type="email"
                      placeholder="Ex: joao@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={styles.formInput}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                      <label style={styles.label}>WhatsApp com DDD</label>
                      <input
                        type="tel"
                        placeholder="Ex: 47999998888"
                        required
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        style={styles.formInput}
                      />
                    </div>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                      <label style={styles.label}>Senha de Acesso</label>
                      <input
                        type="password"
                        placeholder="Mínimo 6 dígitos"
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        style={styles.formInput}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} style={styles.concluirBtn}>
                    {submitting ? <Loader2 size={16} style={styles.spin} /> : "✅ Concluir Cadastro e Publicar"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    padding: 28,
    borderRadius: 24,
    background: "rgba(30, 41, 59, 0.4)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
    maxWidth: 750,
    width: "100%",
    margin: "32px auto 0",
    textAlign: "left",
  },
  title: { margin: "0 0 6px", fontSize: 20, color: "#ffffff", fontWeight: 900, letterSpacing: "-0.01em" },
  desc: { margin: "0 0 18px", color: "#94a3b8", fontSize: 14, lineHeight: 1.5 },
  inputRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#0f172a",
    padding: "0 16px",
    borderRadius: 12,
    flex: 1,
    minWidth: 260,
    height: 48,
    border: "1px solid #1e293b",
  },
  input: { border: 0, background: "transparent", color: "#fff", outline: "none", width: "100%", fontSize: 14 },
  buscarBtn: {
    border: 0,
    height: 48,
    padding: "0 22px",
    borderRadius: 12,
    background: "#22c55e",
    color: "#052e16",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(34,197,94,0.2)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  erroText: { display: "flex", alignItems: "center", gap: 6, color: "#ef4444", fontSize: 13, marginTop: 10, fontWeight: 700 },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 16,
  },
  modal: {
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 580,
    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  closeBtn: {
    background: "rgba(255,255,255,0.05)",
    border: 0,
    borderRadius: 8,
    width: 32,
    height: 32,
    color: "#94a3b8",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: { display: "flex", flexDirection: "column" },

  previewBox: { display: "flex", gap: 14, background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" },
  previewThumb: { width: 90, height: 68, borderRadius: 8, overflow: "hidden", background: "#1e293b", flexShrink: 0 },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  previewNoImg: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#475569", fontSize: 10 },
  previewInfo: { display: "flex", flexDirection: "column", justifyContent: "center" },
  previewTitle: { margin: "0 0 4px", color: "#fff", fontSize: 15, fontWeight: 800 },
  previewPrice: { color: "#10b981", fontSize: 16, fontWeight: 900 },
  previewMeta: { color: "#64748b", fontSize: 12, marginTop: 2 },

  form: { display: "flex", flexDirection: "column", gap: 12 },
  formTitle: { margin: "0 0 2px", color: "#fff", fontSize: 16, fontWeight: 800 },
  formDesc: { margin: "0 0 10px", color: "#64748b", fontSize: 13 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, color: "#94a3b8", fontWeight: 700 },
  formInput: {
    height: 42,
    borderRadius: 10,
    border: "1px solid #1e293b",
    background: "#0b0f19",
    color: "#fff",
    padding: "0 12px",
    fontSize: 13,
    outline: "none",
  },
  formRow: { display: "flex", gap: 12 },
  concluirBtn: {
    border: 0,
    height: 48,
    borderRadius: 12,
    background: "#22c55e",
    color: "#052e16",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    marginTop: 8,
    boxShadow: "0 6px 20px rgba(34,197,94,0.2)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalErro: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 10,
    color: "#f87171",
    fontSize: 13,
    fontWeight: 700,
  },

  sucessoWrapper: { display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 10px", textAlign: "center" },

  spin: { animation: "spin 0.8s linear infinite" },
};
