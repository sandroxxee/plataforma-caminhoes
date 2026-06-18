import { Metadata } from 'next'
import AgentePublico from '@/components/AgentePublico'

export const metadata: Metadata = {
  title: 'Anunciar Grátis | Caminhões à Venda',
  description: 'Anuncie seu caminhão grátis! Nosso agente inteligente te guia passo a passo na criação do seu anúncio.',
}

export default function AnunciarGratisPage() {
  return <AgentePublico />
}
