# 🔍 AUDITORIA TÉCNICA COMPLETA — TRALDI'S HOOPS

**Data:** 07/02/2026  
**Escopo:** Código-fonte (pages, components, hooks, lib), schema Supabase, documentação e fluxos críticos.

---

## ✅ RESUMO EXECUTIVO

- **Imports e dependências:** OK em geral; 1 dependência quebrada (arquivo inexistente).
- **Componentes:** 1 bug de props (QRCodeGenerator no PainelAdmin).
- **Hooks:** useAdminAuth e useQueue OK; useAdmin sem `winnerTeamId` em endCurrentGame (comportamento documentado).
- **Páginas:** Fila com lógica incorreta em "Jogando agora"; FilaAoVivoAnimated quebra por import.
- **Lib/Supabase:** Tipos e funções alinhados ao uso no app; schema da migration/SUPABASE-SQL divergente do código.
- **Rotas:** Sem leitura de hash na inicialização — link do QR Code não abre direto na fila.
- **Segurança:** Senha no hook; keys em env; RLS documentado no FIX-RLS.
- **Performance:** Subscriptions com cleanup; sem loops infinitos detectados.

---

## 1️⃣ IMPORTS E DEPENDÊNCIAS

| Item | Status | Observação |
|------|--------|------------|
| Imports corretos | ✅ | Paths relativos consistentes (`../components/`, `../hooks/`, `../lib/`). |
| Componentes importam de `./Component` | ✅ | Ex.: AdminLogin usa `./Button`, `./Card`. |
| Hooks de `../hooks/` | ✅ | PainelAdmin, Fila, PainelTV importam useAdmin, useQueue, useAdminAuth corretamente. |
| Lib/supabase onde necessário | ✅ | useQueue, useAdmin, useContactForm importam de `../lib/supabase`. |
| Imports duplicados / não utilizados | ✅ | Nenhum relevante encontrado. |
| **Arquivo inexistente** | ❌ **CRÍTICO** | `FilaAoVivoAnimated.tsx` importa `../lib/realtime-mock`; o arquivo **não existe** em `src/lib/` (só existem `supabase.ts` e `motion-tokens.ts`). A rota `fila-ao-vivo` quebra ao acessar. |

**Correção sugerida (1):** Criar `src/lib/realtime-mock.ts` com `getMockRealtimeClient()` e tipo `QueueState`, ou remover o import e usar dados mock locais na página até integrar Supabase Realtime nessa tela.

---

## 2️⃣ COMPONENTES

| Item | Status | Observação |
|------|--------|------------|
| Export correto | ✅ | Componentes exportados com `export function`. |
| Props tipadas | ✅ | Interfaces definidas (ex.: PainelAdminProps, FilaProps). |
| useState/useEffect | ✅ | Dependências e cleanup adequados nos arquivos auditados. |
| Loading/error em async | ✅ | PainelAdmin, Fila, PainelTV tratam loading e error. |
| **QRCodeGenerator no PainelAdmin** | ❌ **IMPORTANTE** | PainelAdmin usa `<QRCodeGenerator value={qrCodeUrl} size={256} />`, mas o componente declara apenas `eventId` e `eventTitle`. Resultado: `eventId` fica `undefined`, URL vira `.../#fila/undefined` e o `size` é ignorado (canvas fixo 300px). |

**Correção sugerida (2):** Em `PainelAdmin.tsx`, trocar para:

```tsx
<QRCodeGenerator eventId={eventId} eventTitle={event?.title} />
```

E, se quiser tamanho configurável, estender a interface em `QRCodeGenerator.tsx` com `size?: number` e usar em `QRCode.toCanvas(..., { width: size ?? 300, ... })`.

---

## 3️⃣ HOOKS CUSTOMIZADOS

### useAdminAuth.ts
- Sessão no localStorage (chave `traldis_admin_auth`), expiração 24h, login valida senha, logout limpa: **OK**.

### useQueue.ts
- `checkInAsSolo` e `checkAndCreateRandomTeam` (5 avulsos → 1 time): **OK**.
- Subscription realtime via `subscribeToQueue(eventId, loadData)` e cleanup no `useEffect`: **OK**.
- Verificação de duplicado por telefone: usa `.single()`; se houver mais de um registro com mesmo telefone, o Supabase retorna erro. Preferível `.maybeSingle()` e tratar `data` para evitar mensagem genérica.

### useAdmin.ts
- `activateEvent`, `pauseQueue`, `resumeQueue`, `startNextGame`, `endCurrentGame`, `addSoloManually`, `removePlayer`, `removeTeam`, `clearQueue`: **presentes e coerentes**.
- `endCurrentGame()` não recebe `winnerTeamId`: ambos os times voltam ao final da fila; a regra “quem ganha ou perde volta” está atendida. Se no futuro for necessário exibir o vencedor, pode-se acrescentar parâmetro e persistir em `matches.winner_team_id`.
- Subscription realtime e cleanup: **OK**.
- DELETE em `queue_players` e `teams`: dependem das policies do FIX-RLS-POLICIES.sql (anon permitido); sem isso, falham em runtime.

---

## 4️⃣ PÁGINAS

### PainelAdmin.tsx
- useAdminAuth integrado; checagem de auth antes de renderizar; AdminLogin quando não autenticado; logout no header: **OK**.
- Modais para ações destrutivas (remover, limpar fila, pausar): **OK**.
- Problema do QR Code: ver **Correção (2)** acima.
- **Observação:** Não há UI para “Adicionar time completo” (apenas “Adicionar avulso”); o hook já expõe `addTeamManually`. Opcional: adicionar botão/modal para cadastro de time com 5 jogadores.

### Fila.tsx
- useQueue integrado; check-in avulso; evento pausado/encerrado; feedback de erro: **OK**.
- **Bug “Jogando agora”:** O bloco “Jogando agora” usa sempre `teamsQueue[0]` e `teamsQueue[1]` e exibe badge “Jogando”. Quando não há partida em andamento, isso mostra os dois primeiros times da fila (geralmente `waiting`) como se estivessem jogando.

**Correção sugerida (3):** Filtrar times com `status === 'playing'` e só exibir “Jogando agora” quando houver exatamente 2; caso contrário, exibir “Aguardando início” ou “Próximos na fila” com os dois primeiros `waiting`. Exemplo:

```tsx
const playingTeams = teamsQueue.filter(t => t.status === 'playing');
// ...
{playingTeams.length === 2 ? (
  // card com playingTeams[0] vs playingTeams[1]
) : (
  // "Aguardando início" ou próximos 2 waiting
)}
```

- Na “Fila de times”, usar `teamsQueue.filter(t => t.status !== 'playing').slice(0, N)` (ou equivalente) para não duplicar os que estão em jogo.

### PainelTV.tsx
- useQueue(eventId); exibição de jogo atual (2 times `playing`) e fila de times; atualização via realtime: **OK**.
- Fullscreen sem header/footer: **OK** (App não renderiza Header/Footer em `painel-tv`).

### FilaAoVivoAnimated.tsx
- Depende de `realtime-mock` inexistente: **quebra** (ver **Correção (1)**). Animações com motion/react e toasts estão coerentes com o código atual.

---

## 5️⃣ LIB/SUPABASE

### supabase.ts
- `createClient` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`: **OK**.
- Tipos `Event`, `QueuePlayer`, `Team`, `Match`, `ContactMessage`: **OK** e usados no app.
- `subscribeToQueue` retorna função de unsubscribe e usa `removeChannel`: **OK**.
- `updateEventStatus` usa `any` no objeto de update: **melhoria** — tipar com `Partial<Event>` ou interface específica.

### Schema da migration 002 e SUPABASE-SQL.md vs código
- **Divergência crítica:** O schema em `002_schema_for_queue_system.sql` e em SUPABASE-SQL.md não bate com o que o código usa.

| Tabela / Uso no código | Migration / Doc | Problema |
|------------------------|-----------------|----------|
| `queue_players` | `player_name`, `position` obrigatório, sem `player_type` nem `team_id` | Código usa `name`, `player_type`, `team_id` e não envia `position` no INSERT de avulso. |
| `teams` | `team_number`, `player_ids`; status `waiting`/`playing`/`finished` | Código usa `name`, `type`, `position` e status `played`. |
| `matches` | status `scheduled`/`playing`/`finished` | Código usa `in_progress` e `finished`; `getCurrentMatch` filtra por `in_progress`. INSERT com `in_progress` falharia no CHECK atual. |
| `contact_messages` | colunas `name`, `email`, `phone`, `message` | Código e tipo `ContactMessage` usam `subject`; INSERT envia `subject` — coluna não existe na migration. |

Ou o projeto Supabase real foi alterado manualmente (e a migration/doc ficaram desatualizadas) ou o app vai falhar com o schema da migration. É necessário alinhar: **ou** atualizar a migration e a doc para o modelo que o app usa (queue_players com name, player_type, team_id; teams com name, type, position; matches com status in_progress/finished; contact_messages com subject), **ou** alterar o código para o schema atual da migration.

---

## 6️⃣ ROTAS E NAVEGAÇÃO

- **Stack:** React (Vite), não Next.js; roteamento por estado (`currentPage`, `currentEventId`) em `App.tsx`.
- Todas as páginas do tipo `Page` estão mapeadas no `switch`; fallback quando `!currentEventId` para evento/fila/painel-tv/painel-admin redireciona para Eventos: **OK**.
- Páginas fullscreen (`painel-tv`, `painel-admin`) sem header/footer: **OK**.

**Problema:** O link do QR Code é `/#fila/${eventId}`. O `App` **não lê o hash na inicialização**. Quem acessa por esse link cai sempre na home; a fila só abriria se o usuário navegar manualmente até o evento e “Entrar na fila”.

**Correção sugerida (4):** No `App.tsx`, no primeiro render (ex.: `useEffect` no mount), ler `window.location.hash` (ex.: `#fila/c0eebc99-...`), parsear página e `eventId`, e chamar `setCurrentPage` e `setCurrentEventId` para abrir direto na página correta. Atualizar o hash quando navegar para fila/painel (opcional, para compartilhar link).

---

## 7️⃣ TYPESCRIPT

- Tipos e interfaces bem usados nos arquivos auditados; props tipadas; sem `any` desnecessário além do objeto de update em `updateEventStatus`.
- Tipos do Supabase importados de `lib/supabase`: **OK**.

---

## 8️⃣ SEGURANÇA

- Senha do admin em `useAdminAuth.ts` (não no JSX): **OK**.
- Chaves Supabase via `VITE_*`: **OK**.
- RLS documentado em FIX-RLS-POLICIES.sql (DELETE/UPDATE para anon): **OK**; depende de o script ter sido executado no projeto.

---

## 9️⃣ PERFORMANCE

- Subscriptions com cleanup no return do `useEffect` em useQueue e useAdmin: **OK**.
- Sem loops infinitos óbvios; `loadData` estável o suficiente para não causar re-subscribe a cada render (closure usa dados do servidor).

---

## 🔟 UI/UX MOBILE-FIRST

- Layouts responsivos e botões utilizáveis em touch nos fluxos principais; loading e feedback de erro presentes.

---

## 1️⃣1️⃣ CONSISTÊNCIA DE CÓDIGO

- Nomenclatura e estrutura de pastas consistentes; comentários úteis em hooks e SQL.

---

## 1️⃣2️⃣ DOCUMENTAÇÃO

- README, AUTH-ADMIN.md, SUPABASE-SQL.md, FIX-RLS-POLICIES.sql existem e descrevem fluxo e políticas.
- **Ajuste:** SUPABASE-SQL.md e a migration 002 devem ser atualizados para refletir o schema real (ou o schema deve ser alterado para refletir o código), conforme item 5.

---

## FLUXOS CRÍTICOS VALIDADOS

1. **Check-in avulso:** Formulário → `checkInAsSolo` → INSERT em `queue_players` → `checkAndCreateRandomTeam` (5 avulsos → 1 time). Realtime atualiza a fila. **Lógica OK**; depende do schema correto no Supabase (name, player_type, team_id).
2. **Iniciar jogo (admin):** `startNextGame` pega 2 primeiros `waiting`, cria match com status `in_progress`, atualiza times/jogadores para `playing`. **Lógica OK**; status no DB deve ser `in_progress` (ou migration alterada).
3. **Encerrar jogo (admin):** `endCurrentGame` finaliza match, coloca os dois times de volta como `waiting` no final da fila. **OK**; não há seleção de vencedor na UI (ambos voltam).

---

## CLASSIFICAÇÃO DOS PROBLEMAS

| Severidade | Item | Ação |
|------------|------|------|
| **Crítico** | Arquivo `realtime-mock` inexistente (FilaAoVivoAnimated) | Criar lib ou remover/ substituir import. |
| **Crítico** | Schema Supabase (migration/doc) ≠ código | Alinhar migration + doc ao código ou código ao schema. |
| **Crítico** | Hash não lido na inicialização (QR Code) | Ler hash no mount do App e setar página + eventId. |
| **Importante** | QRCodeGenerator no PainelAdmin (props erradas) | Passar `eventId` e `eventTitle` (e opcionalmente `size`). |
| **Importante** | Fila: “Jogando agora” sem filtrar por status | Usar apenas times com `status === 'playing'` e tratar “sem jogo”. |
| **Melhoria** | contact_messages sem coluna `subject` | Adicionar coluna ou remover subject do insert. |
| **Melhoria** | Tipar objeto de update em updateEventStatus | Evitar `any`; usar tipo explícito. |
| **Melhoria** | useQueue: duplicata por telefone com .maybeSingle() | Trocar .single() por .maybeSingle() e tratar resultado. |

---

## CHECKLIST FINAL (CONFORME SOLICITADO)

- [x] Imports e dependências revisados (1 quebra: realtime-mock).
- [x] Componentes com export e props (1 bug: QRCode no PainelAdmin).
- [x] useAdminAuth, useQueue, useAdmin revisados.
- [x] PainelAdmin, Fila, PainelTV, FilaAoVivoAnimated, AdminLogin revisados.
- [x] lib/supabase e integração Supabase revisados (schema divergente).
- [x] Rotas e navegação (hash não lido).
- [x] TypeScript e segurança.
- [x] Performance e subscriptions.
- [x] Documentação e fluxos críticos.

Com as correções dos itens **críticos** e **importantes**, o sistema fica consistente com as regras de negócio e com o uso via QR Code e Supabase.
