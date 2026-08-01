const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
};

const TOKEN_KEY = "chf_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Login failed");
  }

  const data = await res.json();
  setToken(data.token);
  return data.user as AdminUser;
}

export async function fetchMe(): Promise<AdminUser | null> {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    clearToken();
    return null;
  }

  return res.json();
}

export async function logout() {
  const token = getToken();
  if (token) {
    await fetch(`${API_URL}/admin/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null);
  }
  clearToken();
}

/**
 * Generic authenticated request helper for every CMS module (FAQs, blogs,
 * projects, etc). Attaches the bearer token automatically and throws a
 * readable error on failure so callers can show it in the UI.
 */
export async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}/admin${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
