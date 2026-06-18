-- ==============================================
-- CHAT INTERNO entre comprador e vendedor
-- ==============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id    uuid NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  sender_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     text NOT NULL CHECK (char_length(content) <= 500),
  lida        boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_truck ON chat_messages(truck_id);
CREATE INDEX IF NOT EXISTS idx_chat_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_receiver ON chat_messages(receiver_id);

-- RLS: usuário vê apenas suas mensagens
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_select" ON chat_messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "chat_insert" ON chat_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "chat_delete" ON chat_messages
  FOR DELETE USING (sender_id = auth.uid());

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;


-- ==============================================
-- BUSCA SALVA com alertas por e-mail
-- ==============================================
CREATE TABLE IF NOT EXISTS saved_searches (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marca      text,
  ano_min    int,
  ano_max    int,
  preco_max  int,
  estado     text,
  termo      text,
  ativo      boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);

-- RLS: usuário gerencia apenas suas buscas
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "searches_select" ON saved_searches
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "searches_insert" ON saved_searches
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "searches_delete" ON saved_searches
  FOR DELETE USING (user_id = auth.uid());

-- ==============================================
-- INSTRUÇÕES DE USO
-- ==============================================
-- 1. Cole este SQL no Supabase > SQL Editor > New query > Run
-- 2. Habilite Realtime para a tabela chat_messages:
--    Supabase > Database > Replication > supabase_realtime > Add table: chat_messages
-- 3. O mapa usa: /app/mapa/page.tsx (rota /mapa)
-- 4. ChatWidget: importe em qualquer página de detalhe do caminhão
-- 5. SalvarBusca: importe na SearchBar ou página de listagem
