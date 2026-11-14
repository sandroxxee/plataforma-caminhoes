import type { CSSProperties } from 'react';

export type ArtworkFormat = 'feed' | 'story' | 'whatsapp';
export type ArtworkTemplateId = 'foto-destaque' | 'clean-branco' | 'premium-escuro';
export type ArtworkProps = {
  format: ArtworkFormat;
  title: string;
  price?: string;
  location?: string;
  photoUrl?: string;
  details?: string;
  headline?: string;
};

export const ARTWORK_SIZES: Record<ArtworkFormat, { width: number; height: number }> = {
  feed: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
  whatsapp: { width: 1200, height: 630 },
};

const brand = 'CAMINHÕES À VENDA';
const column: CSSProperties = { display: 'flex', flexDirection: 'column' };

function Photo({ src, style }: { src?: string; style: CSSProperties }) {
  return (
    <div style={{ display: 'flex', overflow: 'hidden', background: '#dbe2ea', ...style }}>
      {src ? <img src={src} alt="Foto do veículo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> :
        <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 28 }}>Foto indisponível</div>}
    </div>
  );
}

function Info({ data, color, muted, accent }: { data: ArtworkProps; color: string; muted: string; accent: string }) {
  const horizontal = data.format === 'whatsapp';
  return (
    <div style={{ ...column, gap: 16 }}>
      <span style={{ color: accent, fontSize: horizontal ? 17 : 22, fontWeight: 700 }}>{brand}</span>
      <span style={{ color, fontSize: horizontal ? 34 : 48, lineHeight: 1.15, fontWeight: 800 }}>{data.title}</span>
      {data.details && <span style={{ color: muted, fontSize: horizontal ? 20 : 26 }}>{data.details}</span>}
      {data.price && <span style={{ color: accent, fontSize: horizontal ? 46 : 64, fontWeight: 800 }}>{data.price}</span>}
      {data.location && <span style={{ color: muted, fontSize: horizontal ? 22 : 28 }}>{data.location}</span>}
      {data.headline && <span style={{ color, fontSize: horizontal ? 20 : 26 }}>{data.headline}</span>}
    </div>
  );
}

export function FotoDestaqueTemplate(data: ArtworkProps) {
  const { width, height } = ARTWORK_SIZES[data.format];
  const photoHeight = Math.round(height * (data.format === 'story' ? 0.64 : 0.57));
  return (
    <div style={{ ...column, width, height, background: '#0f172a', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <Photo src={data.photoUrl} style={{ width, height: photoHeight, flexShrink: 0 }} />
      <div style={{ ...column, flex: 1, padding: data.format === 'whatsapp' ? 24 : 40, justifyContent: 'center' }}>
        <Info data={data} color="#ffffff" muted="#cbd5e1" accent="#38bdf8" />
      </div>
    </div>
  );
}

export function CleanBrancoTemplate(data: ArtworkProps) {
  const { width, height } = ARTWORK_SIZES[data.format];
  const horizontal = data.format === 'whatsapp';
  return (
    <div style={{ display: 'flex', flexDirection: horizontal ? 'row' : 'column', width, height, padding: 40, gap: 32, background: '#ffffff', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <div style={{ ...column, width: horizontal ? 430 : width - 80, flexShrink: 0, justifyContent: 'center', borderLeft: '8px solid #2563eb', paddingLeft: 24 }}>
        <Info data={data} color="#0f172a" muted="#475569" accent="#2563eb" />
      </div>
      <Photo src={data.photoUrl} style={{ flex: 1, minHeight: 0, borderRadius: 24 }} />
    </div>
  );
}

export function PremiumEscuroTemplate(data: ArtworkProps) {
  const { width, height } = ARTWORK_SIZES[data.format];
  const horizontal = data.format === 'whatsapp';
  return (
    <div style={{ display: 'flex', flexDirection: horizontal ? 'row' : 'column', width, height, background: '#121212', padding: 32, gap: 32, overflow: 'hidden', fontFamily: 'sans-serif', border: '4px solid #c7a45b' }}>
      <Photo src={data.photoUrl} style={{ width: horizontal ? 640 : width - 72, height: horizontal ? height - 72 : Math.round(height * 0.55), borderRadius: 12, flexShrink: 0 }} />
      <div style={{ ...column, flex: 1, justifyContent: 'center', padding: 12 }}>
        <Info data={data} color="#fafafa" muted="#d4d4d4" accent="#e3c780" />
      </div>
    </div>
  );
}

export const ARTWORK_TEMPLATES = [
  { id: 'foto-destaque', name: 'Foto em destaque', description: 'Foto ampla e informações abaixo', component: FotoDestaqueTemplate },
  { id: 'clean-branco', name: 'Clean branco', description: 'Informações primeiro, fundo claro e borda azul', component: CleanBrancoTemplate },
  { id: 'premium-escuro', name: 'Premium escuro', description: 'Foto emoldurada e detalhes dourados', component: PremiumEscuroTemplate },
] as const;

export function ArtworkTemplate({ template, ...data }: ArtworkProps & { template: ArtworkTemplateId }) {
  const selected = ARTWORK_TEMPLATES.find((item) => item.id === template) ?? ARTWORK_TEMPLATES[0];
  const Template = selected.component;
  return <Template {...data} />;
}
