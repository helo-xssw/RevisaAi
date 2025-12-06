📘 Especificação da API REST - RevisaAI
Versão: 1.0 Base URL: /api (Prefixo global recomendado) Formato de Dados: JSON Autenticação: Bearer Token (JWT) enviado no header Authorization.

1. Autenticação (/auth)
O frontend espera que o token JWT seja retornado no corpo da resposta e persista para as próximas chamadas.

🔐 Login
Rota: POST /auth/login

Acesso: Público

Payload (Request):

JSON
{
  "email": "usuario@exemplo.com",
  "password": "senha_segura"
}
Resposta (200 OK):

JSON
{
  "user": {
    "id": "uuid-v4",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "avatarUrl": "https://..." // ou null
  },
  "token": "eyJhbGciOiJIUzI1Ni..."
}
📝 Registro
Rota: POST /auth/register

Acesso: Público

Payload (Request):

JSON
{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senha_segura"
}
Resposta (201 Created):

Mesma estrutura do Login (retorna usuário + token).

2. Usuários (/users)
👤 Atualizar Perfil
Rota: PUT /users/:id

Acesso: Privado (Token necessário)

Validação: O ID na URL deve corresponder ao ID do usuário no Token JWT.

Payload (Request):

JSON
{
  "id": "uuid-v4",
  "name": "Novo Nome",
  "email": "novo@email.com",
  "avatarUrl": "https://nova-foto.com" // opcional
}
Resposta (200 OK):

JSON
{
  "id": "uuid-v4",
  "name": "Novo Nome",
  "email": "novo@email.com",
  "avatarUrl": "..."
}
🗑️ Deletar Conta
Rota: DELETE /users/:id

Acesso: Privado

Resposta (204 No Content): (Vazio)

3. Motos (/motos)
Nota Importante: Todas as rotas de listagem (GET) devem filtrar os dados pelo userId extraído do Token JWT. O usuário não deve ver motos de outros usuários.

🏍️ Listar Minhas Motos
Rota: GET /motos

Acesso: Privado

Resposta (200 OK):

JSON
[
  {
    "id": "uuid",
    "name": "Minha Honda",
    "brand": "Honda",
    "model": "Biz 125",
    "year": 2022,
    "plate": "ABC-1234",
    "km": 15000,
    "color": "Vermelha",
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
➕ Criar Moto
Rota: POST /motos

Acesso: Privado

Payload (Request):

JSON
{
  "name": "Apelido da Moto",
  "brand": "Marca",
  "model": "Modelo (opcional)",
  "year": 2022,        // number, opcional
  "plate": "PLACA",    // opcional
  "km": 0,             // number, opcional
  "color": "Cor"       // opcional
}
Resposta (201 Created): Retorna o objeto completo da moto criada com ID.

✏️ Atualizar Moto
Rota: PUT /motos/:id

Acesso: Privado

Payload (Request):

Aceita Partial<CreateMotoInput> (qualquer campo acima).

Resposta (200 OK): Retorna a moto atualizada.

❌ Deletar Moto
Rota: DELETE /motos/:id

Acesso: Privado

Resposta (204 No Content): (Vazio)

4. Revisões (/revisions)
🛠️ Listar Revisões
Rota: GET /revisions

Acesso: Privado

Filtro: Retornar revisões vinculadas às motos do usuário logado.

Resposta (200 OK): Lista de objetos Revision.

➕ Criar Revisão
Rota: POST /revisions

Acesso: Privado

Payload (Request):

JSON
{
  "motoId": "uuid-moto",
  "title": "Troca de Óleo",
  "service": "Descrição curta",
  "details": "Observações longas...",
  "date": "2024-12-25T00:00:00.000Z", // ISO String
  "time": "2024-12-25T14:30:00.000Z", // ISO String
  "km": 5000,
  "autoReminderEnabled": true,
  "autoReminderInterval": "3 meses"
}
Nota: O campo status deve ser inicializado como 'pending' por padrão no backend.

✏️ Atualizar Revisão (PATCH)
Rota: PATCH /revisions/:id

Acesso: Privado

Diferença: O frontend usa PATCH aqui, não PUT.

Payload (Request): Pode conter qualquer campo da criação + status.

JSON
{
  "status": "done",
  "km": 5500
}
❌ Deletar Revisão
Rota: DELETE /revisions/:id

Acesso: Privado