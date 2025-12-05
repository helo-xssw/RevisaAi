Beleza, vamos transformar esses mocks em uma API “de verdade” pro back-end implementar. Vou documentar as rotas com base nos três módulos que você mandou: `auth.ts`, `motos.ts` e `notifications.ts`.

Vou assumir um padrão REST, com respostas em JSON e autenticação por **Bearer token (JWT)**.

> Use os caminhos relativos (ex.: `/auth/login`). O time pode definir depois o `BASE_URL` (ex.: `https://api.revisaai.com/api`).

---

## 1. Modelos de dados

### 1.1. User

Usado em autenticação e perfil.

```ts
type User = {
  id: string;
  name: string;
  email: string;
};
```

---

### 1.2. Moto

Baseado em `src/api/motos.ts`:

```ts
type Moto = {
  id: string;
  name: string;           // Ex.: "Relâmpago"
  brand: string;          // Ex.: "Yamaha MT 07"
  year: number;
  km: number;
  nextRevisionDate?: string; // ISO 8601 opcional, ex.: "2025-01-15T00:00:00.000Z"
};
```

---

### 1.3. Notification

Baseado em `src/api/notifications.ts`:

```ts
type Notification = {
  id: string;
  motoName: string;     // Ex.: "Honda Biz"
  description: string;  // Ex.: "Troca de óleo"
  completed: boolean;
  createdAt: string;    // ISO 8601
};
```

---

## 2. Autenticação (`auth.ts`)

### 2.1. Login

**Função atual:** `mockLogin(payload: LoginPayload)`

#### Rota

* **POST** `/auth/login`
* **Auth:** pública (não exige token)

#### Body (JSON)

```json
{
  "email": "usuario@exemplo.com",
  "password": "1234"
}
```

`LoginPayload`:

```ts
type LoginPayload = {
  email: string;
  password: string;
};
```

#### Respostas

* **200 OK**

```json
{
  "user": {
    "id": "1",
    "name": "Ricardo Pereira",
    "email": "ricardo@gmail.com"
  },
  "token": "jwt-mock-revisaai-1"
}
```

* **401 Unauthorized** (credenciais inválidas)

```json
{
  "message": "E-mail ou senha incorretos."
}
```

---

### 2.2. Registro (Criar conta)

**Função atual:** `mockRegister(payload: RegisterPayload)`

#### Rota

* **POST** `/auth/register`
* **Auth:** pública

#### Body (JSON)

```json
{
  "name": "Ricardo Pereira",
  "email": "ricardo@gmail.com",
  "password": "1234"
}
```

`RegisterPayload`:

```ts
type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};
```

#### Validações importantes (iguais ao mock)

* E-mail não pode estar em uso.
* `password.length >= 4`.

#### Respostas

* **201 Created**

```json
{
  "user": {
    "id": "2",
    "name": "Ricardo Pereira",
    "email": "ricardo@gmail.com"
  },
  "token": "jwt-mock-revisaai-2"
}
```

* **409 Conflict** (e-mail já cadastrado)

```json
{
  "message": "Este e-mail já está cadastrado."
}
```

* **400 Bad Request** (senha fraca)

```json
{
  "message": "A senha deve ter pelo menos 4 caracteres."
}
```

---

## 3. Usuário & Perfil (`auth.ts`)

### 3.1. Atualizar perfil

**Função atual:** `mockUpdateProfile(payload: UpdateProfilePayload)`

#### Rota

* **PUT** `/users/:id`
* **Auth:** requer token (Bearer JWT)

**Headers**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

#### Body (JSON)

```json
{
  "name": "Novo Nome",
  "email": "novoemail@exemplo.com"
}
```

`UpdateProfilePayload` no front:

```ts
type UpdateProfilePayload = {
  id: string;
  name: string;
  email: string;
};
```

> No backend, o `id` vem pela URL (`:id`). O token deve ser validado para garantir que o usuário só atualiza a própria conta.

#### Respostas

* **200 OK**

```json
{
  "id": "1",
  "name": "Novo Nome",
  "email": "novoemail@exemplo.com"
}
```

* **404 Not Found** (usuário não existe)

```json
{
  "message": "Usuário não encontrado."
}
```

* **409 Conflict** (e-mail já usado por outro usuário)

```json
{
  "message": "Este e-mail já está sendo usado por outro usuário."
}
```

* **401 Unauthorized** (sem ou com token inválido)

```json
{
  "message": "Não autorizado."
}
```

---

### 3.2. Deletar conta

**Função atual:** `mockDeleteAccount(userId: string)`

#### Rota

* **DELETE** `/users/:id`
* **Auth:** requer token (Bearer JWT)

**Headers**

```http
Authorization: Bearer <token>
```

> O backend deve garantir que o usuário só consiga deletar a própria conta (id do token == `:id`), ou que seja um admin.

#### Respostas

* **204 No Content** – conta removida com sucesso

* **404 Not Found**

```json
{
  "message": "Usuário não encontrado."
}
```

* **401 Unauthorized**

```json
{
  "message": "Não autorizado."
}
```

---

## 4. Motos (`motos.ts`)

Funções atuais:

* `fetchMotos()`
* `createMoto(data: CreateMotoInput)`
* `deleteMoto(id: string)`

### 4.1. Listar motos do usuário

#### Rota

* **GET** `/motos`
* **Auth:** requer token

**Headers**

```http
Authorization: Bearer <token>
```

> Backend deve retornar apenas as motos do usuário autenticado.

#### Resposta

* **200 OK**

```json
[
  {
    "id": "1",
    "name": "Relâmpago",
    "brand": "Yamaha MT 07",
    "year": 2022,
    "km": 15000,
    "nextRevisionDate": "2025-01-15T00:00:00.000Z"
  },
  {
    "id": "2",
    "name": "Bizinha",
    "brand": "Honda Biz 125",
    "year": 2018,
    "km": 42000,
    "nextRevisionDate": null
  }
]
```

---

### 4.2. Criar moto

**Função:** `createMoto(data: Omit<Moto, 'id'>)`

#### Rota

* **POST** `/motos`
* **Auth:** requer token

#### Body (JSON)

```json
{
  "name": "Relâmpago",
  "brand": "Yamaha MT 07",
  "year": 2022,
  "km": 15000,
  "nextRevisionDate": "2025-01-15T00:00:00.000Z"
}
```

> `id` deve ser gerado pelo backend. A moto deve ficar vinculada ao usuário autenticado (via token).

#### Respostas

* **201 Created**

```json
{
  "id": "generated-id",
  "name": "Relâmpago",
  "brand": "Yamaha MT 07",
  "year": 2022,
  "km": 15000,
  "nextRevisionDate": "2025-01-15T00:00:00.000Z"
}
```

* **400 Bad Request** (dados inválidos)

```json
{
  "message": "Dados inválidos para cadastro de moto."
}
```

* **401 Unauthorized**

```json
{
  "message": "Não autorizado."
}
```

---

### 4.3. Deletar moto

**Função:** `deleteMoto(id: string)`

#### Rota

* **DELETE** `/motos/:id`
* **Auth:** requer token

> O backend deve verificar se a moto pertence ao usuário autenticado.

#### Respostas

* **204 No Content** – moto deletada com sucesso
* **404 Not Found**

```json
{
  "message": "Moto não encontrada."
}
```

* **401 Unauthorized**

```json
{
  "message": "Não autorizado."
}
```

---

## 5. Notificações (`notifications.ts`)

Funções atuais:

* `fetchNotifications()`
* `completeNotification(id: string)`
* `completeAllNotifications()`

### 5.1. Listar notificações

#### Rota

* **GET** `/notifications`
* **Auth:** requer token

> Backend deve retornar notificações associadas ao usuário (e, se fizer sentido, às motos dele).

#### Resposta

* **200 OK**

```json
[
  {
    "id": "1",
    "motoName": "Honda Biz",
    "description": "Troca de óleo",
    "completed": false,
    "createdAt": "2025-12-01T10:00:00.000Z"
  },
  {
    "id": "2",
    "motoName": "Yamaha MT 07",
    "description": "Revisão de 10.000 km",
    "completed": false,
    "createdAt": "2025-12-01T09:00:00.000Z"
  }
]
```

---

### 5.2. Marcar uma notificação como concluída

**Função:** `completeNotification(id: string)`

#### Rota

* **PATCH** `/notifications/:id/complete`
* **Auth:** requer token

> Alternativa: `PATCH /notifications/:id` com `{ "completed": true }`.
> Aqui sigo a semântica explícita `:id/complete`.

#### Body

* **Opcional** – pode ser vazio (`{}`).

#### Respostas

* **200 OK** (estado após atualização)

```json
{
  "id": "1",
  "motoName": "Honda Biz",
  "description": "Troca de óleo",
  "completed": true,
  "createdAt": "2025-12-01T10:00:00.000Z"
}
```

* **404 Not Found**

```json
{
  "message": "Notificação não encontrada."
}
```

* **401 Unauthorized**

```json
{
  "message": "Não autorizado."
}
```

---

### 5.3. Marcar todas as notificações como concluídas

**Função:** `completeAllNotifications()`

#### Rota

* **PATCH** `/notifications/complete-all`
* **Auth:** requer token

> A operação deve marcar como `completed: true` todas as notificações do usuário autenticado.

#### Body

* Nenhum / `{}`.

#### Respostas

* **200 OK**

```json
[
  {
    "id": "1",
    "motoName": "Honda Biz",
    "description": "Troca de óleo",
    "completed": true,
    "createdAt": "2025-12-01T10:00:00.000Z"
  },
  {
    "id": "2",
    "motoName": "Yamaha MT 07",
    "description": "Revisão de 10.000 km",
    "completed": true,
    "createdAt": "2025-12-01T09:00:00.000Z"
  }
]
```

* **401 Unauthorized**

```json
{
  "message": "Não autorizado."
}
```

---

## 6. Resumo para o dev back-end

Se você quiser mandar uma “cola” rápida pro dev, algo assim resume bem:

* **Auth**

  * `POST /auth/login` – login com email/senha → `{ user, token }`
  * `POST /auth/register` – criar usuário → `{ user, token }`
* **Usuário**

  * `PUT /users/:id` – atualizar nome/e-mail
  * `DELETE /users/:id` – excluir conta
* **Motos**

  * `GET /motos` – listar motos do usuário
  * `POST /motos` – cadastrar moto
  * `DELETE /motos/:id` – excluir moto
* **Notificações**

  * `GET /notifications` – listar notificações
  * `PATCH /notifications/:id/complete` – concluir uma
  * `PATCH /notifications/complete-all` – concluir todas

Se você quiser depois, posso transformar isso em um **esqueleto OpenAPI/Swagger** (`openapi.yaml`) ou em um arquivo `.md` organizado pra colocar direto no repositório.
