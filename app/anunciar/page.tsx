import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

const etapas = [
  {
    numero: "1",
    titulo: "Escolha o tipo",
    texto: "Caminhão e implemento têm informações diferentes, por isso o cadastro começa separado.",
  },
  {
    numero: "2",
    titulo: "Entre ou crie sua conta",
    texto: "A conta mantém seus anúncios organizados e permite acompanhar o status no painel.",
  },
  {
    numero: "3",
    titulo: "Envie dados e fotos",
    texto: "Preencha as informações principais, fotos reais, valor, cidade e contato do anúncio.",
  },
  {
    numero: "4",
    titulo: "Aguarde aprovação",
    texto: "O anúncio fica pendente até revisão antes de aparecer publicamente no site.",
  },
];

export default function AnunciarPage() {
  return (
    <main className="market-page anunciar-page">
      <PublicHeader />

      <section className="market-container anunciar-shell">
        <div className="anunciar-hero">
          <div className="anunciar-copy">
            <span className="anunciar-kicker">Anunciar no Caminhões à Venda</span>
            <h1>Escolha o que deseja anunciar.</h1>
            <p>
              Anuncie caminhões e implementos em uma página direta, organizada e preparada para aprovação antes da publicação.
            </p>

            <div className="anunciar-actions">
              <Link href="/painel/anuncios/novo">Começar anúncio</Link>
              <Link href="/login">Entrar na conta</Link>
            </div>
          </div>

          <div className="anunciar-flow-card" aria-label="Etapas para anunciar">
            <strong>Como anunciar</strong>
            <ol>
              <li>Escolha caminhão ou implemento</li>
              <li>Entre ou crie sua conta</li>
              <li>Preencha dados e fotos</li>
              <li>Aguarde aprovação</li>
            </ol>
          </div>
        </div>

        <div className="anunciar-choice-grid" aria-label="Escolha do tipo de anúncio">
          <Link href="/painel/anuncios/novo/caminhao" className="anunciar-choice-card anunciar-choice-primary">
            <span>1</span>
            <small>Caminhão</small>
            <strong>Anunciar caminhão</strong>
            <p>
              Cavalo mecânico, truck, toco, bitruck, caçamba, baú, prancha, tanque, munck e outros caminhões.
            </p>
            <b>Anunciar caminhão</b>
          </Link>

          <Link href="/painel/anuncios/novo/implemento" className="anunciar-choice-card">
            <span>2</span>
            <small>Implemento</small>
            <strong>Anunciar implemento</strong>
            <p>
              Carreta, caçamba, bi-caçamba, bitrem, prancha, graneleiro, tanque, baú, sider, dolly e outros implementos.
            </p>
            <b>Anunciar implemento</b>
          </Link>
        </div>

        <div className="anunciar-steps-grid">
          {etapas.map((etapa) => (
            <article key={etapa.numero} className="anunciar-step-card">
              <span>{etapa.numero}</span>
              <h2>{etapa.titulo}</h2>
              <p>{etapa.texto}</p>
            </article>
          ))}
        </div>

        <div className="anunciar-note">
          <strong>Importante:</strong>
          <p>
            O anúncio só aparece no site depois de aprovado. Isso ajuda a manter os anúncios organizados, com informações claras e melhor apresentação para compradores.
          </p>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .anunciar-page { padding-bottom: 0; }
        .anunciar-shell { display: grid; gap: 18px; padding-top: 18px; padding-bottom: 30px; }
        .anunciar-hero { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 18px; align-items: stretch; }
        .anunciar-copy { padding: 28px; border-radius: var(--radius); background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); }
        .anunciar-kicker { display: inline-flex; min-height: 28px; width: fit-content; align-items: center; padding: 0 10px; border-radius: 999px; background: var(--blueSoft); color: var(--blue); font-size: 12px; font-weight: 950; letter-spacing: .04em; text-transform: uppercase; }
        .anunciar-copy h1 { max-width: 780px; margin: 14px 0 12px; font-size: clamp(38px, 5vw, 62px); line-height: .98; letter-spacing: -.055em; color: var(--text); }
        .anunciar-copy p { max-width: 720px; margin: 0; color: var(--muted); font-size: 17px; line-height: 1.6; font-weight: 750; }
        .anunciar-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
        .anunciar-actions a { min-height: 46px; display: inline-flex; align-items: center; justify-content: center; padding: 0 18px; border-radius: 999px; font-weight: 950; }
        .anunciar-actions a:first-child { background: var(--blue); color: #fff; }
        .anunciar-actions a:last-child { background: var(--soft); border: 1px solid var(--line); color: var(--text); }
        .anunciar-flow-card { padding: 24px; border-radius: var(--radius); background: #101827; border: 1px solid rgba(148, 163, 184, .22); box-shadow: var(--shadow); color: #fff; }
        .anunciar-flow-card strong { display: block; color: #93c5fd; font-size: 13px; font-weight: 950; letter-spacing: .04em; text-transform: uppercase; }
        .anunciar-flow-card ol { display: grid; gap: 12px; margin: 18px 0 0; padding: 0; list-style: none; counter-reset: steps; }
        .anunciar-flow-card li { counter-increment: steps; display: grid; grid-template-columns: 34px 1fr; gap: 10px; align-items: center; font-weight: 900; color: #e8eef8; }
        .anunciar-flow-card li::before { content: counter(steps); width: 34px; height: 34px; border-radius: 999px; display: grid; place-items: center; background: var(--blue); color: #fff; font-size: 13px; font-weight: 950; }
        .anunciar-choice-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
        .anunciar-choice-card { min-height: 260px; position: relative; overflow: hidden; display: grid; align-content: start; gap: 12px; padding: 26px; border-radius: 24px; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
        .anunciar-choice-card:hover { transform: translateY(-2px); box-shadow: var(--shadow2); border-color: var(--blue); }
        .anunciar-choice-card span { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 16px; background: var(--blueSoft); color: var(--blue); font-size: 14px; font-weight: 950; }
        .anunciar-choice-card small { margin-top: 14px; color: var(--muted); font-size: 12px; font-weight: 950; letter-spacing: .04em; text-transform: uppercase; }
        .anunciar-choice-card strong { color: var(--text); font-size: clamp(27px, 4vw, 40px); line-height: 1; letter-spacing: -.05em; }
        .anunciar-choice-card p { max-width: 560px; margin: 0; color: var(--muted); font-weight: 750; line-height: 1.55; }
        .anunciar-choice-card b { width: fit-content; margin-top: 8px; min-height: 42px; display: inline-flex; align-items: center; justify-content: center; padding: 0 16px; border-radius: 999px; background: var(--blue); color: #fff; font-size: 14px; font-weight: 950; }
        .anunciar-choice-primary { background: var(--blue); border-color: var(--blue); color: #fff; }
        .anunciar-choice-primary span { background: rgba(255,255,255,.16); color: #fff; }
        .anunciar-choice-primary small, .anunciar-choice-primary strong, .anunciar-choice-primary p { color: #fff; }
        .anunciar-choice-primary p { color: rgba(255,255,255,.9); }
        .anunciar-choice-primary b { background: #fff; color: var(--blue); }
        .anunciar-steps-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
        .anunciar-step-card { padding: 18px; border-radius: 18px; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); }
        .anunciar-step-card span { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 14px; background: var(--blueSoft); color: var(--blue); font-weight: 950; }
        .anunciar-step-card h2 { margin: 15px 0 8px; color: var(--text); font-size: 18px; line-height: 1.1; letter-spacing: -.03em; }
        .anunciar-step-card p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.5; font-weight: 720; }
        .anunciar-note { display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-start; padding: 16px 18px; border-radius: 18px; background: var(--blueSoft); border: 1px solid rgba(24, 119, 242, .18); color: var(--text); }
        .anunciar-note strong { color: var(--blue); }
        .anunciar-note p { margin: 0; color: var(--muted); font-weight: 800; line-height: 1.5; }
        @media (max-width: 920px) { .anunciar-hero, .anunciar-choice-grid, .anunciar-steps-grid { grid-template-columns: 1fr; } .anunciar-flow-card { order: -1; } }
        @media (max-width: 560px) { .anunciar-shell { width: min(100% - 20px, 1320px); } .anunciar-copy, .anunciar-flow-card, .anunciar-choice-card { padding: 20px; border-radius: 20px; } .anunciar-actions { display: grid; } .anunciar-actions a { width: 100%; } .anunciar-choice-card { min-height: auto; } }
      `}</style>
    </main>
  );
}
