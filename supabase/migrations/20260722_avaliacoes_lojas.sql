-- ============================================================
-- MIGRATION: 20260722_avaliacoes_lojas.sql
-- Sistema de Avaliações e Reputação de Revendas
-- ============================================================

CREATE TABLE IF NOT EXISTS public.avaliacoes_revendas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    revenda_id UUID REFERENCES public.revendas(id) ON DELETE CASCADE,
    nome_comprador TEXT NOT NULL,
    nota INT CHECK (nota >= 1 AND nota <= 5) NOT NULL,
    comentario TEXT,
    verificado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida de avaliações por revenda
CREATE INDEX IF NOT EXISTS idx_avaliacoes_revenda_id ON public.avaliacoes_revendas(revenda_id);

-- RLS Policies
ALTER TABLE public.avaliacoes_revendas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Avaliacoes sao visiveis publicamente" ON public.avaliacoes_revendas;
CREATE POLICY "Avaliacoes sao visiveis publicamente" ON public.avaliacoes_revendas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Qualquer pessoa pode enviar avaliacao" ON public.avaliacoes_revendas;
CREATE POLICY "Qualquer pessoa pode enviar avaliacao" ON public.avaliacoes_revendas FOR INSERT WITH CHECK (true);
