import { redirect } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { getHomeContent, type HomeContent } from "@/lib/site-content";
import { salvarAparencia } from "./actions";

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
  const params = searchParams ? await searchParams : {};
  const supabase = await requireAdmin();
  const content = await getHomeContent(supabase);

  return (
    <AdminLayout title="Aparência do site" subtitle="Edite os principais textos da página inicial sem mexer no código. O layout continua controlado para não quebrar no celular." badge="Conteúdo editável" actions={<Link href="/" target="_blank" style={styles.topButton}>Ver home</Link>}>
      {params?.salvo === "1" ? <div style={styles.success}>Alterações salvas. Abra a home para conferir.</div> : null}
      <div style={styles.notice}><strong>Primeira etapa editável</strong><span>Agora você consegue trocar frases, textos de confiança, botões e chamadas comerciais da home. Na próxima etapa entram banner/imagens e seleção manual de destaques.</span></div>
      <form action={salvarAparencia} style={styles.form}>
        <section style={styles.section}><h2 style={styles.sectionTitle}>Topo da home</h2><Field name="heroMini" label="Texto pequeno acima da frase principal" value={content.heroMini} /><Field name="heroTitle" label="Frase principal" value={content.heroTitle} textarea /><Field name="heroSubtitle" label="Texto abaixo da frase principal" value={content.heroSubtitle} textarea /><div style={styles.twoCols}><Field name="primaryButtonText" label="Botão principal" value={content.primaryButtonText} /><Field name="primaryButtonHref" label="Link do botão principal" value={content.primaryButtonHref} help="Exemplo: /anuncios" /><Field name="secondaryButtonText" label="Botão secundário" value={content.secondaryButtonText} /><Field name="secondaryButtonHref" label="Link do botão secundário" value={content.secondaryButtonHref} help="Exemplo: /anunciar" /></div></section>
        <section style={styles.section}><h2 style={styles.sectionTitle}>Faixa de confiança</h2><div style={styles.twoCols}><Field name="trust1Title" label="Bloco 1 — título" value={content.trust1Title} /><Field name="trust1Text" label="Bloco 1 — texto" value={content.trust1Text} /><Field name="trust2Title" label="Bloco 2 — título" value={content.trust2Title} /><Field name="trust2Text" label="Bloco 2 — texto" value={content.trust2Text} /><Field name="trust3Title" label="Bloco 3 — título" value={content.trust3Title} /><Field name="trust3Text" label="Bloco 3 — texto" value={content.trust3Text} /><Field name="trust4Title" label="Bloco 4 — título" value={content.trust4Title} /><Field name="trust4Text" label="Bloco 4 — texto" value={content.trust4Text} /></div></section>
        <section style={styles.section}><h2 style={styles.sectionTitle}>Textos comerciais</h2><div style={styles.threeCols}><Field name="buyerTitle" label="Compra — título" value={content.buyerTitle} /><Field name="sellerTitle" label="Venda — título" value={content.sellerTitle} /><Field name="securityTitle" label="Segurança — título" value={content.securityTitle} /></div><Field name="buyerText" label="Compra — texto" value={content.buyerText} textarea /><Field name="sellerText" label="Venda — texto" value={content.sellerText} textarea /><Field name="securityText" label="Segurança — texto" value={content.securityText} textarea /></section>
        <section style={styles.section}><h2 style={styles.sectionTitle}>Chamada para anunciar</h2><Field name="sellMini" label="Texto pequeno da chamada" value={content.sellMini} /><Field name="sellTitle" label="Título da chamada" value={content.sellTitle} /><Field name="sellText" label="Texto da chamada" value={content.sellText} textarea /></section>
        <section style={styles.section}><h2 style={styles.sectionTitle}>Chamada final</h2><Field name="finalMini" label="Texto pequeno final" value={content.finalMini} /><Field name="finalTitle" label="Frase final" value={content.finalTitle} textarea /></section>
        <div style={styles.stickyActions}><button type="submit" style={styles.save}>Salvar alterações</button><Link href="/" target="_blank" style={styles.preview}>Pré-visualizar home</Link></div>
      </form>
    </AdminLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  topButton: { padding: "12px 16px", borderRadius: 14, background: "#1f64b5", color: "#ffffff", textDecoration: "none", fontWeight: 900 },
  success: { padding: 16, borderRadius: 18, background: "#e7f8ef", border: "1px solid #b7efce", color: "#166534", fontWeight: 900, marginBottom: 16 },
  notice: { display: "grid", gap: 6, padding: 18, borderRadius: 22, background: "#eaf2ff", border: "1px solid #b8d4ff", color: "#334155", marginBottom: 18 },
  form: { display: "grid", gap: 18 },
  section: { padding: 22, borderRadius: 26, background: "#ffffff", border: "1px solid #d8dee9", boxShadow: "0 8px 22px rgba(15,23,42,.05)" },
  sectionTitle: { margin: "0 0 16px", fontSize: 24, letterSpacing: "-.035em", color: "#111827" },
  twoCols: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 14 },
  threeCols: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 14, marginBottom: 14 },
  field: { display: "grid", gap: 8, marginBottom: 14 },
  label: { color: "#334155", fontSize: 13, fontWeight: 900 },
  input: { width: "100%", minHeight: 48, padding: "0 14px", borderRadius: 14, border: "1px solid #d8dee9", background: "#ffffff", color: "#111827", font: "inherit", fontWeight: 800, outline: "none" },
  textarea: { width: "100%", padding: 14, borderRadius: 14, border: "1px solid #d8dee9", background: "#ffffff", color: "#111827", font: "inherit", fontWeight: 750, resize: "vertical", outline: "none" },
  help: { color: "#64748b", fontWeight: 750 },
  stickyActions: { position: "sticky", bottom: 14, zIndex: 5, display: "flex", gap: 10, justifyContent: "flex-end", padding: 14, borderRadius: 22, background: "rgba(255,255,255,.92)", border: "1px solid #d8dee9", backdropFilter: "blur(14px)", boxShadow: "0 8px 22px rgba(15,23,42,.08)" },
  save: { minHeight: 50, padding: "0 20px", borderRadius: 999, border: 0, background: "#1f64b5", color: "#ffffff", fontWeight: 950, cursor: "pointer" },
  preview: { minHeight: 50, padding: "0 20px", borderRadius: 999, border: "1px solid #d8dee9", background: "#eef2f7", color: "#334155", textDecoration: "none", display: "inline-flex", alignItems: "center", fontWeight: 950 },
};
