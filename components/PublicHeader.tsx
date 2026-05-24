import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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

export async function PublicHeader() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    role = profile?.role || "anunciante";
  }

  const isLogged = Boolean(user);
  const isAdmin = role === "admin";
  const displayName = getDisplayName(user);

  return (
    <header className="public-header">
      <div className="public-header-inner">
        <Link href="/" className="public-brand" aria-label="Caminhões em Oferta">
          <Image src="/logo-horizontal.png" alt="Caminhões em Oferta" width={190} height={55} priority />
        </Link>

        <nav className="public-nav" aria-label="Menu principal">
          <Link href="/anuncios">Estoque</Link>
          <Link href="/como-funciona">Como funciona</Link>

          {!isLogged && (
            <>
              <Link href="/login">Entrar</Link>
              <Link href="/anunciar" className="public-announce">＋ Anunciar</Link>
            </>
          )}

          {isLogged && (
            <>
              {!isAdmin && <Link href="/painel" className="public-announce">Meu painel</Link>}

              <Link href="/conta" className="account-chip" title={user?.email || "Conta logada"}>
                <span className="account-dot" />
                <span className="account-name">{displayName}</span>
              </Link>

              <Link href="/logout" className="public-logout">Sair</Link>
            </>
          )}
        </nav>
      </div>

      <style>{`
        .public-header {
          position: sticky;
          top: 0;
          z-index: 60;
          background: rgba(2,6,23,.84);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .public-header-inner {
          width: min(1240px, calc(100vw - 32px));
          min-height: 76px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .public-brand {
          display: inline-flex;
          align-items: center;
          color: white;
          text-decoration: none;
          min-width: 0;
        }

        .public-brand img {
          width: 190px;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .public-nav {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .public-nav a {
          min-height: 42px;
          padding: 0 14px;
          border-radius: 14px;
          color: white;
          text-decoration: none;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
          white-space: nowrap;
        }

        .public-nav .public-announce {
          background: #22c55e;
          color: #052e16;
          border-color: transparent;
        }

        .public-nav .public-logout {
          background: rgba(239,68,68,.12);
          color: #fecaca;
          border-color: rgba(239,68,68,.22);
        }

        .public-nav .account-chip {
          background: rgba(34,197,94,.10);
          color: #bbf7d0;
          border-color: rgba(34,197,94,.25);
          gap: 8px;
          max-width: 210px;
        }

        .account-dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 0 4px rgba(34,197,94,.14);
          flex: 0 0 auto;
        }

        .account-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 860px) {
          .public-header-inner {
            width: calc(100vw - 24px);
            min-height: auto;
            padding: 10px 0;
          }

          .public-brand img {
            width: 142px;
          }

          .public-nav {
            gap: 7px;
            overflow-x: auto;
            padding-bottom: 2px;
          }

          .public-nav a {
            min-height: 38px;
            padding: 0 10px;
            font-size: 12px;
          }

          .public-nav a:nth-child(2) {
            display: none;
          }

          .public-nav .account-chip {
            max-width: 135px;
          }
        }
      `}</style>
    </header>
  );
}
