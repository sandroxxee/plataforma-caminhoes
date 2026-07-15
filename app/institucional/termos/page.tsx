import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export const metadata = {
  title: "Termos de Uso | Caminhões à Venda",
  description:
    "Termos e condições de uso da plataforma Caminhões à Venda para anunciantes, compradores e parceiros.",
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

export default function TermosDeUsoPage() {
  return (
    <main className="market-page">
      <PublicHeader />

      <section className="market-container" style={{ maxWidth: 840, paddingTop: 28, paddingBottom: 48 }}>
        <nav style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 20, fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>
          <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }}>Início</Link>
          <span>›</span><span>Termos de Uso</span>
        </nav>

        <div style={{ display: "grid", gap: 20 }}>
          <div style={sectionStyle}>
            <span
              style={{
                display: "block",
                color: "var(--blue)",
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Regras e Condições
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
              Termos de Uso
            </h1>

            <p style={{ ...paragraphStyle, fontSize: 16 }}>
              Estes Termos de Uso regulam o acesso e o uso da plataforma Caminhões à Venda. Ao navegar pelo site, anunciar ou interagir com anúncios, você concorda com as condições descritas abaixo.
            </p>

            <p style={{ ...paragraphStyle, fontSize: 13, marginTop: 12 }}>
              Última atualização: 14 de julho de 2026.
            </p>
          </div>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>1. A Plataforma</h2>
            <p style={paragraphStyle}>
              O Caminhões à Venda funciona como um portal de publicidade e classificados online. Nosso papel é disponibilizar espaço virtual para que anunciantes exibam caminhões, carretas, implementos e peças, facilitando o contato direto de compradores interessados através de links de WhatsApp e formulários.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>2. Isenção de Responsabilidade (Disclaimer)</h2>
            <p style={{ ...paragraphStyle, color: "var(--text)" }}>
              <strong>Atenção redobrada:</strong> O Caminhões à Venda não é proprietário de nenhum dos veículos anunciados no site. Não realizamos vistorias físicas nos veículos, não intermediamos pagamentos, não oferecemos garantias de funcionamento, procedência ou documentação. 
            </p>
            <p style={paragraphStyle}>
              Todas as negociações, tratativas, vistorias e pagamentos são realizados de forma externa, diretamente entre o comprador e o vendedor do anúncio. É de total responsabilidade de ambas as partes verificar a veracidade das informações, documentos do veículo e tomar as devidas precauções de segurança.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>3. Regras de Publicação de Anúncios</h2>
            <p style={paragraphStyle}>
              Para garantir a qualidade e a credibilidade do nosso estoque, os anunciantes devem seguir as seguintes regras básicas:
            </p>
            <ul style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 14, fontWeight: 700, marginTop: 10, paddingLeft: 20 }}>
              <li>Fornecer fotos reais, nítidas e recentes do próprio veículo anunciado.</li>
              <li>Informar preços realistas e condições condizentes com o estado do caminhão.</li>
              <li>É proibida a publicação de conteúdos falsos, difamatórios, golpes, ou que infrinjam marcas registradas.</li>
              <li>O anunciante declara possuir autorização legal para vender o veículo anunciado.</li>
            </ul>
            <p style={paragraphStyle}>
              O Caminhões à Venda reserva-se o direito de recusar, pausar ou remover anúncios que violem estas diretrizes ou que apresentem indícios de fraude, sem aviso prévio.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>4. Limitação de Responsabilidade</h2>
            <p style={paragraphStyle}>
              Em nenhuma circunstância a plataforma Caminhões à Venda será responsável por eventuais prejuízos financeiros, golpes, quebra de contratos ou danos decorrentes de negociações iniciadas através do portal. Nós fornecemos apenas a veiculação publicitária dos classificados.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>5. Propriedade Intelectual</h2>
            <p style={paragraphStyle}>
              Todo o conteúdo original do site (logos, layout, código-fonte e elementos visuais) pertence à plataforma. As fotos e textos descritivos dos anúncios enviados pertencem aos respectivos anunciantes, que nos concedem uma licença gratuita de veiculação pública nas páginas da plataforma.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>6. Central de Suporte e Contato</h2>
            <p style={paragraphStyle}>
              Caso tenha dúvidas sobre estes termos ou queira reportar um anúncio que viole nossas regras de publicação, entre em contato pelo e-mail <a href="mailto:contato@caminhoesavenda.com" style={{ color: "var(--blue)" }}>contato@caminhoesavenda.com</a> ou envie uma mensagem diretamente para nosso canal de atendimento no WhatsApp.
            </p>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
