"use client";

import { useState, useRef } from "react";
import type { CSSProperties, ChangeEvent, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Building2, MapPin, Phone, Smartphone,
  ImagePlus, CheckCircle, Loader2, Eye, ShoppingBag,
} from "lucide-react";

const UFS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA",
  "MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN",
  "RO","RR","RS","SC","SE","SP","TO",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function traduzirErro(msg: string): string {
  if (msg.includes("unique") || msg.includes("duplicate"))
    return "Já existe um parceiro com esse nome (slug duplicado). Tente adicionar a cidade no nome, ex: \"Brutus - São Paulo\".";
  if (msg.includes("storage") || msg.includes("upload"))
    return "Erro ao enviar imagem. Verifique se o bucket \"parceiros\" existe no Supabase Storage.";
  if (msg.includes("violates row-level"))
    return "Permissão negada. Verifique as políticas RLS da tabela parceiros.";
  return msg;
}

export default function AdminParceirosPage() {
  const supabase = createClient();

  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [celular, setCelular] = useState("");
  const [telefone, setTelefone] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleBannerChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  }

  async function uploadImage(file: File, path: string): Promise<string> {
    const { error: upErr } = await supabase.storage
      .from("parceiros")
      .upload(path, file, { upsert: true });
    if (upErr) throw new Error(upErr.message);
    const { data } = supabase.storage.from("parceiros").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!nome.trim() || !cidade.trim() || !estado || !celular.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      // slug único: nome + timestamp para evitar colisões
      const slug = `${slugify(nome)}-${Date.now()}`;
      let logo_url: string | null = null;
      let banner_url: string | null = null;

      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        logo_url = await uploadImage(logoFile, `logos/${slug}.${ext}`);
      }
      if (bannerFile) {
        const ext = bannerFile.name.split(".").pop();
        banner_url = await uploadImage(bannerFile, `banners/${slug}.${ext}`);
      }

      const { error: dbErr } = await supabase.from("parceiros").insert({
        nome: nome.trim(),
        slug,
        cidade: cidade.trim(),
        estado,
        celular: celular.trim(),
        telefone: telefone.trim() || null,
        logo_url,
        banner_url,
        ativo: true,
      });

      if (dbErr) throw new Error(dbErr.message);

      setSuccess(true);
      setShowPreview(false);
      setNome(""); setCidade(""); setEstado(""); setCelular(""); setTelefone("");
      setLogoFile(null); setLogoPreview(null);
      setBannerFile(null); setBannerPreview(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao publicar parceiro.";
      setError(traduzirErro(msg));
    } finally {
      setLoading(false);
    }
  }

  const nomePreenchido = nome.trim().length > 0;

  return (
    <AdminLayout
      title="Parceiros"
      subtitle="Adicione um novo parceiro oficial para publicar no site."
      badge="Admin"
    >
      <div style={s.wrapper}>

        {/* Título */}
        <div style={s.formHeader}>
          <span style={s.badge}>Novo cadastro</span>
          <h2 style={s.formTitle}>Adicionar Novo Parceiro</h2>
          <p style={s.formSub}>
            Preencha os dados abaixo para publicar a revenda parceira no site.
          </p>
        </div>

        {/* Feedbacks */}
        {success && (
          <div style={s.alertSuccess}>
            <CheckCircle size={18} />
            Parceiro publicado com sucesso! Já aparece em{" "}
            <a href="/parceiros" target="_blank" style={{ color: "#bbf7d0", textDecoration: "underline" }}>/parceiros</a>.
          </div>
        )}
        {error && <div style={s.alertError}>⚠️ {error}</div>}

        {/* Layout: formulário + preview lado a lado */}
        <div style={s.twoCol}>

          {/* --- FORMULÁRIO --- */}
          <form onSubmit={handleSubmit} style={s.form}>

            <div style={s.field}>
              <label style={s.label}><Building2 size={13} style={{ marginRight: 5 }} />Nome da Revenda / Loja *</label>
              <input style={s.input} type="text" placeholder="Ex: Brutus Caminhões" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>

            <div style={s.row}>
              <div style={{ ...s.field, flex: 1 }}>
                <label style={s.label}><MapPin size={13} style={{ marginRight: 5 }} />Cidade *</label>
                <input style={s.input} type="text" placeholder="Ex: São Paulo" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
              </div>
              <div style={{ ...s.field, width: 110, flexShrink: 0 }}>
                <label style={s.label}>UF *</label>
                <select style={s.input} value={estado} onChange={(e) => setEstado(e.target.value)} required>
                  <option value="">UF</option>
                  {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
            </div>

            <div style={s.row}>
              <div style={{ ...s.field, flex: 1 }}>
                <label style={s.label}><Smartphone size={13} style={{ marginRight: 5 }} />Celular / WhatsApp *</label>
                <input style={s.input} type="tel" placeholder="(49) 99999-9999" value={celular} onChange={(e) => setCelular(e.target.value)} required />
              </div>
              <div style={{ ...s.field, flex: 1 }}>
                <label style={s.label}>
                  <Phone size={13} style={{ marginRight: 5 }} />
                  Fixo <span style={{ color: "#6b7280", fontWeight: 700, textTransform: "none" }}>(opcional)</span>
                </label>
                <input style={s.input} type="tel" placeholder="(49) 3333-3333" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
              </div>
            </div>

            {/* Uploads */}
            <div style={s.row}>
              <div style={{ ...s.field, flex: 1 }}>
                <label style={s.label}><ImagePlus size={13} style={{ marginRight: 5 }} />Logo <span style={{ color: "#6b7280", fontWeight: 700, textTransform: "none" }}>(1:1)</span></label>
                <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoChange} />
                <button type="button" style={s.uploadBtn} onClick={() => logoRef.current?.click()}>
                  {logoPreview
                    ? <img src={logoPreview} alt="Logo" style={s.previewLogo} />
                    : (<><ImagePlus size={20} style={{ opacity: 0.4 }} /><span style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>Selecionar Logo</span></>)
                  }
                </button>
              </div>

              <div style={{ ...s.field, flex: 2 }}>
                <label style={s.label}><ImagePlus size={13} style={{ marginRight: 5 }} />Banner <span style={{ color: "#6b7280", fontWeight: 700, textTransform: "none" }}>(fundo do card)</span></label>
                <input ref={bannerRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleBannerChange} />
                <button type="button" style={{ ...s.uploadBtn, aspectRatio: "16/7" }} onClick={() => bannerRef.current?.click()}>
                  {bannerPreview
                    ? <img src={bannerPreview} alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} />
                    : (<><ImagePlus size={24} style={{ opacity: 0.4 }} /><span style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>Selecionar Banner</span></>)
                  }
                </button>
              </div>
            </div>

            {/* Botões */}
            <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
              {nomePreenchido && (
                <button
                  type="button"
                  style={s.btnPreview}
                  onClick={() => setShowPreview((v) => !v)}
                >
                  <Eye size={16} />
                  {showPreview ? "Ocultar prévia" : "Ver prévia do card"}
                </button>
              )}
              <button
                type="submit"
                style={loading ? { ...s.submit, opacity: 0.7, cursor: "not-allowed" } : s.submit}
                disabled={loading}
              >
                {loading
                  ? (<><Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> Publicando...</>)
                  : (<><CheckCircle size={17} /> Publicar Parceiro Oficial</>)
                }
              </button>
            </div>
          </form>

          {/* --- PRÉVIA DO CARD --- */}
          {showPreview && nomePreenchido && (
            <div style={s.previewCol}>
              <p style={s.previewLabel}>Prévia — como vai aparecer no site</p>
              <article style={s.cardPreview}>
                {/* banner */}
                <div style={{
                  height: 120,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: bannerPreview
                    ? `url(${bannerPreview})`
                    : "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2027 100%)",
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  padding: 10,
                }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.06), rgba(0,0,0,0.78))" }} />
                  <span style={{ position: "relative", zIndex: 2, background: "#22c55e", color: "#000", fontSize: 10, fontWeight: 900, padding: "3px 8px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    ✓ Verificado
                  </span>
                </div>

                {/* conteúdo */}
                <div style={{ padding: "0 16px 16px", marginTop: -28, position: "relative", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, zIndex: 3, position: "relative" }}>
                    <div style={{ width: 58, height: 58, flexShrink: 0, background: "#fff", borderRadius: 10, padding: 3, boxShadow: "0 4px 14px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "2px solid #343a40" }}>
                      {logoPreview
                        ? <img src={logoPreview} alt="logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        : <span style={{ fontSize: 18, fontWeight: 900, color: "#1e293b", letterSpacing: "-0.04em" }}>{iniciais(nome || "?")}</span>
                      }
                    </div>
                    <div>
                      <h3 style={{ color: "#f4f4f5", fontSize: 15, fontWeight: 900, margin: "0 0 3px", lineHeight: 1.2 }}>{nome || "Nome da revenda"}</h3>
                      <p style={{ display: "flex", alignItems: "center", gap: 4, color: "#9ca3af", fontSize: 12, fontWeight: 700, margin: 0 }}>
                        <MapPin size={11} style={{ color: "#22c55e" }} />
                        {[cidade, estado].filter(Boolean).join(", ") || "Cidade, UF"}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: "#1a1f24", border: "1px dashed #343a40", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                    <strong style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: "#f4f4f5", fontSize: 12, fontWeight: 800, marginBottom: 3 }}>
                      <ShoppingBag size={11} /> Vitrine de produtos
                    </strong>
                    <p style={{ color: "#9ca3af", fontSize: 11, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.4 }}>Peças e serviços em breve aqui.</p>
                    <span style={{ background: "rgba(77,159,255,.18)", color: "#4d9fff", fontSize: 10, fontWeight: 900, padding: "2px 8px", borderRadius: 999 }}>Em breve</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: telefone ? "1fr 1fr" : "1fr", gap: 8 }}>
                    <div style={{ padding: "9px 0", borderRadius: 8, background: "#1877f2", color: "#fff", fontSize: 12, fontWeight: 900, textAlign: "center" }}>WhatsApp</div>
                    {telefone && <div style={{ padding: "9px 0", borderRadius: 8, border: "1.5px solid #343a40", color: "#f4f4f5", fontSize: 12, fontWeight: 900, textAlign: "center" }}>Ligar</div>}
                  </div>
                </div>
              </article>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

const s: Record<string, CSSProperties> = {
  wrapper: { maxWidth: 920 },
  twoCol: { display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" },
  form: { display: "flex", flexDirection: "column", gap: 16, flex: "1 1 420px", minWidth: 0 },
  previewCol: { flex: "0 0 280px", minWidth: 0 },
  previewLabel: { fontSize: 11, fontWeight: 900, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 },
  cardPreview: { background: "#131c2e", border: "1px solid #343a40", borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,.35)" },
  formHeader: { padding: "22px 24px", borderRadius: 24, background: "linear-gradient(135deg, #1f2327, #121416)", border: "1px solid #343a40", marginBottom: 20, boxShadow: "0 16px 34px rgba(0,0,0,.18)" },
  badge: { display: "inline-flex", padding: "7px 11px", borderRadius: 999, background: "#14532d", color: "#bbf7d0", fontWeight: 900, fontSize: 12, marginBottom: 12 },
  formTitle: { margin: "0 0 6px", color: "#f4f4f5", fontSize: 26, lineHeight: 1.15, fontWeight: 800 },
  formSub: { margin: 0, color: "#a7afb7", fontWeight: 700, fontSize: 14, lineHeight: 1.6 },
  alertSuccess: { display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 14, background: "rgba(20,83,45,0.6)", border: "1px solid #166534", color: "#bbf7d0", fontWeight: 800, fontSize: 14, marginBottom: 16 },
  alertError: { padding: "14px 18px", borderRadius: 14, background: "rgba(127,29,29,0.5)", border: "1px solid #991b1b", color: "#fca5a5", fontWeight: 800, fontSize: 14, marginBottom: 16, lineHeight: 1.6 },
  row: { display: "flex", gap: 14, flexWrap: "wrap" },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 900, color: "#a7afb7", textTransform: "uppercase" as const, letterSpacing: "0.07em" },
  input: { height: 48, padding: "0 16px", borderRadius: 14, border: "1px solid #343a40", background: "#1a1f24", color: "#f4f4f5", fontSize: 15, fontWeight: 700, outline: "none", width: "100%" },
  uploadBtn: { display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 8, width: "100%", aspectRatio: "1 / 1", borderRadius: 16, border: "2px dashed #343a40", background: "#1a1f24", cursor: "pointer", padding: 0, overflow: "hidden" },
  previewLogo: { width: "100%", height: "100%", objectFit: "cover" as const, borderRadius: 14 },
  btnPreview: { display: "inline-flex", alignItems: "center", gap: 8, height: 48, paddingLeft: 20, paddingRight: 20, borderRadius: 14, border: "1px solid #343a40", background: "#1a1f24", color: "#a7afb7", fontWeight: 800, fontSize: 14, cursor: "pointer" },
  submit: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, height: 48, paddingLeft: 24, paddingRight: 24, borderRadius: 14, border: "none", background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff", fontWeight: 900, fontSize: 15, cursor: "pointer" },
};
