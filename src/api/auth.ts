// src/api/auth.ts
// API de autenticação mockada para o RevisaAI

export type User = {
  id: string;
  name: string;
  email: string;
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
};

const LATENCY = 600;

// "banco" fake em memória
let users: InternalUser[] = [
  {
    id: '1',
    name: 'Ricardo Pereira',
    email: 'ricardop@gmail.com',
    password: '1234',
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

// ---------- LOGIN ----------
export async function mockLogin(
  payload: LoginPayload,
): Promise<{ user: User; token: string }> {
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
): Promise<{ user: User; token: string }> {
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
  const { id, name, email } = payload;

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
