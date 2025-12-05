# 💻 Exemplos de Implementação - Diferentes Stacks

**Nota:** Use estes exemplos como ponto de partida. Adapte conforme necessário para sua arquitetura.

---

## 📋 Índice

1. [Express.js + TypeScript](#expressjs--typescript)
2. [FastAPI + Python](#fastapi--python)
3. [Django + Django REST Framework](#django--django-rest-framework)
4. [NestJS](#nestjs)
5. [Spring Boot + Java](#spring-boot--java)

---

## Express.js + TypeScript

### Setup

```bash
npm init -y
npm install express dotenv cors jsonwebtoken bcryptjs
npm install --save-dev typescript ts-node @types/express @types/node @types/bcryptjs nodemon
npx tsc --init
```

### Exemplo Completo: Auth + Motos

**`src/models/User.ts`**

```typescript
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcryptjs.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
```

**`src/controllers/authController.ts`**

```typescript
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ error: 'E-mail ou senha incorretos' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'Este e-mail já está cadastrado' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
```

**`src/middlewares/auth.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

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

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
}
```

**`src/app.ts`**

```typescript
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
```

---

## FastAPI + Python

### Setup

```bash
pip install fastapi uvicorn sqlalchemy pydantic python-dotenv pyjwt bcrypt
```

### Exemplo Completo

**`main.py`**

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from pydantic import BaseModel
from typing import Optional
import jwt
import bcrypt
from datetime import datetime, timedelta
import os

app = FastAPI()

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret")
ALGORITHM = "HS256"

# ============ Modelos ============

class User(BaseModel):
    id: str
    name: str
    email: str
    avatarUrl: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginResponse(BaseModel):
    user: User
    token: str

# ============ Autenticação ============

security = HTTPBearer()

def verify_token(credentials: HTTPAuthCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token inválido")
        return user_id
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

# ============ Endpoints ============

@app.post("/api/auth/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    # Simular busca no banco
    if req.email != "test@gmail.com" or req.password != "1234":
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos")
    
    token = jwt.encode(
        {"user_id": "1", "exp": datetime.utcnow() + timedelta(days=7)},
        JWT_SECRET,
        algorithm=ALGORITHM
    )
    
    return {
        "user": {
            "id": "1",
            "name": "Test User",
            "email": "test@gmail.com",
            "avatarUrl": None
        },
        "token": token
    }

@app.post("/api/auth/register", response_model=LoginResponse)
async def register(req: RegisterRequest):
    # Simular validação
    if len(req.password) < 4:
        raise HTTPException(status_code=400, detail="Senha muito curta")
    
    token = jwt.encode(
        {"user_id": "2", "exp": datetime.utcnow() + timedelta(days=7)},
        JWT_SECRET,
        algorithm=ALGORITHM
    )
    
    return {
        "user": {
            "id": "2",
            "name": req.name,
            "email": req.email,
            "avatarUrl": None
        },
        "token": token
    }

@app.get("/api/motos")
async def list_motos(user_id: str = Depends(verify_token)):
    return [
        {
            "id": "1",
            "name": "Honda Biz",
            "brand": "Honda",
            "model": "Biz 125",
            "year": 2020,
            "plate": "ABC-1234",
            "km": 20500,
            "color": "Prata"
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
```

---

## Django + Django REST Framework

### Setup

```bash
pip install django djangorestframework python-dotenv pyjwt
django-admin startproject revisaai
python manage.py startapp api
```

### Exemplo

**`api/models.py`**

```python
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    avatar_url = models.URLField(blank=True, null=True)

class Moto(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    model = models.CharField(max_length=255, blank=True)
    year = models.IntegerField(blank=True, null=True)
    plate = models.CharField(max_length=20, blank=True)
    km = models.FloatField(blank=True, null=True)
    color = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
```

**`api/serializers.py`**

```python
from rest_framework import serializers
from .models import CustomUser, Moto

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'avatar_url')

class MotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Moto
        fields = ('id', 'name', 'brand', 'model', 'year', 'plate', 'km', 'color', 'created_at')
```

**`api/views.py`**

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Moto
from .serializers import MotoSerializer

class MotoViewSet(viewsets.ModelViewSet):
    serializer_class = MotoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Moto.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data
        moto = Moto.objects.create(
            user=request.user,
            name=data['name'],
            brand=data['brand'],
            model=data.get('model'),
            year=data.get('year'),
            plate=data.get('plate'),
            km=data.get('km'),
            color=data.get('color')
        )
        serializer = self.get_serializer(moto)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
```

**`api/urls.py`**

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MotoViewSet

router = DefaultRouter()
router.register(r'motos', MotoViewSet, basename='moto')

urlpatterns = [
    path('api/', include(router.urls)),
]
```

---

## NestJS

### Setup

```bash
npm install -g @nestjs/cli
nest new revisaai
cd revisaai
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install --save-dev @types/bcrypt
```

### Exemplo

**`src/auth/auth.controller.ts`**

```typescript
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(
    @Body() { name, email, password }: { name: string; email: string; password: string },
  ) {
    return this.authService.register(name, email, password);
  }
}
```

**`src/auth/auth.service.ts`**

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    // Simular busca no banco
    if (email !== 'test@gmail.com' || password !== '1234') {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const user = {
      id: '1',
      name: 'Test User',
      email: 'test@gmail.com',
      avatarUrl: null,
    };

    const token = this.jwtService.sign({ userId: user.id });

    return { user, token };
  }

  async register(name: string, email: string, password: string) {
    // Validar
    if (password.length < 4) {
      throw new UnauthorizedException('Senha muito curta');
    }

    const user = {
      id: '2',
      name,
      email,
      avatarUrl: null,
    };

    const token = this.jwtService.sign({ userId: user.id });

    return { user, token };
  }
}
```

---

## Spring Boot + Java

### Setup (Maven)

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.11.5</version>
</dependency>
```

### Exemplo

**`src/main/java/com/revisaai/auth/AuthController.java`**

```java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(
                request.getEmail(),
                request.getPassword()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("E-mail ou senha incorretos"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            LoginResponse response = authService.register(
                request.getName(),
                request.getEmail(),
                request.getPassword()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }
}
```

**`src/main/java/com/revisaai/auth/AuthService.java`**

```java
@Service
public class AuthService {

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(String email, String password) throws Exception {
        // Simular validação
        if (!email.equals("test@gmail.com") || !password.equals("1234")) {
            throw new Exception("E-mail ou senha incorretos");
        }

        User user = new User("1", "Test User", email, null);
        String token = jwtUtil.generateToken(user.getId());

        return new LoginResponse(user, token);
    }

    public LoginResponse register(String name, String email, String password) throws Exception {
        if (password.length() < 4) {
            throw new Exception("Senha muito curta");
        }

        User user = new User("2", name, email, null);
        String token = jwtUtil.generateToken(user.getId());

        return new LoginResponse(user, token);
    }
}
```

---

## 📌 Resumo

| Framework | Linguagem | Complexidade | Performance | Recomendado? |
|-----------|-----------|--------------|-------------|--------------|
| Express + TS | TypeScript | Baixa | Alta | ✅ Sim |
| FastAPI | Python | Muito Baixa | Muito Alta | ✅ Sim |
| Django | Python | Média | Alta | ✅ Sim |
| NestJS | TypeScript | Média | Alta | ✅ Sim |
| Spring Boot | Java | Alta | Muito Alta | ✅ Sim (para escala) |

---

**Escolha o que melhor se adequa ao seu time!**
