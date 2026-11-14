import type { CSSProperties } from 'react';

export type ArtworkFormat = 'feed' | 'story' | 'whatsapp';
export type ArtworkTemplateId = 'foto-destaque' | 'clean-branco' | 'premium-escuro';
export type ArtworkProps = { format: ArtworkFormat; title: string; price?: string; location?: string; photoUrl?: string; details?: string; headline?: string };
export const ARTWORK_SIZES: Record<ArtworkFormat, { width: number; height: number }> = { feed: { width: 1080, height: 1080 }, story: { width: 1080, height: 1920 }, whatsapp: { width: 1200, height: 630 } };
const column: CSSProperties = { display: 'flex', flexDirection: 'column' };
function fit(value: string | undefined, max: number) {
  const text = (value || '').replace(/\s+/g, ' ').trim();
  const chars = Array.from(text);
  return chars.length > max ? chars.slice(0, max - 1).join('') + '…' : text;
}
function Photo({ src, style }: { src?: string; style: CSSProperties }) {
  return <div style={{ display: 'flex', overflow: 'hidden', background: '#dbe2ea', flexShrink: 0, ...style }}>
    {src ? <img src={src} alt="Foto do veículo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 26 }}>Foto indisponível</div>}
  </div>;
}
function Info({ data, light, gold }: { data: ArtworkProps; light: boolean; gold: boolean }) {
  const horizontal = data.format === 'whatsapp';
  const story = data.format === 'story';
  const accent = gold ? '#e3c780' : light ? '#2563eb' : '#38bdf8';
  const color = light ? '#0f172a' : '#ffffff';
  const muted = light ? '#475569' : '#cbd5e1';
  return <div style={{ ...column, gap: horizontal ? 14 : 18, width: '100%', minWidth: 0 }}>
    <span style={{ color: accent, fontSize: horizontal ? 16 : 22, fontWeight: 700 }}>CAMINHÕES À VENDA</span>
    <span style={{ color, fontSize: horizontal ? 32 : story ? 48 : 42, lineHeight: 1.12, fontWeight: 800 }}>{fit(data.title, horizontal ? 58 : 78)}</span>
    {data.details && <span style={{ color: muted, fontSize: horizontal ? 20 : 26, lineHeight: 1.2 }}>{fit(data.details, horizontal ? 46 : 72)}</span>}
    {data.price && <span style={{ color: accent, fontSize: horizontal ? 40 : 60, lineHeight: 1.1, fontWeight: 800 }}>{fit(data.price, 24)}</span>}
    {data.location && <span style={{ color: muted, fontSize: horizontal ? 21 : 28 }}>{fit(data.location, horizontal ? 34 : 56)}</span>}
    {data.headline && <span style={{ color, fontSize: horizontal ? 19 : 25, lineHeight: 1.2 }}>{fit(data.headline, horizontal ? 54 : 82)}</span>}
  </div>;
}
function Layout({ template, ...data }: ArtworkProps & { template: ArtworkTemplateId }) {
  const { width, height } = ARTWORK_SIZES[data.format];
  const horizontal = data.format === 'whatsapp';
  const story = data.format === 'story';
  const light = template === 'clean-branco';
  const gold = template === 'premium-escuro';
  const paddingX = horizontal ? 32 : 48;
  const paddingY = story ? 200 : horizontal ? 32 : 40;
  const gap = story ? 40 : 28;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;
  const photoWidth = horizontal ? (light ? 620 : gold ? 610 : 650) : innerWidth;
  const infoWidth = horizontal ? innerWidth - photoWidth - gap : innerWidth;
  const photoHeight = horizontal ? innerHeight : story ? 820 : 510;
  const infoHeight = horizontal ? innerHeight : innerHeight - photoHeight - gap;
  const photo = <Photo src={data.photoUrl} style={{ width: photoWidth, height: photoHeight, borderRadius: gold ? 12 : 24, border: gold ? '2px solid #c7a45b' : undefined }} />;
  const info = <div style={{ ...column, width: infoWidth, height: infoHeight, minWidth: 0, flexShrink: 0, justifyContent: 'center', borderLeft: light ? '6px solid #2563eb' : undefined, paddingLeft: light ? 24 : 0 }}>
    <Info data={data} light={light} gold={gold} />
  </div>;
  return <div style={{ display: 'flex', flexDirection: horizontal ? 'row' : 'column', width, height, boxSizing: 'border-box', padding: `${paddingY}px ${paddingX}px`, gap, background: light ? '#ffffff' : gold ? '#121212' : '#0f172a', overflow: 'hidden', fontFamily: 'sans-serif' }}>
    {light ? info : photo}
    {light ? photo : info}
  </div>;
}
export function FotoDestaqueTemplate(data: ArtworkProps) { return <Layout {...data} template="foto-destaque" />; }
export function CleanBrancoTemplate(data: ArtworkProps) { return <Layout {...data} template="clean-branco" />; }
export function PremiumEscuroTemplate(data: ArtworkProps) { return <Layout {...data} template="premium-escuro" />; }
export const ARTWORK_TEMPLATES = [
  { id: 'foto-destaque', name: 'Foto em destaque', description: 'Foto ampla e painel lateral no WhatsApp', component: FotoDestaqueTemplate },
  { id: 'clean-branco', name: 'Clean branco', description: 'Informações primeiro, fundo claro e borda azul', component: CleanBrancoTemplate },
  { id: 'premium-escuro', name: 'Premium escuro', description: 'Foto emoldurada e detalhes dourados', component: PremiumEscuroTemplate },
] as const;
export function ArtworkTemplate({ template, ...data }: ArtworkProps & { template: ArtworkTemplateId }) {
  const selected = ARTWORK_TEMPLATES.find((item) => item.id === template) ?? ARTWORK_TEMPLATES[0];
  const Template = selected.component;
  return <Template {...data} />;
}
