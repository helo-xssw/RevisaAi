# ✅ Ciclo Completo: REST + Mock com Token

**Data:** 05/12/2024  
**Status:** 🎉 Implementação Completa

---

## 📊 O Que Foi Feito

### 1️⃣ Contexts Atualizados (com REST + Mock Fallback)

#### MotosContext
- ✅ Importa `useAuth()` para obter `token` e `isLoggedIn`
- ✅ Passa `token` para `fetchMotosApi(token)`, `createMotoApi(input, token)`, etc.
- ✅ Carrega motos apenas se `isLoggedIn === true`
- ✅ Mock fallback automático se API falhar
- **Arquivo:** `src/contexts/motosContext.tsx`

#### RevisionsContext
- ✅ Mesma lógica de MotosContext
- ✅ Métodos auxiliares: `getById()`, `getByMoto()`, `setStatus()`
- ✅ Token passado para todas as operações REST
- **Arquivo:** `src/contexts/revisionsContext.tsx`

#### NotificationsContext
- ✅ Mesma lógica de MotosContext e RevisionsContext
- ✅ Operações por revisão: `removeByRevisionId()`, `updateStatusByRevisionId()`
- ✅ Token em todas as chamadas REST
- **Arquivo:** `src/contexts/notificationsContext.tsx`

### 2️⃣ Hooks Criados/Atualizados

#### useAuth (já existia)
- **Arquivo:** `src/hooks/useAuth.ts`
- Retorna: `{ user, token, isLoggedIn, isReady, signIn, signUp, signOut, updateProfile, deleteAccount }`

#### useMotos
- **Arquivo:** `src/hooks/useMotos.ts`
- Retorna: `{ motos, loading, error, refresh, create, update, remove }`
- ✅ Usa `MotosProvider`

#### useRevisions
- **Arquivo:** `src/hooks/useRevisions.ts`
- Retorna: `{ revisions, loading, error, refresh, getById, getByMoto, create, update, remove, setStatus }`
- ✅ Usa `RevisionsProvider`

#### useNotifications
- **Arquivo:** `src/hooks/useNotifications.ts`
- Retorna: `{ notifications, loading, error, refresh, create, updateStatus, remove, removeByRevisionId, updateStatusByRevisionId }`
- ✅ Usa `NotificationsProvider`

### 3️⃣ Layout Configurado

#### Root Layout (`src/app/_layout.tsx`)
```tsx
<AuthProvider>
  <Stack>
    {/* splash, signIn, signUp, (protected) */}
  </Stack>
</AuthProvider>
```

#### Protected Layout (`src/app/(protected)/_layout.tsx`)
```tsx
<AuthProvider>
  <NotificationsProvider>
    <MotosProvider>
      <RevisionsProvider>
        <Stack>
          {/* Telas com acesso a todos os hooks */}
        </Stack>
      </RevisionsProvider>
    </MotosProvider>
  </NotificationsProvider>
</AuthProvider>
```

---

## 🔄 Fluxo Completo (Exemplo: Carregar Motos)

```
┌─────────────────────────────────────────────────────────┐
│ Tela: minhas-motos/index.tsx                             │
│ const { motos, loading, error } = useMotos()             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
         ┌───────────────────────────┐
         │ useMotos Hook             │
         │ Acessa MotosContext       │
         └────────────┬──────────────┘
                      │
                      ↓
         ┌──────────────────────────────────┐
         │ MotosProvider                    │
         │ const { token } = useAuth()       │
         │ (pega token do AuthContext)      │
         └────────────┬───────────────────┘
                      │
                      ↓
         ┌─────────────────────────────────────┐
         │ loadMotos() useCallback              │
         │ await fetchMotosApi(token)           │
         └────────────┬────────────────────────┘
                      │
                      ↓
         ┌────────────────────────────────────┐
         │ src/api/motos.ts                    │
         │ export async function fetchMotos()  │
         └────────────┬─────────────────────┘
                      │
         ┌────────────┴──────────────┐
         │                           │
         ↓                           ↓
    ┌──────────────┐       ┌─────────────────────┐
    │ Mock         │       │ REST (com token)    │
    │ (memória)    │       │ Authorization:...   │
    └──────────────┘       │ Bearer <token>      │
         ▲                  └─────────────────────┘
         │                           │
         │                    ┌──────┴────────┐
         │                    │               │
         │             ✅ OK  │       ❌ Fail
         │                    │               │
         └────────────────────┴───────────────┘
                      │
                      ↓
         ┌──────────────────────────┐
         │ setMotos(data)           │
         │ Atualiza estado React    │
         └──────────────┬───────────┘
                        │
                        ↓
         ┌──────────────────────────┐
         │ Tela renderiza com dados │
         │ motos.map(...)           │
         └──────────────────────────┘
```

---

## 💻 Como Usar nas Telas

### Exemplo: Tela de Minhas Motos

```tsx
import { useMotos } from '@/hooks/useMotos';
import { FlatList, Text, ActivityIndicator } from 'react-native';

export function MinhasMotosScreen() {
  const { motos, loading, error, create, remove } = useMotos();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Erro: {error}</Text>;

  return (
    <FlatList
      data={motos}
      renderItem={({ item }) => (
        <MotoCard moto={item} onDelete={() => remove(item.id)} />
      )}
      keyExtractor={(m) => m.id}
    />
  );
}
```

### Exemplo: Criar Moto

```tsx
const { create } = useMotos();

const handleCreate = async () => {
  try {
    const newMoto = await create({
      name: 'Honda Biz',
      brand: 'Honda',
      model: 'Biz 125',
      year: 2020,
      plate: 'ABC-1234',
    });
    console.log('Moto criada:', newMoto);
  } catch (err) {
    console.error('Erro:', err.message);
  }
};
```

### Exemplo: Buscar Revisões por Moto

```tsx
const { getByMoto } = useRevisions();

const motoRevisions = getByMoto(motoId);
// Returns: Revision[]
```

---

## 🔐 Token Flow

```
1. SignIn.tsx chama useAuth().signIn()
   ↓
2. AuthContext salva token no AsyncStorage
   ↓
3. AuthContext expõe token via context
   ↓
4. MotosProvider usa useAuth() → obtém token
   ↓
5. fetchMotosApi(token) recebe token
   ↓
6. http.post(..., headers: { Authorization: `Bearer ${token}` })
   ↓
7. Backend valida JWT e retorna dados
   ↓
8. MotosProvider.setMotos(data)
   ↓
9. Tela renderiza com dados
```

---

## ✨ REST + Mock Fallback

### Configuração
```env
# .env.local

# Se definido → usa REST + mock como fallback
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Se não definido → usa 100% mock
EXPO_PUBLIC_API_URL=
```

### Lógica em `src/api/motos.ts`
```tsx
export async function fetchMotos(token?: string | null) {
  // 1. Se hasApiConfigured == false → usa mock
  if (shouldUseMockOnly()) {
    return mockFetchMotos();
  }

  // 2. Tenta REST com token
  try {
    return await restFetchMotos(token);
  } catch (error) {
    // 3. Se falhar → usa mock (degradação graceful)
    console.warn('[motos] Falha na API, usando mock:', error.message);
    return mockFetchMotos();
  }
}
```

---

## 🗂️ Estrutura de Arquivos Final

```
src/
├── api/
│   ├── http.ts              ✅ Cliente REST
│   ├── auth.ts              ✅ REST + mock
│   ├── motos.ts             ✅ REST + mock com token
│   ├── revisions.ts         ✅ REST + mock com token
│   └── notifications.ts     ✅ REST + mock com token
│
├── contexts/
│   ├── authContext.tsx      ✅ Auth + persistência
│   ├── motosContext.tsx     ✅ Usa useAuth() para token
│   ├── revisionsContext.tsx ✅ Usa useAuth() para token
│   └── notificationsContext.tsx ✅ Usa useAuth() para token
│
├── hooks/
│   ├── useAuth.ts           ✅ Acessa AuthContext
│   ├── useMotos.ts          ✅ Acessa MotosContext
│   ├── useRevisions.ts      ✅ Acessa RevisionsContext
│   └── useNotifications.ts  ✅ Acessa NotificationsContext
│
└── app/
    ├── _layout.tsx          ✅ AuthProvider
    └── (protected)/
        └── _layout.tsx      ✅ Todos os providers
```

---

## 📋 Checklist de Validação

- [x] MotosContext importa useAuth()
- [x] MotosContext passa token para APIs
- [x] RevisionsContext importa useAuth()
- [x] RevisionsContext passa token para APIs
- [x] NotificationsContext importa useAuth()
- [x] NotificationsContext passa token para APIs
- [x] Todos os hooks com error handling
- [x] Providers aninhados corretamente no layout
- [x] Mock fallback funciona se API falhar
- [x] Token passado em todas operações REST
- [x] Zero TypeScript errors
- [x] useAuth pode ser chamado nos contexts

---

## 🧪 Testando

### Teste 1: Mock Only
```bash
# .env.local
EXPO_PUBLIC_API_URL=
```
- Abre app
- Faz login
- Vê motos do mock
- ✅ Funciona offline 100%

### Teste 2: API Disponível
```bash
# .env.local
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```
- Backend rodando em localhost:3000
- Faz login
- Cria moto
- ✅ Dados salvam no backend
- ✅ Token enviado corretamente

### Teste 3: API Falha
```bash
# .env.local
EXPO_PUBLIC_API_URL=http://localhost:9999 (porta inválida)
```
- Backend não roda em 9999
- Faz login
- Cria moto
- ✅ Fallback para mock automático
- ✅ Sem erro de crash

---

## 📚 Documentação

- **CONTEXTS-USAGE.md** - Guia completo de como usar os contexts (este arquivo)
- **BACKEND-API-SPEC.md** - Especificação de endpoints para backend
- **BACKEND-IMPLEMENTATION-GUIDE.md** - Como implementar backend
- **BACKEND-CODE-EXAMPLES.md** - Exemplos em 5 frameworks
- **ARCHITECTURE-MAP.md** - Mapa visual da arquitetura

---

## 🚀 Próximos Passos

### Backend
1. Implementar endpoints conforme `BACKEND-API-SPEC.md`
2. Validar JWT tokens
3. Salvar dados em banco de dados real
4. Deployar em servidor

### Frontend
1. Apontar `EXPO_PUBLIC_API_URL` para backend real
2. Testar login → motos → revisões → notificações
3. Validar persistência de dados
4. Teste em app real (iOS/Android)

---

## 📞 Suporte

Qualquer dúvida sobre como usar os contexts:
1. Veja exemplos em **CONTEXTS-USAGE.md**
2. Cheque o código em `src/contexts/` e `src/hooks/`
3. Veja logs no console com `console.log('[Context] ...')`

---

**✅ Frontend pronto para integração com backend!**
