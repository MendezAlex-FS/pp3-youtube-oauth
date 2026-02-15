const db = require("../models");
const { verify } = require("./jwt");

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
    const uid = Number(payload.uid);
    if (!Number.isInteger(uid)) {
      return res.status(401).json({ error: "Not Authorized" });
    }

    if (!db?.User) {
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const user = await db.User.findByPk(payload.uid);
    if (!user) return res.status(401).json({ error: "Not Authorized" });

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Not Authorized" });
  }
}

module.exports = { requireAuth };
