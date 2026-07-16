import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";

const users = [
  ["Sandro Mayer", "luizmayersandro@gmail.com", "49 99936-2681", "Vendedor", "6", "Ativo"],
  ["Auto Truck Sul", "contato@truck.com", "49 99999-0000", "Loja", "12", "Ativo"],
  ["João Particular", "joao@email.com", "54 99999-1111", "Particular", "1", "Ativo"]
];

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  return (
    <AdminLayout
      title="Controle de Usuários"
      subtitle="Gerencie as contas cadastradas na plataforma."
      badge="Admin"
    >
      <div className="admin-input-group">
        <label htmlFor="buscar-usuario">Buscar por nome, e-mail ou telefone</label>
        <input id="buscar-usuario" placeholder="Buscar usuário..." />
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Contato</th>
              <th>Tipo de Conta</th>
              <th>Anúncios</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u[1]}>
                <td>
                  <strong>{u[0]}</strong>
                  <br />
                  <span style={{ color: "var(--muted)", fontSize: "12.5px" }}>{u[1]}</span>
                </td>
                <td>{u[2]}</td>
                <td>{u[3]}</td>
                <td>{u[4]} anúncios</td>
                <td>
                  <span className="admin-card-status" style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", border: 0, padding: "4px 10px" }}>
                    {u[5]}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 8 }}>
                    <button className="admin-btn admin-btn-edit" style={{ padding: "8px 14px", minHeight: "auto", borderRadius: "10px" }}>Ver</button>
                    <button className="admin-btn admin-btn-reject" style={{ padding: "8px 14px", minHeight: "auto", borderRadius: "10px" }}>Bloquear</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
