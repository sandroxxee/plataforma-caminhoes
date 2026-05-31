import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>Caminhões à Venda</strong>
          <p>Compra, venda e divulgação de caminhões com fotos, detalhes e contato direto pelo WhatsApp.</p>
          <em>Toda realidade um dia foi sonhada.</em>
        </div>

        <nav aria-label="Links do rodapé">
          <Link href="/anuncios">Caminhões</Link>
          <Link href="/anuncios?perfil=Implementos">Implementos</Link>
          <Link href="/anunciar">Anunciar</Link>
          <Link href="/sobre">Sobre</Link>
        </nav>
      </div>

      <style>{`
        .site-footer{width:min(1240px,calc(100vw - 28px));margin:34px auto 0;padding:24px 0 38px;border-top:1px solid var(--border);color:var(--muted)}
        .footer-inner{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}.site-footer strong{color:var(--text);display:block;margin-bottom:6px;font-size:16px}.site-footer p{margin:0;color:var(--muted);font-size:14px;line-height:1.5}.site-footer em{display:block;margin-top:10px;color:var(--text);font-size:14px;font-weight:850;font-style:italic}.site-footer nav{display:flex;flex-wrap:wrap;gap:10px}.site-footer nav a{min-height:38px;padding:0 12px;border-radius:999px;background:var(--surface);border:1px solid var(--border);color:var(--muted);display:inline-flex;align-items:center;text-decoration:none;font-weight:850;font-size:14px}.site-footer nav a:hover{color:var(--primary);border-color:var(--primary)}@media(max-width:720px){.site-footer{width:calc(100vw - 22px)}.footer-inner{display:grid}.site-footer nav{display:grid;grid-template-columns:1fr 1fr}.site-footer nav a{justify-content:center}}
      `}</style>
    </footer>
  );
}
