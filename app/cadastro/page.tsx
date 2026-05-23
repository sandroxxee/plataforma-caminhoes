import Link from "next/link";
import type { CSSProperties } from "react";
import { cadastrar } from "./actions";

type PageProps = { searchParams?: Promise<{ erro?: string }> };

export default async function CadastroPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const erro = params?.erro;

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <Link href="/" style={styles.logo}>
          <span style={styles.logoIcon}>🚛</span>
          <span><strong>CAMINHÕES EM OFERTA</strong><small style={styles.small}>Cadastro de anunciante</small></span>
        </Link>

        <span style={styles.badge}>Anunciar</span>
        <h1 style={styles.title}>Criar conta</h1>
        <p style={styles.subtitle}>Cadastre seus dados para enviar caminhões para aprovação.</p>

        {erro && <div style={styles.error}>{erro === "cadastro" ? "Não foi possível criar a conta. Verifique os dados." : "Preencha os campos obrigatórios."}</div>}

        <form action={cadastrar} style={styles.form}>
          <label style={styles.field}><span style={styles.label}>Nome *</span><input style={styles.input} name="nome" placeholder="Seu nome" required /></label>
          <label style={styles.field}><span style={styles.label}>WhatsApp</span><input style={styles.input} name="whatsapp" placeholder="5549999999999" /></label>
          <label style={styles.field}><span style={styles.label}>E-mail *</span><input style={styles.input} name="email" type="email" placeholder="seuemail@exemplo.com" required /></label>
          <label style={styles.field}><span style={styles.label}>Senha *</span><input style={styles.input} name="password" type="password" placeholder="mínimo 6 caracteres" required /></label>

          <div style={styles.row}>
            <label style={styles.field}><span style={styles.label}>Cidade</span><input style={styles.input} name="cidade" placeholder="Xanxerê" /></label>
            <label style={styles.field}><span style={styles.label}>Estado</span><select style={styles.input} name="estado" defaultValue="SC"><option value="SC">SC</option><option value="PR">PR</option><option value="RS">RS</option><option value="SP">SP</option><option value="MG">MG</option></select></label>
          </div>

          <button style={styles.button} type="submit">Criar cadastro</button>
        </form>

        <div style={styles.footer}>
          <span>Já tem conta?</span>
          <Link href="/login" style={styles.link}>Entrar</Link>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "radial-gradient(circle at top,#0f3b2f 0%,#020617 48%,#020617 100%)", color: "white" },
  card: { width: "100%", maxWidth: 520, padding: 30, borderRadius: 28, background: "rgba(15,23,42,.84)", border: "1px solid rgba(255,255,255,.12)", boxShadow: "0 28px 90px rgba(0,0,0,.45)" },
  logo: { display: "flex", alignItems: "center", gap: 12, color: "white", textDecoration: "none", marginBottom: 26 },
  logoIcon: { width: 44, height: 44, borderRadius: 14, display: "grid", placeItems: "center", background: "#22c55e" },
  small: { display: "block", color: "#94a3b8", fontSize: 12 },
  badge: { display: "inline-flex", padding: "7px 12px", borderRadius: 999, color: "#86efac", background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.22)", fontWeight: 900, fontSize: 12 },
  title: { fontSize: 34, margin: "14px 0 8px" },
  subtitle: { margin: "0 0 20px", color: "#cbd5e1", lineHeight: 1.55 },
  error: { padding: 13, borderRadius: 14, marginBottom: 16, color: "#fecaca", background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.25)", fontWeight: 800 },
  form: { display: "grid", gap: 14 },
  row: { display: "grid", gridTemplateColumns: "1fr 120px", gap: 14 },
  field: { display: "grid", gap: 8 },
  label: { color: "#cbd5e1", fontWeight: 900, fontSize: 13 },
  input: { width: "100%", padding: "14px 15px", borderRadius: 15, border: "1px solid rgba(255,255,255,.15)", background: "rgba(2,6,23,.72)", color: "white", outline: "none" },
  button: { marginTop: 6, border: 0, padding: "15px", borderRadius: 16, background: "#22c55e", color: "#052e16", fontWeight: 950, cursor: "pointer", fontSize: 16 },
  footer: { marginTop: 20, display: "flex", justifyContent: "center", gap: 8, color: "#cbd5e1" },
  link: { color: "#86efac", fontWeight: 900, textDecoration: "none" },
};
