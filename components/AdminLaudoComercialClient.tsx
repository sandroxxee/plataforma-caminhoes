"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";

type TruckImage = {
  image_url: string | null;
  principal: boolean | null;
  ordem: number | null;
};

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

type Props = {
  truck: LaudoTruck;
};

function money(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function sortedImages(images?: TruckImage[]) {
  return [...(images || [])]
    .filter((image) => image.image_url)
    .sort((a, b) => {
      if (a.principal && !b.principal) return -1;
      if (!a.principal && b.principal) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    })
    .map((image) => image.image_url as string);
}

function today() {
  return new Date().toLocaleDateString("pt-BR");
}

export function AdminLaudoComercialClient({ truck }: Props) {
  const imagensDoAnuncio = useMemo(() => sortedImages(truck.truck_images), [truck.truck_images]);
  const [valorAvaliado, setValorAvaliado] = useState(money(truck.preco));
  const [placa, setPlaca] = useState("Informar placa");
  const [renavam, setRenavam] = useState("Informar RENAVAM");
  const [chassi, setChassi] = useState("Informar chassi");
  const [conservacao, setConservacao] = useState("Bom estado operacional, com sinais normais de uso");
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

  function handleFotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, 8);
    if (files.length === 0) return;

    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.readAsDataURL(file);
          })
      )
    ).then(setFotosManuais);
  }

  function handleDocumento(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setDocumentoNome(file.name);

    if (!file.type.startsWith("image/")) {
      setDocumento("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setDocumento(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  return (
    <div style={styles.wrapper}>
      <section style={styles.formCard} className="no-print">
        <h2 style={styles.formTitle}>Preenchimento manual do laudo</h2>
        <p style={styles.helpText}>Os dados do anúncio já entram como base. Você completa valor, documento, fotos, justificativa e assinatura antes de salvar em PDF.</p>

        <div style={styles.formGrid}>
          <label style={styles.label}>Valor comercial avaliado
            <input style={styles.input} value={valorAvaliado} onChange={(event) => setValorAvaliado(event.target.value)} />
          </label>
          <label style={styles.label}>Placa
            <input style={styles.input} value={placa} onChange={(event) => setPlaca(event.target.value)} />
          </label>
          <label style={styles.label}>RENAVAM
            <input style={styles.input} value={renavam} onChange={(event) => setRenavam(event.target.value)} />
          </label>
          <label style={styles.label}>Chassi
            <input style={styles.input} value={chassi} onChange={(event) => setChassi(event.target.value)} />
          </label>
        </div>

        <label style={styles.label}>Estado de conservação
          <select style={styles.input} value={conservacao} onChange={(event) => setConservacao(event.target.value)}>
            <option>Bom estado operacional, com sinais normais de uso</option>
            <option>Muito bom estado de conservação</option>
            <option>Excelente estado operacional</option>
            <option>Regular, com necessidade de reparos</option>
          </select>
        </label>

        <label style={styles.label}>Detalhes técnicos e comerciais
          <textarea style={styles.textarea} value={detalhes} onChange={(event) => setDetalhes(event.target.value)} />
        </label>

        <label style={styles.label}>Frase explicando o valor de mercado
          <textarea style={styles.textarea} value={justificativa} onChange={(event) => setJustificativa(event.target.value)} />
        </label>

        <label style={styles.label}>Documento do caminhão / CRLV / ATPV-e / comprovante
          <input style={styles.input} type="file" accept="image/*,.pdf" onChange={handleDocumento} />
        </label>

        <label style={styles.label}>Adicionar fotos manualmente ao laudo
          <input style={styles.input} type="file" accept="image/*" multiple onChange={handleFotos} />
        </label>

        <div style={styles.formGrid}>
          <label style={styles.label}>Responsável / empresa
            <input style={styles.input} value={responsavel} onChange={(event) => setResponsavel(event.target.value)} />
          </label>
          <label style={styles.label}>WhatsApp
            <input style={styles.input} value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} />
          </label>
        </div>

        <label style={styles.label}>Assinatura visual
          <input style={styles.input} value={assinatura} onChange={(event) => setAssinatura(event.target.value)} />
        </label>

        <button type="button" style={styles.printButton} onClick={() => window.print()}>
          Imprimir / Salvar PDF
        </button>
      </section>

      <section style={styles.sheet}>
        <header style={styles.sheetHeader}>
          <div>
            <strong style={styles.brand}>Caminhões à Venda</strong>
            <h1 style={styles.title}>Laudo Comercial de Avaliação Mercadológica</h1>
            <p style={styles.subtitle}>Documento comercial para apoio em venda, troca, negociação ou análise de crédito.</p>
          </div>
          <div style={styles.badge}>Avaliação<br />Comercial</div>
        </header>

        <div style={styles.sheetBody}>
          <div style={styles.valueBox}>
            <div>
              <span style={styles.valueLabel}>Valor comercial avaliado</span>
              <p style={styles.valueText}>Baseado nas condições informadas, fotos, mercado e conjunto operacional.</p>
            </div>
            <strong style={styles.value}>{valorAvaliado}</strong>
          </div>

          <h2 style={styles.sectionTitle}>1. Identificação do veículo</h2>
          <div style={styles.infoGrid}>
            <Info label="Título" value={truck.titulo || "Anúncio sem título"} />
            <Info label="Marca" value={truck.marca || "Não informado"} />
            <Info label="Modelo" value={truck.modelo || "Não informado"} />
            <Info label="Ano" value={truck.ano_modelo ? String(truck.ano_modelo) : "Não informado"} />
            <Info label="Carroceria" value={truck.carroceria || "Não informado"} />
            <Info label="Tração" value={truck.tracao || "Não informado"} />
            <Info label="Cidade/UF" value={`${truck.cidade || "Não informado"}/${truck.estado || ""}`} />
            <Info label="Placa" value={placa} />
            <Info label="RENAVAM" value={renavam} />
            <Info label="Chassi" value={chassi} />
            <Info label="Conservação" value={conservacao} />
            <Info label="Data" value={today()} />
          </div>

          <h2 style={styles.sectionTitle}>2. Documento do caminhão</h2>
          <div style={styles.documentBox}>
            {documento ? <img src={documento} alt="Documento do caminhão" style={styles.documentImage} /> : documentoNome ? <strong>Documento anexado: {documentoNome}</strong> : <span>Espaço reservado para CRLV, ATPV-e, comprovante ou documento do caminhão.</span>}
          </div>

          <h2 style={styles.sectionTitle}>3. Registro fotográfico</h2>
          <div style={styles.photoGrid}>
            {fotosLaudo.length > 0 ? fotosLaudo.map((foto, index) => (
              <figure key={`${foto}-${index}`} style={styles.figure}>
                <img src={foto} alt={`Foto do caminhão ${index + 1}`} style={styles.photo} />
                <figcaption style={styles.caption}>Foto {index + 1}</figcaption>
              </figure>
            )) : <div style={styles.emptyPhoto}>Nenhuma foto adicionada.</div>}
          </div>

          <h2 style={styles.sectionTitle}>4. Características e estado operacional</h2>
          <p style={styles.paragraph}>{detalhes}</p>

          <h2 style={styles.sectionTitle}>5. Fundamentação do valor comercial</h2>
          <p style={styles.paragraph}>{justificativa}</p>
          <p style={styles.notice}><strong>Observação:</strong> este documento tem finalidade comercial e mercadológica. Não substitui vistoria cautelar, perícia judicial, laudo técnico de engenharia, consulta oficial de restrições ou exigência específica de uma instituição financeira.</p>

          <div style={styles.signatureGrid}>
            <div>
              <div style={styles.signatureBox}>{assinatura}</div>
              <div style={styles.signatureLine}><strong>{responsavel}</strong><br />Responsável pela avaliação comercial</div>
            </div>
            <div>
              <div style={styles.blankSignature}></div>
              <div style={styles.signatureLine}>Cliente / Proprietário<br />Assinatura ou ciência das informações</div>
            </div>
          </div>

          <footer style={styles.footer}>
            <span>WhatsApp: {whatsapp}</span>
            <span>www.caminhoesavenda.com.br</span>
          </footer>
        </div>
      </section>

      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .admin-sidebar, .admin-header { display: none !important; }
          .admin-page { display: block !important; background: white !important; }
          .admin-content { padding: 0 !important; }
          .admin-body { overflow: visible !important; }
          section { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.infoBox}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValue}>{value}</strong>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: { display: "grid", gridTemplateColumns: "420px minmax(0, 1fr)", gap: 20, alignItems: "start" },
  formCard: { padding: 18, borderRadius: 22, background: "#1f2327", border: "1px solid #343a40", boxShadow: "0 16px 34px rgba(0,0,0,.18)" },
  formTitle: { margin: 0, color: "#f4f4f5", fontSize: 22 },
  helpText: { margin: "8px 0 16px", color: "#a7afb7", lineHeight: 1.45 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  label: { display: "grid", gap: 7, marginTop: 12, color: "#cbd5df", fontWeight: 800, fontSize: 13 },
  input: { width: "100%", border: "1px solid #343a40", background: "#111315", color: "#f4f4f5", borderRadius: 12, padding: 12, font: "inherit" },
  textarea: { width: "100%", minHeight: 105, border: "1px solid #343a40", background: "#111315", color: "#f4f4f5", borderRadius: 12, padding: 12, font: "inherit", resize: "vertical" },
  printButton: { width: "100%", marginTop: 16, border: 0, borderRadius: 14, padding: "14px 16px", background: "#f59e0b", color: "#1f1300", fontWeight: 900, cursor: "pointer", fontSize: 15 },
  sheet: { background: "#ffffff", color: "#151515", borderRadius: 18, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.35)" },
  sheetHeader: { display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", padding: 26, background: "linear-gradient(135deg,#070707,#1d1d1d 62%,#563006)", color: "#ffffff" },
  brand: { color: "#f5a623", textTransform: "uppercase", letterSpacing: ".08em", fontSize: 13 },
  title: { margin: "8px 0 6px", fontSize: 30, lineHeight: 1.05, letterSpacing: "-.035em" },
  subtitle: { margin: 0, color: "#d6d6d6", lineHeight: 1.45 },
  badge: { border: "1px solid rgba(255,255,255,.25)", color: "#ffd38a", padding: "12px 14px", borderRadius: 14, fontWeight: 900, textAlign: "right" },
  sheetBody: { padding: 26 },
  valueBox: { display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", padding: 18, borderRadius: 16, border: "2px solid #d89b32", background: "#fff8eb", marginBottom: 20 },
  valueLabel: { display: "block", fontSize: 13, color: "#654000", fontWeight: 900, textTransform: "uppercase" },
  valueText: { margin: "6px 0 0", color: "#5b5b5b", lineHeight: 1.4 },
  value: { color: "#b75d00", fontSize: 34, whiteSpace: "nowrap" },
  sectionTitle: { margin: "22px 0 12px", fontSize: 19, color: "#111111" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  infoBox: { minHeight: 70, padding: 12, borderRadius: 12, background: "#f5f5f5", border: "1px solid #dddddd" },
  infoLabel: { display: "block", color: "#666666", fontWeight: 900, fontSize: 11, textTransform: "uppercase", marginBottom: 5 },
  infoValue: { display: "block", color: "#1f1f1f", lineHeight: 1.25 },
  documentBox: { minHeight: 140, display: "grid", placeItems: "center", padding: 16, borderRadius: 14, background: "#fafafa", border: "2px dashed #b9b9b9", color: "#666666", textAlign: "center" },
  documentImage: { maxWidth: "100%", maxHeight: 430, borderRadius: 10, objectFit: "contain" },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  figure: { margin: 0, borderRadius: 14, overflow: "hidden", border: "1px solid #dddddd", background: "#f7f7f7" },
  photo: { width: "100%", height: 175, objectFit: "cover", display: "block" },
  caption: { padding: 8, color: "#666666", fontWeight: 800, fontSize: 12, textAlign: "center" },
  emptyPhoto: { padding: 18, borderRadius: 12, border: "1px dashed #cccccc", color: "#777777" },
  paragraph: { color: "#252525", lineHeight: 1.65, fontSize: 15, margin: 0 },
  notice: { margin: "14px 0 0", padding: 14, borderRadius: 14, background: "#fff8eb", border: "1px solid #efd39f", color: "#4a3922", lineHeight: 1.55 },
  signatureGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 34, alignItems: "end" },
  signatureBox: { height: 88, borderRadius: 12, border: "1px dashed #999999", display: "grid", placeItems: "center", color: "#333333", fontFamily: "cursive", fontSize: 24, marginBottom: 8 },
  blankSignature: { height: 88, marginBottom: 8 },
  signatureLine: { borderTop: "1px solid #333333", paddingTop: 8, textAlign: "center", color: "#333333", fontSize: 13, lineHeight: 1.35 },
  footer: { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 22, paddingTop: 12, borderTop: "1px solid #dddddd", color: "#555555", fontSize: 12, fontWeight: 800 },
};
