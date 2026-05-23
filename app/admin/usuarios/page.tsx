import { PanelShell } from "@/components/PanelShell";

const users = [
  ["Sandro Mayer", "luizmayersandro@gmail.com", "49 99936-2681", "Vendedor", "6", "Ativo"],
  ["Auto Truck Sul", "contato@truck.com", "49 99999-0000", "Loja", "12", "Ativo"],
  ["João Particular", "joao@email.com", "54 99999-1111", "Particular", "1", "Ativo"]
];
export default function UsuariosPage(){return <PanelShell admin><h1 style={{fontSize:36}}>Usuários</h1><div className="field"><label>Buscar por nome, e-mail ou telefone</label><input placeholder="Buscar usuário"/></div><table className="table"><tbody>{users.map(u=><tr key={u[1]}><td><b>{u[0]}</b><br/><span className="muted">{u[1]}</span></td><td>{u[2]}</td><td>{u[3]}</td><td>{u[4]} anúncios</td><td><span className="badge green">{u[5]}</span></td><td><button className="btn">Ver</button></td><td><button className="btn danger">Bloquear</button></td></tr>)}</tbody></table></PanelShell>}
