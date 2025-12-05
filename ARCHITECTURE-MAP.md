# 🗺️ Mapa da Arquitetura - RevisaAI

**Última atualização:** 05/12/2024  
**Status:** Documentação Completa ✅

---

## 📊 Visão Geral do Sistema

```
┌────────────────────────────────────────────────────────────────┐
│                        USUÁRIO FINAL                            │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ↓
        ┌────────────────────────────────────────────┐
        │      React Native + Expo (Frontend)         │
        │   🎨 Telas | 🎯 Componentes | 📱 UI/UX     │
        └────────────────┬───────────────────────────┘
                         │
        ┌────────────────┴─────────────────────┐
        │ (HTTP REST com Bearer Token)         │
        ↓                                       ↓
    ┌────────────────────────┐  ┌────────────────────────┐
    │  API REST Online?      │  │  Sem API / Falha?      │
    │  ✅ Usar API Real      │  │  ✅ Usar Mock em mem   │
    └────────────────────────┘  └────────────────────────┘
        │                               │
        └────────────────────┬──────────┘
                             │
                             ↓
        ┌────────────────────────────────────────────┐
        │   src/api/ (HTTP Client + Mock Fallback)   │
        │                                             │
        │  • http.ts (Cliente REST)                   │
        │  • auth.ts (Login/Register)                 │
        │  • motos.ts (CRUD Motos)                    │
        │  • revisions.ts (CRUD Revisões)            │
        │  • notifications.ts (Notificações)         │
        └────────────────────────────────────────────┘
                             │
        ┌────────────────────┴─────────────────────┐
        │                                           │
        ↓                                           ↓
┌──────────────────────────┐          ┌──────────────────────────┐
│   Backend (Node/Python)  │          │   AsyncStorage + State   │
│   🔐 JWT Auth            │          │   💾 Persistência Local   │
│   🗄️ Banco de Dados      │          │                          │
│   📡 REST API            │          └──────────────────────────┘
└──────────────────────────┘
```

---

## 📁 Estrutura de Pastas - Frontend

```
/home/verissimo/eng-Software2/RevisaAI/
├── src/
│   ├── api/
│   │   ├── http.ts              ← Cliente REST com hasApiConfigured
│   │   ├── auth.ts              ← Auth (login, register, updateProfile)
│   │   ├── motos.ts             ← CRUD de motos
│   │   ├── revisions.ts         ← CRUD de revisões
│   │   └── notifications.ts     ← CRUD de notificações
│   │
│   ├── contexts/
│   │   ├── authContext.tsx      ← Auth state (user, token, isLoggedIn)
│   │   ├── motosContext.tsx     ← Motos state
│   │   ├── revisionsContext.tsx ← Revisões state
│   │   └── notificationsContext.tsx ← Notificações state
│   │
│   ├── hooks/
│   │   ├── useAuth.tsx          ← Hook para auth context
│   │   ├── useMotos.tsx         ← Hook para motos context
│   │   ├── useRevisions.tsx     ← Hook para revisões context
│   │   └── useNotifications.tsx ← Hook para notificações context
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── TextInput.tsx    ← Input com validação visual
│   │   │   ├── Button.tsx       ← Botão padrão
│   │   │   └── ...
│   │   ├── OficinaCard.tsx      ← Card de oficina
│   │   └── ...
│   │
│   ├── app/
│   │   ├── signIn.tsx           ← Tela de login
│   │   ├── (protected)/
│   │   │   ├── index.tsx        ← Dashboard
│   │   │   ├── (tabs)/
│   │   │   │   ├── minhas-motos/
│   │   │   │   ├── revisoes/
│   │   │   │   ├── oficinas/
│   │   │   │   ├── perfil/
│   │   │   │   └── notificacoes/
│   │   │   └── _layout.tsx      ← Layout com tabs
│   │   └── ...
│   │
│   └── theme/
│       └── colors.ts            ← Design system
│
├── BACKEND-API-SPEC.md          ← 📘 Especificação de endpoints
├── BACKEND-IMPLEMENTATION-GUIDE.md ← 📖 Guia de implementação
├── BACKEND-CODE-EXAMPLES.md     ← 💻 Exemplos de código
├── BACKEND-SUMMARY.md           ← 🎯 Resumo executivo
└── API-v2.md                    ← 📝 Documentação interna
```

---

## 🔄 Fluxo de Dados

### 1️⃣ Login

```
┌─────────────────────────────────────────────────────────────┐
│ Tela: signIn.tsx                                            │
│ • Usuário digita email + senha                              │
│ • Clica em "Entrar"                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Hook: useAuth()                                             │
│ • Chama: auth.signIn(email, password)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ src/contexts/authContext.tsx (AuthProvider)                │
│ • Chama: login(payload) da api/auth.ts                      │
│ • Salva user + token em AsyncStorage                        │
│ • Atualiza estado React                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ src/api/auth.ts                                             │
│ IF hasApiConfigured == false → return mockLogin()           │
│ IF hasApiConfigured == true:                                │
│   TRY: return await http.post('/auth/login', payload)       │
│   CATCH: console.warn + return mockLogin()                  │
└────────────────────────┬────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ↓                             ↓
     ┌─────────────┐          ┌──────────────────┐
     │ Mock Data   │          │ Backend REST API │
     │ (memória)   │          │ POST /auth/login │
     └─────────────┘          └──────────────────┘
          │                             │
          └──────────────┬──────────────┘
                         ↓
              ┌──────────────────────┐
              │ { user, token } ✅   │
              └──────────────────────┘
```

### 2️⃣ Buscar Motos

```
┌─────────────────────────────────────────────────────────────┐
│ Tela: minhas-motos/index.tsx                                │
│ • useRevisions() hook traz dados                            │
│ • useEffect chama fetchMotos(token)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ Hook: useMotos()                                            │
│ • Chama: motos.fetchMotos(token)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ src/api/motos.ts                                            │
│ export async function fetchMotos(token)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
    IF hasApiConfigured                │
          ↓                             ↓
    ┌────────────────┐        ┌──────────────────────────┐
    │ TRY REST API   │        │ Return Mock (imediato)   │
    │ GET /motos     │        └──────────────────────────┘
    └────────┬───────┘                  ▲
             │                          │
       IF OK │                    IF API falha
             ↓                          │
       ┌─────────────┐                  │
       │ Return ✅   │                  │
       └─────────────┘──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Tela atualiza com dados                                     │
│ • Estado em React muda                                      │
│ • Componentes re-renderizam com motos                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Fluxo de Autenticação

```
┌─────────────────────────────────────┐
│ Frontend faz requisição              │
│ GET /motos                           │
│ Authorization: Bearer token...       │
└────────────────────┬────────────────┘
                     │
                     ↓
         ┌───────────────────────┐
         │ Backend JWT Middleware│
         │ Verifica token        │
         └───────┬───────────────┘
                 │
        ┌────────┴────────┐
        ↓                 ↓
   ✅ Token OK      ❌ Token inválido
   req.userId       res.status(401)
   setado           "Token inválido"
        │                 │
        ↓                 ↓
   Controller      Frontend trata
   executa         erro + logout
        │
        ↓
   DB query
   com userId
        │
        ↓
   Response
   com dados
```

---

## 💾 Persistência de Dados

```
AsyncStorage (Mobile)
│
├─ @revisaai-auth
│  └─ { user, token, isLoggedIn }
│     └─ Salvo no device
│        └─ Carregado no load inicial (useEffect)
│
└─ Variáveis de ambiente
   └─ EXPO_PUBLIC_API_URL
      └─ Define se usa API REST ou mock
```

---

## 📡 HTTP Client (src/api/http.ts)

```
┌─────────────────────────────────────┐
│ EXPO_PUBLIC_API_URL = ???           │
├─────────────────────────────────────┤
│ if (!BASE_URL)                      │
│   hasApiConfigured = false ❌       │
│ else                                │
│   hasApiConfigured = true ✅        │
└────────────────┬────────────────────┘
                 │
                 ↓
        ┌────────────────────┐
        │ http.get/post/...  │
        │ com headers:       │
        │ - Content-Type    │
        │ - Authorization   │
        └────────────────────┘
```

---

## 🎯 Estados de Cada Context

### AuthContext
```typescript
{
  user: User | null,                    // Usuário logado
  token: string | null,                 // JWT token
  isLoggedIn: boolean,                  // Status de login
  isReady: boolean,                     // Dados carregados
  signIn: (payload) => Promise,         // Login
  signUp: (payload) => Promise,         // Registro
  signOut: () => Promise,               // Logout
  updateProfile: (data) => Promise,     // Atualizar perfil
  deleteAccount: () => Promise,         // Deletar conta
}
```

### MotosContext
```typescript
{
  motos: Moto[],                        // Lista de motos
  isLoading: boolean,                   // Carregando?
  error: string | null,                 // Erro
  fetchMotos: () => Promise,            // Buscar motos
  createMoto: (data) => Promise,        // Criar moto
  updateMoto: (id, data) => Promise,    // Atualizar moto
  deleteMoto: (id) => Promise,          // Deletar moto
}
```

### RevisionsContext
```typescript
{
  revisions: Revision[],                // Lista de revisões
  isLoading: boolean,
  error: string | null,
  fetchRevisions: () => Promise,
  createRevision: (data) => Promise,
  updateRevision: (id, data) => Promise,
  deleteRevision: (id) => Promise,
  markDone: (id) => Promise,            // Marcar como concluída
}
```

### NotificationsContext
```typescript
{
  notifications: Notification[],        // Lista de notificações
  isLoading: boolean,
  error: string | null,
  fetchNotifications: () => Promise,
  createNotification: (data) => Promise,
  updateNotificationStatus: (id, status) => Promise,
  deleteNotification: (id) => Promise,
}
```

---

## 🧪 Sequência de Testes

```
┌─────────────────────────────────────────────┐
│ 1. Teste sem API (mock apenas)              │
│    • Deixe EXPO_PUBLIC_API_URL vazio        │
│    • Teste login, motos, etc                │
│    • Tudo deve funcionar normalmente        │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│ 2. Teste com API URL inválida               │
│    • EXPO_PUBLIC_API_URL=http://invalid     │
│    • App deve fazer fallback para mock      │
│    • Sem erros de crash                     │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│ 3. Teste com API real (localhost)           │
│    • EXPO_PUBLIC_API_URL=http://localhost:3000/api
│    • Backend deve estar rodando             │
│    • Teste login, create, update, delete    │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│ 4. Teste com API real (deploy)              │
│    • EXPO_PUBLIC_API_URL=https://...        │
│    • Teste em app real                      │
│    • Verificar persistência                 │
└─────────────────────────────────────────────┘
```

---

## 📊 Ciclo de Vida - App Startup

```
1. App.tsx carregado
   ↓
2. AuthProvider inicializa
   • Verifica AsyncStorage por auth salva
   • isReady = false (carregando)
   ↓
3. useEffect carrega dados
   • AsyncStorage.getItem('@revisaai-auth')
   • Se existe → setUser + setToken + setIsLoggedIn
   ↓
4. isReady = true
   • Navigator verifica isLoggedIn
   • Se true → mostra (protected)
   • Se false → mostra signIn
   ↓
5. Telas renderizam
   • Contexts estão prontos
   • Dados do usuário disponíveis
```

---

## 🚨 Tratamento de Erros

```
Erro de Rede (API offline/falha)
    ↓
catch block em src/api/*.ts
    ↓
console.warn('[modulo] Falha na API...')
    ↓
return mockData[Operacao]()
    ↓
App continua funcionando
    ↓
Usuário não percebe erro (degradação graceful)
```

---

## 📋 Checklist de Integração Backend

- [ ] Backend rodando em http://localhost:3000
- [ ] `/auth/login` implementado
- [ ] `/auth/register` implementado
- [ ] `/users/:id` (PUT) implementado
- [ ] `/users/:id` (DELETE) implementado
- [ ] `/motos` (GET, POST, PUT, DELETE) implementado
- [ ] `/revisions` (GET, POST, PATCH, DELETE) implementado
- [ ] `/notifications` (GET, POST, PATCH, DELETE) implementado
- [ ] `/notifications/revision/:id` endpoints implementados
- [ ] JWT Bearer Token validação
- [ ] Respostas com status HTTP corretos
- [ ] CORS configurado
- [ ] Teste com cURL/Postman
- [ ] Teste com frontend Expo
- [ ] Deploy em produção
- [ ] Apontar `EXPO_PUBLIC_API_URL` para backend real

---

**Documentação Completa! ✅**  
**Próximo Passo:** Backend implementar endpoints conforme `BACKEND-API-SPEC.md`
