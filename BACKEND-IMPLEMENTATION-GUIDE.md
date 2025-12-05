# 🛠️ Guia de Implementação - Backend REST API

**Versão:** 1.0  
**Data:** Dezembro 2025  
**Público:** Desenvolvedores Backend

---

## 📋 Índice

1. [Arquitetura](#arquitetura)
2. [Setup Inicial](#setup-inicial)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Implementação Passo a Passo](#implementação-passo-a-passo)
5. [Autenticação](#autenticação)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Testes](#testes)
8. [Deploy](#deploy)

---

## 🏗️ Arquitetura

### Fluxo de Requisição

```
┌─────────────────────┐
│  Frontend (Expo)    │
│   (HTTP Request)    │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   Backend REST API  │
│  (Node/Express)     │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  Banco de Dados     │
│  (PostgreSQL)       │
└─────────────────────┘
```

### Camadas Recomendadas

```
src/
├── controllers/      # Lógica de roteamento e validação
├── services/         # Lógica de negócio
├── models/           # Modelos de dados (DB)
├── middlewares/      # Autenticação, logs, etc
├── routes/           # Definição de rotas
├── utils/            # Funções auxiliares
└── config/           # Configuração (DB, env, etc)
```

---

## 🚀 Setup Inicial

### 1. Stack Recomendado

```bash
# Node.js + Express
npm init -y
npm install express dotenv cors
npm install --save-dev typescript ts-node @types/express @types/node nodemon
```

### 2. Estrutura de Pastas

```bash
mkdir -p src/{controllers,services,models,middlewares,routes,utils,config}
```

### 3. Arquivo `.env`

```env
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/revisaai

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:19000,exp://localhost:19000

# Log
LOG_LEVEL=debug
```

---

## 📁 Estrutura de Pastas

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Conexão com DB
│   │   └── env.ts           # Variáveis de ambiente
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── usersController.ts
│   │   ├── motosController.ts
│   │   ├── revisionsController.ts
│   │   └── notificationsController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── usersService.ts
│   │   ├── motosService.ts
│   │   ├── revisionsService.ts
│   │   └── notificationsService.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Moto.ts
│   │   ├── Revision.ts
│   │   └── Notification.ts
│   ├── middlewares/
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── motos.ts
│   │   ├── revisions.ts
│   │   └── notifications.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── validators.ts
│   │   └── errors.ts
│   └── app.ts              # Configuração do Express
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 🔧 Implementação Passo a Passo

### Passo 1: Configuração do Express

**`src/app.ts`**

```typescript
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import motosRoutes from './routes/motos';
import revisionsRoutes from './routes/revisions';
import notificationsRoutes from './routes/notifications';
import errorHandler from './middlewares/errorHandler';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/motos', motosRoutes);
app.use('/api/revisions', revisionsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Tratamento de erros
app.use(errorHandler);

export default app;
```

---

### Passo 2: Autenticação JWT

**`src/utils/jwt.ts`**

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): { userId: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { userId: string };
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
}
```

**`src/middlewares/authMiddleware.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.slice(7); // Remove 'Bearer '

  try {
    const { userId } = verifyToken(token);
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
```

---

### Passo 3: Controller de Autenticação

**`src/controllers/authController.ts`**

```typescript
import { Request, Response } from 'express';
import * as authService from '../services/authService';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const result = await authService.register(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
```

---

### Passo 4: Service de Autenticação

**`src/services/authService.ts`**

```typescript
import User from '../models/User';
import { generateToken } from '../utils/jwt';

export async function login(email: string, password: string) {
  // 1. Buscar usuário por email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('E-mail ou senha incorretos');
  }

  // 2. Verificar senha (usar bcrypt em produção!)
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new Error('E-mail ou senha incorretos');
  }

  // 3. Gerar token
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    token,
  };
}

export async function register(
  name: string,
  email: string,
  password: string,
) {
  // 1. Verificar se email já existe
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('Este e-mail já está cadastrado');
  }

  // 2. Criar novo usuário
  const user = new User({ name, email, password });
  await user.save();

  // 3. Gerar token
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    token,
  };
}
```

---

### Passo 5: Rotas de Autenticação

**`src/routes/auth.ts`**

```typescript
import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

export default router;
```

---

### Passo 6: Controller de Motos

**`src/controllers/motosController.ts`**

```typescript
import { Request, Response } from 'express';
import * as motosService from '../services/motosService';

export async function list(req: Request, res: Response) {
  try {
    const motos = await motosService.listByUserId(req.userId!);
    res.json(motos);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const moto = await motosService.create(req.userId!, req.body);
    res.status(201).json(moto);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const moto = await motosService.update(
      req.params.id,
      req.userId!,
      req.body,
    );
    res.json(moto);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await motosService.delete(req.params.id, req.userId!);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
```

---

### Passo 7: Rotas de Motos

**`src/routes/motos.ts`**

```typescript
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import * as motosController from '../controllers/motosController';

const router = Router();

router.use(authMiddleware);

router.get('/', motosController.list);
router.post('/', motosController.create);
router.put('/:id', motosController.update);
router.delete('/:id', motosController.remove);

export default router;
```

---

## 🔐 Autenticação

### Segurança Recomendada

1. **Hash de Senha:** Use bcrypt
   ```typescript
   import bcrypt from 'bcrypt';
   
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **HTTPS em Produção:** Sempre use HTTPS

3. **CORS:** Configure adequadamente
   ```typescript
   app.use(cors({
     origin: process.env.CORS_ORIGIN?.split(','),
   }));
   ```

4. **Rate Limiting:** Proteja contra brute force
   ```typescript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100,
   });
   
   app.use('/api/auth/login', limiter);
   ```

---

## ⚠️ Tratamento de Erros

**`src/middlewares/errorHandler.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(error);

  res.status(500).json({
    error: error.message || 'Erro interno do servidor',
    statusCode: 500,
    timestamp: new Date().toISOString(),
  });
}
```

---

## 🧪 Testes

### Com cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "1234"
  }'

# Resposta esperada
{
  "user": {
    "id": "1",
    "name": "Test User",
    "email": "test@gmail.com",
    "avatarUrl": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

# Buscar motos (use o token)
curl -X GET http://localhost:3000/api/motos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Com Postman

1. Fazer login em `/auth/login`
2. Copiar o token da resposta
3. Em "Authorization" → "Bearer Token" → colar o token
4. Fazer requisições em outros endpoints

---

## 🚢 Deploy

### Variáveis de Ambiente (Produção)

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://prod_user:prod_pass@prod.db.com:5432/revisaai
JWT_SECRET=chave_super_secreta_em_producao
JWT_EXPIRY=7d
CORS_ORIGIN=https://seu-app.com
LOG_LEVEL=info
```

### Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados em produção
- [ ] SSL/HTTPS configurado
- [ ] CORS restrito a domínios conhecidos
- [ ] Logs configurados
- [ ] Backup de banco de dados
- [ ] Monitoramento de erros (Sentry, etc)
- [ ] Rate limiting ativado
- [ ] CORS pré-voo habilitado

---

## 📞 Suporte

Para dúvidas sobre a integração com o frontend:
- Verifique `BACKEND-API-SPEC.md`
- Repo Frontend: `/home/verissimo/eng-Software2/RevisaAI`

---

**Última atualização:** 05/12/2024
