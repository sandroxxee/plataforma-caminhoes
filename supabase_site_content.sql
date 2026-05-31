-- Execute este arquivo no Supabase SQL Editor.
-- Ele cria a tabela que guarda os textos editáveis da home.
-- Seguro: não apaga anúncios, usuários, fotos ou tabelas existentes.

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "site_content_select_public" on public.site_content;
create policy "site_content_select_public"
on public.site_content
for select
using (true);

drop policy if exists "site_content_admin_insert" on public.site_content;
create policy "site_content_admin_insert"
on public.site_content
for insert
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "site_content_admin_update" on public.site_content;
create policy "site_content_admin_update"
on public.site_content
for update
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

insert into public.site_content (id, content)
values (
  'home',
  '{
    "heroMini": "Caminhões reais • Dados claros • WhatsApp direto",
    "heroTitle": "Encontre caminhões com informação clara e contato direto.",
    "heroSubtitle": "Veja valor, cidade, configuração e chame no WhatsApp para confirmar disponibilidade, pedir fotos, vídeo e negociar.",
    "primaryButtonText": "Ver caminhões",
    "primaryButtonHref": "/anuncios",
    "secondaryButtonText": "Anunciar caminhão",
    "secondaryButtonHref": "/anunciar",
    "trust1Title": "Contato direto",
    "trust1Text": "Negociação pelo WhatsApp",
    "trust2Title": "Anúncios claros",
    "trust2Text": "Valor, cidade e configuração",
    "trust3Title": "Mais visibilidade",
    "trust3Text": "Para quem quer vender",
    "trust4Title": "Estoque organizado",
    "trust4Text": "Leitura rápida no celular",
    "buyerTitle": "Para quem compra",
    "buyerText": "Informação objetiva antes de chamar. Menos enrolação e mais clareza.",
    "sellerTitle": "Para quem vende",
    "sellerText": "Vitrine organizada para divulgar melhor o caminhão e gerar contato.",
    "securityTitle": "Mais segurança",
    "securityText": "Informação objetiva, contato humano e anúncio com aparência profissional.",
    "sellMini": "Anunciar caminhão",
    "sellTitle": "Venda com mais apresentação.",
    "sellText": "Um anúncio bem organizado passa mais confiança e ajuda o comprador chamar já sabendo o básico do caminhão.",
    "finalMini": "Caminhões à venda",
    "finalTitle": "Veja o estoque completo ou anuncie seu caminhão."
  }'::jsonb
)
on conflict (id) do nothing;
