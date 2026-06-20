import { Platform } from 'react-native';

// ─── Paleta de cores ─────────────────────────────────────────────────────────
export const Colors = {
  // Primárias
  primary: '#2563EB',       // Azul principal
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  primarySoft: '#EFF6FF',

  // Superfícies (Light)
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',

  // Superfícies (Dark)
  backgroundDark: '#0F172A',
  surfaceDark: '#1E293B',
  surfaceElevatedDark: '#293548',
  surfaceSecondaryDark: '#162032',

  // Texto
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Texto Dark
  textDark: '#F1F5F9',
  textSecondaryDark: '#94A3B8',
  textMutedDark: '#64748B',

  // Bordas
  border: '#E2E8F0',
  borderDark: '#1E293B',
  borderStrong: '#CBD5E1',

  // Status
  success: '#16A34A',
  successSoft: '#DCFCE7',
  warning: '#D97706',
  warningSoft: '#FEF3C7',
  error: '#DC2626',
  errorSoft: '#FEE2E2',
  info: '#0EA5E9',
  infoSoft: '#E0F2FE',

  // WhatsApp
  whatsapp: '#25D366',
  whatsappSoft: 'rgba(37, 211, 102, 0.12)',

  // Destaque
  gold: '#F59E0B',
  goldSoft: '#FFFBEB',

  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.08)',

  // Transparentes
  glass: 'rgba(255,255,255,0.85)',
  glassDark: 'rgba(15,23,42,0.85)',
} as const;

// ─── Tipografia ───────────────────────────────────────────────────────────────
export const Typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),

  // Tamanhos
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,

  // Pesos
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,

  // Line heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
} as const;

// ─── Espaçamento ─────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

// ─── Bordas arredondadas ──────────────────────────────────────────────────────
export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  full: 9999,
} as const;

// ─── Sombras ──────────────────────────────────────────────────────────────────
export const Shadows = {
  none: {},
  xs: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
    },
    android: { elevation: 1 },
    default: {},
  }),
  sm: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
    },
    android: { elevation: 8 },
    default: {},
  }),
  xl: Platform.select({
    ios: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.16,
      shadowRadius: 32,
    },
    android: { elevation: 16 },
    default: {},
  }),
} as const;

// ─── Utilitários ─────────────────────────────────────────────────────────────
export function formatMoney(value: number | null | undefined): string {
  if (!value) return 'Sob consulta';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

export function formatKm(value: number | null | undefined): string {
  if (!value) return '';
  return `${value.toLocaleString('pt-BR')} km`;
}

export function getLocation(cidade: string | null, estado: string | null): string {
  if (cidade && estado) return `${cidade} • ${estado}`;
  if (estado) return estado;
  return cidade || '';
}

export function getWhatsappLink(whatsapp: string | null, titulo: string): string {
  const phone = (whatsapp || '').replace(/\D/g, '');
  const text = encodeURIComponent(`Olá, tenho interesse no caminhão ${titulo}.`);
  return phone ? `https://wa.me/${phone}?text=${text}` : '';
}

export function getTruckImage(truck_images?: Array<{ image_url: string | null; principal: boolean | null; ordem: number | null }>): string {
  if (!truck_images?.length) return '';
  const sorted = [...truck_images]
    .filter((img) => img.image_url)
    .sort((a, b) => {
      if (a.principal && !b.principal) return -1;
      if (!a.principal && b.principal) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    });
  return sorted[0]?.image_url || '';
}

export function getAnuncioTitle(titulo: string | null, marca: string | null, modelo: string | null): string {
  return titulo || `${marca || ''} ${modelo || ''}`.trim() || 'Caminhão anunciado';
}
