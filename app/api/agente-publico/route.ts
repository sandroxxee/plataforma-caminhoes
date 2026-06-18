import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ORDEM = [
  "tipo", "marca", "modelo", "ano_fabricacao", "ano_modelo",
  "km", "preco", "carroceria", "tracao", "cidade", "estado",
  "whatsapp", "descricao",
];

const PERGUNTAS: Record<string, string> = {
  tipo:          "Ola! Vamos criar seu anuncio gratuitamente em poucos minutos!\n\nO que voce esta vendendo?\n\n**1.** Caminhao\n**2.** Carreta\n**3.** Implemento\n**4.** Maquina",
  marca:         "Qual e a **marca**?\n_(Ex: Scania, Volvo, Mercedes-Benz, Volkswagen, Ford, MAN, Iveco, DAF)_",
  modelo:        "Qual e o **modelo**?\n_(Ex: R540, FH 540, Atego 2430, Delivery 9-160)_",
  ano_fabricacao:"Qual o **ano de fabricacao**? _(Ex: 2019)_",
  ano_modelo:    "Qual o **ano do modelo**? _(pode ser igual ao de fabricacao)_",
  km:            "Qual a **quilometragem** atual?\n_(so numeros, ex: 380000 - ou **0** se nao souber)_",
  preco:         "Qual o **preco de venda**?\n_(so numeros, ex: 320000)_",
  carroceria:    "Qual o tipo de **carroceria / configuracao**?\n_(Ex: Cavalo mecanico, Graneleira, Bau seco, Chassi, Prancha, Tanque, Munck...)_",
  tracao:        "Qual a **tracao**?\n_(Ex: 4x2, 6x2, 6x4, 8x2, 8x4 - ou **Nao se aplica**)_",
  cidade:        "Em qual **cidade** o veiculo esta localizado?",
  estado:        "Qual o **estado (UF)**? _(Ex: SC, SP, PR, RS, MG...)_",
  whatsapp:      "Qual o **WhatsApp** para contato?\n_(com DDD, so numeros - ex: 47999990000)_",
  descricao:     "Conte mais sobre o veiculo\n\nDescreva o **estado de conservacao**, **opcionais**, **historico de manutencao**, etc.\n\n_Quanto mais detalhes, mais chances de vender!_",
};

function proximaEtapa(dados: Record<string, string>): string {
  for (const e of ORDEM) {
    if (!dados[e]) return e;
  }
  return "fotos";
}

function gerarResumo(dados: Record<string, string>, qtdFotos: number): string {
  const preco = dados.preco ? `R$ ${Number(dados.preco).toLocaleString("pt-BR")}` : "-";
  const km = dados.km && dados.km !== "0" ? `${Number(dados.km).toLocaleString("pt-BR")} km` : "Nao informado";
  return [
    "**Perfeito! Confira o resumo do seu anuncio:**",
    "",
    `Tipo: ${dados.tipo}`,
    `Marca/Modelo: ${dados.marca} ${dados.modelo}`,
    `Ano fab/modelo: ${dados.ano_fabricacao}/${dados.ano_modelo}`,
    `KM: ${km}`,
    `Preco: ${preco}`,
    `Carroceria: ${dados.carroceria}`,
    `Tracao: ${dados.tracao}`,
    `Localizacao: ${dados.cidade}/${dados.estado}`,
    `WhatsApp: ${dados.whatsapp}`,
    `Fotos: ${qtdFotos} foto(s) selecionada(s)`,
    `Descricao: ${dados.descricao?.slice(0, 100)}...`,
    "",
    "---",
    "Tudo certo? Digite **publicar** para criar sua conta e publicar o anuncio gratuitamente!\n\nOu **corrigir [campo]** para ajustar algo. _(Ex: \"corrigir preco\")_",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    mensagem: string;
    dados: Record<string, string>;
    etapa: string;
    qtdFotos?: number;
  };

  const { mensagem, etapa, qtdFotos = 0 } = body;
  let dados = { ...body.dados };

  // Etapa inicial - sem auth
  if (!etapa) {
    return NextResponse.json({ resposta: PERGUNTAS.tipo, dados, etapa: "tipo" });
  }

  // Etapa fotos
  if (etapa === "fotos") {
    if (qtdFotos === 0) {
      return NextResponse.json({
        resposta: "Voce ainda nao selecionou nenhuma foto. Adicione pelo menos 1 foto antes de continuar.",
        dados, etapa: "fotos",
      });
    }
    dados.fotos = String(qtdFotos);
    return NextResponse.json({ resposta: gerarResumo(dados, qtdFotos), dados, etapa: "confirmar" });
  }

  // Etapa confirmar
  if (etapa === "confirmar") {
    const resp = mensagem.toLowerCase().trim();

    if (resp.startsWith("corrigir")) {
      const termo = resp.replace("corrigir", "").trim();
      const mapa: Record<string, string> = {
        tipo: "tipo", marca: "marca", modelo: "modelo",
        "ano fab": "ano_fabricacao", "ano modelo": "ano_modelo",
        km: "km", preco: "preco",
        carroceria: "carroceria", tracao: "tracao",
        cidade: "cidade", estado: "estado",
        whatsapp: "whatsapp", descricao: "descricao", fotos: "fotos",
      };
      const campo = Object.entries(mapa).find(([k]) => termo.includes(k))?.[1];
      if (campo) {
        dados[campo] = "";
        if (campo === "fotos") {
          return NextResponse.json({ resposta: "Ok! Adicione as novas fotos e clique em Continuar.", dados, etapa: "fotos" });
        }
        return NextResponse.json({ resposta: PERGUNTAS[campo], dados, etapa: campo });
      }
      return NextResponse.json({
        resposta: "Nao entendi. Ex: \"corrigir preco\", \"corrigir cidade\"",
        dados, etapa: "confirmar",
      });
    }

    if (["publicar", "sim", "s", "ok", "confirmar", "enviar"].includes(resp)) {
      // Verificar se usuario esta logado
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Nao logado: pedir para criar conta
        return NextResponse.json({
          resposta: "Para publicar seu anuncio voce precisa ter uma conta gratuita.\n\nClique no botao abaixo para **criar sua conta** (rapido, so email e senha) e seu anuncio sera publicado automaticamente!",
          dados,
          etapa: "precisa-login",
          precisaLogin: true,
        });
      }

      // Logado: criar anuncio
      const titulo = `${dados.marca} ${dados.modelo} ${dados.ano_modelo || dados.ano_fabricacao}`.trim();
      const { data: truck, error } = await supabase.from("trucks").insert({
        user_id: user.id,
        titulo,
        tipo:           dados.tipo || "Caminhao",
        marca:          dados.marca,
        modelo:         dados.modelo,
        ano_fabricacao: Number(dados.ano_fabricacao),
        ano_modelo:     Number(dados.ano_modelo || dados.ano_fabricacao),
        km:             dados.km && dados.km !== "0" ? Number(dados.km) : null,
        preco:          Number(dados.preco),
        carroceria:     dados.carroceria,
        tracao:         dados.tracao !== "Nao se aplica" ? dados.tracao : null,
        cidade:         dados.cidade,
        estado:         dados.estado.toUpperCase().slice(0, 2),
        whatsapp:       dados.whatsapp.replace(/\D/g, ""),
        descricao:      dados.descricao,
        status:         "pendente",
      }).select("id").single();

      if (error || !truck) {
        return NextResponse.json({
          resposta: `Erro ao criar o anuncio: ${error?.message || "tente novamente"}`,
          dados, etapa: "confirmar",
        });
      }

      return NextResponse.json({
        resposta: "**Anuncio enviado para aprovacao!**\n\nEm breve sera publicado no site.\nAcompanhe em [Meu Painel](/painel).",
        dados, etapa: "finalizado", truckId: truck.id,
      });
    }

    return NextResponse.json({ resposta: gerarResumo(dados, qtdFotos), dados, etapa: "confirmar" });
  }

  // Etapa precisa-login: nao faz nada, frontend redireciona
  if (etapa === "precisa-login") {
    return NextResponse.json({ resposta: "", dados, etapa: "precisa-login" });
  }

  // Processar resposta
  if (etapa && PERGUNTAS[etapa]) {
    const val = mensagem.trim();
    if (etapa === "tipo") {
      const map: Record<string, string> = {
        "1": "Caminhao", "2": "Carreta", "3": "Implemento", "4": "Maquina",
        caminhao: "Caminhao", carreta: "Carreta", implemento: "Implemento", maquina: "Maquina",
      };
      dados.tipo = map[val.toLowerCase()] || val;
    } else if (etapa === "preco" || etapa === "km") {
      const num = val.replace(/\D/g, "");
      if (!num) return NextResponse.json({ resposta: "Por favor informe apenas numeros. Ex: **320000**", dados, etapa });
      if (etapa === "preco" && Number(num) < 1000)
        return NextResponse.json({ resposta: "Valor muito baixo. Informe em reais, ex: **320000**", dados, etapa });
      dados[etapa] = num;
    } else if (etapa === "ano_fabricacao" || etapa === "ano_modelo") {
      const ano = Number(val.replace(/\D/g, ""));
      if (ano < 1970 || ano > new Date().getFullYear() + 1)
        return NextResponse.json({ resposta: "Ano invalido. Ex: **2019**", dados, etapa });
      dados[etapa] = String(ano);
    } else if (etapa === "whatsapp") {
      const wpp = val.replace(/\D/g, "");
      if (wpp.length < 10 || wpp.length > 13)
        return NextResponse.json({ resposta: "WhatsApp invalido. Com DDD, ex: **47999990000**", dados, etapa });
      dados.whatsapp = wpp;
    } else if (etapa === "estado") {
      dados.estado = val.toUpperCase().slice(0, 2);
    } else {
      dados[etapa] = val;
    }
  }

  const proxima = proximaEtapa(dados);

  if (proxima === "fotos") {
    return NextResponse.json({
      resposta: "",
      respostaFotos: "Otimo! Agora adicione as **fotos do veiculo**.\n\n_Minimo 1 foto, recomendado pelo menos 5._\n\nClique em **Adicionar fotos** e depois em **Continuar**.",
      dados, etapa: "fotos",
    });
  }

  return NextResponse.json({ resposta: PERGUNTAS[proxima] || "", dados, etapa: proxima });
}
