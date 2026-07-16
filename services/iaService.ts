export type SugestaoAnuncio = {
  marca?: string;
  modelo?: string;
  ano?: string;
  preco?: string;
  cidade?: string;
  estado?: string;
  carroceria?: string;
  tracao?: string;
  whatsapp?: string;
  descricao?: string;
  conservacao?: string;
  observacoes?: string[];
};

export async function preencherComIa(texto: string, tipo_anuncio: string = "Caminhão"): Promise<SugestaoAnuncio> {
  const response = await fetch("/api/anuncios/preencher-ia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto, tipo_anuncio }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.erro || "Não foi possível preencher o anúncio agora.");
  }

  return data?.sugestao || {};
}
