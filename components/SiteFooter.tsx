import Link from "next/link";
import { Shield, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        <section className="footer-section footer-about">
          <div className="footer-logo">
            <strong className="footer-brand">Caminhões à Venda</strong>
          </div>
          <div className="footer-badges">
            <div className="badge-item"><Shield size={13} /><span>Anúncios Verificados</span></div>
          </div>
        </section>

        <section className="footer-section">
          <strong>Categorias</strong>
          <Link href="/caminhoes">Caminhões</Link>
          <Link href="/carretas">Carretas</Link>
          <Link href="/implementos">Implementos</Link>
          <Link href="/pecas">Peças</Link>
          <Link href="/maquinas">Máquinas</Link>
          <Link href="/revendas">Revendas</Link>
        </section>

        <section className="footer-section">
          <strong>Institucional</strong>
          <Link href="/sobre">Quem Somos</Link>
          <Link href="/como-funciona">Como Funciona</Link>
          <Link href="/anunciar">Anunciar</Link>
          <Link href="/planos">Planos</Link>
          <Link href="/parceiros">Parceiros</Link>
        </section>

        <section className="footer-section">
          <strong>Suporte</strong>
          <Link href="/contato">Fale Conosco</Link>
          <Link href="/politica-de-privacidade">Privacidade</Link>
        </section>

        <section className="footer-section">
          <strong>Contato</strong>
          <a href="https://wa.me/5549999362681" target="_blank" rel="noreferrer" className="contact-link">
            <Phone size={13} /> WhatsApp
          </a>
          <a href="mailto:contato@caminhoesavenda.com" className="contact-link">
            <Mail size={13} /> E-mail
          </a>
        </section>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Caminhões à Venda</p>
      </div>

      <style>{`
        .site-footer {
          background: var(--surface);
          border-top: 1px solid var(--line);
          border-radius: 16px 16px 0 0;
          margin-top: 48px;
          overflow: hidden;
        }
        .footer-inner {
          width: min(1280px, calc(100vw - 40px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr;
          gap: 36px;
          padding: 36px 0 32px;
        }
        .footer-logo { display:flex; align-items:center; gap:9px; margin-bottom:12px; }
        .footer-brand { font-size:15px; font-weight:950; letter-spacing:-.03em; color:var(--text); }
        .footer-badges { display:flex; gap:8px; }
        .badge-item { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:800; color:var(--blue); background:var(--blueSoft); padding:4px 10px; border-radius:99px; }
        .footer-section strong {
          display:block; font-size:10px; font-weight:900; color:var(--text);
          text-transform:uppercase; letter-spacing:.06em;
          margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid var(--line);
        }
        .footer-section a {
          display:block; margin-top:8px; color:var(--muted);
          font-size:12px; font-weight:700; text-decoration:none; transition:color .15s;
        }
        .footer-section a:hover { color:var(--blue); }
        .contact-link { display:flex !important; align-items:center; gap:7px; }
        .footer-bottom {
          border-top:1px solid var(--line);
          background:var(--soft);
          padding:12px 0;
        }
        .footer-bottom p {
          width:min(1280px, calc(100vw - 40px));
          margin:0 auto; font-size:11px; color:var(--muted); font-weight:700;
        }
        @media (max-width:1100px) {
          .footer-inner { grid-template-columns:1fr 1fr 1fr; gap:28px; }
          .footer-about { grid-column:1/-1; }
        }
        @media (max-width:640px) {
          .footer-inner { grid-template-columns:1fr 1fr; gap:20px; padding:28px 0 24px; }
          .footer-about { grid-column:1/-1; }
        }
        @media (max-width:400px) {
          .footer-inner { grid-template-columns:1fr; }
        }
      `}</style>
    </footer>
  );
}
