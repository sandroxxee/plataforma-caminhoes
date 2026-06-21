import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Política de Privacidade | Caminhões à Venda",
  description:
    "Política de Privacidade do Caminhões à Venda para site, anúncios, painel e futuro aplicativo Android.",
};

const sectionStyle = {
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  borderRadius: 22,
  padding: 22,
  overflowWrap: "anywhere",
} as const;

const titleStyle = {
  marginBottom: 10,
  color: "var(--text)",
  fontSize: 24,
  lineHeight: 1.2,
} as const;

const paragraphStyle = {
  color: "var(--muted)",
  lineHeight: 1.75,
  marginTop: 10,
} as const;

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="market-page">
      <PublicHeader />

      <section className="market-container market-section" style={{ maxWidth: 980 }}>
        <div style={{ display: "grid", gap: 22 }}>
          <div style={sectionStyle}>
            <span
              style={{
                display: "block",
                color: "var(--green)",
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Caminhões à Venda
            </span>

            <h1
              style={{
                color: "var(--text)",
                fontSize: "clamp(32px, 6vw, 56px)",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              Política de Privacidade
            </h1>

            <p style={{ ...paragraphStyle, fontSize: 18 }}>
              Esta Política de Privacidade explica como o Caminhões à Venda coleta,
              utiliza, armazena e protege informações relacionadas ao uso do site,
              painel de anúncios e futuro aplicativo Android.
            </p>

            <p style={{ ...paragraphStyle, fontSize: 14 }}>
              Última atualização: 05 de junho de 2026.
            </p>
          </div>

          <div
            style={{
              border: "1px solid rgba(245,158,11,0.35)",
              background: "rgba(245,158,11,0.10)",
              borderRadius: 22,
              padding: 22,
              color: "#fde68a",
              lineHeight: 1.7,
              overflowWrap: "anywhere",
            }}
          >
            <strong>Aviso importante:</strong> O Caminhões à Venda atua como
            plataforma de divulgação e apoio na organização dos anúncios. A
            negociação, vistoria, pagamento, documentação, transferência,
            financiamento, procedência e garantias do veículo são de
            responsabilidade do comprador e do proprietário/vendedor.
          </div>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>1. Quem somos</h2>
            <p style={paragraphStyle}>
              O Caminhões à Venda é uma plataforma voltada à divulgação de
              caminhões, implementos, máquinas e veículos pesados. Nosso objetivo
              é facilitar a apresentação dos anúncios, organizar informações dos
              veículos e aproximar compradores, proprietários, vendedores,
              lojistas e profissionais do ramo.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>2. Quais dados podemos coletar</h2>
            <p style={paragraphStyle}>
              Durante o uso da plataforma, podemos coletar informações fornecidas
              diretamente pelo usuário, como nome, e-mail, telefone, WhatsApp,
              cidade, estado, dados de login e informações necessárias para
              cadastro, acesso ao painel e publicação de anúncios.
            </p>
            <p style={paragraphStyle}>
              Ao cadastrar um anúncio, também poderão ser informados dados do
              veículo, como marca, modelo, ano, versão, tipo de carroceria,
              tração, quilometragem, valor, cidade, descrição, condições gerais,
              fotos e demais informações comerciais necessárias para divulgação.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>3. Dados de login e painel</h2>
            <p style={paragraphStyle}>
              Para acessar áreas restritas, como painel do anunciante ou área
              administrativa, podem ser utilizados dados de login, autenticação e
              sessão. Essas informações servem para identificar o usuário,
              proteger o acesso e permitir que cada anunciante gerencie seus
              próprios anúncios.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>4. Dados dos anúncios e fotos dos veículos</h2>
            <p style={paragraphStyle}>
              As informações e imagens enviadas para anúncios podem ser exibidas
              publicamente na plataforma após análise, aprovação ou organização
              interna. Isso inclui fotos do veículo, descrição, características,
              localização aproximada e formas de contato comercial autorizadas
              pelo anunciante.
            </p>
            <p style={paragraphStyle}>
              O anunciante é responsável por enviar informações corretas, atuais
              e autorizadas, incluindo imagens que tenha direito de utilizar e
              divulgar.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>5. Uso do WhatsApp</h2>
            <p style={paragraphStyle}>
              A plataforma pode disponibilizar botões ou links de contato via
              WhatsApp para facilitar a comunicação entre interessados,
              vendedores, proprietários ou equipe de atendimento. Ao clicar em um
              botão de WhatsApp, o usuário poderá ser direcionado para ambiente
              externo ao Caminhões à Venda.
            </p>
            <p style={paragraphStyle}>
              As conversas, negociações, envio de documentos, propostas e
              tratativas feitas pelo WhatsApp são de responsabilidade das partes
              envolvidas na negociação.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>6. Como usamos os dados</h2>
            <p style={paragraphStyle}>Os dados podem ser utilizados para:</p>
            <ul
              style={{
                color: "var(--muted)",
                lineHeight: 1.8,
                marginTop: 12,
                paddingLeft: 22,
              }}
            >
              <li>permitir cadastro, login e acesso ao painel;</li>
              <li>publicar, revisar, organizar e exibir anúncios;</li>
              <li>facilitar contato entre interessados e anunciantes;</li>
              <li>melhorar a segurança e funcionamento da plataforma;</li>
              <li>prevenir uso indevido, fraude ou abuso;</li>
              <li>prestar suporte e atendimento ao usuário;</li>
              <li>cumprir obrigações legais, regulatórias ou judiciais.</li>
            </ul>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>7. Cookies e tecnologias semelhantes</h2>
            <p style={paragraphStyle}>
              O site e o futuro aplicativo podem utilizar cookies,
              identificadores técnicos e tecnologias semelhantes para manter
              sessões de login, melhorar a navegação, entender uso da plataforma,
              reforçar segurança e aprimorar a experiência do usuário.
            </p>
            <p style={paragraphStyle}>
              O usuário pode ajustar permissões de cookies diretamente nas
              configurações do navegador ou do dispositivo, quando aplicável.
              Algumas funções da plataforma podem depender dessas tecnologias
              para funcionar corretamente.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>8. Serviços técnicos e terceiros</h2>
            <p style={paragraphStyle}>
              Para manter a plataforma funcionando, podemos utilizar serviços
              técnicos de hospedagem, banco de dados, autenticação,
              armazenamento de imagens, segurança, análise de funcionamento,
              envio de mensagens e infraestrutura.
            </p>
            <p style={paragraphStyle}>
              Esses serviços podem processar informações necessárias para
              operação do site, painel, anúncios e futuro aplicativo, sempre
              buscando limitar o uso ao necessário para a prestação do serviço.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>9. Compartilhamento de dados</h2>
            <p style={paragraphStyle}>
              O Caminhões à Venda não vende dados pessoais dos usuários.
              Informações de anúncios aprovados podem ser exibidas publicamente
              conforme a finalidade da plataforma. Dados também podem ser
              compartilhados com prestadores técnicos essenciais para
              funcionamento, segurança e armazenamento da plataforma.
            </p>
            <p style={paragraphStyle}>
              Quando necessário, dados poderão ser fornecidos para cumprir
              obrigação legal, ordem de autoridade competente, defesa de direitos
              ou prevenção de fraude e abuso.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>10. Segurança das informações</h2>
            <p style={paragraphStyle}>
              Adotamos medidas técnicas e organizacionais para proteger as
              informações contra acesso não autorizado, perda, alteração,
              divulgação indevida ou uso inadequado. Mesmo assim, nenhum sistema
              digital é totalmente livre de riscos.
            </p>
            <p style={paragraphStyle}>
              O usuário também deve proteger seus dados de acesso, evitar
              compartilhar senha, conferir links antes de clicar e tomar cuidado
              ao enviar documentos ou valores durante negociações.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>11. Direitos do usuário</h2>
            <p style={paragraphStyle}>
              O usuário pode solicitar informações sobre seus dados, correção de
              dados incorretos, atualização cadastral, remoção de informações,
              exclusão de conta quando aplicável, esclarecimentos sobre
              tratamento de dados ou revogação de consentimentos, respeitados os
              limites legais e obrigações de segurança.
            </p>
            <p style={paragraphStyle}>
              Algumas informações podem precisar ser mantidas por período
              necessário para cumprimento de obrigação legal, prevenção de fraude,
              auditoria, segurança ou defesa de direitos.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>12. Correção ou remoção de anúncios e dados</h2>
            <p style={paragraphStyle}>
              O anunciante pode solicitar correção, atualização ou remoção de
              dados relacionados aos seus anúncios. Também poderá pedir a
              exclusão de fotos ou informações que não deseja mais divulgar.
            </p>
            <p style={paragraphStyle}>
              O Caminhões à Venda poderá remover, ocultar, revisar ou recusar
              anúncios que apresentem informações incompletas, suspeitas,
              inadequadas, enganosas, irregulares ou que possam prejudicar
              usuários e a segurança da plataforma.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>13. Responsabilidade pela negociação</h2>
            <p style={paragraphStyle}>
              O Caminhões à Venda não é proprietário dos veículos anunciados, não
              garante venda, não intermedeia pagamento obrigatório, não realiza
              vistoria oficial, não garante documentação, procedência,
              transferência, financiamento, aprovação de crédito ou condições
              mecânicas dos veículos.
            </p>
            <p style={paragraphStyle}>
              A responsabilidade pela negociação é do comprador e do
              proprietário/vendedor do veículo. Recomendamos que toda negociação
              seja feita com cautela, conferência documental, vistoria presencial
              ou profissional, consulta de procedência e formalização adequada
              entre as partes.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>14. Crianças e adolescentes</h2>
            <p style={paragraphStyle}>
              A plataforma é voltada para público interessado em compra, venda e
              divulgação de veículos pesados. Não é direcionada a crianças. Caso
              seja identificado uso inadequado por menor de idade sem
              autorização, poderemos limitar, remover ou bloquear o acesso.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>15. Alterações nesta Política</h2>
            <p style={paragraphStyle}>
              Esta Política de Privacidade poderá ser atualizada para refletir
              melhorias da plataforma, mudanças legais, novos recursos do site,
              painel ou aplicativo Android. A data de atualização será indicada
              no início do documento.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={titleStyle}>16. Contato oficial</h2>
            <p style={paragraphStyle}>
              Para solicitar correção, atualização, remoção de dados, remoção de
              anúncio, esclarecimentos sobre privacidade ou atendimento
              relacionado à plataforma, entre em contato pelo canal oficial:
            </p>

            <div
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 18,
                padding: 18,
                marginTop: 16,
                color: "var(--muted)",
                lineHeight: 1.7,
                overflowWrap: "anywhere",
              }}
            >
              <strong style={{ color: "var(--text)" }}>Caminhões à Venda</strong>
              <p style={{ marginTop: 8 }}>WhatsApp: (49) 99936-2681</p>
              <p>Site: https://caminhoesavenda.com</p>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
