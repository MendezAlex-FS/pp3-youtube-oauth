const db = require("../models");
const { generatePKCE, getVerifier, exchangeCode } = require("../services/oauthService");
const { sign } = require("../utils/jwt");

/**
 *
 * GET /auth/google/login
 *
 * Starts the Google OAuth 2.0 authorization flow using PKCE.
 * Generates a state + code_challenge, then redirects the browser to Google.
 *
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @returns {*} Redirects the user agent to Google's OAuth consent screen
 */
const login = (req, res) => {
  const { state, challenge } = generatePKCE();

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    // This line is what allows this application to work even if no scopes are defined
    // in that console. In production, the scopes need to be defined. Especially for
    // sensitive/restricted scopes.
    scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
    access_type: "offline",
    prompt: "consent",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256"
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

/**
 *
 * GET /auth/google/callback
 *
 * Handles the OAuth callback from Google.
 *
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @returns {*} Redirects to the client on success or sends an error response on failure
 */
const callback = async (req, res) => {
  try {
    const { code, state } = req.query;

    const verifier = getVerifier(state);
    if (!verifier) return res.status(400).send("Invalid state");

    const tokens = await exchangeCode(code, verifier);

    if (!tokens?.access_token || !tokens?.expires_in || !tokens?.id_token) {
      console.error("Token response missing fields:", tokens);
      return res
        .status(500)
        .send("OAuth token exchange did not return expected tokens.");
    }

    const userInfo = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`
    ).then((r) => r.json());

    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;
    const tokenExpiry = new Date(Date.now() + tokens.expires_in * 1000);

    const [user] = await db.User.findOrCreate({
      where: { userId: userInfo.sub },
      defaults: {
        userId: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        accessToken,
        ...(refreshToken ? { refreshToken } : {}),
        tokenExpiry
      }
    });

    // Always update the current access token + expiry
    user.accessToken = accessToken;
    user.tokenExpiry = tokenExpiry;

    // We don't always get the refresh token
    if (refreshToken) user.refreshToken = refreshToken;

    await user.save();

    const appToken = sign({ uid: user.id }, process.env.JWT_SECRET);
    res.redirect(`${process.env.CLIENT_ORIGIN}/?session=${appToken}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Auth callback failed.");
  }
};

/**
 *
 * GET /auth/me
 *
 * Returns the authenticated user's profile information.
 * Assumes `requireAuth` middleware has attached the user model to `req.user`.
 *
 * @param {*} req Express request object (expects `req.user`)
 * @param {*} res Express response object
 * @returns {*} JSON containing basic user profile fields
 */
const me = (req, res) => {
  const u = req.user;
  return res.json({
    user: {
      id: u.id,
      email: u.email,
      name: u.name,
      picture: u.picture
    }
  });
};

module.exports = { login, callback, me };
