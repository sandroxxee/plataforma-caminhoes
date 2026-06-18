import Link from "next/link";
import { Truck, Shield, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        <section className="footer-section footer-about">
          <div className="footer-logo">
            <Truck size={22} />
            <strong className="footer-brand">Caminhões à Venda</strong>
          </div>
          <p className="footer-desc">
            A plataforma especializada em veículos pesados do Brasil. Conectamos compradores e vendedores de forma direta e segura.
          </p>
          <div className="footer-badges">
            <div className="badge-item"><Shield size={14} /><span>Anúncios Verificados</span></div>
          </div>
        </section>

        <section className="footer-section">
          <strong>Categorias</strong>
          <Link href="/caminhoes">Caminhões</Link>
          <Link href="/carretas">Carretas</Link>
          <Link href="/implementos">Implementos</Link>
          <Link href="/pecas">Peças e Acessórios</Link>
          <Link href="/maquinas">Máquinas Pesadas</Link>
          <Link href="/revendas">Revendas</Link>
        </section>

        <section className="footer-section">
          <strong>Institucional</strong>
          <Link href="/sobre">Quem Somos</Link>
          <Link href="/como-funciona">Como Funciona</Link>
          <Link href="/anunciar">Anunciar Grátis</Link>
          <Link href="/planos">Planos</Link>
          <Link href="/parceiros">Parceiros</Link>
        </section>

        <section className="footer-section">
          <strong>Suporte</strong>
          <Link href="/contato">Fale Conosco</Link>
          <Link href="/politica-de-privacidade">Privacidade</Link>
          <Link href="/termos">Termos de Uso</Link>
          <Link href="/como-funciona">Dicas de Segurança</Link>
        </section>

        <section className="footer-section">
          <strong>Contato</strong>
          <a href="https://wa.me/5549999362681" target="_blank" rel="noreferrer" className="contact-link">
            <Phone size={13} /> WhatsApp Suporte
          </a>
          <a href="mailto:contato@caminhoesavenda.com" className="contact-link">
            <Mail size={13} /> E-mail Comercial
          </a>
        </section>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Caminhões à Venda · A negociação e verificação do veículo são de responsabilidade das partes.</p>
      </div>

      <style>{`
        .site-footer { background:var(--surface); border-top:1px solid var(--line); margin-top:64px; }
        .footer-inner {
          width:min(1280px,calc(100vw - 40px)); margin:0 auto;
          display:grid; grid-template-columns:1.6fr 1fr 1fr 1fr 1fr;
          gap:48px; padding:52px 0 48px;
        }
        .footer-logo { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
        .footer-brand { font-size:17px; font-weight:950; letter-spacing:-.03em; color:var(--text); }
        .footer-desc { font-size:13px; color:var(--muted); line-height:1.65; margin:0 0 16px; font-weight:600; max-width:26ch; }
        .footer-badges { display:flex; gap:10px; }
        .badge-item { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:800; color:var(--blue); background:var(--blueSoft); padding:5px 10px; border-radius:99px; }
        .footer-section strong { display:block; font-size:11px; font-weight:900; color:var(--text); text-transform:uppercase; letter-spacing:.06em; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid var(--line); }
        .footer-section a { display:block; margin-top:10px; color:var(--muted); font-size:13px; font-weight:700; text-decoration:none; transition:color .15s; }
        .footer-section a:hover { color:var(--blue); }
        .contact-link { display:flex !important; align-items:center; gap:8px; }
        .footer-bottom { border-top:1px solid var(--line); background:var(--soft); padding:18px 0; }
        .footer-bottom p { width:min(1280px,calc(100vw - 40px)); margin:0 auto; font-size:12px; color:var(--muted); font-weight:700; }
        @media (max-width:1100px) { .footer-inner { grid-template-columns:1fr 1fr 1fr; gap:32px; } .footer-about { grid-column:1/-1; } .footer-desc { max-width:none; } }
        @media (max-width:640px) { .footer-inner { grid-template-columns:1fr 1fr; gap:28px; padding:36px 0 32px; } .footer-about { grid-column:1/-1; } }
        @media (max-width:400px) { .footer-inner { grid-template-columns:1fr; } }
      `}</style>
    </footer>
  );
}
