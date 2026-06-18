import Link from "next/link";
import { Truck, Shield, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <section className="footer-section footer-about">
          <div className="footer-logo">
            <Truck size={24} />
            <strong className="footer-brand">Caminhões à Venda</strong>
          </div>
          <p className="footer-desc">
            A maior plataforma de anúncios especializados em veículos pesados do Brasil. Conectamos compradores e vendedores de forma direta e segura.
          </p>
          <div className="footer-badges">
            <div className="badge-item">
              <Shield size={16} />
              <span>Anúncios Verificados</span>
            </div>
          </div>
        </section>

        <section className="footer-section">
          <strong>Categorias</strong>
          <Link href="/anuncios">Caminhões</Link>
          <Link href="/carretas">Carretas</Link>
          <Link href="/implementos">Implementos</Link>
          <Link href="/pecas">Peças e Acessórios</Link>
          <Link href="/maquinas">Máquinas Pesadas</Link>
        </section>

        <section className="footer-section">
          <strong>Institucional</strong>
          <Link href="/sobre">Quem Somos</Link>
          <Link href="/como-funciona">Como Funciona</Link>
          <Link href="/anunciar">Anunciar Grátis</Link>
          <Link href="/parceiros">Parceiros</Link>
        </section>

        <section className="footer-section">
          <strong>Suporte e Ajuda</strong>
          <Link href="/contato">Fale Conosco</Link>
          <Link href="/politica-de-privacidade">Privacidade</Link>
          <Link href="/termos">Termos de Uso</Link>
        </section>

        <section className="footer-section">
          <strong>Contato</strong>
          <a href="https://wa.me/5549999362681" target="_blank" rel="noreferrer" className="contact-link">
            <Phone size={14} /> WhatsApp Suporte
          </a>
          <a href="mailto:contato@caminhoesavenda.com" className="contact-link">
            <Mail size={14} /> E-mail Comercial
          </a>
        </section>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          © 2026 Caminhões à Venda. A negociação e verificação do veículo são de responsabilidade das partes.
        </p>
      </div>

      <style jsx>{`
        .site-footer {
          background: var(--surface);
          border-top: 1px solid var(--line);
          margin-top: 64px;
        }
        .footer-inner {
          width: min(1280px, calc(100vw - 40px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr repeat(4, 1fr);
          gap: 40px;
          padding: 48px 0;
        }
        .footer-logo {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
        }
        .footer-brand { font-size: 18px; font-weight: 950; letter-spacing: -.03em; color: var(--text); }
        .footer-desc { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 20px; font-weight: 600; }
        .footer-badges { display: flex; gap: 12px; }
        .badge-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 800; color: var(--blue);
          background: var(--blueSoft); padding: 6px 12px; border-radius: 99px;
        }
        .footer-section strong {
          display: block; font-size: 13px; font-weight: 900; color: var(--text);
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;
        }
        .footer-section a {
          display: block; margin-top: 8px; color: var(--muted);
          font-size: 14px; font-weight: 700; text-decoration: none; transition: color 0.2s;
        }
        .footer-section a:hover { color: var(--blue); }
        .contact-link { display: flex !important; align-items: center; gap: 8px; }
        .footer-bottom {
          background: var(--soft); border-top: 1px solid var(--line); padding: 20px 0;
        }
        .footer-copy {
          width: min(1280px, calc(100vw - 40px));
          margin: 0 auto; font-size: 12px; color: var(--muted); font-weight: 700;
        }
        @media (max-width: 1024px) {
          .footer-inner { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer-about { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) {
          .footer-inner { grid-template-columns: 1fr; gap: 28px; }
        }
      `}</style>
    </footer>
  );
}
