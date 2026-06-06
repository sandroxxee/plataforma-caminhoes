import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Anunciar caminhão ou implemento",
  description:
    "Anuncie caminhões, cavalos mecânicos, trucks, bitrucks e implementos no Caminhões à Venda com fotos, dados principais, revisão e contato pelo WhatsApp.",
  alternates: { canonical: "/anunciar" },
};

export default function AnunciarPage() {
  return (
    <main className="market-page anunciar-page">
      <PublicHeader />

      <section className="market-container anunciar-hero">
        <div className="anunciar-copy">
          <span className="anunciar-eyebrow">Anunciar no Caminhões à Venda</span>
          <h1>Escolha o que deseja anunciar.</h1>
          <p>
            Separe caminhão e implemento desde o começo, entre ou crie sua conta e envie o anúncio para aprovação com fotos, dados principais e contato correto.
          </p>
        </div>

        <div className="anunciar-flow-card">
          <strong>Fluxo organizado</strong>
          <span>Escolher tipo → acessar conta → preencher dados → enviar para aprovação.</span>
        </div>
      </section>

      <section className="market-container anunciar-choice-grid" aria-label="Escolha o tipo de anúncio">
        <Link href="/cadastro?tipo=caminhao" className="anunciar-choice-card primary">
          <span className="choice-number">01</span>
          <div>
            <small>Anúncio de caminhão</small>
            <h2>Anunciar caminhão</h2>
            <p>Cavalo mecânico, truck, bitruck, toco, caçamba, baú, prancha, tanque, munck e outros caminhões.</p>
          </div>
          <b>Começar como caminhão</b>
        </Link>

        <Link href="/cadastro?tipo=implemento" className="anunciar-choice-card">
          <span className="choice-number">02</span>
          <div>
            <small>Anúncio de implemento</small>
            <h2>Anunciar implemento</h2>
            <p>Carreta, caçamba, prancha, graneleiro, tanque, baú, sider, dolly, bitrem e outros implementos.</p>
          </div>
          <b>Começar como implemento</b>
        </Link>
      </section>

      <section className="market-container anunciar-account-strip">
        <div>
          <strong>Já tem conta?</strong>
          <span>Entre no painel para cadastrar, revisar ou acompanhar seus anúncios.</span>
        </div>
        <Link href="/login">Entrar no painel</Link>
      </section>

      <section className="market-container anunciar-steps">
        <article>
          <span>1</span>
          <strong>Escolha o tipo</strong>
          <p>Caminhão e implemento têm informações diferentes, por isso começam separados.</p>
        </article>
        <article>
          <span>2</span>
          <strong>Acesse sua conta</strong>
          <p>Crie cadastro ou entre no painel para manter seus anúncios organizados.</p>
        </article>
        <article>
          <span>3</span>
          <strong>Preencha os dados</strong>
          <p>Informe modelo, ano, cidade, valor, WhatsApp, descrição e fotos reais.</p>
        </article>
        <article>
          <span>4</span>
          <strong>Envie para aprovação</strong>
          <p>O anúncio fica pendente até revisão antes de aparecer publicamente.</p>
        </article>
      </section>

      <section className="market-container anunciar-final">
        <div>
          <span className="anunciar-eyebrow">Publicação revisada</span>
          <h2>Seu anúncio fica mais claro para quem está comprando.</h2>
          <p>A página organiza o caminho sem repetir botões e sem misturar caminhão com implemento.</p>
        </div>
        <Link href="/anuncios">Ver anúncios publicados</Link>
      </section>

      <SiteFooter />

      <style>{`
        .anunciar-page { padding-bottom: 30px; }
        .anunciar-hero { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 18px; align-items: stretch; padding-top: 22px; }
        .anunciar-copy, .anunciar-flow-card, .anunciar-choice-card, .anunciar-account-strip, .anunciar-steps article, .anunciar-final { background: var(--surface); border: 1px solid var(--line); border-radius: 24px; box-shadow: var(--shadow); }
        .anunciar-copy { padding: clamp(24px, 4vw, 44px); }
        .anunciar-eyebrow { display: inline-flex; min-height: 28px; width: fit-content; align-items: center; padding: 0 10px; border-radius: 999px; background: var(--blueSoft); color: var(--blue); font-size: 12px; font-weight: 950; letter-spacing: .04em; text-transform: uppercase; }
        .anunciar-copy h1 { margin: 14px 0 10px; max-width: 760px; font-size: clamp(42px, 6vw, 76px); line-height: .92; letter-spacing: -.07em; }
        .anunciar-copy p { max-width: 780px; margin: 0; color: var(--muted); font-size: 18px; line-height: 1.55; font-weight: 750; }
        .anunciar-flow-card { padding: 24px; display: grid; align-content: center; gap: 8px; }
        .anunciar-flow-card strong { color: var(--blue); font-size: 30px; line-height: 1; letter-spacing: -.05em; }
        .anunciar-flow-card span { color: var(--muted); font-weight: 800; line-height: 1.5; }
        .anunciar-choice-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 18px; }
        .anunciar-choice-card { min-height: 310px; padding: 26px; display: grid; align-content: space-between; gap: 22px; color: var(--text); transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease; }
        .anunciar-choice-card:hover { transform: translateY(-3px); border-color: var(--blue); box-shadow: var(--shadow2); }
        .anunciar-choice-card.primary { background: linear-gradient(135deg, var(--blue), var(--blue2)); color: #fff; border-color: transparent; }
        .choice-number { width: 46px; height: 46px; border-radius: 16px; display: grid; place-items: center; background: var(--blueSoft); color: var(--blue); font-weight: 950; }
        .anunciar-choice-card.primary .choice-number { background: rgba(255,255,255,.18); color: #fff; }
        .anunciar-choice-card small { display: block; margin-bottom: 10px; color: var(--muted); font-weight: 950; letter-spacing: .04em; text-transform: uppercase; }
        .anunciar-choice-card.primary small { color: rgba(255,255,255,.78); }
        .anunciar-choice-card h2 { margin: 0 0 10px; font-size: clamp(30px, 4vw, 48px); line-height: .95; letter-spacing: -.06em; }
        .anunciar-choice-card p { margin: 0; color: var(--muted); font-weight: 760; line-height: 1.55; }
        .anunciar-choice-card.primary p { color: rgba(255,255,255,.86); }
        .anunciar-choice-card b { min-height: 46px; width: fit-content; display: inline-flex; align-items: center; justify-content: center; padding: 0 18px; border-radius: 999px; background: var(--blue); color: #fff; font-weight: 950; }
        .anunciar-choice-card.primary b { background: #fff; color: var(--blue2); }
        .anunciar-account-strip { margin-top: 18px; padding: 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .anunciar-account-strip div { display: grid; gap: 2px; }
        .anunciar-account-strip strong { font-size: 18px; }
        .anunciar-account-strip span { color: var(--muted); font-weight: 750; }
        .anunciar-account-strip a, .anunciar-final a { min-height: 46px; display: inline-flex; align-items: center; justify-content: center; padding: 0 18px; border-radius: 999px; background: var(--soft); border: 1px solid var(--line); font-weight: 950; white-space: nowrap; }
        .anunciar-steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 18px; }
        .anunciar-steps article { padding: 20px; display: grid; gap: 10px; align-content: start; }
        .anunciar-steps article span { width: 36px; height: 36px; border-radius: 13px; display: grid; place-items: center; background: var(--blueSoft); color: var(--blue); font-weight: 950; }
        .anunciar-steps article strong { font-size: 17px; }
        .anunciar-steps article p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.5; font-weight: 750; }
        .anunciar-final { margin-top: 18px; padding: 26px; display: flex; align-items: center; justify-content: space-between; gap: 18px; }
        .anunciar-final h2 { margin: 10px 0 6px; font-size: clamp(28px, 4vw, 44px); line-height: 1; letter-spacing: -.05em; }
        .anunciar-final p { margin: 0; color: var(--muted); font-weight: 750; }
        @media (max-width: 980px) { .anunciar-hero { grid-template-columns: 1fr; } .anunciar-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 720px) { .anunciar-choice-grid { grid-template-columns: 1fr; } .anunciar-account-strip, .anunciar-final { align-items: stretch; flex-direction: column; } .anunciar-account-strip a, .anunciar-final a { width: 100%; } }
        @media (max-width: 520px) { .anunciar-copy, .anunciar-choice-card, .anunciar-final { padding: 20px; border-radius: 20px; } .anunciar-copy h1 { font-size: 42px; } .anunciar-steps { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
