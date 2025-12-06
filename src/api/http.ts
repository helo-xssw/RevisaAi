const BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

export const hasApiConfigured = !!BASE_URL;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  body?: any;
  token?: string | null;
};

async function request<T>(
  path: string,
  method: HttpMethod,
  options: RequestOptions = {},
): Promise<T> {
  if (!BASE_URL) {
    throw new Error('API base URL not configured');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(
      `HTTP ${response.status}: ${text || response.statusText}`,
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export const http = {
  get: <T>(path: string, token?: string | null) =>
    request<T>(path, 'GET', { token }),
  post: <T>(path: string, body?: any, token?: string | null) =>
    request<T>(path, 'POST', { body, token }),
  put: <T>(path: string, body?: any, token?: string | null) =>
    request<T>(path, 'PUT', { body, token }),
  patch: <T>(path: string, body?: any, token?: string | null) =>
    request<T>(path, 'PATCH', { body, token }),
  delete: <T>(path: string, token?: string | null) =>
    request<T>(path, 'DELETE', { token }),
};
