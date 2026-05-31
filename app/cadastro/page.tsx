import Image from "next/image";
import Link from "next/link";
import { CadastroForm } from "./CadastroForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CadastroPage() {
  return (
    <main className="cadastro-page">
      <header className="cadastro-topbar">
        <Link href="/" className="brand" aria-label="Caminhões à Venda">
          <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda" width={230} height={84} priority />
        </Link>
        <nav>
          <Link href="/anuncios">Estoque</Link>
          <Link href="/login" className="create">Entrar</Link>
        </nav>
      </header>

      <section className="cadastro-shell">
        <div className="copy">
          <span>Cadastro</span>
          <h1>Crie sua conta para anunciar caminhões.</h1>
          <p>Cadastro simples: nome, e-mail válido, telefone/WhatsApp e senha. Cidade e dados completos ficam dentro do anúncio.</p>
          <div className="cadastro-points">
            <b>Envie anúncio para aprovação</b>
            <b>Acompanhe status no painel</b>
            <b>Organize fotos, valor e contato</b>
          </div>
        </div>

        <div className="form-card-wrap">
          <CadastroForm />
        </div>
      </section>

      <style>{`
        .cadastro-page{min-height:100vh;color:var(--site-text);background:radial-gradient(circle at 82% -12%,color-mix(in srgb,var(--site-green) 18%,transparent),transparent 34%),radial-gradient(circle at 8% 4%,color-mix(in srgb,var(--site-gold) 10%,transparent),transparent 27%),linear-gradient(180deg,var(--site-bg),var(--site-bg-2));overflow-x:hidden;padding-bottom:46px}.cadastro-topbar{width:min(1120px,calc(100vw - 32px));min-height:84px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:14px}.brand{width:210px;height:58px;display:flex;align-items:center;text-decoration:none}.brand img{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 12px 20px rgba(0,0,0,.28))}nav{display:flex;gap:10px}nav a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 15px;border-radius:999px;color:var(--site-text);text-decoration:none;font-size:12px;font-weight:950;letter-spacing:.035em;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft)}nav a.create{background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;border-color:transparent}.cadastro-shell{width:min(1120px,calc(100vw - 32px));margin:0 auto;min-height:calc(100vh - 138px);display:grid;grid-template-columns:minmax(0,1fr) 460px;gap:38px;align-items:center}.copy span{display:inline-flex;min-height:32px;align-items:center;padding:0 13px;border-radius:999px;color:var(--site-green);background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 28%,transparent);font-size:12px;font-weight:950;text-transform:uppercase;letter-spacing:.06em}.copy h1{margin:18px 0 14px;font-size:clamp(38px,5.4vw,64px);line-height:.96;letter-spacing:-.06em}.copy p{margin:0;max-width:570px;color:var(--site-muted);font-size:18px;line-height:1.6;font-weight:720}.cadastro-points{display:grid;gap:10px;max-width:520px;margin-top:22px}.cadastro-points b{padding:13px 15px;border-radius:18px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft);font-size:14px}.form-card-wrap{width:100%}.form-card-wrap > *{border-radius:26px!important}@media(max-width:850px){.cadastro-topbar,.cadastro-shell{width:calc(100vw - 24px)}.cadastro-topbar{padding:10px 0;align-items:flex-start;flex-direction:column}.brand{width:178px}nav{width:100%;display:grid;grid-template-columns:1fr 1fr}.cadastro-shell{grid-template-columns:1fr;gap:24px;padding-top:28px}.copy h1{font-size:40px}}@media(max-width:460px){nav{grid-template-columns:1fr}.copy h1{font-size:36px}}
      `}</style>
    </main>
  );
}
