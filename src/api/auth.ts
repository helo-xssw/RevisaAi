import { hasApiConfigured, http } from './http';

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

type InternalUser = User & {
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type UpdateProfilePayload = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};

const LATENCY = 600;

// "banco" fake em memória (fallback offline / sem API)
let users: InternalUser[] = [
  {
    id: '1',
    name: 'Ricardo Pereira',
    email: 'ricardo@gmail.com',
    password: '1234',
    avatarUrl: undefined,
  },
];

function createTokenForUser(user: User): string {
  return `jwt-mock-revisaai-${user.id}`;
}

// Util para esconder o campo password
function publicUser(user: InternalUser): User {
  const { password: _pw, ...rest } = user;
  return rest;
}

// ============================================================
// MOCK (fallback offline / sem API)
// ============================================================

// ---------- LOGIN ----------
export async function mockLogin(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const { email, password } = payload;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = users.find((u) => u.email === email.trim());

      if (!found || found.password !== password) {
        return reject(new Error('E-mail ou senha incorretos.'));
      }

      const user = publicUser(found);
      const token = createTokenForUser(user);
      resolve({ user, token });
    }, LATENCY);
  });
}

// ---------- REGISTER ----------
export async function mockRegister(
  payload: RegisterPayload,
): Promise<LoginResponse> {
  const { name, email, password } = payload;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      );

      if (emailExists) {
        return reject(new Error('Este e-mail já está cadastrado.'));
      }

      if (password.length < 4) {
        return reject(
          new Error('A senha deve ter pelo menos 4 caracteres.'),
        );
      }

      const newUser: InternalUser = {
        id: (users.length + 1).toString(),
        name: name.trim(),
        email: email.trim(),
        password,
      };

      users.push(newUser);

      const user = publicUser(newUser);
      const token = createTokenForUser(user);

      resolve({ user, token });
    }, LATENCY);
  });
}

// ---------- UPDATE PROFILE ----------
export async function mockUpdateProfile(
  payload: UpdateProfilePayload,
): Promise<User> {
  const { id, name, email, avatarUrl } = payload;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = users.findIndex((u) => u.id === id);

      if (index === -1) {
        return reject(new Error('Usuário não encontrado.'));
      }

      const emailExists = users.some(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.id !== id,
      );

      if (emailExists) {
        return reject(
          new Error('Este e-mail já está sendo usado por outro usuário.'),
        );
      }

      users[index] = {
        ...users[index],
        name: name.trim(),
        email: email.trim(),
        avatarUrl,
      };

      const updated = publicUser(users[index]);
      resolve(updated);
    }, LATENCY);
  });
}

// ---------- DELETE ACCOUNT ----------
export async function mockDeleteAccount(userId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = users.some((u) => u.id === userId);
      if (!exists) {
        return reject(new Error('Usuário não encontrado.'));
      }

      users = users.filter((u) => u.id !== userId);
      resolve();
    }, LATENCY);
  });
}

// ============================================================
// REST "oficial" da API
// (ajuste paths se sua API usar outros endpoints)
// ============================================================

async function restLogin(payload: LoginPayload): Promise<LoginResponse> {
  // ex: POST /auth/login
  return http.post<LoginResponse>('/auth/login', payload);
}

async function restRegister(
  payload: RegisterPayload,
): Promise<LoginResponse> {
  // ex: POST /auth/register
  return http.post<LoginResponse>('/auth/register', payload);
}

async function restUpdateProfile(
  payload: UpdateProfilePayload,
  token: string | null,
): Promise<User> {
  // ex: PUT /users/:id
  return http.put<User>(`/users/${payload.id}`, payload, token);
}

async function restDeleteAccount(
  userId: string,
  token: string | null,
): Promise<void> {
  // ex: DELETE /users/:id
  await http.delete(`/users/${userId}`, token);
}

// ============================================================
// Funções públicas: REST-first, mock como fallback
// ============================================================

const shouldUseMockOnly = () => !hasApiConfigured;

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (shouldUseMockOnly()) {
    return mockLogin(payload);
  }

  try {
    return await restLogin(payload);
  } catch (error) {
    console.warn(
      '[auth] Falha na API, usando mockLogin:',
      (error as Error).message,
    );
    return mockLogin(payload);
  }
}

export async function register(
  payload: RegisterPayload,
): Promise<LoginResponse> {
  if (shouldUseMockOnly()) {
    return mockRegister(payload);
  }

  try {
    return await restRegister(payload);
  } catch (error) {
    console.warn(
      '[auth] Falha na API, usando mockRegister:',
      (error as Error).message,
    );
    return mockRegister(payload);
  }
}

export async function updateProfileApi(
  payload: UpdateProfilePayload,
  token: string | null,
): Promise<User> {
  if (shouldUseMockOnly()) {
    return mockUpdateProfile(payload);
  }

  try {
    return await restUpdateProfile(payload, token);
  } catch (error) {
    console.warn(
      '[auth] Falha na API, usando mockUpdateProfile:',
      (error as Error).message,
    );
    return mockUpdateProfile(payload);
  }
}

export async function deleteAccountApi(
  userId: string,
  token: string | null,
): Promise<void> {
  if (shouldUseMockOnly()) {
    return mockDeleteAccount(userId);
  }

  try {
    return await restDeleteAccount(userId, token);
  } catch (error) {
    console.warn(
      '[auth] Falha na API, usando mockDeleteAccount:',
      (error as Error).message,
    );
    return mockDeleteAccount(userId);
  }
}
