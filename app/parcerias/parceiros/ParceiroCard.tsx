"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin } from "lucide-react";

type Parceiro = {
  id: string;
  nome: string;
  slug: string;
  cidade: string | null;
  estado: string | null;
  celular: string | null;
  telefone: string | null;
  logo_url: string | null;
  banner_url: string | null;
  instagram?: string | null;
  facebook?: string | null;
};

const WaIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

type Props = { parceiro: Parceiro; thumbs: string[] };

export function ParceiroCard({ parceiro: p, thumbs }: Props) {
  // filtra as URLs que carregaram com sucesso
  const [validThumbs, setValidThumbs] = useState<string[]>([]);
  const [checkedCount, setCheckedCount] = useState(0);
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pré-verifica cada imagem no lado client antes de exibir
  useEffect(() => {
    if (thumbs.length === 0) { setCheckedCount(thumbs.length); return; }
    const valid: string[] = [];
    let done = 0;
    thumbs.forEach((url) => {
      const img = new window.Image();
      img.onload = () => {
        valid.push(url);
        done++;
        if (done === thumbs.length) {
          setValidThumbs([...valid]);
          setCheckedCount(done);
        }
      };
      img.onerror = () => {
        done++;
        if (done === thumbs.length) {
          setValidThumbs([...valid]);
          setCheckedCount(done);
        }
      };
      img.src = url;
    });
  }, [thumbs]);

  const hasSlider = validThumbs.length > 1;

  useEffect(() => {
    if (!hasSlider) return;
    timerRef.current = setInterval(() => setIdx((i) => (i + 1) % validThumbs.length), 2800);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [hasSlider, validThumbs.length]);

  const location = [p.cidade, p.estado].filter(Boolean).join(", ");
  const waNumber = (p.celular || p.telefone || "").replace(/\D/g, "");
  const isLoading = checkedCount < thumbs.length;

  // Decide o que mostrar no topo do card
  const showSlider = validThumbs.length > 0;
  const showBanner = !showSlider && !!p.banner_url;
  const showPlaceholder = !showSlider && !showBanner;

  return (
    <article className="pc-card">
      {/* ─── Área de imagem ─── */}
      <Link href={`/parcerias/parceiros/${p.slug}`} className="pc-media" aria-label={`Ver estoque de ${p.nome}`}>

        {/* Placeholder enquanto carrega */}
        {isLoading && (
          <div className="pc-media-inner pc-loading">
            <span className="pc-loading-dot" />
            <span className="pc-loading-dot" />
            <span className="pc-loading-dot" />
          </div>
        )}

        {/* Slider de fotos dos caminhões */}
        {!isLoading && showSlider && (
          <div className="pc-media-inner">
            {validThumbs.map((url, i) => (
              <img
                key={url + i}
                src={url}
                alt=""
                aria-hidden="true"
                className={`pc-slide-img${i === idx ? " active" : ""}`}
                draggable={false}
              />
            ))}
            <div className="pc-slide-overlay" />
            {hasSlider && (
              <div className="pc-dots" aria-hidden="true">
                {validThumbs.map((_, i) => (
                  <span key={i} className={`pc-dot${i === idx ? " active" : ""}`} />
                ))}
              </div>
            )}
            {/* legenda discreta */}
            <span className="pc-media-label">{validThumbs.length} foto{validThumbs.length > 1 ? "s" : ""} do estoque</span>
          </div>
        )}

        {/* Banner do parceiro como fallback */}
        {!isLoading && showBanner && (
          <div className="pc-media-inner">
            <img src={p.banner_url!} alt="" aria-hidden="true" className="pc-slide-img active" draggable={false} />
            <div className="pc-slide-overlay" />
          </div>
        )}

        {/* Placeholder sem imagem */}
        {!isLoading && showPlaceholder && (
          <div className="pc-media-inner pc-placeholder">
            <span className="pc-placeholder-initials">{iniciais(p.nome)}</span>
          </div>
        )}

        {/* Badge verificado */}
        <span className="pc-badge">✓ Verificado</span>
      </Link>

      {/* ─── Corpo do card ─── */}
      <div className="pc-body">
        {/* Logo + nome + localização */}
        <div className="pc-head">
          <Link href={`/parcerias/parceiros/${p.slug}`} className="pc-logo-wrap" tabIndex={-1}>
            {p.logo_url ? (
              <img src={p.logo_url} alt={`Logo ${p.nome}`} className="pc-logo-img"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <span className="pc-logo-initials">{iniciais(p.nome)}</span>
            )}
          </Link>
          <div className="pc-info">
            <Link href={`/parcerias/parceiros/${p.slug}`} className="pc-name">{p.nome}</Link>
            {location && (
              <span className="pc-location">
                <MapPin size={11} aria-hidden="true" />
                {location}
              </span>
            )}
          </div>
        </div>

        {/* Redes sociais */}
        {(p.instagram || p.facebook) && (
          <div className="pc-social">
            {p.instagram && (
              <a
                href={p.instagram.startsWith("http") ? p.instagram : `https://instagram.com/${p.instagram.replace("@", "")}`}
                target="_blank" rel="noreferrer" className="pc-social-link pc-insta"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                Instagram
              </a>
            )}
            {p.facebook && (
              <a
                href={p.facebook.startsWith("http") ? p.facebook : `https://facebook.com/${p.facebook}`}
                target="_blank" rel="noreferrer" className="pc-social-link pc-fb"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                Facebook
              </a>
            )}
          </div>
        )}

        {/* Botões */}
        <div className="pc-actions">
          <Link href={`/parcerias/parceiros/${p.slug}`} className="pc-btn-outline">
            Ver estoque
          </Link>
          {waNumber && (
            <a href={`https://wa.me/55${waNumber}`} target="_blank" rel="noreferrer" className="pc-btn-wa">
              <WaIcon /> WhatsApp
            </a>
          )}
        </div>
      </div>

      <style>{`
        /* Card */
        .pc-card {
          background: var(--surface);
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: box-shadow .22s, transform .22s;
        }
        .pc-card:hover {
          box-shadow: 0 10px 32px rgba(0,0,0,0.11);
          transform: translateY(-3px);
        }
        body.public-theme-dark .pc-card { border-color: rgba(255,255,255,0.07); }

        /* Media / slider */
        .pc-media {
          display: block;
          position: relative;
          height: 196px;
          overflow: hidden;
          text-decoration: none;
          flex-shrink: 0;
          background: var(--soft);
        }
        .pc-media-inner {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        /* Imagens */
        .pc-slide-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity .7s ease;
          display: block;
        }
        .pc-slide-img.active { opacity: 1; }
        .pc-slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%);
          pointer-events: none;
        }

        /* Placeholder sem imagem */
        .pc-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--soft) 0%, var(--line) 100%);
        }
        .pc-placeholder-initials {
          font-size: 48px;
          font-weight: 900;
          color: var(--muted);
          opacity: 0.3;
          letter-spacing: -0.04em;
          user-select: none;
        }

        /* Loading pulse */
        .pc-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          background: var(--soft);
        }
        .pc-loading-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--muted);
          opacity: 0.35;
          animation: pc-pulse 1.2s ease-in-out infinite;
        }
        .pc-loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .pc-loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pc-pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.85); }
          50% { opacity: 0.55; transform: scale(1.1); }
        }

        /* Dots do slider */
        .pc-dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          z-index: 3;
        }
        .pc-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          transition: all .25s;
          flex-shrink: 0;
        }
        .pc-dot.active { background: #fff; width: 16px; border-radius: 3px; }

        /* Legenda discreta */
        .pc-media-label {
          position: absolute;
          bottom: 10px;
          left: 12px;
          font-size: 11px;
          font-weight: 800;
          color: rgba(255,255,255,0.85);
          z-index: 3;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }

        /* Badge verificado */
        .pc-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #22c55e;
          color: #052e16;
          font-size: 11px;
          font-weight: 900;
          padding: 3px 10px;
          border-radius: 999px;
          letter-spacing: .04em;
          text-transform: uppercase;
          z-index: 3;
          box-shadow: 0 2px 8px rgba(34,197,94,0.35);
        }

        /* Body */
        .pc-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        .pc-head { display: flex; align-items: center; gap: 12px; }

        /* Logo */
        .pc-logo-wrap {
          width: 50px; height: 50px;
          flex-shrink: 0;
          background: var(--surface);
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.08);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          text-decoration: none;
        }
        body.public-theme-dark .pc-logo-wrap { border-color: rgba(255,255,255,0.1); }
        .pc-logo-img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
        .pc-logo-initials { font-size: 17px; font-weight: 900; color: var(--text); letter-spacing: -0.03em; }

        .pc-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1; }
        .pc-name {
          font-size: 15px; font-weight: 900; color: var(--text);
          text-decoration: none; letter-spacing: -0.02em;
          line-height: 1.2;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          display: block;
        }
        .pc-name:hover { color: var(--blue); }
        .pc-location {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; font-weight: 700; color: var(--muted);
        }

        /* Social */
        .pc-social { display: flex; gap: 8px; flex-wrap: wrap; }
        .pc-social-link {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 800; text-decoration: none;
          padding: 5px 10px; border-radius: 8px; transition: all .15s;
        }
        .pc-insta { color: #e1306c; background: rgba(225,48,108,0.08); }
        .pc-insta:hover { background: rgba(225,48,108,0.16); }
        .pc-fb { color: var(--blue); background: var(--blueSoft); }
        .pc-fb:hover { filter: brightness(0.92); }

        /* Actions */
        .pc-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: auto;
        }
        .pc-btn-outline, .pc-btn-wa {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          height: 42px; border-radius: 10px;
          font-size: 13px; font-weight: 900;
          text-decoration: none; cursor: pointer; transition: all .18s;
        }
        .pc-btn-outline {
          border: 1.5px solid rgba(0,0,0,0.1);
          background: transparent; color: var(--text);
        }
        body.public-theme-dark .pc-btn-outline { border-color: rgba(255,255,255,0.12); }
        .pc-btn-outline:hover { border-color: var(--blue); color: var(--blue); }
        .pc-btn-wa { background: #25d366; color: #052e16; border: none; }
        .pc-btn-wa:hover { background: #1ebe5b; transform: translateY(-1px); }
      `}</style>
    </article>
  );
}
