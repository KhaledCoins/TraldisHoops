-- ==========================================
-- 🔧 CORRIGIR POLICIES RLS - REMOVER AVULSO E LIMPAR FILA
-- ==========================================
-- 
-- PROBLEMA: As funções de remover jogador e limpar fila não funcionam
-- porque as policies RLS só permitem DELETE para usuários "authenticated",
-- mas o sistema usa chave "anon" (sem login).
--
-- SOLUÇÃO: Atualizar as policies para permitir DELETE também para "anon"
--
-- ==========================================

-- 1️⃣ REMOVER POLICIES ANTIGAS
-- ==========================================

-- Remover policies antigas de queue_players
DROP POLICY IF EXISTS "Admins podem gerenciar fila" ON queue_players;

-- Remover policies antigas de teams
DROP POLICY IF EXISTS "Admins podem gerenciar times" ON teams;

-- ==========================================
-- 2️⃣ CRIAR NOVAS POLICIES PARA queue_players
-- ==========================================

-- Permitir DELETE para todos (admin sem autenticação)
CREATE POLICY "Qualquer um pode remover jogadores"
ON queue_players FOR DELETE
TO anon, authenticated
USING (true);

-- Permitir UPDATE para todos (admin sem autenticação)
CREATE POLICY "Admins podem editar fila"
ON queue_players FOR UPDATE
TO anon, authenticated
USING (true);

-- ==========================================
-- 3️⃣ CRIAR NOVAS POLICIES PARA teams
-- ==========================================

-- Permitir DELETE para todos (admin sem autenticação)
CREATE POLICY "Qualquer um pode remover times"
ON teams FOR DELETE
TO anon, authenticated
USING (true);

-- Permitir UPDATE para todos (admin sem autenticação)
CREATE POLICY "Qualquer um pode editar times"
ON teams FOR UPDATE
TO anon, authenticated
USING (true);

-- ==========================================
-- 4️⃣ VERIFICAR SE AS POLICIES FORAM CRIADAS
-- ==========================================

-- Listar todas as policies de queue_players
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'queue_players';

-- Listar todas as policies de teams
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'teams';

-- ==========================================
-- ✅ TESTE
-- ==========================================

-- 1. Execute este script completo no Supabase SQL Editor
-- 2. Teste remover um jogador avulso no Painel Admin
-- 3. Teste limpar a fila no Painel Admin
-- 4. Ambos devem funcionar agora! 🎉
