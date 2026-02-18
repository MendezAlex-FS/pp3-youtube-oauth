const crypto = require("crypto");
const pkceStore = new Map();

/**
 *
 * Encodes a Buffer into a Base64URL-safe string.
 * Replaces "+" with "-", "/" with "_", and removes "=" padding.
 *
 * @param {*} buffer Buffer to encode
 * @returns {string} Base64URL-encoded string
 */
function base64url(buffer) {
  return buffer.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 *
 * Generates PKCE (Proof Key for Code Exchange) values for OAuth 2.0.
 * 
 * @param {*} none
 * @returns {{ state: string, challenge: string }} PKCE state and code challenge
 */
function generatePKCE() {
  const state = base64url(crypto.randomBytes(32));
  const verifier = base64url(crypto.randomBytes(64));
  const challenge = base64url(
    crypto.createHash("sha256").update(verifier).digest()
  );

  pkceStore.set(state, verifier);
  return { state, challenge };
}

/**
 *
 * Retrieves and deletes the stored PKCE verifier associated with a state value.
 * Ensures the verifier is single-use.
 *
 * @param {*} state OAuth state value received in callback
 * @returns {*} The original code_verifier string or undefined if not found
 */
function getVerifier(state) {
  const v = pkceStore.get(state);
  pkceStore.delete(state);
  return v;
}

/**
 *
 * Exchanges an OAuth authorization code for access and refresh tokens
 * using Google's OAuth 2.0 token endpoint.
 *
 * @param {*} code Authorization code received from Google OAuth callback
 * @param {*} verifier Original PKCE code_verifier used during login
 * @returns {*} Parsed JSON response containing tokens or error details
 */
async function exchangeCode(code, verifier) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
      code,
      code_verifier: verifier
    })
  });

  return res.json();
}

async function refreshAccessToken(refreshToken) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  });

  return res.json();
}


module.exports = { generatePKCE, getVerifier, exchangeCode, refreshAccessToken };
