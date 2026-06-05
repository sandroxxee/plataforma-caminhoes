import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Implementos à venda",
  description:
    "Veja implementos rodoviários anunciados no Caminhões à Venda, incluindo carretas, caçambas, pranchas, baús, tanques e semirreboques.",
  alternates: { canonical: "/implementos" },
};

export default function ImplementosPage() {
  redirect("/anuncios?perfil=Implementos");
}
