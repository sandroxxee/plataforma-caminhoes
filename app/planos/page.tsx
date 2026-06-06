import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Planos para anunciar | Caminhões à Venda",
  description:
    "Planos para anunciar caminhões no Caminhões à Venda. Página preparada internamente, ainda sem divulgação pública oficial.",
  robots: {
    index: false,
    follow: true,
  },
};

const planos = [
  {
    nome: "Básico",
    preco: "R$ 49,90",
    descricao: "Para anunciar um caminhão de forma simples, organizada e revisada antes de publicar.",
    linkPagamento: "LINK_PAGAMENTO_BASICO",
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
    preco: "R$ 99,90",
    descricao: "Para quem quer mais visibilidade e uma apresentação comercial mais forte do anúncio.",
    linkPagamento: "LINK_PAGAMENTO_DESTAQUE",
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
    preco: "R$ 149,90",
    descricao: "Para anúncio com prioridade, mais fotos, apoio extra e material pronto para divulgação.",
    linkPagamento: "LINK_PAGAMENTO_PREMIUM",
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
    <main className="market-page trust-page">
      <PublicHeader />

      <section className="market-container trust-hero">
        <div>
          <span className="trust-eyebrow">Planos para anunciar</span>
          <h1>Escolha uma forma simples de anunciar seu caminhão.</h1>
          <p>
            Os planos foram preparados para organizar a publicação, revisão e divulgação dos anúncios dentro do Caminhões à Venda.
          </p>
        </div>
        <aside>
          <strong>Pagamento externo</strong>
          <span>Escolha o plano, pague pelo link externo e envie seu anúncio pelo painel.</span>
        </aside>
      </section>

      <section className="market-container trust-grid">
        {planos.map((plano) => (
          <article key={plano.nome}>
            <span>{plano.nome}</span>
            <b>{plano.preco}</b>
            <h2>{plano.descricao}</h2>
            <ul>
              {plano.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a
              href={plano.linkPagamento}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pagar plano {plano.nome}
            </a>
          </article>
        ))}
      </section>

      <section className="market-container trust-card">
        <span className="trust-eyebrow">Contratação</span>
        <h2>Pagamento e aprovação manual</h2>
        <p>
          Após o pagamento, envie seu anúncio pelo painel. A aprovação será feita após conferência das informações e confirmação do pagamento.
        </p>
      </section>

      <section className="market-container trust-card">
        <span className="trust-eyebrow">Aviso importante</span>
        <h2>Responsabilidade da negociação</h2>
        <p>
          O Caminhões à Venda não garante venda, financiamento, vistoria, documentação, pagamento, transferência ou garantias do veículo. A negociação é feita diretamente entre comprador e proprietário/vendedor.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
