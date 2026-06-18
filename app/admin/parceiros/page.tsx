"use client";

import { useState, useRef } from "react";
import type { CSSProperties, ChangeEvent, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Building2, MapPin, Phone, Smartphone, ImagePlus, CheckCircle, Loader2 } from "lucide-react";

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

    if (!nome.trim() || !cidade.trim() || !estado || !celular.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const slug = slugify(nome);
      let logo_url = "";
      let banner_url = "";

      if (logoFile) {
        logo_url = await uploadImage(logoFile, `logos/${slug}-${Date.now()}.${logoFile.name.split(".").pop()}`);
      }
      if (bannerFile) {
        banner_url = await uploadImage(bannerFile, `banners/${slug}-${Date.now()}.${bannerFile.name.split(".").pop()}`);
      }

      const { error: dbErr } = await supabase.from("parceiros").insert({
        nome: nome.trim(),
        slug,
        cidade: cidade.trim(),
        estado,
        celular: celular.trim(),
        telefone: telefone.trim() || null,
        logo_url: logo_url || null,
        banner_url: banner_url || null,
        ativo: true,
      });

      if (dbErr) throw new Error(dbErr.message);

      setSuccess(true);
      setNome(""); setCidade(""); setEstado(""); setCelular(""); setTelefone("");
      setLogoFile(null); setLogoPreview(null);
      setBannerFile(null); setBannerPreview(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao publicar parceiro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout
      title="Parceiros"
      subtitle="Adicione um novo parceiro oficial para publicar no site."
      badge="Admin"
    >
      <div style={s.wrapper}>

        {/* Título do formulário */}
        <div style={s.formHeader}>
          <span style={s.badge}>Novo cadastro</span>
          <h2 style={s.formTitle}>Adicionar Novo Parceiro</h2>
          <p style={s.formSub}>
            Preencha os dados abaixo para publicar a revenda parceira no site.
          </p>
        </div>

        {/* Feedback */}
        {success && (
          <div style={s.alertSuccess}>
            <CheckCircle size={18} />
            Parceiro publicado com sucesso!
          </div>
        )}
        {error && <div style={s.alertError}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>

          {/* Nome */}
          <div style={s.field}>
            <label style={s.label}>
              <Building2 size={13} style={{ marginRight: 5 }} />
              Nome da Revenda / Loja *
            </label>
            <input
              style={s.input}
              type="text"
              placeholder="Ex: Brutus Caminhões"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          {/* Cidade + Estado */}
          <div style={s.row}>
            <div style={{ ...s.field, flex: 1 }}>
              <label style={s.label}>
                <MapPin size={13} style={{ marginRight: 5 }} />
                Cidade *
              </label>
              <input
                style={s.input}
                type="text"
                placeholder="Ex: São Paulo"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
              />
            </div>
            <div style={{ ...s.field, width: 120, flexShrink: 0 }}>
              <label style={s.label}>Estado (UF) *</label>
              <select
                style={s.input}
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                required
              >
                <option value="">UF</option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Celular + Telefone */}
          <div style={s.row}>
            <div style={{ ...s.field, flex: 1 }}>
              <label style={s.label}>
                <Smartphone size={13} style={{ marginRight: 5 }} />
                Celular / WhatsApp *
              </label>
              <input
                style={s.input}
                type="tel"
                placeholder="(49) 99999-9999"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                required
              />
            </div>
            <div style={{ ...s.field, flex: 1 }}>
              <label style={s.label}>
                <Phone size={13} style={{ marginRight: 5 }} />
                Telefone Fixo <span style={{ color: "#6b7280", fontWeight: 700 }}>(Opcional)</span>
              </label>
              <input
                style={s.input}
                type="tel"
                placeholder="(49) 3333-3333"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
          </div>

          {/* Uploads */}
          <div style={s.row}>
            {/* Logo */}
            <div style={{ ...s.field, flex: 1 }}>
              <label style={s.label}>
                <ImagePlus size={13} style={{ marginRight: 5 }} />
                Foto do Logotipo <span style={{ color: "#6b7280", fontWeight: 700 }}>(Proporção 1:1)</span>
              </label>
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleLogoChange}
              />
              <button
                type="button"
                style={s.uploadBtn}
                onClick={() => logoRef.current?.click()}
              >
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoPreview} alt="Logo" style={s.previewLogo} />
                ) : (
                  <>
                    <ImagePlus size={20} style={{ opacity: 0.4 }} />
                    <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 700 }}>Selecionar Logo</span>
                  </>
                )}
              </button>
            </div>

            {/* Banner */}
            <div style={{ ...s.field, flex: 2 }}>
              <label style={s.label}>
                <ImagePlus size={13} style={{ marginRight: 5 }} />
                Foto do Banner Promocional <span style={{ color: "#6b7280", fontWeight: 700 }}>(Fundo do Card)</span>
              </label>
              <input
                ref={bannerRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleBannerChange}
              />
              <button
                type="button"
                style={{ ...s.uploadBtn, aspectRatio: "16/7" }}
                onClick={() => bannerRef.current?.click()}
              >
                {bannerPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={bannerPreview} alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} />
                ) : (
                  <>
                    <ImagePlus size={24} style={{ opacity: 0.4 }} />
                    <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 700 }}>Selecionar Banner</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={loading ? { ...s.submit, opacity: 0.7, cursor: "not-allowed" } : s.submit}
            disabled={loading}
          >
            {loading ? (
              <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Publicando...</>
            ) : (
              <><CheckCircle size={18} /> Publicar Parceiro Oficial</>
            )}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

const s: Record<string, CSSProperties> = {
  wrapper: {
    maxWidth: 720,
  },
  formHeader: {
    padding: "22px 24px",
    borderRadius: 24,
    background: "linear-gradient(135deg, #1f2327, #121416)",
    border: "1px solid #343a40",
    marginBottom: 20,
    boxShadow: "0 16px 34px rgba(0,0,0,.18)",
  },
  badge: {
    display: "inline-flex",
    padding: "7px 11px",
    borderRadius: 999,
    background: "#14532d",
    color: "#bbf7d0",
    fontWeight: 900,
    fontSize: 12,
    marginBottom: 12,
  },
  formTitle: {
    margin: "0 0 6px",
    color: "#f4f4f5",
    fontSize: 26,
    lineHeight: 1.15,
    fontWeight: 800,
  },
  formSub: {
    margin: 0,
    color: "#a7afb7",
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 1.6,
  },
  alertSuccess: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 18px",
    borderRadius: 14,
    background: "rgba(20,83,45,0.6)",
    border: "1px solid #166534",
    color: "#bbf7d0",
    fontWeight: 800,
    fontSize: 14,
    marginBottom: 16,
  },
  alertError: {
    padding: "14px 18px",
    borderRadius: 14,
    background: "rgba(127,29,29,0.5)",
    border: "1px solid #991b1b",
    color: "#fca5a5",
    fontWeight: 800,
    fontSize: 14,
    marginBottom: 16,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  row: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 11,
    fontWeight: 900,
    color: "#a7afb7",
    textTransform: "uppercase" as const,
    letterSpacing: "0.07em",
  },
  input: {
    height: 48,
    padding: "0 16px",
    borderRadius: 14,
    border: "1px solid #343a40",
    background: "#1a1f24",
    color: "#f4f4f5",
    fontSize: 15,
    fontWeight: 700,
    outline: "none",
    width: "100%",
  },
  uploadBtn: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: 16,
    border: "2px dashed #343a40",
    background: "#1a1f24",
    cursor: "pointer",
    transition: "border-color .18s",
    padding: 0,
    overflow: "hidden",
  },
  previewLogo: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    borderRadius: 14,
  },
  submit: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
    transition: "filter .18s",
    marginTop: 8,
  },
};
