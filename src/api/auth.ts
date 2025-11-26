// Mock de autenticação para o RevisaAI
// Esta é uma implementação de exemplo. Em produção, substituir por API real.

export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // Em produção, NUNCA armazenar senha em texto plano
};

// Array de usuários mockados
const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    password: '1234',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    password: 'senha123',
  },
];

// Simula latência de rede
const simulateDelay = (ms: number = 800) => 
  new Promise(resolve => setTimeout(resolve, ms));

export type LoginResponse = {
  success: true;
  user: Omit<User, 'password'>;
  token: string;
} | {
  success: false;
  error: string;
};

export type RegisterResponse = {
  success: true;
  user: Omit<User, 'password'>;
  token: string;
} | {
  success: false;
  error: string;
};

/**
 * Mock de login
 * Valida email e senha contra array de usuários mockados
 */
export async function mockLogin(
  email: string,
  password: string
): Promise<LoginResponse> {
  await simulateDelay();

  // Validações básicas
  if (!email || !password) {
    return {
      success: false,
      error: 'Email e senha são obrigatórios.',
    };
  }

  if (password.length < 4) {
    return {
      success: false,
      error: 'A senha deve ter no mínimo 4 caracteres.',
    };
  }

  // Buscar usuário
  const user = mockUsers.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return {
      success: false,
      error: 'E-mail ou senha incorretos.',
    };
  }

  // Gerar token JWT mockado
  const token = `jwt-mock-revisaai-${user.id}`;

  // Remover senha antes de retornar
  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    user: userWithoutPassword,
    token,
  };
}

/**
 * Mock de registro
 * Cria novo usuário se email não estiver em uso
 */
export async function mockRegister(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  await simulateDelay();

  // Validações básicas
  if (!name || !email || !password) {
    return {
      success: false,
      error: 'Todos os campos são obrigatórios.',
    };
  }

  if (name.trim().length < 3) {
    return {
      success: false,
      error: 'O nome deve ter no mínimo 3 caracteres.',
    };
  }

  // Validação simples de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: 'Por favor, insira um e-mail válido.',
    };
  }

  if (password.length < 4) {
    return {
      success: false,
      error: 'A senha deve ter no mínimo 4 caracteres.',
    };
  }

  // Verificar se email já existe
  const emailExists = mockUsers.some(
    u => u.email.toLowerCase() === email.toLowerCase()
  );

  if (emailExists) {
    return {
      success: false,
      error: 'Este e-mail já está cadastrado.',
    };
  }

  // Criar novo usuário
  const newUser: User = {
    id: String(mockUsers.length + 1),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  };

  // Adicionar ao array mockado
  mockUsers.push(newUser);

  // Gerar token JWT mockado
  const token = `jwt-mock-revisaai-${newUser.id}`;

  // Remover senha antes de retornar
  const { password: _, ...userWithoutPassword } = newUser;

  return {
    success: true,
    user: userWithoutPassword,
    token,
  };
}
