"use client";

import { useMemo, useState } from "react";

const tipos = [
  { label: "Caminhão 3/4", configuracoes: ["3/4"] },
  { label: "Caminhão Toco", configuracoes: ["4x2"] },
  { label: "Caminhão Truck", configuracoes: ["6x2"] },
  { label: "Caminhão Traçado", configuracoes: ["6x4"] },
  { label: "Caminhão Bitruck", configuracoes: ["8x2", "8x4"] },
  { label: "Cavalo Mecânico", configuracoes: ["4x2", "6x2", "6x4", "8x2", "8x4"] },
];

function tracaoDaConfiguracao(configuracao: string) {
  if (configuracao.endsWith("x4")) return "Traçado";
  return "Simples";
}

export function TruckConfigurationFields() {
  const [tipo, setTipo] = useState("");
  const [configuracaoManual, setConfiguracaoManual] = useState("");

  const tipoSelecionado = tipos.find((item) => item.label === tipo);
  const configuracoesDisponiveis = tipoSelecionado?.configuracoes || [];
  const precisaEscolherConfiguracao = configuracoesDisponiveis.length > 1;

  const configuracao = useMemo(() => {
    if (!tipoSelecionado) return "";
    if (precisaEscolherConfiguracao) return configuracaoManual;
    return configuracoesDisponiveis[0] || "";
  }, [configuracaoManual, configuracoesDisponiveis, precisaEscolherConfiguracao, tipoSelecionado]);

  const tracao = configuracao ? tracaoDaConfiguracao(configuracao) : "";

  function alterarTipo(novoTipo: string) {
    const novoTipoSelecionado = tipos.find((item) => item.label === novoTipo);
    setTipo(novoTipo);
    setConfiguracaoManual(novoTipoSelecionado?.configuracoes.length === 1 ? novoTipoSelecionado.configuracoes[0] : "");
  }

  return (
    <>
      <label>
        Tipo do caminhão *
        <select name="tipo_caminhao" value={tipo} onChange={(event) => alterarTipo(event.target.value)} required>
          <option value="" disabled>Selecione o tipo</option>
          {tipos.map((item) => (
            <option key={item.label} value={item.label}>{item.label}</option>
          ))}
        </select>
        <small>Escolha o tipo comercial. A configuração e a tração são marcadas automaticamente.</small>
      </label>

      <label>
        Configuração *
        {precisaEscolherConfiguracao ? (
          <select
            name="tracao"
            value={configuracaoManual}
            onChange={(event) => setConfiguracaoManual(event.target.value)}
            required
          >
            <option value="" disabled>Selecione a configuração</option>
            {configuracoesDisponiveis.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        ) : (
          <>
            <input value={configuracao} placeholder="Automático" readOnly required />
            <input type="hidden" name="tracao" value={configuracao} />
          </>
        )}
        <small>3/4, 4x2, 6x2, 6x4, 8x2 ou 8x4. Sem Truck/Bitruck/Traçado misturado aqui.</small>
      </label>

      <label>
        Tração
        <input value={tracao} placeholder="Automático" readOnly />
        <small>Simples ou traçado, definido sozinho pela configuração escolhida.</small>
      </label>
    </>
  );
}
