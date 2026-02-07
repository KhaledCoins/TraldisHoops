# ✅ RESPOSTA PARA O CURSOR

## 1️⃣ .ENV ESTÁ CORRETO? ✅

Sim! O arquivo `.env` já foi criado com:

```env
VITE_SUPABASE_URL=https://mjunstpuynfizsxghkqx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qdW5zdHB1eW5maXpzeGdoa3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTE2ODMsImV4cCI6MjA4NjAyNzY4M30.9v90syprroHLRrPKqjVA0_2hECPS6fTiYsx47BmgBHM
```

---

## 2️⃣ MIGRATION ESTÁ DISPONÍVEL? ✅

Sim! Criamos o arquivo completo:

**📂 Localização:**
```
/supabase/migrations/002_schema_for_queue_system.sql
```

**📋 Conteúdo:**
- ✅ 5 Tabelas (events, queue_players, teams, matches, contact_messages)
- ✅ 6 Índices para performance
- ✅ RLS habilitado em todas as tabelas
- ✅ 11 Policies de segurança
- ✅ 3 Eventos inseridos (seed data)
- ✅ Comentários para habilitar Realtime

---

## 3️⃣ O QUE FAZER AGORA?

### Opção A: SE O BANCO JÁ ESTÁ CRIADO ✅ (RECOMENDADO)

**Você já rodou os scripts antes, certo?**

Então o schema já está OK! Pode pular para:

```bash
npm install
npm run dev
```

### Opção B: SE O BANCO ESTÁ VAZIO ⚠️

**Caso precise criar tudo do zero:**

1. Acessar Supabase:
   - Dashboard: https://supabase.com/dashboard/project/mjunstpuynfizsxghkqx
   - SQL Editor: https://supabase.com/dashboard/project/mjunstpuynfizsxghkqx/sql/new

2. Copiar TODO o conteúdo de:
   ```
   /supabase/migrations/002_schema_for_queue_system.sql
   ```

3. Colar no SQL Editor do Supabase

4. Clicar em "RUN"

5. Verificar resultado:
   ```sql
   SELECT * FROM events;
   ```
   Deve mostrar 3 eventos.

---

## 4️⃣ VERIFICAR SE O BANCO JÁ ESTÁ CRIADO

**Rode este SQL no Supabase SQL Editor:**

```sql
-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Resultado esperado (5 tabelas):**
- contact_messages
- events
- matches
- queue_players
- teams

### ✅ SE APARECER AS 5 TABELAS:
**O BANCO JÁ ESTÁ PRONTO!** Não precisa rodar a migration. Pode ir direto para:

```bash
npm install
npm run dev
```

### ❌ SE NÃO APARECER AS TABELAS:
**Rode a migration `002_schema_for_queue_system.sql`** conforme Opção B acima.

---

## 5️⃣ CHECKLIST RÁPIDO

Antes de continuar, confirme:

- [x] `.env` existe e contém as credenciais corretas
- [ ] Banco Supabase tem as 5 tabelas criadas
- [ ] Evento "Tardezinha Traldi's Hoops" está ativo
- [ ] Realtime está habilitado (Settings → API → Realtime)

---

## 6️⃣ PRÓXIMOS COMANDOS

Depois de verificar tudo acima:

```bash
# 1. Instalar dependências
npm install

# 2. Rodar projeto
npm run dev

# 3. Abrir navegador
# http://localhost:5173

# 4. Testar realtime
# Aba 1: Painel TV
# Aba 2: Painel Admin (adicionar jogador)
# Aba 1: Verificar se atualiza automaticamente
```

---

## 🆘 PROBLEMAS COMUNS

### "Table does not exist"
**Solução:** Rodar migration `002_schema_for_queue_system.sql` no Supabase

### "Permission denied"
**Solução:** Verificar RLS policies estão criadas (já estão no SQL)

### "Realtime not working"
**Solução:** Habilitar Realtime manualmente:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE queue_players;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
```

---

## ✅ RESUMO PARA O CURSOR

1. ✅ `.env` criado e configurado
2. ✅ Migration `002_schema_for_queue_system.sql` disponível
3. ⚠️ **VERIFICAR:** Banco Supabase já tem as tabelas?
   - Se SIM → `npm install` → `npm run dev`
   - Se NÃO → Rodar migration no Supabase → depois `npm install`

---

**Está tudo pronto! 🚀**
