import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        <section className="footer-section footer-brand-col">
          <strong className="footer-brand">Caminhões à Venda</strong>
          <p className="footer-brand-tag">A plataforma simples e direta para compra e venda de veículos pesados.</p>
          <div className="footer-legal-info">
            <span>Caminhões à Venda</span>
            <span>CNPJ: 00.000.000/0001-00</span>
            <span>Chapecó - SC, Brasil</span>
          </div>
        </section>

        <section className="footer-section">
          <strong>Institucional</strong>
          <Link href="/institucional/sobre">Quem Somos</Link>
          <Link href="/planos">Anuncie Conosco</Link>
          <Link href="/parcerias/parceiros">Empresas Parceiras</Link>
        </section>

        <section className="footer-section">
          <strong>Ajuda e Segurança</strong>
          <Link href="/institucional/termos">Termos de Uso</Link>
          <Link href="/institucional/privacidade">Política de Privacidade</Link>
          <Link href="/institucional/seguranca">Dicas de Segurança</Link>
          <Link href="/institucional/ajuda">Central de Ajuda</Link>
        </section>

        <section className="footer-section">
          <strong>Suporte e Contato</strong>
          <a href="https://wa.me/5549999362681" target="_blank" rel="noreferrer" className="contact-link">
            <Phone size={12} /> WhatsApp Support
          </a>
          <a href="mailto:contato@caminhoesavenda.com" className="contact-link">
            <Mail size={12} /> contato@caminhoesavenda.com
          </a>
          <a href="mailto:abuse@caminhoesavenda.com?subject=Denuncia%20de%20Anuncio" className="contact-link" style={{ color: "var(--red, #ef4444)" }}>
            ⚠️ Denunciar Abuso
          </a>
        </section>

      </div>

      <div className="footer-disclaimer">
        <div className="disclaimer-inner">
          <p>
            <strong>Isenção de responsabilidade:</strong> O Caminhões à Venda é um portal de publicidade e classificados online. Não somos proprietários de nenhum veículo anunciado, não realizamos vistorias, intermediações financeiras, transporte ou garantias de procedência e documentação. As negociações são de exclusiva responsabilidade e risco de compradores e vendedores.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Caminhões à Venda. Todos os direitos reservados.</p>
      </div>

      <style>{`
        .site-footer {
          background: var(--surface);
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 16px 16px 0 0;
          margin-top: 40px;
          overflow: hidden;
        }
        body.public-theme-dark .site-footer {
          border-top-color: rgba(255, 255, 255, 0.05);
        }
        .footer-inner {
          width: min(1600px, calc(100vw - 40px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1fr;
          gap: 28px;
          padding: 32px 0 24px;
        }
        .footer-brand {
          font-size: 14px;
          font-weight: 900;
          letter-spacing: -.02em;
          color: var(--text);
        }
        .footer-brand-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .footer-brand-tag {
          font-size: 12px;
          font-weight: 700;
          color: var(--muted);
          line-height: 1.4;
          margin: 0;
          max-width: 240px;
        }
        .footer-legal-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 10px;
          font-weight: 700;
          color: var(--muted);
          opacity: 0.8;
          line-height: 1.3;
        }
        .footer-section strong {
          display: block;
          font-size: 9px;
          font-weight: 900;
          color: var(--text);
          text-transform: uppercase;
          letter-spacing: .06em;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.03);
        }
        body.public-theme-dark .footer-section strong {
          border-bottom-color: rgba(255, 255, 255, 0.03);
        }
        .footer-section a {
          display: block;
          margin-top: 6px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: color .15s;
        }
        .footer-section a:hover {
          color: var(--blue);
        }
        .contact-link {
          display: flex !important;
          align-items: center;
          gap: 6px;
        }
        .footer-disclaimer {
          border-top: 1px solid rgba(0, 0, 0, 0.04);
          background: rgba(0, 0, 0, 0.005);
          padding: 12px 0;
        }
        body.public-theme-dark .footer-disclaimer {
          border-top-color: rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.005);
        }
        .disclaimer-inner {
          width: min(1600px, calc(100vw - 40px));
          margin: 0 auto;
        }
        .disclaimer-inner p {
          margin: 0;
          font-size: 10px;
          line-height: 1.5;
          color: var(--muted);
          font-weight: 700;
          text-align: justify;
        }
        .disclaimer-inner p strong {
          color: var(--text);
          font-weight: 800;
        }
        .footer-bottom {
          border-top: 1px solid rgba(0, 0, 0, 0.04);
          background: var(--soft);
          padding: 12px 0;
        }
        body.public-theme-dark .footer-bottom {
          border-top-color: rgba(255, 255, 255, 0.04);
        }
        .footer-bottom p {
          width: min(1600px, calc(100vw - 40px));
          margin: 0 auto;
          font-size: 10px;
          color: var(--muted);
          font-weight: 700;
        }
        @media (max-width: 960px) {
          .footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            padding: 24px 0;
          }
          .footer-brand-col {
            grid-column: 1 / -1;
            border-bottom: 1px solid rgba(0, 0, 0, 0.04);
            padding-bottom: 16px;
          }
          body.public-theme-dark .footer-brand-col {
            border-bottom-color: rgba(255, 255, 255, 0.04);
          }
        }
        @media (max-width: 560px) {
          .footer-inner {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
