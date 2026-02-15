const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const { requireAuth } = require("../utils/auth");

router.get("/google/login", auth.login);
router.get("/google/callback", auth.callback);
router.get("/me", requireAuth, auth.me);

module.exports = router;
