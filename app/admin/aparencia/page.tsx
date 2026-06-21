import { redirect } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { getHomeContent, type HomeContent } from "@/lib/site-content";
import { salvarAparencia } from "./actions";
import { HeroBannerSection } from "./HeroBannerSection";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<{ salvo?: string }> };

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");
  return supabase;
}

function Field({ name, label, value, textarea = false, help }: { name: keyof HomeContent; label: string; value: string; textarea?: boolean; help?: string }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      {textarea ? <textarea name={name} defaultValue={value} rows={4} style={styles.textarea} /> : <input name={name} defaultValue={value} style={styles.input} />}
      {help ? <small style={styles.help}>{help}</small> : null}
    </label>
  );
}

export default async function AdminAparenciaPage({ searchParams }: Props) {
  const params  = searchParams ? await searchParams : {};
  const supabase = await requireAdmin();
  const content  = await getHomeContent(supabase);

  return (
    <AdminLayout
      title="Aparência do site"
      subtitle="Edite textos e a imagem da capa sem mexer no código."
      badge="Conteúdo editável"
      actions={<Link href="/" target="_blank" style={styles.topButton}>Ver home</Link>}
    >
      {params?.salvo === "1" && (
        <div style={styles.success}>Alterações salvas. Abra a home para conferir.</div>
      )}

      {/* Seção imagem da capa */}
      <HeroBannerSection currentUrl={content.heroBannerUrl} />

      <form action={salvarAparencia} style={styles.form}>
        {/* Campo hidden para heroBannerUrl — atualizado pelo HeroBannerSection via DOM */}
        <input type="hidden" name="heroBannerUrl" id="heroBannerUrl" defaultValue={content.heroBannerUrl} />

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Topo da home</h2>
          <Field name="heroMini" label="Texto pequeno acima da frase principal" value={content.heroMini} />
          <Field name="heroTitle" label="Frase principal" value={content.heroTitle} textarea />
          <Field name="heroSubtitle" label="Texto abaixo da frase principal" value={content.heroSubtitle} textarea />
          <div style={styles.twoCols}>
            <Field name="primaryButtonText" label="Botão principal" value={content.primaryButtonText} />
            <Field name="primaryButtonHref" label="Link do botão principal" value={content.primaryButtonHref} help="Exemplo: /anuncios" />
            <Field name="secondaryButtonText" label="Botão secundário" value={content.secondaryButtonText} />
            <Field name="secondaryButtonHref" label="Link do botão secundário" value={content.secondaryButtonHref} help="Exemplo: /anunciar" />
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Faixa de confiança</h2>
          <div style={styles.twoCols}>
            <Field name="trust1Title" label="Bloco 1 — título" value={content.trust1Title} />
            <Field name="trust1Text"  label="Bloco 1 — texto"  value={content.trust1Text} />
            <Field name="trust2Title" label="Bloco 2 — título" value={content.trust2Title} />
            <Field name="trust2Text"  label="Bloco 2 — texto"  value={content.trust2Text} />
            <Field name="trust3Title" label="Bloco 3 — título" value={content.trust3Title} />
            <Field name="trust3Text"  label="Bloco 3 — texto"  value={content.trust3Text} />
            <Field name="trust4Title" label="Bloco 4 — título" value={content.trust4Title} />
            <Field name="trust4Text"  label="Bloco 4 — texto"  value={content.trust4Text} />
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Textos comerciais</h2>
          <div style={styles.threeCols}>
            <Field name="buyerTitle"    label="Compra — título"    value={content.buyerTitle} />
            <Field name="sellerTitle"   label="Venda — título"     value={content.sellerTitle} />
            <Field name="securityTitle" label="Segurança — título" value={content.securityTitle} />
          </div>
          <Field name="buyerText"    label="Compra — texto"    value={content.buyerText}    textarea />
          <Field name="sellerText"   label="Venda — texto"     value={content.sellerText}   textarea />
          <Field name="securityText" label="Segurança — texto" value={content.securityText} textarea />
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Chamada para anunciar</h2>
          <Field name="sellMini"  label="Texto pequeno da chamada" value={content.sellMini} />
          <Field name="sellTitle" label="Título da chamada"        value={content.sellTitle} />
          <Field name="sellText"  label="Texto da chamada"         value={content.sellText} textarea />
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Chamada final</h2>
          <Field name="finalMini"  label="Texto pequeno final" value={content.finalMini} />
          <Field name="finalTitle" label="Frase final"         value={content.finalTitle} textarea />
        </section>

        <div style={styles.stickyActions}>
          <button type="submit" style={styles.save}>Salvar alterações</button>
          <Link href="/" target="_blank" style={styles.preview}>Pré-visualizar home</Link>
        </div>
      </form>
    </AdminLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  topButton:      { padding: "12px 20px", borderRadius: 14, background: "#1877f2", color: "#ffffff", textDecoration: "none", fontWeight: 800, fontSize: 14, boxShadow: "0 4px 12px rgba(24,119,242,0.2)" },
  success:        { padding: 16, borderRadius: 18, background: "#dcfce7", border: "1px solid rgba(22,101,52,0.1)", color: "#166534", fontWeight: 800, marginBottom: 24 },
  form:           { display: "grid", gap: 24 },
  section:        { padding: 32, borderRadius: 24, background: "#ffffff", border: "1px solid rgba(148,163,184,0.12)", boxShadow: "0 4px 20px rgba(15,23,42,0.04)" },
  sectionTitle:   { margin: "0 0 20px", fontSize: 24, fontWeight: 800, letterSpacing: "-.03em", color: "#0f172a" },
  twoCols:        { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 16 },
  threeCols:      { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 16, marginBottom: 16 },
  field:          { display: "grid", gap: 8, marginBottom: 16 },
  label:          { color: "#475569", fontSize: 13, fontWeight: 800, letterSpacing: '0.02em' },
  input:          { width: "100%", minHeight: 48, padding: "0 16px", borderRadius: 14, border: "1px solid rgba(148,163,184,0.15)", background: "#ffffff", color: "#0f172a", font: "inherit", fontWeight: 700, outline: "none", transition: 'all 0.2s' },
  textarea:       { width: "100%", padding: 16, borderRadius: 14, border: "1px solid rgba(148,163,184,0.15)", background: "#ffffff", color: "#0f172a", font: "inherit", fontWeight: 600, resize: "vertical", outline: "none", lineHeight: 1.6 },
  help:           { color: "#94a3b8", fontWeight: 700, fontSize: 12 },
  stickyActions:  { position: "sticky", bottom: 20, zIndex: 10, display: "flex", gap: 12, justifyContent: "flex-end", padding: 20, borderRadius: 24, background: "rgba(255,255,255,0.85)", border: "1px solid rgba(148,163,184,0.12)", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(15,23,42,0.08)" },
  save:           { minHeight: 50, padding: "0 28px", borderRadius: 14, border: 0, background: "#1877f2", color: "#ffffff", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(24,119,242,0.2)", fontSize: 15 },
  preview:        { minHeight: 50, padding: "0 28px", borderRadius: 14, border: "1px solid rgba(148,163,184,0.15)", background: "#f8fafc", color: "#475569", textDecoration: "none", display: "inline-flex", alignItems: "center", fontWeight: 800, fontSize: 15 },
};
