import Link from "next/link";

interface EmptyStateLink {
  href: string;
  label: string;
  emoji?: string;
}

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  /** Link principal de CTA (ex: limpar filtro, ver todos) */
  primaryHref: string;
  primaryLabel: string;
  /** Links alternativos — outras categorias, marcas, etc */
  suggestions?: EmptyStateLink[];
  /** Link para anunciar */
  announceHref?: string;
  announceLabel?: string;
}

export function EmptyState({
  emoji = "🔍",
  title,
  description,
  primaryHref,
  primaryLabel,
  suggestions = [],
  announceHref,
  announceLabel,
}: EmptyStateProps) {
  return (
    <div className="es-wrap">
      <span className="es-emoji" role="img" aria-hidden="true">{emoji}</span>
      <strong className="es-title">{title}</strong>
      {description && <p className="es-desc">{description}</p>}

      <Link href={primaryHref} className="es-primary">{primaryLabel}</Link>

      {suggestions.length > 0 && (
        <div className="es-suggestions">
          <p className="es-suggestions-label">Veja também</p>
          <div className="es-suggestions-grid">
            {suggestions.map((s) => (
              <Link key={s.href} href={s.href} className="es-suggestion-chip">
                {s.emoji && <span aria-hidden="true">{s.emoji}</span>}
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {announceHref && (
        <p className="es-announce">
          Tem um para vender?{" "}
          <Link href={announceHref} className="es-announce-link">{announceLabel ?? "Anuncie aqui"}</Link>
        </p>
      )}

      <style>{`
        .es-wrap {
          display: flex; flex-direction: column; align-items: center;
          gap: 12px; padding: 64px 24px 72px;
          text-align: center;
          background: var(--surface);
          border-radius: 20px;
          border: 1px solid var(--line);
          margin-top: 8px;
        }
        .es-emoji { font-size: 52px; line-height: 1; margin-bottom: 4px; }
        .es-title {
          font-size: 20px; font-weight: 900;
          color: var(--text); letter-spacing: -.02em;
        }
        .es-desc {
          margin: 0; font-size: 14px; color: var(--muted);
          font-weight: 600; max-width: 36ch; line-height: 1.55;
        }
        .es-primary {
          display: inline-flex; align-items: center; justify-content: center;
          height: 44px; padding: 0 24px; border-radius: 12px;
          background: var(--blue); color: #fff;
          font-weight: 900; font-size: 14px;
          text-decoration: none; margin-top: 4px;
          transition: background .14s;
        }
        .es-primary:hover { background: var(--blue2); }
        .es-suggestions { width: 100%; max-width: 480px; margin-top: 8px; }
        .es-suggestions-label {
          margin: 0 0 10px; font-size: 11px; font-weight: 800;
          color: var(--muted); text-transform: uppercase; letter-spacing: .06em;
        }
        .es-suggestions-grid {
          display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
        }
        .es-suggestion-chip {
          display: inline-flex; align-items: center; gap: 6px;
          height: 34px; padding: 0 14px;
          border-radius: 999px; border: 1.5px solid var(--line);
          background: var(--bg); color: var(--text);
          font-size: 13px; font-weight: 700;
          text-decoration: none;
          transition: border-color .12s, color .12s, background .12s;
        }
        .es-suggestion-chip:hover {
          border-color: var(--blue); color: var(--blue); background: var(--blueSoft);
        }
        .es-announce {
          margin: 0; font-size: 13px; color: var(--muted); font-weight: 600;
        }
        .es-announce-link {
          color: var(--blue); font-weight: 800; text-decoration: none;
        }
        .es-announce-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
