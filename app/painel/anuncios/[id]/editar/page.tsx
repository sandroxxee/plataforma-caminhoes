import Link from "next/link";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { editarAnuncio } from "../../actions";

export const dynamic = "force-dynamic";

const marcas = ["Mercedes-Benz", "Scania", "Volvo", "Volkswagen", "Ford", "Iveco", "DAF"];
const carrocerias = ["Caçamba basculante", "Caçamba meia-cana", "Graneleira", "Chassi", "Prancha", "Plataforma", "Baú seco", "Baú frigorífico", "Cavalo mecânico", "Munck", "Outra"];
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
    .select("id, user_id, marca, modelo, ano_modelo, preco, cidade, estado, carroceria, tracao, whatsapp, descricao, status")
    .eq("id", id);

  if (!isAdmin) {
    query = query.eq("user_id", user.id);
  }

  const { data: truck } = await query.single();

  if (!truck) redirect("/painel/anuncios");

  return (
    <PanelLayout
      title="Editar anúncio"
      subtitle="Ao editar como anunciante, o anúncio volta para pendente. Como admin, você pode manter aprovado."
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
            <label style={styles.label}>Cidade *</label>
            <input style={styles.input} name="cidade" defaultValue={truck.cidade || ""} required />
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

          <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <label style={styles.label}>Descrição</label>
            <textarea style={{ ...styles.input, minHeight: 130, resize: "vertical" }} name="descricao" defaultValue={truck.descricao || ""} />
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
  formCard: { padding: 26, borderRadius: 24, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.10)" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 16 },
  field: { display: "grid", gap: 8 },
  label: { color: "#cbd5e1", fontWeight: 800, fontSize: 13 },
  input: { width: "100%", padding: "13px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,.14)", background: "rgba(15,23,42,.78)", color: "white", outline: "none" },
  fileInput: { width: "100%", padding: "13px 14px", borderRadius: 14, border: "1px dashed rgba(34,197,94,.45)", background: "rgba(15,23,42,.78)", color: "#cbd5e1", outline: "none" },
  uploadBox: { padding: 20, borderRadius: 20, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.20)" },
  uploadTitle: { color: "white", fontSize: 18 },
  photoGrid: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 16, marginTop: 16 },
  footer: { marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.10)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" },
  helpText: { color: "#a7b5c7", margin: 0, lineHeight: 1.6 },
  primaryButton: { border: 0, padding: "13px 18px", borderRadius: 14, background: "#22c55e", color: "#052e16", fontWeight: 900, cursor: "pointer" },
  secondaryButton: { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "11px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.06)", color: "white", textDecoration: "none", fontWeight: 800 },
};