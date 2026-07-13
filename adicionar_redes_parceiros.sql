-- SCRIPT SQL PARA ADICIONAR COLUNAS DE REDES SOCIAIS NA TABELA DE PARCEIROS
-- Execute este script no SQL Editor do seu console do Supabase (https://supabase.com)

-- Adiciona as colunas 'instagram' e 'facebook' na tabela 'parceiros' caso não existam
ALTER TABLE public.parceiros ADD COLUMN IF NOT EXISTS instagram text;
ALTER TABLE public.parceiros ADD COLUMN IF NOT EXISTS facebook text;
