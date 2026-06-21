import Link from "next/link";
import type { ReactNode } from "react";
import { Search } from "lucide-react";

interface EmptyStateLink {
  href: string;
  label: string;
  icon?: ReactNode;
}

interface EmptyStateProps {
  icon?: ReactNode;
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
  icon,
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
      <div className="es-icon-wrap" aria-hidden="true">
        {icon || <Search size={48} strokeWidth={1.5} />}
      </div>
      <strong className="es-title">{title}</strong>
      {description && <p className="es-desc">{description}</p>}

      <Link href={primaryHref} className="es-primary">{primaryLabel}</Link>

      {suggestions.length > 0 && (
        <div className="es-suggestions">
          <p className="es-suggestions-label">Veja também</p>
          <div className="es-suggestions-grid">
            {suggestions.map((s) => (
              <Link key={s.href} href={s.href} className="es-suggestion-chip">
                {s.icon && <span className="es-sugg-icon">{s.icon}</span>}
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
          gap: 16px; padding: 80px 24px;
          text-align: center;
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(148,163,184,0.12);
          margin-top: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .es-icon-wrap {
          color: var(--blue);
          margin-bottom: 8px;
          opacity: 0.8;
        }
        .es-title {
          font-size: 22px; font-weight: 800;
          color: #0f172a; letter-spacing: -.03em;
        }
        .es-desc {
          margin: 0; font-size: 15px; color: #64748b;
          font-weight: 600; max-width: 40ch; line-height: 1.6;
        }
        .es-primary {
          display: inline-flex; align-items: center; justify-content: center;
          height: 48px; padding: 0 28px; border-radius: 14px;
          background: var(--blue); color: #fff;
          font-weight: 800; font-size: 14px;
          text-decoration: none; margin-top: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(24,119,242,0.2);
        }
        .es-primary:hover { background: var(--blue2); transform: translateY(-1px); }
        .es-suggestions { width: 100%; max-width: 520px; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(148,163,184,0.08); }
        .es-suggestions-label {
          margin: 0 0 16px; font-size: 11px; font-weight: 800;
          color: #94a3b8; text-transform: uppercase; letter-spacing: .1em;
        }
        .es-suggestions-grid {
          display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
        }
        .es-suggestion-chip {
          display: inline-flex; align-items: center; gap: 8px;
          height: 38px; padding: 0 16px;
          border-radius: 12px; border: 1px solid rgba(148,163,184,0.15);
          background: #ffffff; color: #475569;
          font-size: 13px; font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }
        .es-suggestion-chip:hover {
          border-color: var(--blue); color: var(--blue); background: var(--blueSoft); transform: translateY(-1px);
        }
        .es-sugg-icon { display: flex; align-items: center; color: var(--blue); opacity: 0.7; }
        .es-announce {
          margin-top: 24px; font-size: 14px; color: #64748b; font-weight: 600;
        }
        .es-announce-link {
          color: var(--blue); font-weight: 800; text-decoration: none;
          margin-left: 4px;
        }
        .es-announce-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
