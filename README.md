# Traldi's Hoops

Sistema de **fila digital** para eventos de basquete (São José dos Campos, SP).  
Site institucional + Fila + Painel Admin + Painel TV.  
Stack: **React (Vite)** + **Supabase** + **Vercel**.

- Repositório: [github.com/KhaledCoins/TraldisHoops](https://github.com/KhaledCoins/TraldisHoops)
- Design original: [Figma – Traldi's Hoops Website](https://www.figma.com/design/XCc6aMj5Hmsp9ZegczKzXv/Traldi-s-Hoops-Website)

---

## Rodar localmente

```bash
npm i
npm run dev
```

Abre em **http://localhost:3000**.

---

## Enviar para o GitHub (primeira vez)

Na pasta do projeto, no **CMD** ou **Git Bash**:

```bash
git init
git branch -M main
git remote add origin https://github.com/KhaledCoins/TraldisHoops.git
git add -A
git commit -m "Traldis Hoops - Fila digital, Painel Admin, Painel TV, Supabase"
git push -u origin main
```

Ou execute o script: **`push-to-github.bat`** (duplo clique no Windows).

---

## Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login.
2. **Add New** → **Project** → **Import Git Repository** → escolha **KhaledCoins/TraldisHoops**.
3. **Framework Preset:** Vite. **Root Directory:** (deixe em branco). **Build Command:** `npm run build`. **Output Directory:** `build` (ou `dist` se o Vite estiver gerando em `dist`).
4. Em **Environment Variables** adicione:
   - `VITE_SUPABASE_URL` = URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` = Chave anônima (anon key) do Supabase
5. **Deploy**.

Após o deploy, a URL do QR Code da fila será:  
`https://seu-projeto.vercel.app/#fila/{eventId}`.

---

## Variáveis de ambiente

| Variável | Uso |
|----------|-----|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima (public) do Supabase |

Crie um arquivo `.env` na raiz para desenvolvimento (não commitar). Na Vercel, configure em **Settings → Environment Variables**.
