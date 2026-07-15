-- OPÇÃO 1: Definir visualizações aleatórias grandes (entre 320 e 1450) apenas para anúncios com 0 ou poucas visualizações
UPDATE trucks
SET views = FLOOR(RANDOM() * 1130 + 320)
WHERE views IS NULL OR views < 50;


-- OPÇÃO 2: Definir visualizações aleatórias grandes (entre 320 e 1450) para ABSOLUTAMENTE TODOS os anúncios atuais do banco
-- UPDATE trucks
-- SET views = FLOOR(RANDOM() * 1130 + 320);


-- OPÇÃO 3: Fazer com que TODOS os novos anúncios cadastrados no futuro já comecem automaticamente com visualizações aleatórias maiores (entre 200 e 500)
-- ALTER TABLE trucks 
-- ALTER COLUMN views SET DEFAULT floor(random() * 300 + 200);


-- OPÇÃO 4: Agendar uma tarefa recorrente no Supabase (pg_cron) para adicionar visualizações aleatórias (entre 20 e 80) 
-- a todos os anúncios ativos semanalmente (todo domingo às 00:00).
--
-- Para ativar, execute no SQL Editor:
-- SELECT cron.schedule(
--   'adicionar-visualizacoes-semanais',
--   '0 0 * * 0', -- Expressão Cron: Todo domingo às 00:00
--   $$ UPDATE trucks SET views = COALESCE(views, 0) + FLOOR(RANDOM() * 60 + 20) WHERE vendido = false AND status = 'aprovado' $$
-- );
--
-- Se você quiser remover essa automação semanal no futuro, execute no SQL Editor:
-- SELECT cron.unschedule('adicionar-visualizacoes-semanais');
