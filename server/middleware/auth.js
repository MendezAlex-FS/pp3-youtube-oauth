const db = require("../models");
const { verify } = require("../utils/jwt");
const { refreshAccessToken } = require("../services/oauthService");

/**
 *
 * Express middleware that protects routes by requiring a valid JWT.
 * 
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @param {*} next Express next middleware function
 * @returns {*} Sends 401/500 response on failure or calls next() on success
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [type, token] = authHeader.split(" ");

    if (type?.toLowerCase() !== "bearer" || !token) {
      return res.status(401).json({ error: "Not Authorized" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res
        .status(500)
        .json({ error: "Server misconfiguration" });
    }

    const payload = verify(token, jwtSecret);
    const uid = Number(payload?.uid);
    if (!Number.isInteger(uid)) {
      return res.status(401).json({ error: "Not Authorized" });
    }

    if (!db?.User) {
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const user = await db.User.findByPk(uid);
    if (!user) return res.status(401).json({ error: "Not Authorized" });

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Not Authorized" });
  }
}

async function requireYouTubeAuth(req, res, next) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Not Authorized" });

    if (!user.accessToken) {
      return res.status(401).json({ error: "Re-auth required" });
    }

    const nowMs = Date.now();
    const expiryMs = user.tokenExpiry ? new Date(user.tokenExpiry).getTime() : 0;

    if (!expiryMs) return next();

    const SKEW_MS = 60 * 1000; // 60 seconds

    if (nowMs < (expiryMs - SKEW_MS)) return next();

    if (!user.refreshToken) {
      return res.status(401).json({ error: "Re-auth required" });
    }

    // Refresh logic
    const refreshed = await refreshAccessToken(user.refreshToken);

    if (!refreshed || refreshed.error || !refreshed.access_token || !refreshed.expires_in) {
      return res.status(401).json({ error: "Re-auth required" });
    }

    const newAccessToken = refreshed.access_token;
    const newExpiry = new Date(Date.now() + Number(refreshed.expires_in) * 1000);

    user.accessToken = newAccessToken;
    user.tokenExpiry = newExpiry;

    if (refreshed.refresh_token) user.refreshToken = refreshed.refresh_token;

    await user.save();

    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Re-auth required" });
  }
}

module.exports = { requireAuth, requireYouTubeAuth };
