import Link from "next/link";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { editarAnuncio } from "../../actions";

export const dynamic = "force-dynamic";

const marcas = ["Mercedes-Benz", "Scania", "Volvo", "Volkswagen", "Ford", "Iveco", "DAF"];
const carrocerias = ["Caçamba basculante", "Caçamba meia-cana", "Graneleira", "Chassis", "Tanque", "Prancha", "Plataforma", "Baú seco", "Baú frigorífico", "Cavalo mecânico", "Munck", "Outra"];
const tracoes = ["4x2", "6x2", "6x4", "8x2", "8x4", "Truck", "Bitruck", "Traçado"];
const estados = ["SC", "PR", "RS", "SP", "MG", "MS", "MT", "GO", "BA", "RJ", "ES", "Outro"];

type PageProps = { params: Promise<{ id: string }> };

export default async function EditarAnuncioPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin";

  let query = supabase
    .from("trucks")
    .select("id, user_id, marca, modelo, ano_modelo, preco, quilometragem, cidade, estado, carroceria, tracao, whatsapp, descricao, status, abaixo_fipe")
    .eq("id", id);

  if (!isAdmin) {
    query = query.eq("user_id", user.id);
  }

  const { data: truck } = await query.single();

  if (!truck) redirect("/painel/anuncios");

  const abaixoFipe = (truck as any).abaixo_fipe === true;

  return (
    <PanelLayout
      title="Editar anúncio"
      subtitle="Revise as informações do caminhão e salve as alterações com segurança."
      badge="Edição"
      actions={<Link href={isAdmin ? "/admin/anuncios" : "/painel/anuncios"} style={styles.secondaryButton}>Voltar</Link>}
    >
      <form action={editarAnuncio} style={styles.formCard} encType="multipart/form-data">
        <input type="hidden" name="id" value={truck.id} />

        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Marca *</label>
            <select style={styles.input} name="marca" required defaultValue={truck.marca || ""}>
              {marcas.map((marca) => <option key={marca} value={marca}>{marca}</option>)}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Modelo *</label>
            <input style={styles.input} name="modelo" defaultValue={truck.modelo || ""} required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Ano *</label>
            <input style={styles.input} name="ano" type="number" defaultValue={truck.ano_modelo || ""} required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Valor *</label>
            <input style={styles.input} name="preco" type="number" defaultValue={truck.preco || ""} required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Quilometragem <span style={styles.optionalTag}>(opcional)</span></label>
            <input style={styles.input} name="quilometragem" type="number" defaultValue={(truck as any).quilometragem || ""} placeholder="Ex: 450000" />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Cidade <span style={styles.optionalTag}>(opcional)</span></label>
            <input style={styles.input} name="cidade" defaultValue={truck.cidade || ""} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Estado *</label>
            <select style={styles.input} name="estado" defaultValue={truck.estado || "SC"} required>
              {estados.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Carroceria *</label>
            <select style={styles.input} name="carroceria" required defaultValue={truck.carroceria || ""}>
              {carrocerias.map((carroceria) => <option key={carroceria} value={carroceria}>{carroceria}</option>)}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Tração *</label>
            <select style={styles.input} name="tracao" required defaultValue={truck.tracao || ""}>
              {tracoes.map((tracao) => <option key={tracao} value={tracao}>{tracao}</option>)}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>WhatsApp *</label>
            <input style={styles.input} name="whatsapp" defaultValue={truck.whatsapp || ""} required />
          </div>

          {isAdmin && (
            <div style={styles.field}>
              <label style={styles.label}>Status</label>
              <select style={styles.input} name="status" defaultValue={truck.status || "pendente"}>
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="reprovado">Reprovado</option>
              </select>
            </div>
          )}

          {/* Toggle: Abaixo da FIPE */}
          <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <label style={styles.fipeToggleLabel}>
              <input
                type="checkbox"
                name="abaixo_fipe"
                value="true"
                defaultChecked={abaixoFipe}
                style={styles.fipeCheckbox}
              />
              <span style={styles.fipeToggleText}>
                <span style={styles.fipeBadgePreview}>📉 Abaixo da FIPE</span>
                <span style={styles.fipeHint}>Marque se o preço deste anúncio está abaixo da tabela FIPE</span>
              </span>
            </label>
          </div>

          <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <label style={styles.label}>Descrição</label>
            <textarea style={{ ...styles.input, minHeight: 130, resize: "vertical", paddingTop: 13 }} name="descricao" defaultValue={truck.descricao || ""} />
          </div>

          <div style={{ ...styles.uploadBox, gridColumn: "1 / -1" }}>
            <strong style={styles.uploadTitle}>Adicionar novas fotos</strong>
            <p style={styles.helpText}>As fotos antigas continuam. Envie novas fotos se quiser complementar o anúncio.</p>

            <div style={styles.photoGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Nova foto principal</label>
                <input style={styles.fileInput} name="foto_principal" type="file" accept="image/*" />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Novas fotos extras</label>
                <input style={styles.fileInput} name="fotos_extras" type="file" accept="image/*" multiple />
              </div>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <p style={styles.helpText}>Salve e confira o anúncio novamente.</p>
          <button style={styles.primaryButton} type="submit">Salvar alterações</button>
        </div>
      </form>
    </PanelLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  formCard: { padding: 24, borderRadius: 22, background: "#1f2327", border: "1px solid #343a40", boxShadow: "0 16px 34px rgba(0,0,0,.18)" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 16 },
  field: { display: "grid", gap: 8 },
  label: { color: "#cbd5df", fontWeight: 900, fontSize: 13 },
  optionalTag: { color: "#8f99a3", fontWeight: 700, fontSize: 11, marginLeft: 4 },
  input: { width: "100%", padding: "13px 14px", borderRadius: 14, border: "1px solid #343a40", background: "#15181b", color: "#e8eaed", outline: "none", boxSizing: "border-box" },
  fileInput: { width: "100%", padding: "13px 14px", borderRadius: 14, border: "1px dashed #22c55e", background: "#15181b", color: "#cbd5df", outline: "none", boxSizing: "border-box" },
  uploadBox: { padding: 20, borderRadius: 18, background: "#181b1e", border: "1px solid #343a40" },
  uploadTitle: { color: "#f4f4f5", fontSize: 18 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 16, marginTop: 16 },
  footer: { marginTop: 22, paddingTop: 18, borderTop: "1px solid #343a40", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" },
  helpText: { color: "#a7afb7", margin: 0, lineHeight: 1.6 },
  primaryButton: { border: 0, padding: "13px 18px", borderRadius: 14, background: "#22c55e", color: "#06140b", fontWeight: 900, cursor: "pointer" },
  secondaryButton: { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "11px 14px", borderRadius: 14, border: "1px solid #343a40", background: "#2a2f34", color: "#e8eaed", textDecoration: "none", fontWeight: 900 },
  fipeToggleLabel: { display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, border: "1px solid #22c55e30", background: "#0d1f12", cursor: "pointer" },
  fipeCheckbox: { width: 20, height: 20, accentColor: "#22c55e", cursor: "pointer", flexShrink: 0 },
  fipeToggleText: { display: "flex", flexDirection: "column", gap: 3 },
  fipeBadgePreview: { color: "#86efac", fontWeight: 900, fontSize: 14 },
  fipeHint: { color: "#6b7280", fontWeight: 700, fontSize: 12 },
};
