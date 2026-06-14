import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LoginForm } from "./LoginForm";
import { LayoutDashboard, ImagePlus, ClipboardCheck } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
  const bullets = [
    { icon: LayoutDashboard, text: "Anúncios organizados no painel" },
    { icon: ImagePlus,       text: "Fotos e dados em um só lugar" },
    { icon: ClipboardCheck,  text: "Controle de status em tempo real" },
  ];

  return (
    <main className="market-page auth-page">
      <PublicHeader />

      <section className="market-container auth-shell">
        <div className="auth-copy">
          <span className="auth-badge">Área do anunciante</span>
          <h1>Acesse sua conta.</h1>
          <p>Entre com e-mail e senha para gerenciar anúncios e acompanhar o status no painel.</p>

          <div className="auth-bullets">
            {bullets.map(({ icon: Icon, text }) => (
              <div key={text} className="auth-bullet">
                <div className="auth-bullet-icon">
                  <Icon size={15} strokeWidth={2} />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="auth-actions">
            <Link href="/cadastro">Criar conta</Link>
            <Link href="/anuncios">Ver caminhões</Link>
          </div>
        </div>

        <div className="auth-card-wrap">
          <LoginForm />
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .auth-page { padding-bottom: 30px; }
        .auth-shell {
          min-height: calc(100vh - 190px);
          display: grid;
          grid-template-columns: minmax(0,1fr) 430px;
          gap: 34px; align-items: center; padding-top: 24px;
        }
        .auth-copy {
          padding: 28px; border-radius: var(--radius);
          background: var(--surface); border: 1px solid var(--line);
          box-shadow: var(--shadow);
        }
        .auth-badge {
          display: inline-flex; min-height: 28px; align-items: center;
          padding: 0 10px; border-radius: 999px;
          background: var(--blueSoft); color: var(--blue);
          font-size: 12px; font-weight: 950;
          letter-spacing: .04em; text-transform: uppercase;
        }
        .auth-copy h1 {
          margin: 14px 0 10px;
          font-size: clamp(38px,5vw,62px);
          line-height: 1; letter-spacing: -.045em;
        }
        .auth-copy p {
          max-width: 620px; margin: 0;
          color: var(--muted); font-size: 17px;
          line-height: 1.6; font-weight: 700;
        }
        .auth-bullets { display: grid; gap: 8px; margin-top: 20px; }
        .auth-bullet {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 14px;
          background: var(--soft); border: 1px solid var(--line);
          font-size: 14px; font-weight: 800; color: var(--text);
        }
        .auth-bullet-icon {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          background: var(--blueSoft); color: var(--blue);
          display: flex; align-items: center; justify-content: center;
        }
        .auth-actions {
          display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px;
        }
        .auth-actions a {
          min-height: 44px; display: inline-flex;
          align-items: center; justify-content: center;
          padding: 0 16px; border-radius: 999px; font-weight: 950;
          text-decoration: none;
        }
        .auth-actions a:first-child { background: var(--blue); color: #fff; }
        .auth-actions a:last-child {
          background: var(--soft); border: 1px solid var(--line); color: var(--text);
        }
        .auth-card-wrap { width: 100%; }
        @media (max-width: 900px) {
          .auth-shell { grid-template-columns: 1fr; gap: 18px; }
          .auth-copy { padding: 22px; }
        }
        @media (max-width: 520px) {
          .auth-copy h1 { font-size: 36px; }
          .auth-actions { display: grid; }
          .auth-actions a { width: 100%; }
        }
      `}</style>
    </main>
  );
}
