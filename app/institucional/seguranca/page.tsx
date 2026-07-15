import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export const metadata = {
  title: "Dicas de Segurança | Caminhões à Venda",
  description:
    "Saiba como negociar com segurança na internet. Dicas práticas para compradores e vendedores evitarem golpes e fraudes.",
};

const sectionStyle = {
  border: "1px solid var(--line)",
  background: "var(--surface)",
  borderRadius: 22,
  padding: 24,
  overflowWrap: "anywhere",
} as const;

const titleStyle = {
  marginBottom: 12,
  color: "var(--text)",
  fontSize: 22,
  fontWeight: 900,
  lineHeight: 1.2,
} as const;

const paragraphStyle = {
  color: "var(--muted)",
  lineHeight: 1.7,
  fontSize: 14,
  marginTop: 8,
  fontWeight: 700,
} as const;

export default function DicasDeSegurancaPage() {
  return (
    <main className="market-page">
      <PublicHeader />

      <section className="market-container" style={{ maxWidth: 840, paddingTop: 28, paddingBottom: 48 }}>
        <nav style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 20, fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>
          <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }}>Início</Link>
          <span>›</span><span>Segurança</span>
        </nav>

        <div style={{ display: "grid", gap: 20 }}>
          <div style={sectionStyle}>
            <span
              style={{
                display: "block",
                color: "var(--green)",
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Guia Prático
            </span>

            <h1
              style={{
                color: "var(--text)",
                fontSize: "clamp(28px, 5vw, 44px)",
                fontWeight: 950,
                lineHeight: 1.1,
                margin: "0 0 12px",
                letterSpacing: "-0.03em",
              }}
            >
              Negocie com Segurança
            </h1>

            <p style={{ ...paragraphStyle, fontSize: 16 }}>
              O Caminhões à Venda quer que você faça excelentes negócios com total tranquilidade. Reunimos as melhores práticas e dicas fundamentais para compradores e vendedores evitarem os golpes mais comuns da internet.
            </p>
          </div>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>🛡️ Dicas para o Comprador</h2>
            <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
              <div>
                <strong style={{ color: "var(--text)", fontSize: 15, fontWeight: 900 }}>1. Nunca pague adiantado</strong>
                <p style={paragraphStyle}>Evite realizar depósitos de sinal, taxa de reserva, ou pagamentos antecipados sem antes ver o veículo pessoalmente. Desconfie se o vendedor insistir em um "sinal" para garantir o caminhão devido a supostos outros interessados.</p>
              </div>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                <strong style={{ color: "var(--text)", fontSize: 15, fontWeight: 900 }}>2. Faça vistorias presenciais ou contrate profissionais</strong>
                <p style={paragraphStyle}>Sempre marque para olhar o veículo pessoalmente. Se não puder ir, contrate uma empresa homologada de vistoria cautelar ou peça a um mecânico de confiança para inspecionar o estado mecânico e a estrutura do caminhão.</p>
              </div>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                <strong style={{ color: "var(--text)", fontSize: 15, fontWeight: 900 }}>3. Desconfie de preços muito abaixo do mercado</strong>
                <p style={paragraphStyle}>Se um caminhão ou implemento está anunciado por um preço extremamente baixo em relação à tabela FIPE ou à média do mercado, redobre a atenção. Golpistas usam preços atrativos para obter sinais rápidos.</p>
              </div>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                <strong style={{ color: "var(--text)", fontSize: 15, fontWeight: 900 }}>4. Consulte a documentação antes de fechar o negócio</strong>
                <p style={paragraphStyle}>Exija o documento atualizado do veículo. Faça consultas nos órgãos de trânsito (Detran/Senatran) para verificar se existem multas, restrições financeiras, alienação fiduciária, bloqueios judiciais ou histórico de leilão/sinistro.</p>
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>🔑 Dicas para o Vendedor</h2>
            <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
              <div>
                <strong style={{ color: "var(--text)", fontSize: 15, fontWeight: 900 }}>1. Confirme o pagamento antes da entrega</strong>
                <p style={paragraphStyle}>Nunca entregue o veículo ou o documento de transferência assinado (DUT/ATPV-e) antes de confirmar o saldo integral em sua conta bancária. Desconfie de comprovantes de transferências por TED/DOC feitos no final de semana ou envelopes de depósito vazios.</p>
              </div>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                <strong style={{ color: "var(--text)", fontSize: 15, fontWeight: 900 }}>2. Cuidado com o golpe do intermediário</strong>
                <p style={paragraphStyle}>Se alguém entrar em contato dizendo que está comprando o caminhão para pagar uma dívida com um terceiro (ex: ex-sócio, parente, funcionário) e pedir para você não mencionar o valor da venda para a pessoa que vai olhar o veículo, **cancele a negociação**. Esse é um dos golpes mais aplicados no mercado.</p>
              </div>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                <strong style={{ color: "var(--text)", fontSize: 15, fontWeight: 900 }}>3. Mostre o veículo em locais seguros</strong>
                <p style={paragraphStyle}>Sempre que agendar visitas para mostrar o caminhão, prefira locais movimentados e públicos, como postos de combustíveis na rodovia, concessionárias ou estacionamentos de grandes comércios. Evite locais isolados ou sua residência, se possível.</p>
              </div>
            </div>
          </section>

          <section style={{ ...sectionStyle, border: "1px solid rgba(245,158,11,0.35)", background: "rgba(245,158,11,0.10)" }}>
            <h2 style={{ ...titleStyle, color: "#fde68a" }}>⚠️ Como denunciar anúncios suspeitos?</h2>
            <p style={{ ...paragraphStyle, color: "#fde68a" }}>
              Se você encontrou um anúncio suspeito, com informações incoerentes, fotos falsas ou se o anunciante demonstrou comportamento duvidoso, por favor, denuncie imediatamente.
            </p>
            <p style={{ ...paragraphStyle, color: "rgba(255,255,255,0.8)" }}>
              Envie um e-mail para <a href="mailto:abuse@caminhoesavenda.com" style={{ color: "var(--blue)", fontWeight: 900 }}>abuse@caminhoesavenda.com</a> contendo o link do anúncio ou clique no botão de WhatsApp de suporte para que nossa equipe faça a análise jurídica e técnica imediata.
            </p>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
