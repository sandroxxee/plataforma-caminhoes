import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anuncie seu Caminhão, Carreta ou Máquina | CaminhõesBR",
  description:
    "Publique seu anúncio grátis em minutos. Cole o texto e a IA preenche tudo automaticamente. Comprador direto, sem intermediários.",
  openGraph: {
    title: "Anuncie grátis — CaminhõesBR",
    description:
      "A maior plataforma de caminhões, carretas e máquinas do Brasil. Anúncio grátis, preenchimento automático com IA.",
    url: "https://caminhoesbr.com.br/anunciar",
  },
};

const CATEGORIAS = [
  { label: "Caminhão",   emoji: "🚛", href: "/painel/anuncios/novo?tipo=Caminhão",  desc: "Trucks, cavalo mecânico, basculante e mais" },
  { label: "Carreta",    emoji: "🚚", href: "/painel/anuncios/novo?tipo=Carretas",  desc: "Graneleira, sider, prancha, frigorífica…" },
  { label: "Máquina",    emoji: "🏗️", href: "/painel/anuncios/novo?tipo=Máquinas",  desc: "Escavadeira, pá carregadeira, motoniveladora…" },
  { label: "Implemento", emoji: "⚙️", href: "/painel/anuncios/novo?tipo=Implemento", desc: "Tanque, baú, cegonheiro, basculante…" },
];

const PASSOS = [
  { num: "1", titulo: "Escolha a categoria",    desc: "Caminhão, carreta, máquina ou implemento." },
  { num: "2", titulo: "Cole o texto do anúncio", desc: "Pode ser do WhatsApp, OLX, Facebook — qualquer formato." },
  { num: "3", titulo: "A IA preenche tudo",      desc: "Marca, modelo, ano, preço e cidade detectados automaticamente." },
  { num: "4", titulo: "Publique em 1 clique",    desc: "Seu anúncio entra na plataforma e aparece para compradores." },
];

const BENEFICIOS = [
  { emoji: "💸", titulo: "100% grátis",                desc: "Sem taxa para anunciar. Sempre." },
  { emoji: "🤖", titulo: "IA preenche os campos",      desc: "Cole o texto — a IA extrai marca, modelo, ano e preço." },
  { emoji: "📱", titulo: "Comprador direto no WhatsApp", desc: "O contato vai direto para o seu número, sem intermediário." },
  { emoji: "🔍", titulo: "Aparece no Google",          desc: "Cada anúncio tem página própria indexada nos buscadores." },
];

const pageStyles = `
.lp-wrap { min-height:100vh; background:#030712; color:#f1f5f9; }
.hero { display:flex; flex-direction:column; align-items:center; text-align:center; padding:80px 20px 64px; gap:20px; }
.hero-badge { display:inline-block; background:#052e16; color:#4ade80; border:1px solid #166534; border-radius:999px; padding:4px 16px; font-size:13px; font-weight:700; margin:0; }
.hero-title { font-size:clamp(2rem,5vw,3.5rem); font-weight:950; line-height:1.1; margin:0; max-width:800px; }
.hero-highlight { color:#22c55e; }
.hero-sub { font-size:clamp(1rem,2vw,1.2rem); color:#94a3b8; max-width:600px; margin:0; line-height:1.6; }
.hero-cta-row { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:8px; }
.btn-primary { display:inline-flex; align-items:center; background:#22c55e; color:#052e16; font-weight:900; font-size:1rem; padding:14px 28px; border-radius:14px; text-decoration:none; box-shadow:0 10px 30px rgba(34,197,94,.25); transition:opacity .15s; }
.btn-primary:hover { opacity:.85; }
.btn-lg { font-size:1.15rem; padding:18px 36px; }
.btn-ghost { display:inline-flex; align-items:center; color:#94a3b8; font-weight:700; font-size:1rem; padding:14px 20px; border-radius:14px; text-decoration:none; border:1px solid #1e293b; transition:color .15s; }
.btn-ghost:hover { color:#f1f5f9; }
.lp-section { padding:64px 20px; max-width:1100px; margin:0 auto; }
.lp-section-dark { background:#0f172a; padding:64px 20px; }
.lp-section-dark-inner { max-width:1100px; margin:0 auto; }
.section-title { text-align:center; font-size:clamp(1.4rem,3vw,2rem); font-weight:900; margin:0 0 40px; }
.categorias-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; }
.cat-card { display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px; padding:28px 20px; background:#0f172a; border:1px solid #1e293b; border-radius:18px; text-decoration:none; color:inherit; transition:border-color .15s,transform .15s; }
.cat-card:hover { border-color:#22c55e; transform:translateY(-3px); }
.cat-emoji { font-size:2.5rem; }
.cat-label { font-size:1.1rem; font-weight:800; }
.cat-desc { font-size:.875rem; color:#64748b; }
.passos-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:20px; }
.passo-card { display:flex; flex-direction:column; gap:8px; padding:24px; background:#1e293b; border-radius:16px; }
.passo-num { width:36px; height:36px; background:#22c55e; color:#052e16; font-weight:900; font-size:1rem; border-radius:50%; display:flex; align-items:center; justify-content:center; }
.passo-titulo { font-weight:800; font-size:1rem; }
.passo-desc { font-size:.875rem; color:#94a3b8; margin:0; }
.beneficios-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; }
.beneficio-card { display:flex; flex-direction:column; gap:8px; padding:24px; background:#0f172a; border:1px solid #1e293b; border-radius:16px; }
.beneficio-emoji { font-size:1.8rem; }
.beneficio-titulo { font-weight:800; font-size:1rem; }
.beneficio-desc { font-size:.875rem; color:#94a3b8; margin:0; }
.cta-final { display:flex; flex-direction:column; align-items:center; text-align:center; padding:80px 20px; gap:16px; background:linear-gradient(180deg,#030712 0%,#052e16 100%); }
.cta-title { font-size:clamp(1.8rem,4vw,2.8rem); font-weight:950; margin:0; }
.cta-sub { color:#94a3b8; margin:0; font-size:1rem; }
`;

export default function AnunciarPage() {
  return (
    <main className="lp-wrap">
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      {/* HERO */}
      <section className="hero">
        <p className="hero-badge">🚛 Plataforma gratuita</p>
        <h1 className="hero-title">
          Anuncie seu caminhão,<br />carreta ou máquina<br />
          <span className="hero-highlight">em menos de 2 minutos</span>
        </h1>
        <p className="hero-sub">
          Cole o texto do seu anúncio e a IA preenche tudo automaticamente.<br />
          Comprador direto no seu WhatsApp. Sem taxa, sem burocracia.
        </p>
        <div className="hero-cta-row">
          <Link href="/cadastro" className="btn-primary">Criar conta grátis</Link>
          <Link href="/login" className="btn-ghost">Já tenho conta →</Link>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="lp-section">
        <h2 className="section-title">O que você quer anunciar?</h2>
        <div className="categorias-grid">
          {CATEGORIAS.map((c) => (
            <Link key={c.label} href={c.href} className="cat-card">
              <span className="cat-emoji">{c.emoji}</span>
              <strong className="cat-label">{c.label}</strong>
              <span className="cat-desc">{c.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <div className="lp-section-dark">
        <div className="lp-section-dark-inner">
          <h2 className="section-title">Como funciona</h2>
          <div className="passos-grid">
            {PASSOS.map((p) => (
              <div key={p.num} className="passo-card">
                <span className="passo-num">{p.num}</span>
                <strong className="passo-titulo">{p.titulo}</strong>
                <p className="passo-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BENEFÍCIOS */}
      <section className="lp-section">
        <h2 className="section-title">Por que anunciar aqui?</h2>
        <div className="beneficios-grid">
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} className="beneficio-card">
              <span className="beneficio-emoji">{b.emoji}</span>
              <strong className="beneficio-titulo">{b.titulo}</strong>
              <p className="beneficio-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <h2 className="cta-title">Pronto para anunciar?</h2>
        <p className="cta-sub">Cadastro gratuito. Sem cartão de crédito.</p>
        <Link href="/cadastro" className="btn-primary btn-lg">Anunciar agora — é grátis</Link>
      </section>
    </main>
  );
}
