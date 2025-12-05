# 🎯 Resumo Executivo - Padrão REST + Mock Fallback

**Data:** Dezembro 2025  
**Branch:** `barra`  
**Status:** ✅ Pronto para Backend

---

## 📌 Visão Geral

O RevisaAI utiliza um sistema **REST-first com mock fallback automático**. Isso significa:

1. ✅ **Sem API configurada?** → Funciona 100% com dados mockados
2. ✅ **API inativa/com erro?** → Cai automático para mock (sem quebra)
3. ✅ **API online?** → Usa API REST em tempo real

**Nenhuma alteração no código do frontend** é necessária. O desenvolvedor backend apenas implementa os endpoints REST.

---

## 📚 Documentação

| Documento | Descrição | Público |
|-----------|-----------|---------|
| **[BACKEND-API-SPEC.md](./BACKEND-API-SPEC.md)** | Especificação completa de endpoints REST | Backend |
| **[BACKEND-IMPLEMENTATION-GUIDE.md](./BACKEND-IMPLEMENTATION-GUIDE.md)** | Guia passo-a-passo de implementação | Backend |
| **[API-v2.md](./context/API-v2.md)** | Documentação interna (mock/tipos) | Frontend |

---

## 🔗 Arquivos Principais (Frontend)

```
src/api/
├── http.ts              ← Cliente REST com hasApiConfigured
├── auth.ts              ← Login/register com fallback
├── motos.ts             ← CRUD de motos
├── revisions.ts         ← CRUD de revisões
└── notifications.ts     ← CRUD de notificações

src/contexts/
└── authContext.tsx      ← Usa auth.ts com persistência

src/components/ui/
└── TextInput.tsx        ← Componente com validação visual
```

---

## 🚀 Fluxo Rápido

### Frontend chamando API

```typescript
// Componente/Context chama:
const motos = await fetchMotos(token);

// Internamente (src/api/motos.ts):
1. Se !hasApiConfigured → return mockFetchMotos()
2. Se API ok → return await http.get('/motos', token)
3. Se API falha → console.warn + return mockFetchMotos()
```

### Variável de Ambiente

```bash
# Configure no .env ou app.config.ts
EXPO_PUBLIC_API_URL=https://seu-backend.com/api

# Sem configurar = usa mock sempre
```

---

## 📡 Endpoints Esperados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login (sem token) |
| POST | `/auth/register` | Registro (sem token) |
| PUT | `/users/:id` | Atualizar perfil |
| DELETE | `/users/:id` | Deletar conta |
| GET | `/motos` | Listar motos |
| POST | `/motos` | Criar moto |
| PUT | `/motos/:id` | Atualizar moto |
| DELETE | `/motos/:id` | Deletar moto |
| GET | `/revisions` | Listar revisões |
| POST | `/revisions` | Criar revisão |
| PATCH | `/revisions/:id` | Atualizar revisão |
| DELETE | `/revisions/:id` | Deletar revisão |
| GET | `/notifications` | Listar notificações |
| POST | `/notifications` | Criar notificação |
| PATCH | `/notifications/:id` | Atualizar notificação |
| DELETE | `/notifications/:id` | Deletar notificação |
| DELETE | `/notifications/revision/:revisionId` | Deletar por revisão |
| PATCH | `/notifications/revision/:revisionId` | Atualizar por revisão |

---

## 🔐 Autenticação

- **Tipo:** JWT Bearer Token
- **Header:** `Authorization: Bearer token...`
- **Endpoints públicos:** `/auth/login`, `/auth/register`
- **Endpoints protegidos:** Todos os outros (requerem token)

---

## 📊 Tipos de Dados

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "avatarUrl": "string (opcional)"
}
```

### Moto
```json
{
  "id": "string",
  "name": "string",
  "brand": "string",
  "model": "string (opcional)",
  "year": "number (opcional)",
  "plate": "string (opcional)",
  "km": "number (opcional)",
  "color": "string (opcional)",
  "createdAt": "ISO 8601 (opcional)"
}
```

### Revision
```json
{
  "id": "string",
  "motoId": "string",
  "title": "string",
  "service": "string",
  "details": "string (opcional)",
  "date": "ISO 8601",
  "time": "ISO 8601",
  "km": "number (opcional)",
  "status": "pending | done",
  "autoReminderEnabled": "boolean",
  "autoReminderInterval": "string (opcional)",
  "createdAt": "ISO 8601 (opcional)"
}
```

### Notification
```json
{
  "id": "string",
  "motoId": "string",
  "revisionId": "string",
  "title": "string",
  "description": "string",
  "status": "pending | done",
  "createdAt": "ISO 8601 (opcional)"
}
```

---

## ✅ Implementação Checklist

- [ ] Setup do servidor Express/Node
- [ ] Banco de dados (PostgreSQL recomendado)
- [ ] Middleware de autenticação JWT
- [ ] Validação de entrada
- [ ] CRUD de usuários (auth + perfil)
- [ ] CRUD de motos
- [ ] CRUD de revisões
- [ ] CRUD de notificações
- [ ] Endpoints especiais (notifications by revision)
- [ ] Testes com cURL/Postman
- [ ] Configuração CORS
- [ ] Tratamento de erros
- [ ] Rate limiting
- [ ] Logs
- [ ] Deploy em produção
- [ ] Variáveis de ambiente

---

## 🧪 Teste Rápido

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"1234"}' \
  | jq -r '.token')

# 2. Buscar motos
curl -X GET http://localhost:3000/api/motos \
  -H "Authorization: Bearer $TOKEN"

# 3. Criar moto
curl -X POST http://localhost:3000/api/motos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Honda Biz",
    "brand": "Honda",
    "model": "Biz 125",
    "year": 2020,
    "plate": "ABC-1234"
  }'
```

---

## 🔄 Ciclo de Desenvolvimento

### Frontend (já pronto)
1. ✅ Mock em memória funcionando
2. ✅ Componentes UI com validação
3. ✅ Contexts com persistência AsyncStorage
4. ✅ HTTP client com fallback automático
5. ⏳ Aguardando Backend

### Backend (próximo passo)
1. ⏳ Setup servidor
2. ⏳ Autenticação JWT
3. ⏳ CRUD endpoints
4. ⏳ Validação de dados
5. ⏳ Testes
6. ⏳ Deploy

### Teste Integrado
1. ⏳ Apontar `EXPO_PUBLIC_API_URL` para seu backend
2. ⏳ Testar login/registro
3. ⏳ Testar CRUD de motos
4. ⏳ Testar CRUD de revisões
5. ⏳ Testar CRUD de notificações

---

## 📞 Contatos / Dúvidas

**Frontend Developer:**  
- Branch: `barra`
- Repo: `/home/verissimo/eng-Software2/RevisaAI`

**Backend Developer:**  
- Leia: `BACKEND-API-SPEC.md`
- Implemente: `BACKEND-IMPLEMENTATION-GUIDE.md`

---

## 📝 Notas Importantes

1. **Datas em ISO 8601:** Todos os timestamps devem estar em ISO 8601
   - ✅ `2024-12-05T15:30:00Z`
   - ❌ `05/12/2024 15:30`

2. **Status HTTP:**
   - `200` - GET/PUT/PATCH bem-sucedido
   - `201` - POST bem-sucedido
   - `204` - DELETE bem-sucedido
   - `400` - Dados inválidos
   - `401` - Token ausente/inválido
   - `404` - Recurso não encontrado
   - `500` - Erro do servidor

3. **Bearer Token:**
   - Sempre usar `Authorization: Bearer token...`
   - Sem "Bearer " = erro 401

4. **Fallback Automático:**
   - Frontend não precisa fazer nada
   - Se API falhar, usa mock automaticamente
   - Logs mostram qual rota foi usada (`[motos] Falha na API...`)

---

## 🎓 Referências

- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)
- [ISO 8601 Dates](https://en.wikipedia.org/wiki/ISO_8601)
- [JWT.io](https://jwt.io/)
- [REST Best Practices](https://restfulapi.net/)
- [Express.js](https://expressjs.com/)

---

**Status:** ✅ Documentação Completa  
**Última Atualização:** 05/12/2024  
**Próxima Etapa:** Implementação Backend
