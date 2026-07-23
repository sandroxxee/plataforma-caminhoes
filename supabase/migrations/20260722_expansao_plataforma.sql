-- ============================================================
-- MIGRATION: 20260722_expansao_plataforma.sql
-- Expansão do Banco de Dados para Caminhões à Venda
-- ============================================================

-- 1. EXTENSÕES & HELPERS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA PERFIS (usuários)
CREATE TABLE IF NOT EXISTS public.perfis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    nome TEXT,
    telefone TEXT,
    role TEXT CHECK (role IN ('admin', 'revenda', 'vendedor', 'comprador')) DEFAULT 'comprador',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA REVENDAS (lojistas/parceiros)
CREATE TABLE IF NOT EXISTS public.revendas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
    nome_fantasia TEXT NOT NULL,
    razao_social TEXT,
    cnpj TEXT UNIQUE,
    logo_url TEXT,
    banner_url TEXT,
    cidade TEXT,
    estado TEXT,
    telefone TEXT,
    whatsapp TEXT,
    status TEXT CHECK (status IN ('ativo', 'inativo', 'pendente')) DEFAULT 'pendente',
    selo_verificado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA PLANOS (assinaturas)
CREATE TABLE IF NOT EXISTS public.planos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tipo TEXT CHECK (tipo IN ('individual', 'destaque', 'assinatura')) DEFAULT 'assinatura',
    limite_anuncios INT DEFAULT 5,
    duracao_dias INT DEFAULT 30,
    destaque_automatico BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserts padrão para planos caso a tabela esteja vazia
INSERT INTO public.planos (nome, descricao, preco, tipo, limite_anuncios, duracao_dias, destaque_automatico)
SELECT 'Individual Grátis', 'Plano básico para 1 anúncio individual', 0.00, 'individual', 1, 30, false
WHERE NOT EXISTS (SELECT 1 FROM public.planos WHERE nome = 'Individual Grátis');

INSERT INTO public.planos (nome, descricao, preco, tipo, limite_anuncios, duracao_dias, destaque_automatico)
SELECT 'Plano Destaque 15 Dias', 'Anúncio com destaque na home e topo da busca por 15 dias', 79.90, 'destaque', 1, 15, true
WHERE NOT EXISTS (SELECT 1 FROM public.planos WHERE nome = 'Plano Destaque 15 Dias');

INSERT INTO public.planos (nome, descricao, preco, tipo, limite_anuncios, duracao_dias, destaque_automatico)
SELECT 'Revenda Gold', 'Até 30 anúncios simultâneos com selo de loja recomendada', 349.90, 'assinatura', 30, 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.planos WHERE nome = 'Revenda Gold');

-- 5. TABELA ASSINATURAS (vínculo revenda x plano)
CREATE TABLE IF NOT EXISTS public.assinaturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    revenda_id UUID REFERENCES public.revendas(id) ON DELETE CASCADE,
    plano_id UUID REFERENCES public.planos(id) ON DELETE RESTRICT,
    data_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('ativa', 'expirada', 'cancelada')) DEFAULT 'ativa',
    pagamento_pix_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. GARANTIA DOS CAMPOS NA TABELA ANUNCIOS
ALTER TABLE IF EXISTS public.anuncios ADD COLUMN IF NOT EXISTS revenda_id UUID REFERENCES public.revendas(id) ON DELETE SET NULL;
ALTER TABLE IF EXISTS public.anuncios ADD COLUMN IF NOT EXISTS destaque BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS public.anuncios ADD COLUMN IF NOT EXISTS visualizacoes INT DEFAULT 0;
ALTER TABLE IF EXISTS public.anuncios ADD COLUMN IF NOT EXISTS cliques_whatsapp INT DEFAULT 0;

-- 7. TABELA FOTOS_ANUNCIOS
CREATE TABLE IF NOT EXISTS public.fotos_anuncios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID REFERENCES public.anuncios(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    ordem INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABELA METRICAS_ANUNCIOS (agregado diário)
CREATE TABLE IF NOT EXISTS public.metricas_anuncios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID REFERENCES public.anuncios(id) ON DELETE CASCADE,
    data DATE DEFAULT CURRENT_DATE,
    visualizacoes INT DEFAULT 0,
    cliques_whatsapp INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(anuncio_id, data)
);

-- 9. TABELA LEADS_WHATSAPP
CREATE TABLE IF NOT EXISTS public.leads_whatsapp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID REFERENCES public.anuncios(id) ON DELETE CASCADE,
    comprador_telefone TEXT,
    ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. TABELA NOTIFICACOES_PUSH (para App Mobile Expo)
CREATE TABLE IF NOT EXISTS public.notificacoes_push (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    revenda_id UUID REFERENCES public.revendas(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    corpo TEXT NOT NULL,
    dados JSONB DEFAULT '{}'::jsonb,
    lida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. TABELA AUDIT_LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
    acao TEXT NOT NULL,
    detalhes JSONB DEFAULT '{}'::jsonb,
    ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. TABELA FEATURE_FLAGS (painel dev)
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT UNIQUE NOT NULL,
    ativo BOOLEAN DEFAULT FALSE,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserts padrão de feature_flags
INSERT INTO public.feature_flags (nome, ativo, descricao)
VALUES 
  ('chat_ia_assistente', true, 'Habilita o Assistente IA (Gemini) no painel admin'),
  ('notificacoes_push_mobile', true, 'Permite disparar notificações Push para revendas via Expo'),
  ('modo_manutencao', false, 'Ativa tela de manutenção em rotas públicas')
ON CONFLICT (nome) DO NOTHING;

-- 13. ÍNDICES DE PERFORMANCE PARA RLS E BUSCAS
CREATE INDEX IF NOT EXISTS idx_revendas_user_id ON public.revendas(user_id);
CREATE INDEX IF NOT EXISTS idx_revendas_status ON public.revendas(status);
CREATE INDEX IF NOT EXISTS idx_assinaturas_revenda ON public.assinaturas(revenda_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON public.assinaturas(status);
CREATE INDEX IF NOT EXISTS idx_anuncios_revenda ON public.anuncios(revenda_id);
CREATE INDEX IF NOT EXISTS idx_metricas_anuncio_data ON public.metricas_anuncios(anuncio_id, data);
CREATE INDEX IF NOT EXISTS idx_audit_logs_usuario ON public.audit_logs(usuario_id);

-- 14. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes_push ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Leitura pública para planos e feature flags
DROP POLICY IF EXISTS "Leitura publica de planos" ON public.planos;
CREATE POLICY "Leitura publica de planos" ON public.planos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Leitura publica de feature flags" ON public.feature_flags;
CREATE POLICY "Leitura publica de feature flags" ON public.feature_flags FOR SELECT USING (true);

-- Revendas públicas ativas
DROP POLICY IF EXISTS "Revendas ativas visiveis a todos" ON public.revendas;
CREATE POLICY "Revendas ativas visiveis a todos" ON public.revendas FOR SELECT USING (status = 'ativo' OR auth.role() = 'authenticated');

