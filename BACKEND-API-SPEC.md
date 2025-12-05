# 📋 Especificação de API REST - RevisaAI Backend

**Status:** Este documento define o padrão REST que o backend deve seguir para integrar com o aplicativo mobile RevisaAI.

**Data:** Dezembro 2025  
**Branch:** `barra`  
**Cliente:** React Native + Expo

---

## 🏗️ Arquitetura

O frontend utiliza um sistema **REST-first + mock fallback**:

```
┌─────────────────────────────────┐
│   Telas/Contexts do React       │
├─────────────────────────────────┤
│   Funções Públicas              │
│   (fetchMotos, createRevision)  │
├─────────────────────────────────┤
│  Tentativa REST API   (Prioridade 1)
│        ↓
│  Se falhar/sem URL → Mock em memória (Prioridade 2)
├─────────────────────────────────┤
│   HTTP Client (http.ts)         │
│   + Bearer Token Authentication │
└─────────────────────────────────┘
```

**Configuração:**
- A URL da API é definida via variável de ambiente: `EXPO_PUBLIC_API_URL`
- Se não configurada ou falhar, tudo continua funcionando com mock
- **Não há quebra** de funcionalidade - é sempre degradação graceful

---

## 🔐 Autenticação

### Bearer Token

Todos os endpoints (exceto `/auth/login` e `/auth/register`) requerem **Bearer Token** no header:

```http
GET /motos HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Login Response

Retorna user + token JWT:

```json
{
  "user": {
    "id": "123",
    "name": "Ricardo Pereira",
    "email": "ricardo@gmail.com",
    "avatarUrl": "https://..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📡 Endpoints Esperados

### 1️⃣ **Autenticação** (`/auth`)

#### `POST /auth/login`

**Request:**
```json
{
  "email": "ricardo@gmail.com",
  "password": "senha123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "1",
    "name": "Ricardo Pereira",
    "email": "ricardo@gmail.com",
    "avatarUrl": null
  },
  "token": "jwt-token..."
}
```

**Erros:**
- `400`: Email ou senha incorretos
- `500`: Erro do servidor

---

#### `POST /auth/register`

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@gmail.com",
  "password": "senha123"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "2",
    "name": "João Silva",
    "email": "joao@gmail.com",
    "avatarUrl": null
  },
  "token": "jwt-token..."
}
```

---

### 2️⃣ **Usuários** (`/users`)

#### `PUT /users/:id`

Atualiza perfil do usuário (incluindo avatar).

**Headers:**
```http
Authorization: Bearer token...
```

**Request:**
```json
{
  "name": "Ricardo P.",
  "email": "ricardo.novo@gmail.com",
  "avatarUrl": "file://path-to-image"
}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "Ricardo P.",
  "email": "ricardo.novo@gmail.com",
  "avatarUrl": "file://path-to-image"
}
```

---

#### `DELETE /users/:id`

Deleta conta do usuário.

**Headers:**
```http
Authorization: Bearer token...
```

**Response (204 No Content):** (sem corpo)

---

### 3️⃣ **Motos** (`/motos`)

#### `GET /motos`

Lista todas as motos do usuário autenticado.

**Headers:**
```http
Authorization: Bearer token...
```

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "name": "Honda Biz",
    "brand": "Honda",
    "model": "Biz 125",
    "year": 2020,
    "plate": "ABC-1234",
    "km": 20500,
    "color": "Prata",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "2",
    "name": "Yamaha 360",
    "brand": "Yamaha",
    "model": "Factor 150",
    "year": 2019,
    "plate": "XYZ-5678",
    "km": 15650,
    "color": "Preta",
    "createdAt": "2024-01-10T14:20:00Z"
  }
]
```

---

#### `POST /motos`

Cria uma nova moto.

**Headers:**
```http
Authorization: Bearer token...
```

**Request:**
```json
{
  "name": "Suzuki Intruder",
  "brand": "Suzuki",
  "model": "Intruder 125",
  "year": 2022,
  "plate": "DEF-9012",
  "km": 5000,
  "color": "Vermelho"
}
```

**Response (201 Created):**
```json
{
  "id": "3",
  "name": "Suzuki Intruder",
  "brand": "Suzuki",
  "model": "Intruder 125",
  "year": 2022,
  "plate": "DEF-9012",
  "km": 5000,
  "color": "Vermelho",
  "createdAt": "2024-12-05T15:45:00Z"
}
```

---

#### `PUT /motos/:id`

Atualiza dados de uma moto.

**Headers:**
```http
Authorization: Bearer token...
```

**Request:**
```json
{
  "km": 21000,
  "color": "Azul"
}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "Honda Biz",
  "brand": "Honda",
  "model": "Biz 125",
  "year": 2020,
  "plate": "ABC-1234",
  "km": 21000,
  "color": "Azul",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

#### `DELETE /motos/:id`

Deleta uma moto.

**Headers:**
```http
Authorization: Bearer token...
```

**Response (204 No Content):** (sem corpo)

---

### 4️⃣ **Revisões** (`/revisions`)

#### `GET /revisions`

Lista todas as revisões (de todas as motos do usuário).

**Headers:**
```http
Authorization: Bearer token...
```

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "motoId": "1",
    "title": "Troca de Óleo",
    "service": "Óleo do motor",
    "details": "Moto está com problema de carburador...",
    "date": "2024-12-10T00:00:00Z",
    "time": "2024-12-10T14:30:00Z",
    "km": 30500,
    "status": "pending",
    "autoReminderEnabled": false,
    "autoReminderInterval": null,
    "createdAt": "2024-12-05T10:00:00Z"
  },
  {
    "id": "2",
    "motoId": "1",
    "title": "Revisão Geral",
    "service": "Motor, faróis e freio",
    "details": "Revisão geral para venda da moto.",
    "date": "2024-12-15T00:00:00Z",
    "time": "2024-12-15T10:00:00Z",
    "km": 30500,
    "status": "pending",
    "autoReminderEnabled": false,
    "autoReminderInterval": null,
    "createdAt": "2024-12-05T11:00:00Z"
  }
]
```

---

#### `POST /revisions`

Cria uma nova revisão.

**Headers:**
```http
Authorization: Bearer token...
```

**Request:**
```json
{
  "motoId": "1",
  "title": "Troca de Corrente",
  "service": "Corrente, coroa e pinhão",
  "details": "Folga excessiva...",
  "date": "2024-12-20T00:00:00Z",
  "time": "2024-12-20T09:00:00Z",
  "km": 32000,
  "autoReminderEnabled": true,
  "autoReminderInterval": "Três meses"
}
```

**Response (201 Created):**
```json
{
  "id": "3",
  "motoId": "1",
  "title": "Troca de Corrente",
  "service": "Corrente, coroa e pinhão",
  "details": "Folga excessiva...",
  "date": "2024-12-20T00:00:00Z",
  "time": "2024-12-20T09:00:00Z",
  "km": 32000,
  "status": "pending",
  "autoReminderEnabled": true,
  "autoReminderInterval": "Três meses",
  "createdAt": "2024-12-05T15:30:00Z"
}
```

---

#### `PATCH /revisions/:id`

Atualiza uma revisão (incluindo marcar como concluída).

**Headers:**
```http
Authorization: Bearer token...
```

**Request:**
```json
{
  "status": "done",
  "details": "Serviço concluído com sucesso"
}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "motoId": "1",
  "title": "Troca de Óleo",
  "service": "Óleo do motor",
  "details": "Serviço concluído com sucesso",
  "date": "2024-12-10T00:00:00Z",
  "time": "2024-12-10T14:30:00Z",
  "km": 30500,
  "status": "done",
  "autoReminderEnabled": false,
  "autoReminderInterval": null,
  "createdAt": "2024-12-05T10:00:00Z"
}
```

---

#### `DELETE /revisions/:id`

Deleta uma revisão.

**Headers:**
```http
Authorization: Bearer token...
```

**Response (204 No Content):** (sem corpo)

---

### 5️⃣ **Notificações** (`/notifications`)

#### `GET /notifications`

Lista todas as notificações do usuário.

**Headers:**
```http
Authorization: Bearer token...
```

**Response (200 OK):**
```json
[
  {
    "id": "1",
    "motoId": "1",
    "revisionId": "1",
    "title": "Troca de Óleo",
    "description": "Sua Honda Biz precisa de troca de óleo",
    "status": "pending",
    "createdAt": "2024-12-05T10:00:00Z"
  }
]
```

---

#### `POST /notifications`

Cria uma nova notificação.

**Headers:**
```http
Authorization: Bearer token...
```

**Request:**
```json
{
  "motoId": "1",
  "revisionId": "1",
  "title": "Troca de Óleo",
  "description": "Sua Honda Biz precisa de troca de óleo"
}
```

**Response (201 Created):**
```json
{
  "id": "1",
  "motoId": "1",
  "revisionId": "1",
  "title": "Troca de Óleo",
  "description": "Sua Honda Biz precisa de troca de óleo",
  "status": "pending",
  "createdAt": "2024-12-05T10:00:00Z"
}
```

---

#### `PATCH /notifications/:id`

Atualiza status de uma notificação (ex: marcar como lida).

**Headers:**
```http
Authorization: Bearer token...
```

**Request:**
```json
{
  "status": "done"
}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "motoId": "1",
  "revisionId": "1",
  "title": "Troca de Óleo",
  "description": "Sua Honda Biz precisa de troca de óleo",
  "status": "done",
  "createdAt": "2024-12-05T10:00:00Z"
}
```

---

#### `DELETE /notifications/:id`

Deleta uma notificação.

**Headers:**
```http
Authorization: Bearer token...
```

**Response (204 No Content):** (sem corpo)

---

#### `DELETE /notifications/revision/:revisionId`

Deleta todas as notificações de uma revisão.

**Headers:**
```http
Authorization: Bearer token...
```

**Response (204 No Content):** (sem corpo)

---

#### `PATCH /notifications/revision/:revisionId`

Atualiza status de todas as notificações de uma revisão.

**Headers:**
```http
Authorization: Bearer token...
```

**Request:**
```json
{
  "status": "done"
}
```

**Response (204 No Content):** (sem corpo)

---

## 📊 Tipos de Dados

### User

```typescript
type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};
```

### Moto

```typescript
type Moto = {
  id: string;
  name: string;
  brand: string;
  model?: string;
  year?: number;
  plate?: string;
  km?: number;
  color?: string;
  createdAt?: string;
};
```

### Revision

```typescript
type RevisionStatus = 'pending' | 'done';

type Revision = {
  id: string;
  motoId: string;
  title: string;
  service: string;
  details?: string;
  date: string; // ISO 8601
  time: string; // ISO 8601
  km?: number;
  status: RevisionStatus;
  autoReminderEnabled: boolean;
  autoReminderInterval?: string;
  createdAt?: string;
};
```

### Notification

```typescript
type NotificationStatus = 'pending' | 'done';

type Notification = {
  id: string;
  motoId: string;
  revisionId: string;
  title: string;
  description: string;
  status: NotificationStatus;
  createdAt?: string;
};
```

---

## 🎯 Padrões de Resposta

### Sucesso

**2xx Status Codes:**
- `200 OK` - Requisição bem-sucedida (GET, PATCH, PUT)
- `201 Created` - Recurso criado (POST)
- `204 No Content` - Requisição bem-sucedida, sem corpo (DELETE)

**Exemplo:**
```json
{
  "id": "123",
  "name": "Honda Biz",
  ...
}
```

### Erro

**4xx/5xx Status Codes:**
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Token ausente ou inválido
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro do servidor

**Formato de erro (recomendado):**
```json
{
  "error": "Email ou senha incorretos",
  "statusCode": 400,
  "timestamp": "2024-12-05T15:30:00Z"
}
```

---

## 🔄 Fluxo de Chamada no Frontend

### Exemplo: Buscar Motos

```typescript
// src/api/motos.ts

// 1. Função pública chamada pelo context/screen
export async function fetchMotos(token?: string | null): Promise<Moto[]> {
  // 2. Verifica se há API configurada
  if (!hasApiConfigured) {
    return mockFetchMotos(); // Usa mock
  }

  try {
    // 3. Tenta chamar a API REST
    return await http.get<Moto[]>('/motos', token);
  } catch (error) {
    // 4. Se falhar, usa mock como fallback
    console.warn('[motos] Falha na API, usando mock:', error);
    return mockFetchMotos();
  }
}
```

### Configuração de Ambiente

Para usar a API real, configure no `.env` ou `app.config.ts`:

```bash
# .env
EXPO_PUBLIC_API_URL=https://seu-backend.com/api
```

**Sem configuração → mock funcionando**  
**Com URL inválida → API falha → mock como fallback**

---

## ✅ Checklist para Backend

- [ ] Implementar autenticação JWT (`/auth/login`, `/auth/register`)
- [ ] Validar Bearer Token em todos os endpoints
- [ ] Implementar CRUD de motos (`/motos`)
- [ ] Implementar CRUD de revisões (`/revisions`)
- [ ] Implementar CRUD de notificações (`/notifications`)
- [ ] Endpoints de notificações por revisão (`/notifications/revision/:id`)
- [ ] Validar dados de entrada (types de entrada)
- [ ] Retornar status HTTP corretos (200, 201, 204, 400, 401, 404, 500)
- [ ] Incluir timestamps em ISO 8601 (`createdAt`, `date`, `time`)
- [ ] Suportar soft deletes ou hard deletes?
- [ ] Documentar endpoints adicionais (se houver)
- [ ] Testar com cliente REST (Postman, Insomnia, etc.)

---

## 🧪 Teste Rápido com cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ricardo@gmail.com", "password": "1234"}'

# Buscar motos (use o token retornado)
curl -X GET http://localhost:3000/api/motos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Criar moto
curl -X POST http://localhost:3000/api/motos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{\n  "name": "Honda Biz",\n  "brand": "Honda",\n  "model": "Biz 125"\n}'
```

---

## 📚 Referências

- **HTTP Status Codes:** https://httpwg.org/specs/rfc7231.html#status.codes
- **ISO 8601 Dates:** https://en.wikipedia.org/wiki/ISO_8601
- **JWT Authentication:** https://jwt.io/
- **REST Best Practices:** https://restfulapi.net/

---

**Última atualização:** 05/12/2024  
**Desenvolvedor responsável:** Backend Team  
**Frontend Repository:** `/home/verissimo/eng-Software2/RevisaAI`
