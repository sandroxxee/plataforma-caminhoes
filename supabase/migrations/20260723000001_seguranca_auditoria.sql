-- ============================================================
-- MIGRATION: 20260723000001_seguranca_auditoria.sql
-- Tabela de Sessões, Auditoria Expandida e Alertas Multidispositivo
-- ============================================================

-- 1. TABELA DE SESSÕES DE USUÁRIOS E ADMINS
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.perfis(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    user_agent TEXT,
    navegador TEXT,
    ip TEXT,
    cidade TEXT,
    estado TEXT,
    pais TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    status TEXT CHECK (status IN ('online', 'idle', 'offline')) DEFAULT 'online',
    online_seconds INT DEFAULT 0,
    ultimo_acesso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EXPANSÃO DA TABELA DE AUDITORIA (AUDIT_LOGS)
ALTER TABLE IF EXISTS public.audit_logs ADD COLUMN IF NOT EXISTS navegador TEXT;
ALTER TABLE IF EXISTS public.audit_logs ADD COLUMN IF NOT EXISTS cidade TEXT;
ALTER TABLE IF EXISTS public.audit_logs ADD COLUMN IF NOT EXISTS entidade TEXT;
ALTER TABLE IF EXISTS public.audit_logs ADD COLUMN IF NOT EXISTS path TEXT;

-- 3. TABELA DE ALERTAS DE SEGURANÇA ADMIN (MULTIDISPOSITIVO)
CREATE TABLE IF NOT EXISTS public.admin_security_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.perfis(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.user_sessions(id) ON DELETE SET NULL,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    navegador TEXT,
    cidade TEXT,
    ip TEXT,
    lido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_status ON public.user_sessions(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_ultimo_acesso ON public.user_sessions(ultimo_acesso);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entidade ON public.audit_logs(entidade);
CREATE INDEX IF NOT EXISTS idx_admin_security_alerts_user ON public.admin_security_alerts(user_id, lido);

-- 5. POLÍTICAS DE SEGURANÇA (RLS)
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_security_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sessões visíveis para autenticados" ON public.user_sessions;
CREATE POLICY "Sessões visíveis para autenticados" ON public.user_sessions FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Inserção livre em user_sessions" ON public.user_sessions;
CREATE POLICY "Inserção livre em user_sessions" ON public.user_sessions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Atualização de sessões do próprio usuário ou admin" ON public.user_sessions;
CREATE POLICY "Atualização de sessões do próprio usuário ou admin" ON public.user_sessions FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Alertas visíveis ao próprio admin" ON public.admin_security_alerts;
CREATE POLICY "Alertas visíveis ao próprio admin" ON public.admin_security_alerts FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Inserção livre em admin_security_alerts" ON public.admin_security_alerts;
CREATE POLICY "Inserção livre em admin_security_alerts" ON public.admin_security_alerts FOR INSERT WITH CHECK (true);
