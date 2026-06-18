import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// FLUXO: cadastro -> marca -> modelo -> tipo -> fotos -> preco -> descricao -> publicar
const ORDEM = ['nome', 'whatsapp', 'cidade', 'senha', 'marca', 'modelo', 'tipo', 'fotos', 'preco', 'descricao']

type Dados = Record<string, string | string[]>

const PERGUNTAS: Record<string, string> = {
  nome: '👋 Olá! Vamos criar sua conta e anunciar seu caminhão grátis!\n\nQual é o seu **nome completo**?',
  whatsapp: 'Perfeito! Agora, qual é o seu **WhatsApp** (com DDD)?\n_Ex: 11987654321_',
  cidade: 'Ótimo! Em qual **cidade** você está localizado?\n_Ex: São Paulo - SP_',
  senha: 'Agora crie uma **senha** para sua conta (mínimo 6 caracteres):',
  marca: '🚚 Conta criada com sucesso! Agora vamos cadastrar seu caminhão.\n\nQual a **marca** do veículo?\n\n1. Scania\n2. Volvo\n3. Mercedes-Benz\n4. Volkswagen\n5. Ford\n6. MAN\n7. Iveco\n8. DAF\n9. Outra',
  modelo: 'Qual é o **modelo**?\n_Ex: R540, FH 540, Atego 2430, Delivery 9-160_',
  tipo: 'Qual o **tipo** do veículo?\n\n1. Cavalo mecânico\n2. Truck com baú\n3. Truck com carroceria\n4. Truck com caçamba\n5. Toco\n6. Bitruck\n7. Outro',
  fotos: '📷 Agora envie as **fotos do caminhão**!\n_Clique no botão acima para adicionar as fotos._',
  preco: 'Qual é o **preço de venda**?\n_Ex: 320000_',
  descricao: 'Por último, conte mais sobre o veículo:\n• Ano\n• KM\n• Estado de conservação\n• Opcionais\n_Ex: 2019, 380 mil km, motor revisado, pneus novos_',
}

function proximaEtapa(dados: Dados): string {
  for (const e of ORDEM) {
    if (!dados[e] || (e === 'fotos' && (!Array.isArray(dados.fotos) || dados.fotos.length === 0))) {
      return e
    }
  }
  return 'confirmar'
}

function gerarResumo(d: Dados): string {
  const fotos = Array.isArray(d.fotos) ? d.fotos : []
  return `✅ **Resumo do anúncio:**\n\n👤 **Nome:** ${d.nome}\n📱 **WhatsApp:** ${d.whatsapp}\n🏙️ **Cidade:** ${d.cidade}\n\n🚚 **Marca/Modelo:** ${d.marca} ${d.modelo}\n🛠️ **Tipo:** ${d.tipo}\n💰 **Preço:** R$ ${Number(d.preco || 0).toLocaleString('pt-BR')}\n📝 **Descrição:** ${d.descricao}\n📷 **Fotos:** ${fotos.length} foto(s)\n\n✅ Tudo certo? Digite **publicar** para enviar para aprovação!\nOu digite **corrigir [campo]** para ajustar algo.\n_Ex: corrigir preco_`
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { mensagem: string; dados: Dados; etapa: string }
  let { mensagem, dados = {}, etapa = 'inicio' } = body
  mensagem = mensagem.toLowerCase().trim()

  const supabase = await createClient()

  // INICIO
  if (mensagem === '__inicio__') {
    return NextResponse.json({
      resposta: PERGUNTAS.nome,
      dados,
      etapa: 'nome',
    })
  }

  // CADASTRO - NOME
  if (etapa === 'nome') {
    if (!mensagem || mensagem.length < 3) {
      return NextResponse.json({ resposta: 'Por favor, digite seu nome completo.', dados, etapa: 'nome' })
    }
    dados.nome = mensagem
    return NextResponse.json({ resposta: PERGUNTAS.whatsapp, dados, etapa: 'whatsapp' })
  }

  // CADASTRO - WHATSAPP
  if (etapa === 'whatsapp') {
    const limpo = mensagem.replace(/\D/g, '')
    if (limpo.length < 10 || limpo.length > 11) {
      return NextResponse.json({ resposta: 'WhatsApp inválido. Digite com DDD (ex: 11987654321)', dados, etapa: 'whatsapp' })
    }
    dados.whatsapp = limpo
    return NextResponse.json({ resposta: PERGUNTAS.cidade, dados, etapa: 'cidade' })
  }

  // CADASTRO - CIDADE
  if (etapa === 'cidade') {
    if (!mensagem || mensagem.length < 3) {
      return NextResponse.json({ resposta: 'Digite a cidade e o estado (ex: São Paulo - SP)', dados, etapa: 'cidade' })
    }
    dados.cidade = mensagem
    return NextResponse.json({ resposta: PERGUNTAS.senha, dados, etapa: 'senha' })
  }

  // CADASTRO - SENHA & CRIAR CONTA
  if (etapa === 'senha') {
    if (!mensagem || mensagem.length < 6) {
      return NextResponse.json({ resposta: 'Senha muito curta. Mínimo 6 caracteres.', dados, etapa: 'senha' })
    }
    dados.senha = mensagem

    // Criar conta no Supabase Auth
    const email = `${dados.whatsapp}@temp.caminhoesavenda.com`
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: mensagem,
      options: {
        data: {
          nome: dados.nome,
          whatsapp: dados.whatsapp,
          cidade: dados.cidade,
        },
      },
    })

    if (authError) {
      // Se já existe, fazer login
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password: mensagem })
      if (loginError) {
        return NextResponse.json({ resposta: 'Erro ao criar conta. Tente outro WhatsApp.', dados, etapa: 'senha' })
      }
    }

    dados.user_id = authData?.user?.id || ''
    return NextResponse.json({ resposta: PERGUNTAS.marca, dados, etapa: 'marca' })
  }

  // MARCA
  if (etapa === 'marca') {
    const marcas = ['scania', 'volvo', 'mercedes', 'volkswagen', 'vw', 'ford', 'man', 'iveco', 'daf']
    const num = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    if (num.includes(mensagem[0])) {
      const idx = parseInt(mensagem[0]) - 1
      const map = ['Scania', 'Volvo', 'Mercedes-Benz', 'Volkswagen', 'Ford', 'MAN', 'Iveco', 'DAF', mensagem]
      dados.marca = map[idx] || mensagem
    } else if (marcas.some(m => mensagem.includes(m))) {
      dados.marca = mensagem.charAt(0).toUpperCase() + mensagem.slice(1)
    } else {
      dados.marca = mensagem
    }
    return NextResponse.json({ resposta: PERGUNTAS.modelo, dados, etapa: 'modelo' })
  }

  // MODELO
  if (etapa === 'modelo') {
    dados.modelo = mensagem
    return NextResponse.json({ resposta: PERGUNTAS.tipo, dados, etapa: 'tipo' })
  }

  // TIPO
  if (etapa === 'tipo') {
    const tipos = [
      'Cavalo mecânico',
      'Truck com baú',
      'Truck com carroceria',
      'Truck com caçamba',
      'Toco',
      'Bitruck',
      mensagem,
    ]
    if (mensagem[0] >= '1' && mensagem[0] <= '7') {
      dados.tipo = tipos[parseInt(mensagem[0]) - 1]
    } else {
      dados.tipo = mensagem
    }
    return NextResponse.json({ resposta: PERGUNTAS.fotos, dados, etapa: 'fotos' })
  }

  // FOTOS - detectar mensagem "fotos_enviadas:url1,url2" do widget
  if (etapa === 'fotos') {
    if (mensagem.startsWith('fotos_enviadas:')) {
      // Widget enviou as URLs
      const urls = mensagem.replace('fotos_enviadas:', '').split(',').filter(Boolean)
      dados.fotos = Array.isArray(dados.fotos) ? [...dados.fotos, ...urls] : urls
    }

    const fotos = Array.isArray(dados.fotos) ? dados.fotos : []
    if (fotos.length === 0) {
      return NextResponse.json({
        resposta: 'Você ainda não enviou nenhuma foto. Clique no botão acima para adicionar.',
        dados,
        etapa: 'fotos',
      })
    }

    // Avançar se já tiver fotos e usuário disser "ok", "pronto", "continuar", etc
    if (['ok', 'pronto', 'continuar', 'proximo', 'próximo'].includes(mensagem)) {
      return NextResponse.json({ resposta: PERGUNTAS.preco, dados, etapa: 'preco' })
    }

    // Aguardando fotos ou confirmação
    if (mensagem.startsWith('fotos_enviadas:')) {
      return NextResponse.json({
        resposta: `✅ ${fotos.length} foto(s) adicionada(s)!\n\nQuer adicionar mais fotos ou continuar? Digite **continuar** para prosseguir.`,
        dados,
        etapa: 'fotos',
      })
    }

    return NextResponse.json({ resposta: PERGUNTAS.fotos, dados, etapa: 'fotos' })
  }

  // PRECO
  if (etapa === 'preco') {
    const preco = mensagem.replace(/\D/g, '')
    if (!preco || parseInt(preco) < 1000) {
      return NextResponse.json({ resposta: 'Preço inválido. Digite o valor em reais (ex: 320000)', dados, etapa: 'preco' })
    }
    dados.preco = preco
    return NextResponse.json({ resposta: PERGUNTAS.descricao, dados, etapa: 'descricao' })
  }

  // DESCRICAO
  if (etapa === 'descricao') {
    dados.descricao = mensagem
    return NextResponse.json({ resposta: gerarResumo(dados), dados, etapa: 'confirmar' })
  }

  // CONFIRMAR & PUBLICAR
  if (etapa === 'confirmar') {
    if (mensagem === 'publicar') {
      // Salvar no Supabase
      const fotos = Array.isArray(dados.fotos) ? dados.fotos : []
      const { error } = await supabase.from('anuncios').insert({
        user_id: dados.user_id,
        tipo: 'caminhao',
        marca: dados.marca,
        modelo: dados.modelo,
        categoria: dados.tipo,
        preco: parseInt(dados.preco as string),
        descricao: dados.descricao,
        cidade: dados.cidade,
        whatsapp: dados.whatsapp,
        fotos: fotos,
        status: 'pendente',
      })

      if (error) {
        return NextResponse.json({ resposta: 'Erro ao salvar anúncio. Tente novamente.', dados, etapa: 'confirmar' })
      }

      return NextResponse.json({
        resposta: '✅ **Anúncio criado com sucesso!**\n\nSeu anúncio foi enviado para aprovação e em breve estará disponível no site. Você receberá notificações pelo WhatsApp.\n\n👉 Acesse seu painel: [caminhoesavenda.com/painel](https://www.caminhoesavenda.com/painel)',
        dados,
        etapa: 'finalizado',
      })
    }

    // Corrigir campo
    if (mensagem.startsWith('corrigir')) {
      const campo = mensagem.replace('corrigir', '').trim()
      const mapa: Record<string, string> = {
        nome: 'nome',
        whatsapp: 'whatsapp',
        whats: 'whatsapp',
        telefone: 'whatsapp',
        cidade: 'cidade',
        local: 'cidade',
        marca: 'marca',
        modelo: 'modelo',
        tipo: 'tipo',
        categoria: 'tipo',
        preco: 'preco',
        valor: 'preco',
        descricao: 'descricao',
        fotos: 'fotos',
      }
      const etapaCorrigir = mapa[campo] || 'marca'
      return NextResponse.json({
        resposta: `Ok! ${PERGUNTAS[etapaCorrigir] || 'Digite o novo valor:'}`,
        dados,
        etapa: etapaCorrigir,
      })
    }

    return NextResponse.json({ resposta: gerarResumo(dados), dados, etapa: 'confirmar' })
  }

  // Fallback
  const prox = proximaEtapa(dados)
  return NextResponse.json({ resposta: PERGUNTAS[prox] || 'Digite sua resposta:', dados, etapa: prox })
}
