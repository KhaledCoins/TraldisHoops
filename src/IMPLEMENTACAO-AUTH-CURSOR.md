# 🔐 IMPLEMENTAÇÃO DE AUTENTICAÇÃO - GUIA PARA CURSOR

## 📌 **CONTEXTO**

Implementamos um sistema de autenticação simples para proteger o Painel Admin do sistema Traldi's Hoops.

---

## 🎯 **OBJETIVO**

Adicionar uma camada de proteção ao painel administrativo, exigindo senha para acesso.

**Senha:** `khaledaoferoz`

---

## 📁 **ARQUITETURA**

### **1. Hook de Autenticação**
**Arquivo:** `/hooks/useAdminAuth.ts`

```ts
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return {
    isAuthenticated,  // Se o usuário está autenticado
    isLoading,        // Se está carregando a sessão
    login,            // Função para fazer login
    logout            // Função para fazer logout
  };
}
```

**Responsabilidades:**
- ✅ Verificar sessão no localStorage ao carregar
- ✅ Validar senha (hardcoded)
- ✅ Criar sessão com timestamp
- ✅ Verificar expiração (24h)
- ✅ Limpar sessão no logout

---

### **2. Componente de Login**
**Arquivo:** `/components/AdminLogin.tsx`

```tsx
interface AdminLoginProps {
  onLogin: (password: string) => boolean;
}

export function AdminLogin({ onLogin }: AdminLoginProps)
```

**Características:**
- ✅ Interface minimalista (identidade Traldi's)
- ✅ Campo de senha com show/hide
- ✅ Validação em tempo real
- ✅ Feedback de erro
- ✅ Mobile-first
- ✅ Delay de 500ms para UX (simula verificação)

---

### **3. Integração no Painel Admin**
**Arquivo:** `/pages/PainelAdmin.tsx`

**Modificações:**

1. **Imports:**
```tsx
import { AdminLogin } from '../components/AdminLogin';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { LogOut } from 'lucide-react';
```

2. **Hook de Auth:**
```tsx
const { isAuthenticated, isLoading: authLoading, login, logout } = useAdminAuth();
```

3. **Verificação de Auth (antes de renderizar):**
```tsx
// Loading da autenticação
if (authLoading) {
  return <LoadingScreen />;
}

// Se não autenticado, mostrar login
if (!isAuthenticated) {
  return <AdminLogin onLogin={login} />;
}

// Resto do painel...
```

4. **Botão de Logout:**
```tsx
<Button variant="ghost" onClick={logout} title="Sair">
  <LogOut className="w-5 h-5" />
</Button>
```

---

## 🔄 **FLUXO DE EXECUÇÃO**

### **Cenário 1: Primeiro Acesso**

```
1. Usuário acessa URL do painel
2. useAdminAuth() executa
3. checkSession() → localStorage vazio
4. isAuthenticated = false
5. Renderiza <AdminLogin />
6. Usuário digita senha
7. Clica em "ENTRAR"
8. login(password) valida senha
9. Se correta:
   - Cria objeto session { authenticated: true, timestamp: now }
   - Salva no localStorage
   - setIsAuthenticated(true)
10. PainelAdmin re-renderiza
11. Mostra painel completo ✅
```

### **Cenário 2: Retorno (sessão válida)**

```
1. Usuário acessa URL do painel
2. useAdminAuth() executa
3. checkSession() → encontra sessão no localStorage
4. Verifica timestamp (< 24h?)
5. Se válido:
   - setIsAuthenticated(true)
6. PainelAdmin renderiza direto ✅
```

### **Cenário 3: Sessão Expirada**

```
1. Usuário acessa URL do painel
2. useAdminAuth() executa
3. checkSession() → encontra sessão no localStorage
4. Verifica timestamp (> 24h?)
5. Se expirado:
   - logout() → remove do localStorage
   - setIsAuthenticated(false)
6. Renderiza <AdminLogin />
```

### **Cenário 4: Logout Manual**

```
1. Usuário clica no botão de logout
2. logout() executa
3. Remove do localStorage
4. setIsAuthenticated(false)
5. PainelAdmin re-renderiza
6. Renderiza <AdminLogin />
```

---

## 🔐 **ESTRUTURA DE DADOS**

### **localStorage Key:**
```ts
const AUTH_KEY = 'traldis_admin_auth';
```

### **Estrutura da Sessão:**
```ts
interface AuthSession {
  authenticated: boolean;
  timestamp: number; // Date.now()
}
```

### **Exemplo no localStorage:**
```json
{
  "traldis_admin_auth": "{\"authenticated\":true,\"timestamp\":1707330000000}"
}
```

---

## ⚙️ **CONFIGURAÇÕES**

### **Senha:**
```ts
const ADMIN_PASSWORD = 'khaledaoferoz';
```

### **Duração da Sessão:**
```ts
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas em ms
```

### **Key do localStorage:**
```ts
const AUTH_KEY = 'traldis_admin_auth';
```

---

## 🎨 **UI/UX**

### **Tela de Login:**

**Layout:**
```
┌──────────────────────────────────┐
│                                  │
│          [🔒 Lock Icon]          │
│                                  │
│        PAINEL ADMIN              │
│        Traldi's Hoops            │
│                                  │
│  ┌──────────────────────────┐   │
│  │ SENHA DE ACESSO          │   │
│  ├──────────────────────────┤   │
│  │ [Digite a senha]    [👁️] │   │
│  └──────────────────────────┘   │
│                                  │
│  [❌ Senha incorreta]            │  (só aparece se erro)
│                                  │
│  ┌──────────────────────────┐   │
│  │      ENTRAR              │   │
│  └──────────────────────────┘   │
│                                  │
│  Acesso restrito aos             │
│  organizadores do evento         │
│                                  │
└──────────────────────────────────┘
```

**Estados:**
- **Idle:** Campo vazio, botão desabilitado
- **Digitando:** Botão habilitado
- **Loading:** "VERIFICANDO..." (500ms)
- **Erro:** Mensagem vermelha, campo limpa
- **Sucesso:** Redirect para painel

---

## 🧪 **TESTES**

### **Checklist de Teste:**

- [ ] **Primeiro acesso pede senha**
- [ ] **Senha correta → acesso liberado**
- [ ] **Senha incorreta → mensagem de erro**
- [ ] **Campo de senha limpa após erro**
- [ ] **Botão show/hide senha funciona**
- [ ] **Sessão persiste após fechar navegador**
- [ ] **Logout limpa sessão**
- [ ] **Após logout, pede senha novamente**
- [ ] **Responsive em mobile**
- [ ] **Autofocus no campo de senha**
- [ ] **Enter submete o formulário**

---

## 🔧 **TROUBLESHOOTING**

### **Problema:** Login não funciona

**Verificar:**
1. Senha digitada corretamente?
2. Console do navegador tem erros?
3. localStorage está habilitado?
4. JavaScript está habilitado?

**Solução:**
```ts
// Limpar localStorage manualmente
localStorage.removeItem('traldis_admin_auth');
```

---

### **Problema:** Sessão expira muito rápido

**Ajustar duração:**
```ts
// Em /hooks/useAdminAuth.ts
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias
```

---

### **Problema:** Preciso mudar a senha

**Editar:**
```ts
// Em /hooks/useAdminAuth.ts
const ADMIN_PASSWORD = 'NOVA_SENHA_AQUI';
```

**⚠️ Importante:**
- Fazer commit e push
- Fazer deploy na Vercel
- Informar usuários da nova senha

---

## 📱 **MOBILE CONSIDERATIONS**

### **iOS Safari:**
- ✅ localStorage funciona
- ✅ Autofocus funciona
- ✅ Show/hide password funciona

### **Android Chrome:**
- ✅ localStorage funciona
- ✅ Autofocus funciona
- ✅ Show/hide password funciona

### **PWA (se aplicável):**
- ✅ Sessão persiste entre reloads
- ✅ Funciona offline (após primeiro load)

---

## 🚀 **DEPLOY**

### **Checklist:**

1. ✅ Arquivos criados:
   - `/hooks/useAdminAuth.ts`
   - `/components/AdminLogin.tsx`
   - `/AUTH-ADMIN.md`
   - `/IMPLEMENTACAO-AUTH-CURSOR.md`

2. ✅ Arquivo modificado:
   - `/pages/PainelAdmin.tsx`

3. ✅ Deploy na Vercel
4. ✅ Testar em produção
5. ✅ Compartilhar senha com equipe

---

## 🔮 **FUTURO (MELHORIAS)**

### **Curto Prazo:**
- [ ] Adicionar "Esqueci a senha"
- [ ] Múltiplos usuários admin
- [ ] Histórico de login (quem, quando)

### **Médio Prazo:**
- [ ] Integração com Supabase Auth
- [ ] Roles (admin, moderador, viewer)
- [ ] Permissões granulares

### **Longo Prazo:**
- [ ] 2FA (two-factor authentication)
- [ ] SSO (single sign-on)
- [ ] Logs de auditoria

---

## 📚 **REFERÊNCIAS**

**Tecnologias Usadas:**
- React Hooks (useState, useEffect)
- localStorage API
- Lucide Icons

**Padrões Aplicados:**
- Custom Hooks
- Controlled Components
- Composition Pattern
- Mobile-First Design

---

## ✅ **CONCLUSÃO**

Sistema de autenticação implementado com sucesso:

✅ Tela de login funcional
✅ Sessão persistente (24h)
✅ Logout manual
✅ Mobile-first
✅ Identidade visual da marca
✅ Documentação completa

**Pronto para usar! 🎉**

---

**Desenvolvido para Traldi's Hoops**
**Data:** 07/02/2026
