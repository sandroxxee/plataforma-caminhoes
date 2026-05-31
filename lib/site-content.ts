export type HomeContent = {
  heroMini: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  trust1Title: string;
  trust1Text: string;
  trust2Title: string;
  trust2Text: string;
  trust3Title: string;
  trust3Text: string;
  trust4Title: string;
  trust4Text: string;
  buyerTitle: string;
  buyerText: string;
  sellerTitle: string;
  sellerText: string;
  securityTitle: string;
  securityText: string;
  sellMini: string;
  sellTitle: string;
  sellText: string;
  finalMini: string;
  finalTitle: string;
};

export const defaultHomeContent: HomeContent = {
  heroMini: "",
  heroTitle: "Encontre caminhões com informação clara e contato direto.",
  heroSubtitle:
    "Veja valor, cidade, configuração e chame no WhatsApp para confirmar disponibilidade, pedir fotos, vídeo e negociar.",
  primaryButtonText: "Ver caminhões",
  primaryButtonHref: "/anuncios",
  secondaryButtonText: "Anunciar caminhão",
  secondaryButtonHref: "/anunciar",
  trust1Title: "Contato direto",
  trust1Text: "Negociação pelo WhatsApp",
  trust2Title: "Anúncios claros",
  trust2Text: "Valor, cidade e configuração",
  trust3Title: "Mais visibilidade",
  trust3Text: "Para quem quer vender",
  trust4Title: "Estoque organizado",
  trust4Text: "Leitura rápida no celular",
  buyerTitle: "Para quem compra",
  buyerText: "Informação objetiva antes de chamar. Menos enrolação e mais clareza.",
  sellerTitle: "Para quem vende",
  sellerText: "Vitrine organizada para divulgar melhor o caminhão e gerar contato.",
  securityTitle: "Mais segurança",
  securityText: "Informação objetiva, contato humano e anúncio com aparência profissional.",
  sellMini: "Anunciar caminhão",
  sellTitle: "Venda com mais apresentação.",
  sellText:
    "Um anúncio bem organizado passa mais confiança e ajuda o comprador chamar já sabendo o básico do caminhão.",
  finalMini: "Caminhões à venda",
  finalTitle: "Veja o estoque completo ou anuncie seu caminhão.",
};

export function mergeHomeContent(content: unknown): HomeContent {
  if (!content || typeof content !== "object") return defaultHomeContent;

  const raw = content as Partial<Record<keyof HomeContent, unknown>>;
  const merged = { ...defaultHomeContent };

  (Object.keys(defaultHomeContent) as (keyof HomeContent)[]).forEach((key) => {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) {
      merged[key] = value.trim();
    }
  });

  return merged;
}

export async function getHomeContent(supabase: any): Promise<HomeContent> {
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", "home")
    .maybeSingle();

  return mergeHomeContent(data?.content);
}
