import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>Caminhões à Venda</strong>
          <p>Compra, venda e divulgação de caminhões usados e seminovos com contato direto pelo WhatsApp.</p>
          <em className="footer-dream">Toda realidade um dia foi sonhada.</em>
        </div>

        <nav aria-label="Links do rodapé">
          <Link href="/anuncios">Anúncios</Link>
          <Link href="/anunciar">Anunciar</Link>
          <Link href="/sobre">Sobre</Link>
        </nav>

        <div className="security-note">
          <strong>Aviso de negociação</strong>
          <span>
            Confira documentos, procedência, estado do caminhão e dados do vendedor antes de fechar negócio.
          </span>
        </div>
      </div>

      <style>{`
        .site-footer{width:min(1240px,calc(100vw - 32px));margin:36px auto 0;padding:28px 0 42px;border-top:1px solid var(--site-line);color:var(--site-muted)}.footer-inner{display:grid;grid-template-columns:1.1fr .8fr 1.2fr;gap:22px;align-items:start}.site-footer strong{color:var(--site-text);display:block;margin-bottom:8px;font-size:16px}.site-footer p,.security-note span{margin:0;color:var(--site-muted);font-size:14px;line-height:1.55}.footer-dream{display:block;margin-top:12px;color:var(--site-text);font-size:14px;line-height:1.45;font-weight:900;font-style:italic;letter-spacing:-.01em}.site-footer nav{display:flex;flex-wrap:wrap;gap:10px}.site-footer nav a{color:var(--site-text);text-decoration:none;font-weight:900;padding:8px 10px;border-radius:999px;background:var(--site-surface);border:1px solid var(--site-line)}.security-note{padding:16px;border-radius:18px;background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 24%,transparent)}.security-note strong{color:var(--site-green)}@media(max-width:800px){.site-footer{width:calc(100vw - 24px)}.footer-inner{grid-template-columns:1fr}}
      `}</style>
    </footer>
  );
}
