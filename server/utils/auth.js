const db = require("../models");
const { verify } = require("./jwt");

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

module.exports = { requireAuth };
