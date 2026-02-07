# 🔐 AUTENTICAÇÃO DO PAINEL ADMIN

## 📋 **RESUMO**

O Painel Admin agora requer autenticação com senha para acesso.

**Senha:** `khaledaoferoz`

---

## ✨ **FUNCIONALIDADES**

### **1️⃣ Tela de Login**
- Interface minimalista com identidade visual da marca
- Campo de senha com opção de mostrar/ocultar
- Feedback visual de erro em caso de senha incorreta
- Mobile-first (responsivo)

### **2️⃣ Sessão Persistente**
- Sessão dura **24 horas**
- Armazenada no localStorage do navegador
- Logout manual disponível

### **3️⃣ Proteção de Rotas**
- Acesso ao painel bloqueado sem autenticação
- Redirect automático para login
- Botão de logout no header do painel

---

## 🔧 **ARQUIVOS CRIADOS/MODIFICADOS**

### **Novos Arquivos:**

1. **`/hooks/useAdminAuth.ts`**
   - Hook customizado de autenticação
   - Gerencia login, logout e verificação de sessão
   - Duração da sessão: 24h

2. **`/components/AdminLogin.tsx`**
   - Componente da tela de login
   - Design minimalista preto/branco
   - Validação de senha em tempo real

### **Modificados:**

3. **`/pages/PainelAdmin.tsx`**
   - Importa hooks de autenticação
   - Verifica autenticação antes de renderizar
   - Adiciona botão de logout no header

---

## 🚀 **COMO USAR**

### **Acessar o Painel Admin:**

1. Navegue até:
   ```
   https://traldi-s-hoops-jfue.vercel.app/#painel/c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33
   ```

2. Digite a senha: **`khaledaoferoz`**

3. Clique em **ENTRAR**

4. ✅ Acesso liberado por 24 horas!

### **Fazer Logout:**

1. No header do painel, clique no ícone de **logout** (porta com seta)

2. ✅ Sessão encerrada imediatamente

3. Será redirecionado para a tela de login

---

## 🔐 **SEGURANÇA**

### **Como Funciona:**

- ✅ Senha hardcoded no código (para MVP)
- ✅ Sessão armazenada no localStorage
- ✅ Expiração automática após 24h
- ✅ Logout manual disponível

### **Observações:**

⚠️ **Para MVP:**
- Senha hardcoded é aceitável para uso local em São José dos Campos
- Não é recomendado para produção em larga escala

🔒 **Para Produção Futura:**
- Implementar autenticação com Supabase Auth
- Usar hash de senha (bcrypt)
- Adicionar sistema de roles (admin/moderador)
- Implementar 2FA (autenticação de dois fatores)

---

## 📊 **FLUXO DE AUTENTICAÇÃO**

```
┌─────────────────────────────────────────┐
│ Usuário acessa Painel Admin             │
└─────────────────┬───────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ Verificar      │
         │ localStorage   │
         └────────┬───────┘
                  │
         ┌────────┴────────┐
         │                 │
    Sessão               Não
    Válida?            Autenticado
         │                 │
         ▼                 ▼
    ┌─────────┐      ┌──────────┐
    │ Painel  │      │ Tela de  │
    │ Admin   │      │ Login    │
    └─────────┘      └────┬─────┘
                          │
                          ▼
                    ┌──────────────┐
                    │ Digite senha │
                    └──────┬───────┘
                           │
                      ┌────┴────┐
                      │         │
                   Correta    Errada
                      │         │
                      ▼         ▼
                 ┌────────┐  ┌──────┐
                 │ Salvar │  │ Erro │
                 │ Sessão │  └──────┘
                 └───┬────┘
                     │
                     ▼
              ┌─────────────┐
              │ Painel Admin│
              └─────────────┘
```

---

## 🧪 **TESTE LOCAL**

1. **Primeiro Acesso:**
   - Acessar URL do painel
   - Ver tela de login
   - Digitar senha correta
   - Acessar painel

2. **Sessão Persistente:**
   - Fechar navegador
   - Abrir novamente
   - Acessar URL do painel
   - ✅ Já está logado (sem pedir senha novamente)

3. **Logout:**
   - Clicar em logout
   - Ver tela de login novamente
   - Sessão encerrada

4. **Senha Incorreta:**
   - Digitar senha errada
   - Ver mensagem de erro
   - Campo limpa automaticamente

---

## 📱 **MOBILE-FIRST**

A tela de login é totalmente responsiva:

- ✅ Funciona em qualquer tamanho de tela
- ✅ Touch-friendly (botões grandes)
- ✅ Autofocus no campo de senha
- ✅ Teclado aparece automaticamente no mobile

---

## 🎨 **DESIGN**

**Identidade Visual:**
- Fundo preto
- Texto branco
- Ícone de cadeado
- Estilo minimalista
- Bordar 2px (consistente com o resto do sistema)

**Elementos:**
- Logo/Ícone de cadeado
- Título "PAINEL ADMIN"
- Subtítulo "Traldi's Hoops"
- Campo de senha com mostrar/ocultar
- Botão de login
- Mensagem de erro (quando aplicável)

---

## 🔄 **PRÓXIMOS PASSOS (FUTURO)**

Para produção robusta:

1. **Supabase Auth:**
   ```ts
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'admin@traldishoops.com',
     password: senha
   })
   ```

2. **Roles e Permissões:**
   - Admin (acesso total)
   - Moderador (apenas controle de fila)
   - Visualizador (apenas leitura)

3. **Logs de Auditoria:**
   - Quem fez login
   - Quais ações foram executadas
   - Timestamp de cada ação

4. **2FA (Two-Factor Authentication):**
   - Código SMS
   - Google Authenticator
   - Email de confirmação

---

## ⚠️ **IMPORTANTE**

### **Senha Atual:**
```
khaledaoferoz
```

### **Onde Alterar:**
Arquivo: `/hooks/useAdminAuth.ts`
```ts
const ADMIN_PASSWORD = 'khaledaoferoz'; // <- Alterar aqui
```

### **Duração da Sessão:**
Arquivo: `/hooks/useAdminAuth.ts`
```ts
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas
```

---

**Sistema de autenticação implementado com sucesso! 🎉**
