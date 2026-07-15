"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { money, fotosObrigatorias } from "./laudo/laudoStyles";
import { LaudoFormPanel } from "./laudo/LaudoFormPanel";
import { LaudoSheet } from "./laudo/LaudoSheet";
import { styles } from "./laudo/laudoStyles";

type TruckImage = { image_url: string | null; principal: boolean | null; ordem: number | null };

export type LaudoTruck = {
  id: string;
  titulo: string | null;
  marca: string | null;
  modelo: string | null;
  ano_modelo: number | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
  carroceria: string | null;
  tracao: string | null;
  whatsapp: string | null;
  descricao: string | null;
  truck_images?: TruckImage[];
};

type Props = { truck: LaudoTruck };

import { formatImageUrl } from "@/lib/truck-utils";

function sortedImages(images?: TruckImage[]) {
  return [...(images || [])]
    .filter((image) => image.image_url)
    .sort((a, b) => {
      if (a.principal && !b.principal) return -1;
      if (!a.principal && b.principal) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    })
    .map((image) => formatImageUrl(image.image_url))
    .filter((url): url is string => Boolean(url));
}

export function AdminLaudoComercialClient({ truck }: Props) {
  const imagensDoAnuncio = useMemo(() => sortedImages(truck.truck_images), [truck.truck_images]);

  const [valorAvaliado, setValorAvaliado] = useState(money(truck.preco));
  const [placa, setPlaca] = useState("Informar placa");
  const [renavam, setRenavam] = useState("Informar RENAVAM");
  const [chassi, setChassi] = useState("Informar chassi");
  const [motivo, setMotivo] = useState("Avaliação mercadológica");
  const [conservacao, setConservacao] = useState("Bom estado operacional, com sinais normais de uso");
  const [checkFotos, setCheckFotos] = useState<string[]>(["Frente", "Traseira", "Lateral esquerda", "Lateral direita", "Documento"]);
  const [detalhes, setDetalhes] = useState(
    truck.descricao ||
      "Descrever motor, câmbio, freios, direção, pneus, implemento instalado, documentação, funcionamento e pontos que valorizam o conjunto operacional."
  );
  const [justificativa, setJustificativa] = useState(
    "O valor comercial estimado considera o conjunto operacional do caminhão, estado de conservação, documentação apresentada, características mecânicas, implemento instalado, liquidez de mercado e valores praticados para veículos similares em condições equivalentes."
  );
  const [assinatura, setAssinatura] = useState("Caminhões à Venda");
  const [responsavel, setResponsavel] = useState("Caminhões à Venda");
  const [whatsapp, setWhatsapp] = useState(truck.whatsapp || "49 9 9936-2681");
  const [documento, setDocumento] = useState<string>("");
  const [documentoNome, setDocumentoNome] = useState("");
  const [fotosManuais, setFotosManuais] = useState<string[]>([]);

  const fotosLaudo = fotosManuais.length > 0 ? fotosManuais : imagensDoAnuncio.slice(0, 6);

  function toggleFoto(item: string) {
    setCheckFotos((current) =>
      current.includes(item) ? current.filter((foto) => foto !== item) : [...current, item]
    );
  }

  function handleFotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, 8);
    if (files.length === 0) return;
    Promise.all(
      files.map((file) => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.readAsDataURL(file);
      }))
    ).then(setFotosManuais);
  }

  function handleDocumento(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setDocumentoNome(file.name);
    if (!file.type.startsWith("image/")) { setDocumento(""); return; }
    const reader = new FileReader();
    reader.onload = () => setDocumento(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  return (
    <div style={styles.wrapper}>
      <LaudoFormPanel
        valorAvaliado={valorAvaliado} setValorAvaliado={setValorAvaliado}
        motivo={motivo} setMotivo={setMotivo}
        placa={placa} setPlaca={setPlaca}
        renavam={renavam} setRenavam={setRenavam}
        chassi={chassi} setChassi={setChassi}
        conservacao={conservacao} setConservacao={setConservacao}
        checkFotos={checkFotos} toggleFoto={toggleFoto}
        detalhes={detalhes} setDetalhes={setDetalhes}
        justificativa={justificativa} setJustificativa={setJustificativa}
        responsavel={responsavel} setResponsavel={setResponsavel}
        whatsapp={whatsapp} setWhatsapp={setWhatsapp}
        assinatura={assinatura} setAssinatura={setAssinatura}
        onDocumento={handleDocumento}
        onFotos={handleFotos}
      />
      <LaudoSheet
        truck={truck}
        valorAvaliado={valorAvaliado}
        placa={placa} renavam={renavam} chassi={chassi}
        conservacao={conservacao} motivo={motivo}
        checkFotos={checkFotos}
        documento={documento} documentoNome={documentoNome}
        fotosLaudo={fotosLaudo}
        detalhes={detalhes} justificativa={justificativa}
        assinatura={assinatura} responsavel={responsavel} whatsapp={whatsapp}
      />
      <style>{`@media(max-width:1100px){.laudo-wrapper{display:block}}@media print{body{background:white!important}.no-print{display:none!important}.admin-sidebar,.admin-header{display:none!important}.admin-page{display:block!important;background:white!important}.admin-content{padding:0!important}.admin-body{overflow:visible!important}section{box-shadow:none!important}}`}</style>
    </div>
  );
}
