import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { criarAnuncio } from "../actions";

export const dynamic = "force-dynamic";

const marcas = ["Mercedes-Benz", "Scania", "Volvo", "Volkswagen", "Ford", "Iveco", "DAF"];
const carrocerias = [
  "Caçamba basculante",
  "Caçamba meia-cana",
  "Prancha",
  "Plataforma",
  "Baú seco",
  "Baú frigorífico",
  "Cavalo mecânico",
  "Munck",
  "Outra",
];
const tracoes = ["4x2", "6x2", "6x4", "8x2", "8x4", "Truck", "Bitruck", "Traçado"];
const estados = ["SC", "PR", "RS", "SP", "MG", "MS", "MT", "GO", "BA", "RJ", "ES", "Outro"];

export default async function NovoAnuncioPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <PanelLayout
      title="Cadastrar caminhão"
      subtitle="Preencha só o essencial. O título será criado automaticamente com marca, modelo, tração e ano."
      badge="Novo anúncio"
      actions={<Link href="/painel/anuncios" style={styles.secondaryButton}>Voltar</Link>}
    >
      <form action={criarAnuncio} style={styles.formCard}>
        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Marca *</label>
            <select style={styles.input} name="marca" required defaultValue="">
              <option value="" disabled>Selecione a marca</option>
              {marcas.map((marca) => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Modelo *</label>
            <input style={styles.input} name="modelo" placeholder="Ex: 113, P420, FH 540, 24-280" required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Ano *</label>
            <input style={styles.input} name="ano" type="number" placeholder="Ex: 1995" required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Valor *</label>
            <input style={styles.input} name="preco" type="number" placeholder="Ex: 180000" required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Cidade *</label>
            <input style={styles.input} name="cidade" placeholder="Ex: Xanxerê" required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Estado *</label>
            <select style={styles.input} name="estado" defaultValue="SC" required>
              {estados.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Carroceria *</label>
            <select style={styles.input} name="carroceria" required defaultValue="">
              <option value="" disabled>Selecione a carroceria</option>
              {carrocerias.map((carroceria) => (
                <option key={carroceria} value={carroceria}>{carroceria}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Tração *</label>
            <select style={styles.input} name="tracao" required defaultValue="">
              <option value="" disabled>Selecione a tração</option>
              {tracoes.map((tracao) => (
                <option key={tracao} value={tracao}>{tracao}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>WhatsApp *</label>
            <input style={styles.input} name="whatsapp" placeholder="Ex: 5549999362681" required />
          </div>

          <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <label style={styles.label}>Descrição</label>
            <textarea
              style={{ ...styles.input, minHeight: 130, resize: "vertical" }}
              name="descricao"
              placeholder="Ex: Caminhão conservado, mecânica em dia, pronto para trabalhar."
            />
          </div>

          <div style={{ ...styles.uploadBox, gridColumn: "1 / -1" }}>
            <div>
              <strong style={styles.uploadTitle}>Fotos do caminhão</strong>
              <p style={styles.helpText}>
                Envie uma foto principal e fotos extras. Use fotos reais e nítidas do caminhão.
              </p>
            </div>

            <div style={styles.photoGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Foto principal</label>
                <input
                  style={styles.fileInput}
                  name="foto_principal"
                  type="file"
                  accept="image/*"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Fotos extras</label>
                <input
                  style={styles.fileInput}
                  name="fotos_extras"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>
            </div>
          </div>
        </div>

        <div style={styles.previewBox}>
          <strong>Prévia do título automático:</strong>
          <span>Marca + Modelo + Tração + Ano</span>
        </div>

        <div style={styles.footer}>
          <p style={styles.helpText}>
            Ao enviar, o anúncio fica pendente até aprovação do administrador.
          </p>
          <button style={styles.primaryButton} type="submit">Enviar para aprovação</button>
        </div>
      </form>
    </PanelLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  formCard: {
    padding: 26,
    borderRadius: 24,
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.10)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
  },
  field: { display: "grid", gap: 8 },
  label: { color: "#cbd5e1", fontWeight: 800, fontSize: 13 },
  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(15,23,42,.78)",
    color: "white",
    outline: "none",
  },
  fileInput: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 14,
    border: "1px dashed rgba(34,197,94,.45)",
    background: "rgba(15,23,42,.78)",
    color: "#cbd5e1",
    outline: "none",
  },
  uploadBox: {
    padding: 20,
    borderRadius: 20,
    background: "rgba(34,197,94,.08)",
    border: "1px solid rgba(34,197,94,.20)",
  },
  uploadTitle: { color: "white", fontSize: 18 },
  photoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
    marginTop: 16,
  },
  previewBox: {
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    background: "rgba(15,23,42,.60)",
    border: "1px solid rgba(255,255,255,.10)",
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    color: "#cbd5e1",
  },
  footer: {
    marginTop: 22,
    paddingTop: 18,
    borderTop: "1px solid rgba(255,255,255,.10)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  helpText: { color: "#a7b5c7", margin: 0, lineHeight: 1.6 },
  primaryButton: {
    border: 0,
    padding: "13px 18px",
    borderRadius: 14,
    background: "#22c55e",
    color: "#052e16",
    fontWeight: 900,
    cursor: "pointer",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "11px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.15)",
    background: "rgba(255,255,255,.06)",
    color: "white",
    textDecoration: "none",
    fontWeight: 800,
  },
};
