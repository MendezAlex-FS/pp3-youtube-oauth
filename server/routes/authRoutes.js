const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const { requireAuth } = require("../utils/auth");

/**
 *
 * GET /google/login
 *
 * Initiates the Google OAuth 2.0 login flow.
 * Redirects the user to Google's authorization endpoint
 * with the required scopes and PKCE parameters.
 *
 */
router.get("/google/login", auth.login);

/**
 *
 * GET /google/callback
 *
 * Handles the OAuth callback from Google.
 * Exchanges the authorization code for tokens,
 * creates or updates the user, and issues a JWT session.
 *
 */
router.get("/google/callback", auth.callback);

/**
 *
 * GET /me
 *
 * Protected route that returns the currently authenticated user
 * using the requireAuth middleware for the JWT.
 *
 */
router.get("/me", requireAuth, auth.me);

module.exports = router;
