const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api/v1";
const SESSION_KEY = "pp3_jwt";

/**
 *
 * Reads the saved JWT session token from localStorage.
 *
 * @param {*} none
 * @returns {*} The stored JWT string if present; otherwise null
 */
export const getSessionToken = () => localStorage.getItem(SESSION_KEY);

/**
 *
 * Saves the JWT session token to localStorage.
 *
 * @param {*} token JWT session token to store
 * @returns {*} none
 */
export const setSessionToken = (token) => localStorage.setItem(SESSION_KEY, token);

/**
 *
 * Removes the JWT session token from localStorage.
 *
 * @param {*} none
 * @returns {*} none
 */
export const clearSessionToken = () => localStorage.removeItem(SESSION_KEY);

/**
 *
 * Builds the Authorization header object for API requests.
 * If a session token exists, adds: Authorization: "Bearer <token>"
 *
 * @param {*} none
 * @returns {Object} Headers object (may be empty)
 */
const authHeaders = () => {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 *
 * Performs a GET request to the backend API using the configured API base URL.
 * Automatically includes Authorization headers when a session token exists.
 *
 * @param {*} path API path starting with "/" (example: "/auth/me")
 * @returns {*} Parsed JSON response body
 * @throws {Error} If the response is not OK (non-2xx)
 */
export const apiGet = async (path) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...authHeaders() }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`);
  return data;
};

/**
 *
 * Returns the full backend URL used to start Google OAuth login.
 * This is typically used as the href for a "Sign in with Google" button/link.
 *
 * @param {*} none
 * @returns {string} Login URL (example: "http://localhost:3001/api/v1/auth/google/login")
 */
export const loginUrl = () => `${API_BASE}/auth/google/login`;
