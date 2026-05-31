import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
  return (
    <main className="login-page">
      <header className="login-topbar">
        <Link href="/" className="brand" aria-label="Caminhões à Venda">
          <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda" width={230} height={84} priority />
        </Link>
        <nav>
          <Link href="/anuncios">Ver caminhões</Link>
          <Link href="/cadastro" className="create">Criar conta</Link>
        </nav>
      </header>

      <section className="login-shell">
        <div className="login-copy">
          <span>Área do anunciante</span>
          <h1>Acesse sua conta.</h1>
          <p>Entre com e-mail e senha para gerenciar anúncios, enviar caminhões para aprovação e acompanhar o status no painel.</p>
          <div className="login-points">
            <b>Anúncios organizados</b>
            <b>Fotos e dados em um só lugar</b>
            <b>Controle de status</b>
          </div>
        </div>

        <div className="login-card-wrap">
          <LoginForm />
        </div>
      </section>

      <style>{`
        .login-page{min-height:100vh;color:var(--site-text);background:radial-gradient(circle at 82% -12%,color-mix(in srgb,var(--site-green) 18%,transparent),transparent 34%),radial-gradient(circle at 8% 4%,color-mix(in srgb,var(--site-gold) 10%,transparent),transparent 27%),linear-gradient(180deg,var(--site-bg),var(--site-bg-2));overflow-x:hidden;padding-bottom:44px}.login-topbar{width:min(1080px,calc(100vw - 32px));min-height:84px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:14px}.brand{width:210px;height:58px;display:flex;align-items:center;text-decoration:none}.brand img{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 12px 20px rgba(0,0,0,.28))}nav{display:flex;gap:10px}nav a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 15px;border-radius:999px;color:var(--site-text);text-decoration:none;font-size:12px;font-weight:950;letter-spacing:.035em;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft)}nav a.create{background:linear-gradient(135deg,var(--site-green),var(--site-green-2));color:#052e16;border-color:transparent}.login-shell{width:min(1080px,calc(100vw - 32px));min-height:calc(100vh - 138px);margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) 430px;gap:42px;align-items:center}.login-copy span{display:inline-flex;min-height:32px;align-items:center;padding:0 13px;border-radius:999px;color:var(--site-green);background:var(--site-green-soft);border:1px solid color-mix(in srgb,var(--site-green) 28%,transparent);font-size:12px;font-weight:950;text-transform:uppercase;letter-spacing:.06em}.login-copy h1{max-width:560px;margin:18px 0 14px;font-size:clamp(42px,5vw,64px);line-height:.98;letter-spacing:-.055em}.login-copy p{max-width:560px;margin:0;color:var(--site-muted);font-size:18px;line-height:1.6;font-weight:720}.login-points{display:grid;gap:10px;max-width:520px;margin-top:22px}.login-points b{padding:13px 15px;border-radius:18px;background:var(--site-surface);border:1px solid var(--site-line);box-shadow:var(--site-shadow-soft);font-size:14px}.login-card-wrap{width:100%}.login-card-wrap :global(form),.login-card-wrap > *{border-radius:26px!important}@media(max-width:850px){.login-topbar,.login-shell{width:calc(100vw - 24px)}.login-topbar{padding:10px 0;align-items:flex-start;flex-direction:column}.brand{width:178px}nav{width:100%;display:grid;grid-template-columns:1fr 1fr}.login-shell{min-height:auto;grid-template-columns:1fr;gap:24px;padding-top:28px}.login-copy h1{font-size:40px}}@media(max-width:460px){nav{grid-template-columns:1fr}.login-copy h1{font-size:36px}}
      `}</style>
    </main>
  );
}
