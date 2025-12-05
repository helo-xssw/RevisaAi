# 🎯 Guia de Uso dos Contexts

**Data:** 05/12/2024  
**Status:** Implementado ✅

---

## 📚 Visão Geral

Implementamos **3 contexts principais** com **REST + mock fallback**, todos usando o token do `AuthContext`:

1. **AuthContext** - Autenticação (login, register, persistência)
2. **MotosContext** - CRUD de motos com token
3. **RevisionsContext** - CRUD de revisões com token
4. **NotificationsContext** - CRUD de notificações com token

---

## 🔐 AuthContext

### Localização
- Context: `src/contexts/authContext.tsx`
- Hook: `src/hooks/useAuth.ts`

### Uso na Tela

```tsx
import { useAuth } from '@/hooks/useAuth';

export function SignInScreen() {
  const { signIn, isLoggedIn, user, token } = useAuth();

  const handleLogin = async () => {
    const result = await signIn({
      email: 'user@example.com',
      password: '123456',
    });

    if (result.success) {
      // Login bem-sucedido
    } else {
      console.error(result.error);
    }
  };

  return (
    <>
      {isLoggedIn && <Text>Olá {user?.name}</Text>}
      {/* Botão login */}
    </>
  );
}
```

### API Disponível

```typescript
{
  user: User | null;              // Usuário logado
  token: string | null;           // JWT token
  isLoggedIn: boolean;            // Status
  isReady: boolean;               // Dados carregados
  signIn: (payload) => Promise;   // Login
  signUp: (payload) => Promise;   // Registro
  signOut: () => Promise;         // Logout
  updateProfile: (data) => Promise;
  deleteAccount: () => Promise;
}
```

---

## 🏍️ MotosContext

### Localização
- Context: `src/contexts/motosContext.tsx`
- Hook: `src/hooks/useMotos.ts`

### Uso na Tela

```tsx
import { useMotos } from '@/hooks/useMotos';

export function MinhasMotosScreen() {
  const { motos, loading, error, create, update, remove, refresh } = useMotos();

  // Listar motos
  if (loading) return <Text>Carregando motos...</Text>;
  if (error) return <Text>Erro: {error}</Text>;

  return (
    <FlatList
      data={motos}
      renderItem={({ item }) => (
        <MotoCard
          moto={item}
          onEdit={() => handleEditMoto(item.id)}
          onDelete={() => handleDeleteMoto(item.id)}
        />
      )}
      keyExtractor={(m) => m.id}
      ListEmptyComponent={<Text>Nenhuma moto cadastrada</Text>}
    />
  );
}
```

### Operações CRUD

**Criar:**
```tsx
const moto = await create({
  name: 'Honda Biz',
  brand: 'Honda',
  model: 'Biz 125',
  year: 2020,
  plate: 'ABC-1234',
  km: 20500,
  color: 'Prata',
});
```

**Atualizar:**
```tsx
const updated = await update(motoId, {
  km: 25000,
  color: 'Azul',
});
```

**Remover:**
```tsx
await remove(motoId);
```

**Recarregar:**
```tsx
await refresh();
```

### API Disponível

```typescript
{
  motos: Moto[];                              // Lista de motos
  loading: boolean;                           // Carregando?
  error: string | null;                       // Erro se houver
  refresh: () => Promise<void>;               // Recarregar dados
  create: (input: CreateMotoInput) => Promise<Moto>;
  update: (id: string, input: UpdateMotoInput) => Promise<Moto>;
  remove: (id: string) => Promise<void>;
}
```

---

## 📋 RevisionsContext

### Localização
- Context: `src/contexts/revisionsContext.tsx`
- Hook: `src/hooks/useRevisions.ts`

### Uso na Tela

```tsx
import { useRevisions } from '@/hooks/useRevisions';

export function RevisionsScreen() {
  const { revisions, getByMoto, create, setStatus, remove } = useRevisions();

  // Revisões de uma moto específica
  const motoRevisions = getByMoto(motoId);

  // Marcar como concluída
  const handleMarkDone = async (revisionId: string) => {
    await setStatus(revisionId, 'done');
  };

  return (
    <FlatList
      data={motoRevisions}
      renderItem={({ item }) => (
        <RevisionCard
          revision={item}
          onMarkDone={() => handleMarkDone(item.id)}
          onDelete={() => remove(item.id)}
        />
      )}
      keyExtractor={(r) => r.id}
    />
  );
}
```

### Operações Comuns

**Buscar por ID:**
```tsx
const revision = getById(revisionId);
```

**Buscar por Moto:**
```tsx
const motoRevisions = getByMoto(motoId);
// Retorna: Revision[]
```

**Criar:**
```tsx
const revision = await create({
  motoId: '1',
  title: 'Troca de Óleo',
  service: 'Óleo do motor',
  details: 'Verificar também filtro de ar',
  date: new Date().toISOString(),
  time: new Date().toISOString(),
  km: 30500,
  autoReminderEnabled: true,
  autoReminderInterval: 'Três meses',
});
```

**Atualizar:**
```tsx
const updated = await update(revisionId, {
  status: 'done',
  km: 35000,
});
```

**Mudar Status:**
```tsx
await setStatus(revisionId, 'done');
// Equivalente a: update(revisionId, { status: 'done' })
```

**Remover:**
```tsx
await remove(revisionId);
```

### API Disponível

```typescript
{
  revisions: Revision[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id?: string) => Revision | undefined;
  getByMoto: (motoId?: string) => Revision[];
  create: (input: CreateRevisionInput) => Promise<Revision>;
  update: (id: string, input: UpdateRevisionInput) => Promise<Revision>;
  remove: (id: string) => Promise<void>;
  setStatus: (id: string, status: RevisionStatus) => Promise<Revision>;
}
```

---

## 🔔 NotificationsContext

### Localização
- Context: `src/contexts/notificationsContext.tsx`
- Hook: `src/hooks/useNotifications.ts`

### Uso na Tela

```tsx
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationsScreen() {
  const { notifications, loading, create, updateStatus, remove } = useNotifications();

  return (
    <FlatList
      data={notifications}
      renderItem={({ item }) => (
        <NotificationCard
          notification={item}
          onMarkDone={() => updateStatus(item.id, 'done')}
          onDelete={() => remove(item.id)}
        />
      )}
      keyExtractor={(n) => n.id}
    />
  );
}
```

### Operações Comuns

**Criar:**
```tsx
const notif = await create({
  motoId: '1',
  revisionId: 'rev-1',
  title: 'Honda Biz: Troca de Óleo',
  description: 'Óleo do motor vencido',
});
```

**Atualizar Status:**
```tsx
await updateStatus(notificationId, 'done');
```

**Remover por Revisão:**
```tsx
await removeByRevisionId(revisionId);
// Remove todas as notificações dessa revisão
```

**Atualizar Status por Revisão:**
```tsx
await updateStatusByRevisionId(revisionId, 'done');
// Marca todas as notificações da revisão como 'done'
```

### API Disponível

```typescript
{
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: CreateNotificationInput) => Promise<Notification>;
  updateStatus: (id: string, status: NotificationStatus) => Promise<Notification>;
  remove: (id: string) => Promise<void>;
  removeByRevisionId: (revisionId: string) => Promise<void>;
  updateStatusByRevisionId: (revisionId: string, status: NotificationStatus) => Promise<void>;
}
```

---

## 🏗️ Estrutura de Providers

### No Root Layout (`src/app/_layout.tsx`)
```tsx
<AuthProvider>
  <Stack>
    {/* Todas as telas */}
  </Stack>
</AuthProvider>
```

### No Protected Layout (`src/app/(protected)/_layout.tsx`)
```tsx
<AuthProvider>
  {/* acesso a useAuth */}
  <NotificationsProvider>
    <MotosProvider>
      <RevisionsProvider>
        <Stack>
          {/* Telas protegidas com acesso a:
              - useAuth()
              - useMotos()
              - useRevisions()
              - useNotifications()
          */}
        </Stack>
      </RevisionsProvider>
    </MotosProvider>
  </NotificationsProvider>
</AuthProvider>
```

> **Nota:** `AuthProvider` está em ambos os níveis (root já pode ter), mas o importante é que **MotosProvider, RevisionsProvider, NotificationsProvider estejam DENTRO do AuthProvider**.

---

## 🔄 Fluxo de Dados com Token

```
1. Usuário faz login
   ↓
2. AuthContext salva token + user
   ↓
3. MotosProvider obtém token do useAuth()
   ↓
4. MotosProvider passa token para fetchMotosApi(token)
   ↓
5. fetchMotosApi verifica:
   - Se hasApiConfigured == false → usa mock
   - Se hasApiConfigured == true → tenta REST
   - Se REST falha → usa mock como fallback
   ↓
6. Dados carregam em motosContext.motos
   ↓
7. Tela renderiza com dados
```

---

## ⚡ Padrões de Uso

### 1. Carregar dados na tela
```tsx
useEffect(() => {
  refresh(); // Recarrega dados do contexto
}, [refresh]);
```

### 2. Tratar erros
```tsx
if (error) {
  return (
    <ErrorBoundary>
      <Text>{error}</Text>
      <Button onPress={() => refresh()}>Tentar Novamente</Button>
    </ErrorBoundary>
  );
}
```

### 3. Estado de carregamento
```tsx
if (loading) {
  return <ActivityIndicator size="large" />;
}
```

### 4. Operação com feedback
```tsx
const handleCreateMoto = async () => {
  try {
    const moto = await create(formData);
    Alert.alert('Sucesso', 'Moto criada!');
    navigate('motos');
  } catch (err) {
    Alert.alert('Erro', err.message);
  }
};
```

---

## 🧪 Testando Localmente

### 1. Sem API (Mock Only)
```env
# .env.local
EXPO_PUBLIC_API_URL=
```
App usa 100% mock em memória.

### 2. Com API Local
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```
App tenta REST, fallback para mock se falhar.

### 3. Debug
```tsx
// No contexto
console.log('[MotosContext] Token:', token);
console.log('[MotosContext] isLoggedIn:', isLoggedIn);
console.log('[MotosContext] Motos carregadas:', motos.length);
```

---

## ✅ Checklist de Implementação

- [x] AuthContext com token + persistência
- [x] MotosContext com REST + mock
- [x] RevisionsContext com REST + mock
- [x] NotificationsContext com REST + mock
- [x] Todos os hooks com error handling
- [x] Providers configurados no layout
- [x] Token passado para todas as APIs
- [x] Fallback automático para mock
- [x] Zero TypeScript errors

---

**Próximo Passo:** Backend implementar endpoints conforme `BACKEND-API-SPEC.md`
