import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Vantagens para anunciar | Caminhões à Venda",
  description:
    "Vantagens para anunciar caminhões e implementos no Caminhões à Venda, com pagamento online e aprovação manual.",
  robots: {
    index: false,
    follow: true,
  },
};

const vantagens = [
  {
    titulo: "Anúncio organizado",
    texto: "Seu caminhão ou implemento aparece com informações claras, fotos, descrição e contato direto.",
  },
  {
    titulo: "Contato pelo WhatsApp",
    texto: "O interessado chega direto no canal de atendimento, sem formulário complicado para o comprador.",
  },
  {
    titulo: "Revisão antes de publicar",
    texto: "O anúncio passa por conferência para evitar informação solta, erro básico ou anúncio mal apresentado.",
  },
  {
    titulo: "Mais confiança",
    texto: "A plataforma separa caminhões e implementos, organiza os dados e ajuda o comprador a entender melhor o anúncio.",
  },
];

const planos = [
  {
    nome: "Básico",
    destaque: "Para começar",
    preco: "R$ 49,90",
    descricao: "Ideal para colocar o anúncio no ar com apresentação simples, direta e organizada.",
    linkPagamento: "https://mpago.la/1ZoAqKF",
    itens: [
      "1 anúncio por 30 dias",
      "Até 5 fotos",
      "Contato direto pelo WhatsApp",
      "Revisão antes de publicar",
      "Exibição na listagem do site",
    ],
  },
  {
    nome: "Destaque",
    destaque: "Mais visibilidade",
    preco: "R$ 99,90",
    descricao: "Indicado para quem quer uma apresentação mais forte e mais chance de chamar atenção.",
    linkPagamento: "https://mpago.la/2mrvzjq",
    recomendado: true,
    itens: [
      "1 anúncio por 45 dias",
      "Até 10 fotos",
      "Anúncio com destaque visual",
      "Melhor posição na listagem quando possível",
      "Texto revisado para venda",
      "Apoio na divulgação quando possível",
    ],
  },
  {
    nome: "Premium",
    destaque: "Mais completo",
    preco: "R$ 149,90",
    descricao: "Para quem quer prioridade, mais fotos e apoio extra na apresentação do anúncio.",
    linkPagamento: "https://mpago.la/1WNaNtK",
    itens: [
      "1 anúncio por 60 dias",
      "Até 15 fotos",
      "Destaque máximo no site",
      "Texto comercial melhorado",
      "Kit de divulgação pronto",
      "Prioridade na aprovação",
      "Apoio extra na divulgação quando possível",
    ],
  },
];

export default function PlanosPage() {
  return (
    <main className="market-page planos-page">
      <PublicHeader />

      <section className="market-container planos-hero">
        <div className="planos-hero-copy">
          <span className="planos-kicker">Vantagens para anunciar</span>
          <h1>Anuncie com mais organização, confiança e contato direto.</h1>
          <p>
            O Caminhões à Venda ajuda seu caminhão ou implemento a aparecer de forma mais clara para quem está procurando. Você escolhe a forma de anúncio, paga online pelo Mercado Pago e envia as informações para aprovação.
          </p>
          <div className="planos-hero-tags" aria-label="Vantagens principais">
            <span>Anúncio revisado</span>
            <span>Contato pelo WhatsApp</span>
            <span>Pagamento online</span>
          </div>
        </div>

        <aside className="planos-hero-card">
          <strong>Por que anunciar aqui?</strong>
          <ol>
            <li>Organiza a apresentação do veículo</li>
            <li>Mostra informações importantes</li>
            <li>Facilita contato com interessados</li>
            <li>Passa por conferência antes de publicar</li>
          </ol>
        </aside>
      </section>

      <section className="market-container vantagens-grid" aria-label="Vantagens de anunciar">
        {vantagens.map((vantagem) => (
          <article key={vantagem.titulo}>
            <span>✓</span>
            <h2>{vantagem.titulo}</h2>
            <p>{vantagem.texto}</p>
          </article>
        ))}
      </section>

      <section className="market-container escolha-head">
        <span className="planos-kicker">Escolha como anunciar</span>
        <h2>Valores simples para publicar seu anúncio</h2>
        <p>
          Escolha uma opção, pague online e depois envie os dados e fotos pelo painel. A publicação acontece após conferência das informações e confirmação do pagamento.
        </p>
      </section>

      <section className="market-container planos-grid" aria-label="Opções para anunciar">
        {planos.map((plano) => (
          <article key={plano.nome} className={plano.recomendado ? "plano-card plano-card-featured" : "plano-card"}>
            {plano.recomendado && <div className="plano-recommended">Mais escolhido</div>}
            <div className="plano-head">
              <span>{plano.destaque}</span>
              <h2>{plano.nome}</h2>
              <strong>{plano.preco}</strong>
            </div>

            <p>{plano.descricao}</p>

            <ul>
              {plano.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <a
              className="plano-pay-button"
              href={plano.linkPagamento}
              target="_blank"
              rel="noopener noreferrer"
            >
              Anunciar com {plano.nome}
            </a>
          </article>
        ))}
      </section>

      <section className="market-container planos-info-grid">
        <article>
          <span className="planos-kicker">Após o pagamento</span>
          <h2>Envie seu anúncio pelo painel</h2>
          <p>
            Após o pagamento, envie seu anúncio pelo painel. A aprovação será feita após conferência das informações e confirmação do pagamento.
          </p>
        </article>

        <article>
          <span className="planos-kicker">Aviso importante</span>
          <h2>Responsabilidade da negociação</h2>
          <p>
            O Caminhões à Venda não garante venda, financiamento, vistoria, documentação, pagamento, transferência ou garantias do veículo. A negociação é feita diretamente entre comprador e proprietário/vendedor.
          </p>
        </article>
      </section>

      <SiteFooter />

      <style>{`
        .planos-page { padding-bottom: 0; }
        .planos-hero { display: grid; grid-template-columns: minmax(0, 1fr) 370px; gap: 18px; padding-top: 20px; padding-bottom: 18px; }
        .planos-hero-copy { min-height: 360px; display: grid; align-content: center; padding: 34px; border-radius: var(--radius); background: linear-gradient(135deg, #07111f 0%, #10233f 58%, #0f5132 100%); color: #fff; box-shadow: var(--shadow); overflow: hidden; position: relative; }
        .planos-hero-copy::after { content: ""; position: absolute; width: 280px; height: 280px; border-radius: 999px; right: -90px; top: -90px; background: rgba(255,255,255,.09); }
        .planos-kicker { width: fit-content; display: inline-flex; min-height: 28px; align-items: center; padding: 0 10px; border-radius: 999px; background: rgba(37, 99, 235, .12); color: var(--blue); font-size: 12px; font-weight: 950; letter-spacing: .04em; text-transform: uppercase; }
        .planos-hero-copy .planos-kicker { background: rgba(255,255,255,.14); color: #bfdbfe; }
        .planos-hero-copy h1 { max-width: 860px; margin: 16px 0 12px; font-size: clamp(38px, 5vw, 68px); line-height: .96; letter-spacing: -.06em; color: #fff; position: relative; z-index: 1; }
        .planos-hero-copy p { max-width: 780px; margin: 0; color: rgba(255,255,255,.84); font-size: 18px; line-height: 1.6; font-weight: 760; position: relative; z-index: 1; }
        .planos-hero-tags { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 24px; position: relative; z-index: 1; }
        .planos-hero-tags span { min-height: 34px; display: inline-flex; align-items: center; padding: 0 12px; border-radius: 999px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.12); color: #fff; font-size: 13px; font-weight: 900; }
        .planos-hero-card { padding: 26px; border-radius: var(--radius); background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); }
        .planos-hero-card strong { display: block; color: var(--text); font-size: 22px; letter-spacing: -.03em; }
        .planos-hero-card ol { display: grid; gap: 13px; margin: 20px 0 0; padding: 0; list-style: none; counter-reset: planos; }
        .planos-hero-card li { counter-increment: planos; display: grid; grid-template-columns: 36px 1fr; gap: 10px; align-items: center; color: var(--text); font-weight: 900; }
        .planos-hero-card li::before { content: counter(planos); width: 36px; height: 36px; display: grid; place-items: center; border-radius: 14px; background: var(--blueSoft); color: var(--blue); font-size: 13px; font-weight: 950; }
        .vantagens-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; padding-bottom: 18px; }
        .vantagens-grid article { padding: 20px; border-radius: 22px; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); }
        .vantagens-grid span { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 14px; background: rgba(22, 163, 74, .13); color: #16a34a; font-weight: 950; }
        .vantagens-grid h2 { margin: 15px 0 8px; color: var(--text); font-size: 20px; line-height: 1.1; letter-spacing: -.035em; }
        .vantagens-grid p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.5; font-weight: 760; }
        .escolha-head { padding-top: 4px; padding-bottom: 18px; }
        .escolha-head h2 { max-width: 760px; margin: 12px 0 8px; color: var(--text); font-size: clamp(30px, 4vw, 48px); line-height: 1; letter-spacing: -.055em; }
        .escolha-head p { max-width: 820px; margin: 0; color: var(--muted); font-size: 16px; line-height: 1.6; font-weight: 760; }
        .planos-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; padding-bottom: 18px; }
        .plano-card { position: relative; display: grid; gap: 18px; align-content: start; padding: 26px; border-radius: 26px; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); overflow: hidden; }
        .plano-card-featured { border-color: rgba(22, 163, 74, .45); box-shadow: var(--shadow2); transform: translateY(-6px); }
        .plano-recommended { position: absolute; top: 16px; right: 16px; min-height: 30px; display: inline-flex; align-items: center; padding: 0 11px; border-radius: 999px; background: #16a34a; color: #fff; font-size: 12px; font-weight: 950; }
        .plano-head span { display: block; color: var(--muted); font-size: 12px; font-weight: 950; letter-spacing: .04em; text-transform: uppercase; }
        .plano-head h2 { margin: 10px 0 10px; color: var(--text); font-size: 34px; line-height: 1; letter-spacing: -.055em; }
        .plano-head strong { display: block; color: var(--text); font-size: 38px; line-height: 1; letter-spacing: -.055em; }
        .plano-card p { margin: 0; color: var(--muted); font-size: 15px; line-height: 1.55; font-weight: 760; }
        .plano-card ul { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
        .plano-card li { display: grid; grid-template-columns: 22px 1fr; gap: 9px; color: var(--text); font-size: 14px; line-height: 1.35; font-weight: 820; }
        .plano-card li::before { content: "✓"; width: 22px; height: 22px; border-radius: 999px; display: grid; place-items: center; background: rgba(22, 163, 74, .13); color: #16a34a; font-size: 13px; font-weight: 950; }
        .plano-pay-button { min-height: 52px; display: inline-flex; align-items: center; justify-content: center; padding: 0 18px; border-radius: 16px; background: #16a34a; color: #fff; font-size: 15px; font-weight: 950; text-align: center; box-shadow: 0 10px 22px rgba(22, 163, 74, .22); }
        .plano-card-featured .plano-pay-button { min-height: 58px; font-size: 16px; }
        .planos-info-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; padding-bottom: 30px; }
        .planos-info-grid article { padding: 24px; border-radius: 22px; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); }
        .planos-info-grid h2 { margin: 12px 0 8px; color: var(--text); font-size: 24px; line-height: 1.1; letter-spacing: -.04em; }
        .planos-info-grid p { margin: 0; color: var(--muted); line-height: 1.6; font-weight: 760; }
        @media (max-width: 980px) { .planos-hero, .planos-grid, .planos-info-grid, .vantagens-grid { grid-template-columns: 1fr; } .plano-card-featured { transform: none; } }
        @media (max-width: 560px) { .planos-hero, .vantagens-grid, .escolha-head { width: min(100% - 20px, 1320px); } .planos-hero-copy, .planos-hero-card, .plano-card, .planos-info-grid article, .vantagens-grid article { padding: 20px; border-radius: 22px; } .planos-hero-copy { min-height: auto; } .planos-hero-tags { display: grid; } .plano-head h2 { font-size: 30px; } .plano-head strong { font-size: 34px; } }
      `}</style>
    </main>
  );
}
