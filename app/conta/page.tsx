import Link from "next/link";
import { redirect } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getDisplayName(user: { email?: string | null; user_metadata?: Record<string, unknown> } | null) {
  if (!user) return "";

  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "";

  if (metadataName.trim()) return metadataName.trim();

  const email = user.email || "";
  return email ? email.split("@")[0] : "Minha conta";
}

export default async function ContaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "anunciante";
  const isAdmin = role === "admin";
  const displayName = getDisplayName(user);

  return (
    <main className="page">
      <PublicHeader />

      <section className="container">
        <div className="hero">
          <span>Conta logada</span>
          <h1>Você está conectado como {displayName}.</h1>
          <p>Use esta página para confirmar qual conta está ativa antes de criar anúncio, aprovar anúncios ou sair do sistema.</p>
        </div>

        <section className="account-card">
          <div className="avatar">{displayName.slice(0, 1).toUpperCase()}</div>

          <div className="account-info">
            <span>Nome / identificação</span>
            <strong>{displayName}</strong>
          </div>

          <div className="account-info">
            <span>E-mail</span>
            <strong>{user.email || "E-mail não encontrado"}</strong>
          </div>

          <div className="account-info">
            <span>Tipo de conta</span>
            <strong>{isAdmin ? "Administrador" : "Anunciante / usuário normal"}</strong>
          </div>
        </section>

        <section className="actions">
          {!isAdmin && <Link href="/painel" className="primary">Ir para meu painel</Link>}
          <Link href="/anuncios">Ver estoque</Link>
          <Link href="/logout" className="danger">Sair da conta</Link>
        </section>

        {isAdmin && (
          <section className="admin-note">
            <strong>Admin protegido</strong>
            <p>
              O link do painel administrativo não aparece no menu público. O acesso deve ser feito diretamente pelo endereço administrativo.
            </p>
          </section>
        )}
      </section>

      <style>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 18% 6%, rgba(34,197,94,.16), transparent 28%),
            linear-gradient(135deg, #020617 0%, #061512 58%, #020617 100%);
          color: white;
          padding-bottom: 48px;
        }

        .container {
          width: min(860px, calc(100vw - 32px));
          margin: 0 auto;
          padding-top: 44px;
        }

        .hero span {
          display: inline-flex;
          min-height: 32px;
          align-items: center;
          padding: 0 13px;
          border-radius: 999px;
          color: #86efac;
          background: rgba(34,197,94,.12);
          border: 1px solid rgba(34,197,94,.22);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .hero h1 {
          margin: 18px 0 12px;
          font-size: clamp(34px, 5vw, 58px);
          line-height: 1;
          letter-spacing: -.055em;
        }

        .hero p {
          margin: 0 0 22px;
          color: #cbd5e1;
          font-size: 18px;
          line-height: 1.6;
        }

        .account-card,
        .actions,
        .admin-note {
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 28px;
        }

        .account-card {
          padding: 24px;
          display: grid;
          grid-template-columns: 78px 1fr;
          gap: 16px;
          align-items: center;
        }

        .avatar {
          width: 70px;
          height: 70px;
          border-radius: 22px;
          display: grid;
          place-items: center;
          background: #22c55e;
          color: #052e16;
          font-size: 32px;
          font-weight: 950;
        }

        .account-info {
          grid-column: 2;
          display: grid;
          gap: 5px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .account-info:last-child {
          border-bottom: 0;
        }

        .account-info span {
          color: #94a3b8;
          font-size: 13px;
          font-weight: 900;
        }

        .account-info strong {
          color: white;
          font-size: 19px;
          overflow-wrap: anywhere;
        }

        .actions {
          margin-top: 16px;
          padding: 14px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .actions a {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          font-weight: 950;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
        }

        .actions .primary {
          background: #22c55e;
          color: #052e16;
          border-color: transparent;
        }

        .actions .danger {
          background: rgba(239,68,68,.12);
          color: #fecaca;
          border-color: rgba(239,68,68,.24);
        }

        .admin-note {
          margin-top: 16px;
          padding: 20px;
        }

        .admin-note strong {
          color: #86efac;
          display: block;
          margin-bottom: 8px;
        }

        .admin-note p {
          color: #cbd5e1;
          margin: 0;
          line-height: 1.55;
        }

        @media (max-width: 620px) {
          .container {
            width: calc(100vw - 24px);
            padding-top: 28px;
          }

          .account-card {
            grid-template-columns: 1fr;
          }

          .account-info {
            grid-column: 1;
          }

          .actions {
            display: grid;
          }

          .actions a {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
