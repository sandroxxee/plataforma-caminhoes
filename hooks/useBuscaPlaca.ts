import { useState, useCallback } from "react";

export type DadosPlaca = {
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  municipio: string;
  uf: string;
  combustivel: string;
};

type Estado =
  | { status: "idle" }
  | { status: "carregando" }
  | { status: "sucesso"; dados: DadosPlaca }
  | { status: "erro"; mensagem: string };

export function useBuscaPlaca() {
  const [estado, setEstado] = useState<Estado>({ status: "idle" });

  const buscar = useCallback(async (placa: string) => {
    if (!placa || placa.length < 7) return;

    setEstado({ status: "carregando" });

    try {
      const res = await fetch(`/api/consulta-placa?placa=${placa}`);
      const json = await res.json();

      if (!res.ok) {
        setEstado({ status: "erro", mensagem: json.error || "Erro desconhecido" });
        return;
      }

      setEstado({ status: "sucesso", dados: json });
    } catch {
      setEstado({ status: "erro", mensagem: "Falha na conexão. Tente novamente." });
    }
  }, []);

  const resetar = useCallback(() => setEstado({ status: "idle" }), []);

  return { estado, buscar, resetar };
}
