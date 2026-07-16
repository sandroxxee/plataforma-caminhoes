export type DadosImportadosOLX = {
  titulo: string;
  preco: number | null;
  descricao: string;
  cidade: string;
  estado: string;
  imagens: string[];
  fonte: string;
};

export async function importarDaOlx(url: string): Promise<DadosImportadosOLX> {
  const res = await fetch("/api/importar-olx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erro ao importar.");
  }

  return data;
}
