# Conectar Supabase com Cursor

Há duas formas de “conectar” o Supabase ao seu fluxo no Cursor:

---

## 1. Fazer o app usar o Supabase (obrigatório para rodar o projeto)

O código já está preparado; falta só as variáveis de ambiente.

### Passos

1. **Crie um arquivo `.env` na raiz do projeto** (mesma pasta do `package.json`).

2. **Copie o conteúdo do `.env.example`** e preencha com os dados do seu projeto Supabase:

   ```
   VITE_SUPABASE_URL=https://mjunstpuynfizsxghkqx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   Use a **URL do projeto** e a **anon key (pública)** do dashboard:  
   [Supabase → Settings → API](https://supabase.com/dashboard/project/mjunstpuynfizsxghkqx/settings/api).

3. **Reinicie o servidor de desenvolvimento** (parar e rodar de novo `npm run dev`).

O app (Fila, Painel Admin, Fila ao Vivo, etc.) passará a usar esse projeto Supabase. O Cursor não precisa de configuração extra para isso.

---

## 2. Conectar o Cursor ao Supabase via MCP (opcional)

Com o **Supabase MCP** no Cursor, o assistente de IA pode, por exemplo:

- Ver tabelas e schema
- Rodar consultas SQL
- Ajudar com migrations e tipos

### Passos

1. **Criar um Personal Access Token (PAT) no Supabase**
   - Acesse: [Supabase Dashboard → Account → Access Tokens](https://supabase.com/dashboard/account/tokens) (ou **Settings → Access Tokens**).
   - Crie um token e copie o valor (ele não será mostrado de novo).

2. **Configurar o MCP no Cursor**
   - Na raiz do projeto, crie (ou edite) o arquivo:
     - **`.cursor/mcp.json`**  
     Ou use em Cursor: **Settings → Cursor Settings → MCP** e adicione o servidor.
   - Conteúdo sugerido do MCP (substitua `<<SEU_PAT>>` pelo token):

   ```json
   {
     "mcpServers": {
       "supabase": {
         "command": "npx",
         "args": [
           "-y",
           "@supabase/mcp-server-supabase@latest",
           "--access-token",
           "<<SEU_PAT>>"
         ]
       }
     }
   }
   ```

3. **Reiniciar o Cursor**  
   Após salvar, feche e abra o Cursor (ou recarregue a janela). O status do MCP deve aparecer como conectado (indicador verde, se disponível).

### Referências

- [Supabase – MCP Server](https://supabase.com/features/mcp-server)
- [Como conectar Supabase ao Cursor via MCP](https://generativeai.pub/how-to-connect-your-supabase-db-to-cursor-via-mcp-3b739924c1c0)

---

**Resumo:** para o **Traldi's Hoops** funcionar com Supabase, basta o **item 1** (arquivo `.env`). O **item 2** é opcional e serve para o Cursor (IA) interagir diretamente com o seu projeto Supabase.
