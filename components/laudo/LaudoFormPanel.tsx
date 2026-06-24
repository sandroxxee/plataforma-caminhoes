"use client";

import type { ChangeEvent } from "react";
import { styles, motivos, fotosObrigatorias } from "./laudoStyles";

type Props = {
  valorAvaliado: string;
  setValorAvaliado: (v: string) => void;
  motivo: string;
  setMotivo: (v: string) => void;
  placa: string;
  setPlaca: (v: string) => void;
  renavam: string;
  setRenavam: (v: string) => void;
  chassi: string;
  setChassi: (v: string) => void;
  conservacao: string;
  setConservacao: (v: string) => void;
  checkFotos: string[];
  toggleFoto: (item: string) => void;
  detalhes: string;
  setDetalhes: (v: string) => void;
  justificativa: string;
  setJustificativa: (v: string) => void;
  responsavel: string;
  setResponsavel: (v: string) => void;
  whatsapp: string;
  setWhatsapp: (v: string) => void;
  assinatura: string;
  setAssinatura: (v: string) => void;
  onDocumento: (e: ChangeEvent<HTMLInputElement>) => void;
  onFotos: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function LaudoFormPanel({
  valorAvaliado, setValorAvaliado,
  motivo, setMotivo,
  placa, setPlaca,
  renavam, setRenavam,
  chassi, setChassi,
  conservacao, setConservacao,
  checkFotos, toggleFoto,
  detalhes, setDetalhes,
  justificativa, setJustificativa,
  responsavel, setResponsavel,
  whatsapp, setWhatsapp,
  assinatura, setAssinatura,
  onDocumento, onFotos,
}: Props) {
  return (
    <section style={styles.formCard} className="no-print">
      <h2 style={styles.formTitle}>Preenchimento manual do laudo</h2>
      <p style={styles.helpText}>Os dados do anúncio entram como base. Complete valor, motivo, documento, fotos, justificativa e assinatura antes de salvar em PDF.</p>

      <div style={styles.formGrid}>
        <label style={styles.label}>Valor comercial avaliado<input style={styles.input} value={valorAvaliado} onChange={(e) => setValorAvaliado(e.target.value)} /></label>
        <label style={styles.label}>Motivo da avaliação<select style={styles.input} value={motivo} onChange={(e) => setMotivo(e.target.value)}>{motivos.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label style={styles.label}>Placa<input style={styles.input} value={placa} onChange={(e) => setPlaca(e.target.value)} /></label>
        <label style={styles.label}>RENAVAM<input style={styles.input} value={renavam} onChange={(e) => setRenavam(e.target.value)} /></label>
        <label style={styles.label}>Chassi<input style={styles.input} value={chassi} onChange={(e) => setChassi(e.target.value)} /></label>
        <label style={styles.label}>Estado de conservação
          <select style={styles.input} value={conservacao} onChange={(e) => setConservacao(e.target.value)}>
            <option>Bom estado operacional, com sinais normais de uso</option>
            <option>Muito bom estado de conservação</option>
            <option>Excelente estado operacional</option>
            <option>Regular, com necessidade de reparos</option>
          </select>
        </label>
      </div>

      <div style={styles.checkCard}>
        <strong style={styles.checkTitle}>Fotos conferidas no laudo</strong>
        <div style={styles.checkGrid}>
          {fotosObrigatorias.map((item) => (
            <label key={item} style={styles.checkItem}>
              <input type="checkbox" checked={checkFotos.includes(item)} onChange={() => toggleFoto(item)} /> {item}
            </label>
          ))}
        </div>
      </div>

      <label style={styles.label}>Detalhes técnicos e comerciais<textarea style={styles.textarea} value={detalhes} onChange={(e) => setDetalhes(e.target.value)} /></label>
      <label style={styles.label}>Frase explicando o valor de mercado<textarea style={styles.textarea} value={justificativa} onChange={(e) => setJustificativa(e.target.value)} /></label>
      <label style={styles.label}>Documento do caminhão / CRLV / ATPV-e / comprovante<input style={styles.input} type="file" accept="image/*,.pdf" onChange={onDocumento} /></label>
      <label style={styles.label}>Adicionar fotos manualmente ao laudo<input style={styles.input} type="file" accept="image/*" multiple onChange={onFotos} /></label>

      <div style={styles.formGrid}>
        <label style={styles.label}>Responsável / empresa<input style={styles.input} value={responsavel} onChange={(e) => setResponsavel(e.target.value)} /></label>
        <label style={styles.label}>WhatsApp<input style={styles.input} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} /></label>
      </div>
      <label style={styles.label}>Assinatura visual<input style={styles.input} value={assinatura} onChange={(e) => setAssinatura(e.target.value)} /></label>
      <button type="button" style={styles.printButton} onClick={() => window.print()}>Imprimir / Salvar PDF</button>
    </section>
  );
}
