const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api/v1";
const SESSION_KEY = "pp3_jwt";

export const getSessionToken = () => localStorage.getItem(SESSION_KEY);
export const setSessionToken = (token) => localStorage.setItem(SESSION_KEY, token);
export const clearSessionToken = () => localStorage.removeItem(SESSION_KEY);

const authHeaders = () => {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiGet = async (path) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...authHeaders() }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data;
};

export const loginUrl = () => `${API_BASE}/auth/google/login`;
