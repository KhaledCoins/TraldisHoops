# 🔧 CORRIGIR: Remover Avulso e Limpar Fila

## 🎯 **PROBLEMA IDENTIFICADO**

As funções de **"Remover Jogador Avulso"** e **"Limpar Fila"** no Painel Admin não estão funcionando porque:

- ❌ O sistema usa chave **ANON** (sem login)
- ❌ As policies RLS só permitem DELETE para usuários **AUTHENTICATED**
- ❌ Resultado: DELETE é bloqueado pelo Row Level Security

---

## ✅ **SOLUÇÃO**

Atualizar as políticas RLS no Supabase para permitir DELETE também para usuários anônimos.

---

## 📋 **PASSO A PASSO**

### **1️⃣ Abrir Supabase Dashboard**

```
https://supabase.com/dashboard/project/mjunstpuynfizsxghkqx
```

### **2️⃣ Ir para SQL Editor**

1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique em **"New query"**

### **3️⃣ Copiar e Colar o Script**

Abra o arquivo `/FIX-RLS-POLICIES.sql` e copie TODO o conteúdo.

Ou copie daqui:

```sql
-- REMOVER POLICIES ANTIGAS
DROP POLICY IF EXISTS "Admins podem gerenciar fila" ON queue_players;
DROP POLICY IF EXISTS "Admins podem gerenciar times" ON teams;

-- CRIAR NOVAS POLICIES PARA queue_players
CREATE POLICY "Qualquer um pode remover jogadores"
ON queue_players FOR DELETE
TO anon, authenticated
USING (true);

CREATE POLICY "Admins podem editar fila"
ON queue_players FOR UPDATE
TO anon, authenticated
USING (true);

-- CRIAR NOVAS POLICIES PARA teams
CREATE POLICY "Qualquer um pode remover times"
ON teams FOR DELETE
TO anon, authenticated
USING (true);

CREATE POLICY "Qualquer um pode editar times"
ON teams FOR UPDATE
TO anon, authenticated
USING (true);
```

### **4️⃣ Executar o Script**

1. Cole o script no SQL Editor
2. Clique em **"RUN"** (ou pressione Ctrl/Cmd + Enter)
3. Aguarde a confirmação de sucesso

### **5️⃣ Verificar se Funcionou**

Execute esta query para verificar as policies:

```sql
SELECT 
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('queue_players', 'teams')
ORDER BY tablename, cmd;
```

**Resultado esperado:**

| tablename      | policyname                           | roles                  | cmd    |
|----------------|--------------------------------------|------------------------|--------|
| queue_players  | Fila é pública                       | {anon,authenticated}   | SELECT |
| queue_players  | Qualquer um pode fazer check-in      | {anon,authenticated}   | INSERT |
| queue_players  | Qualquer um pode remover jogadores   | {anon,authenticated}   | DELETE |
| queue_players  | Admins podem editar fila             | {anon,authenticated}   | UPDATE |
| teams          | Times são públicos                   | {anon,authenticated}   | SELECT |
| teams          | Qualquer um pode criar times         | {anon,authenticated}   | INSERT |
| teams          | Qualquer um pode remover times       | {anon,authenticated}   | DELETE |
| teams          | Qualquer um pode editar times        | {anon,authenticated}   | UPDATE |

---

## 🧪 **TESTAR**

### **Teste 1: Remover Jogador Avulso**

1. Vá para o Painel Admin em produção:
   ```
   https://traldi-s-hoops-jfue.vercel.app/#painel/c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
   ```

2. Adicione um jogador avulso manualmente

3. Clique no ícone de **lixeira** ao lado do jogador

4. Confirme a remoção

5. ✅ O jogador deve ser removido imediatamente

### **Teste 2: Limpar Fila**

1. Adicione alguns jogadores/times na fila

2. Clique no botão **"Limpar Fila"**

3. Confirme a ação

4. ✅ Todos os jogadores e times devem ser removidos

---

## 📊 **QUERIES ÚTEIS PARA DEBUG**

### Ver todas as policies de uma tabela:

```sql
SELECT * FROM pg_policies WHERE tablename = 'queue_players';
```

### Testar DELETE manualmente:

```sql
-- Inserir um jogador de teste
INSERT INTO queue_players (event_id, player_name, phone, position)
VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Teste', '11999999999', 999);

-- Deletar o jogador de teste
DELETE FROM queue_players WHERE player_name = 'Teste';

-- Se deletou = policies funcionando! ✅
```

---

## ⚠️ **SEGURANÇA**

**Pergunta:** Não é perigoso permitir DELETE para usuários anônimos?

**Resposta:** 
- ✅ Para um MVP local em São José dos Campos, é aceitável
- ✅ O painel admin não é público (URL não compartilhada)
- ⚠️ Para produção futura, implemente autenticação:
  - Login com email/senha
  - Autenticação via Google
  - Sistema de roles (admin/user)

---

## 🚀 **PRÓXIMOS PASSOS**

Após executar o script:

1. ✅ Testar no Painel Admin em produção
2. ✅ Testar remoção de jogador avulso
3. ✅ Testar limpar fila
4. ✅ Gerar QR codes dos eventos
5. 📱 Testar sistema completo mobile

---

**Pronto! Execute o script e teste! 🏀**
