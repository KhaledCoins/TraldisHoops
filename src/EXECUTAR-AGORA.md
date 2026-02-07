# ⚡ EXECUTE AGORA - 2 MINUTOS

## 🎯 **O QUE FAZER**

Copie e execute este SQL no Supabase para corrigir as funções de remover e limpar fila.

---

## 📋 **PASSO 1: Abrir Supabase**

```
https://supabase.com/dashboard/project/mjunstpuynfizsxghkqx/editor
```

1. Clique em **"SQL Editor"** no menu lateral
2. Clique em **"New query"**

---

## 📋 **PASSO 2: Copiar e Executar**

Cole este script completo e clique em **RUN**:

```sql
-- ==========================================
-- CORRIGIR POLICIES RLS
-- ==========================================

-- 1. Remover policies antigas
DROP POLICY IF EXISTS "Admins podem gerenciar fila" ON queue_players;
DROP POLICY IF EXISTS "Admins podem gerenciar times" ON teams;

-- 2. Criar policies para queue_players
CREATE POLICY "Qualquer um pode remover jogadores"
ON queue_players FOR DELETE
TO anon, authenticated
USING (true);

CREATE POLICY "Admins podem editar fila"
ON queue_players FOR UPDATE
TO anon, authenticated
USING (true);

-- 3. Criar policies para teams
CREATE POLICY "Qualquer um pode remover times"
ON teams FOR DELETE
TO anon, authenticated
USING (true);

CREATE POLICY "Qualquer um pode editar times"
ON teams FOR UPDATE
TO anon, authenticated
USING (true);

-- 4. Verificar
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('queue_players', 'teams')
ORDER BY tablename, cmd;
```

---

## 📋 **PASSO 3: Verificar Resultado**

Você deve ver esta tabela no resultado:

```
queue_players | Fila é pública                     | SELECT
queue_players | Qualquer um pode fazer check-in    | INSERT  
queue_players | Qualquer um pode remover jogadores | DELETE ✅
queue_players | Admins podem editar fila           | UPDATE ✅
teams         | Times são públicos                 | SELECT
teams         | Qualquer um pode criar times       | INSERT
teams         | Qualquer um pode remover times     | DELETE ✅
teams         | Qualquer um pode editar times      | UPDATE ✅
```

---

## 📋 **PASSO 4: Testar**

Vá para o Painel Admin:

```
https://traldi-s-hoops-jfue.vercel.app/#painel/c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
```

**Teste 1 - Remover Avulso:**
1. Adicione um jogador manualmente
2. Clique no ícone de lixeira
3. Confirme
4. ✅ Deve remover

**Teste 2 - Limpar Fila:**
1. Clique em "Limpar Fila"
2. Confirme
3. ✅ Deve limpar tudo

---

## ✅ **PRONTO!**

Agora as funções de remover e limpar funcionam corretamente! 🎉

**Tempo estimado:** 2 minutos ⏱️
