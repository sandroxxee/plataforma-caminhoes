import { Metadata } from 'next'
import AgentChat from '@/components/AgentChat'

export const metadata: Metadata = {
  title: 'Anunciar Grátis | Caminhões à Venda',
  description: 'Anuncie seu caminhão grátis! Nosso agente inteligente te guia passo a passo na criação do seu anúncio.',
}

export default function AnunciarGratisPage() {
  return <AgentChat variant="publico" />
}
