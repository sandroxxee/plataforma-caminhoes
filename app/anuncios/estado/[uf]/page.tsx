import { redirect } from "next/navigation";

export default async function RedirectEstado({ params }: { params: Promise<{ uf: string }> }) {
  const { uf } = await params;
  redirect(`/caminhoes/estado/${uf}`);
}
