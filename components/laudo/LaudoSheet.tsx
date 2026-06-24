import { styles, fotosObrigatorias, today } from "./laudoStyles";
import type { LaudoTruck } from "../AdminLaudoComercialClient";

type Props = {
  truck: LaudoTruck;
  valorAvaliado: string;
  placa: string;
  renavam: string;
  chassi: string;
  conservacao: string;
  motivo: string;
  checkFotos: string[];
  documento: string;
  documentoNome: string;
  fotosLaudo: string[];
  detalhes: string;
  justificativa: string;
  assinatura: string;
  responsavel: string;
  whatsapp: string;
};

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.infoBox}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValue}>{value}</strong>
    </div>
  );
}

export function LaudoSheet({
  truck, valorAvaliado, placa, renavam, chassi, conservacao, motivo,
  checkFotos, documento, documentoNome, fotosLaudo,
  detalhes, justificativa, assinatura, responsavel, whatsapp,
}: Props) {
  return (
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
          <Info label="Motivo" value={motivo} />
          <Info label="Data" value={today()} />
        </div>

        <h2 style={styles.sectionTitle}>2. Checklist fotográfico</h2>
        <div style={styles.photoChecklist}>
          {fotosObrigatorias.map((item) => (
            <span key={item} style={checkFotos.includes(item) ? styles.checkedPill : styles.uncheckedPill}>
              {checkFotos.includes(item) ? "✓" : "○"} {item}
            </span>
          ))}
        </div>

        <h2 style={styles.sectionTitle}>3. Documento do caminhão</h2>
        <div style={styles.documentBox}>
          {documento
            ? <img src={documento} alt="Documento do caminhão" style={styles.documentImage} />
            : documentoNome
              ? <strong>Documento anexado: {documentoNome}</strong>
              : <span>Espaço reservado para CRLV, ATPV-e, comprovante ou documento do caminhão.</span>
          }
        </div>

        <h2 style={styles.sectionTitle}>4. Registro fotográfico</h2>
        <div style={styles.photoGrid}>
          {fotosLaudo.length > 0
            ? fotosLaudo.map((foto, index) => (
                <figure key={`${foto}-${index}`} style={styles.figure}>
                  <img src={foto} alt={`Foto do caminhão ${index + 1}`} style={styles.photo} />
                  <figcaption style={styles.caption}>Foto {index + 1}</figcaption>
                </figure>
              ))
            : <div style={styles.emptyPhoto}>Nenhuma foto adicionada.</div>
          }
        </div>

        <h2 style={styles.sectionTitle}>5. Características e estado operacional</h2>
        <p style={styles.paragraph}>{detalhes}</p>

        <h2 style={styles.sectionTitle}>6. Fundamentação do valor comercial</h2>
        <p style={styles.paragraph}>{justificativa}</p>

        <p style={styles.notice}>
          <strong>Observação:</strong> este documento tem finalidade comercial e mercadológica. Não substitui vistoria cautelar, perícia judicial, laudo técnico de engenharia, consulta oficial de restrições ou exigência específica de uma instituição financeira.
        </p>

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
  );
}
