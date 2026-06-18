type SearchMarketplaceProps = {
  busca?: string;
  marca?: string;
  perfil?: string;
  tracao?: string;
  implemento?: string;
  perfis?: string[];
  tracoes?: string[];
  implementos?: string[];
  compact?: boolean;
};

const MARCAS = ["DAF", "Ford", "Iveco", "Mercedes-Benz", "Scania", "Volkswagen", "Volvo"];

export function SearchMarketplace({
  busca = "",
  marca = "",
  perfil = "",
  tracao = "",
  implemento = "",
  perfis = [],
  tracoes = [],
  implementos = [],
  compact = false,
}: SearchMarketplaceProps) {
  const temFiltro = Boolean(busca || marca || perfil || tracao || implemento);

  return (
    <form className={`market-search ${compact ? "market-search-compact" : ""}`} action="/anuncios">
      <div className="market-field market-field-search">
        <label>Buscar</label>
        <input name="busca" defaultValue={busca} placeholder="Modelo, marca, cidade ou ano" />
      </div>

      <div className="market-field">
        <label>Marca</label>
        <select name="marca" defaultValue={marca}>
          <option value="">Todas as marcas</option>
          {MARCAS.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="market-field">
        <label>Tipo</label>
        <select name="perfil" defaultValue={perfil}>
          <option value="">Todos os tipos</option>
          {perfis.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="market-field">
        <label>Tração</label>
        <select name="tracao" defaultValue={tracao}>
          <option value="">Todas as trações</option>
          {tracoes.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="market-field">
        <label>Implemento</label>
        <select name="implemento" defaultValue={implemento}>
          <option value="">Todos os implementos</option>
          {implementos.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="market-filter-actions">
        <button type="submit">Buscar</button>
        {temFiltro ? <a href="/anuncios">Limpar</a> : null}
      </div>
    </form>
  );
}
