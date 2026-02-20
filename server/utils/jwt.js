const crypto = require("crypto");

/**
 *
 * Converts a Buffer (or buffer-like input) into a Base64URL-encoded string.
 * Base64URL is standard Base64 with URL-safe characters and no "=" padding.
 *
 * @param {*} buf Buffer or buffer-like data to encode
 * @returns {string} Base64URL-encoded string (no padding)
 */
function base64urlEncode(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 *
 * Decodes a Base64URL-encoded string into a Buffer.
 * Automatically restores "=" padding and converts URL-safe chars back to Base64.
 *
 * @param {*} str Base64URL string to decode
 * @returns {Buffer} Decoded bytes as a Buffer
 */
function base64urlDecode(str) {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64");
}

/**
 *
 * Signs a payload into a JWT string using HS256 (HMAC-SHA256).
 * Automatically adds `iat` (issued-at) and `exp` (expiration) claims.
 *
 * @param {*} payload Plain object payload to include in the JWT
 * @param {*} secret Secret used to HMAC-sign the token (JWT_SECRET)
 * @param {*} options Optional signing options
 * @param {*} options.expiresInSeconds Token lifetime in seconds (default: 7 days)
 * @returns {string} Signed JWT string in the format "header.payload.signature"
 * @throws {Error} If `secret` is missing
 */
function sign(payload, secret, { expiresInSeconds = 60 * 60 * 24 * 7 } = {}) {
  if (!secret) throw new Error("JWT_SECRET is missing");

  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

  const h = base64urlEncode(JSON.stringify(header));
  const p = base64urlEncode(JSON.stringify(fullPayload));
  const data = `${h}.${p}`;

  const sig = base64urlEncode(
    crypto.createHmac("sha256", String(secret)).update(data).digest()
  );

  return `${data}.${sig}`;
}

/**
 *
 * Verifies a JWT string signed with HS256 (HMAC-SHA256).
 * Checks token format, validates signature using timing-safe comparison,
 * and rejects expired tokens (based on `exp` claim).
 *
 * @param {*} token JWT string to verify
 * @param {*} secret Secret used to verify the HMAC signature (JWT_SECRET)
 * @returns {*} Decoded payload object if valid; otherwise null
 */
function verify(token, secret) {
  try {
    if (!token || !secret) return null;

    const parts = String(token).split(".");
    if (parts.length !== 3) return null;

    const [h, p, s] = parts;
    const data = `${h}.${p}`;

    const expected = base64urlEncode(
      crypto.createHmac("sha256", String(secret)).update(data).digest()
    );

    const a = Buffer.from(expected);
    const b = Buffer.from(s);
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;

    const payload = JSON.parse(base64urlDecode(p).toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && now > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

module.exports = { sign, verify };
