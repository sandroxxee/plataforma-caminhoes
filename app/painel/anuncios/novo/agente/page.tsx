import AgentChat from "@/components/AgentChat";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assistente de Anuncio | Caminhoes a Venda",
  description: "Crie seu anuncio respondendo algumas perguntas rapidas.",
  robots: { index: false, follow: false },
};

export default function AgenteAnuncioPage() {
  return (
    <main style={{ padding: "24px 16px", minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Criar anuncio com assistente
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: "6px 0 0" }}>
            Responda as perguntas abaixo e seu anuncio sera criado automaticamente.
          </p>
        </div>
        <AgentChat variant="anuncio" />
      </div>
    </main>
  );
}
