const crypto = require("crypto");
const pkceStore = new Map();

function base64url(buffer) {
  return buffer.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generatePKCE() {
  const state = base64url(crypto.randomBytes(32));
  const verifier = base64url(crypto.randomBytes(64));
  const challenge = base64url(
    crypto.createHash("sha256").update(verifier).digest()
  );

  pkceStore.set(state, verifier);
  return { state, challenge };
}

function getVerifier(state) {
  const v = pkceStore.get(state);
  pkceStore.delete(state);
  return v;
}

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

module.exports = { generatePKCE, getVerifier, exchangeCode };
