// REMOVIDO — rota movida para /caminhoes/[marca]/page.tsx para evitar conflito com /anuncios/[id]
import { redirect } from "next/navigation";

export default async function RedirectMarca({ params }: { params: Promise<{ marca: string }> }) {
  const { marca } = await params;
  redirect(`/caminhoes/${marca}`);
}
