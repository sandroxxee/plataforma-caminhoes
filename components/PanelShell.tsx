import Link from "next/link";

export function PanelShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const links = admin
    ? [["/admin", "Dashboard"], ["/admin/pendentes", "Pendentes"], ["/admin/anuncios", "Todos anúncios"], ["/admin/usuarios", "Usuários"], ["/", "Sair"]]
    : [["/painel", "Painel"], ["/painel/anuncios", "Meus anúncios"], ["/painel/anuncios/novo", "Novo anúncio"], ["/", "Sair"]];
  return (
    <main className="panel-layout">
      <aside className="sidebar">
        <div className="brand" style={{marginBottom: 22}}>🚛 <span>{admin ? "Admin" : "Anunciante"}<small>{admin ? "Área protegida" : "Painel do usuário"}</small></span></div>
        {links.map(([href, label]) => <Link key={href} className="side-link" href={href}>{label}</Link>)}
      </aside>
      <section className="panel-main">{children}</section>
    </main>
  );
}
