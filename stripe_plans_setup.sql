-- Tabela de Planos (plans)
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  interval TEXT NOT NULL, -- 'month' ou 'year'
  max_ads INTEGER, -- limite de anuncios (null = ilimitado)
  featured_ads INTEGER DEFAULT 0, -- anuncios destacados inclusos
  chat_enabled BOOLEAN DEFAULT TRUE,
  stripe_price_id TEXT, -- ID do preco cadastrado no Stripe
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Assinaturas (subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id),
  status TEXT NOT NULL, -- 'active', 'expired', 'canceled'
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilita Row Level Security (RLS) para seguranca
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Politicas de acesso para planos (qualquer um logado ou anonimo pode ver planos ativos)
CREATE POLICY "Allow public read-only of plans" ON public.plans
  FOR SELECT USING (is_active = true);

-- Politicas de acesso para assinaturas (apenas o proprio usuario pode ler suas assinaturas)
CREATE POLICY "Allow users to read their own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Ativa a publicacao de tempo real (Realtime) do Supabase para assinaturas
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
