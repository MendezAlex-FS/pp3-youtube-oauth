const crypto = require("crypto");

function base64urlEncode(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(str) {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64");
}

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
