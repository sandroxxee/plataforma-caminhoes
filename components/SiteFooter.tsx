import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>Caminhões à Venda</strong>
          <p>Vitrine digital para compra, venda e divulgação de caminhões usados e seminovos com contato direto pelo WhatsApp.</p>
          <em className="footer-dream">Toda realidade um dia foi sonhada.</em>
        </div>

        <nav aria-label="Links do rodapé">
          <strong>Loja</strong>
          <Link href="/anuncios">Anúncios</Link>
          <Link href="/anuncios?perfil=Implementos">Implementos</Link>
          <Link href="/anunciar">Anunciar</Link>
          <Link href="/sobre">Quem somos</Link>
        </nav>

        <div className="footer-contact">
          <strong>Contato e localização</strong>
          <span>Atendimento comercial pelo WhatsApp.</span>
          <span>Consulte disponibilidade, fotos, vídeos e detalhes do caminhão.</span>
        </div>

        <div className="security-note">
          <strong>Aviso de negociação</strong>
          <span>Confira documentos, procedência, estado do caminhão e dados do vendedor antes de fechar negócio.</span>
        </div>
      </div>

      <style>{`
        .site-footer{width:min(1240px,calc(100vw - 28px));margin:34px auto 0;padding:28px 0 42px;border-top:1px solid var(--site-line);color:var(--site-muted)}
        .footer-inner{display:grid;grid-template-columns:1.15fr .75fr .95fr 1.05fr;gap:18px;align-items:start}.site-footer strong{color:var(--site-text);display:block;margin-bottom:9px;font-size:16px}.site-footer p,.footer-contact span,.security-note span{margin:0;color:var(--site-muted);font-size:14px;line-height:1.55}.footer-dream{display:inline-block;margin-top:13px;padding:10px 12px;border-radius:14px;background:var(--site-surface-2);border:1px solid var(--site-line);color:var(--site-text);font-size:14px;line-height:1.45;font-weight:900;font-style:italic;letter-spacing:-.01em}.site-footer nav,.footer-contact{display:grid;gap:7px}.site-footer nav a{color:var(--site-muted);text-decoration:none;font-weight:850;font-size:14px}.site-footer nav a:hover{color:var(--site-blue)}.security-note{padding:16px;border-radius:18px;background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 24%,transparent)}.security-note strong{color:var(--site-green)}@media(max-width:900px){.footer-inner{grid-template-columns:1fr 1fr}}@media(max-width:620px){.site-footer{width:calc(100vw - 22px)}.footer-inner{grid-template-columns:1fr}}
      `}</style>
    </footer>
  );
}
