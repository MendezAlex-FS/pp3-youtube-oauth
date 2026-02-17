const { User } = require("../models");
const { verify } = require("../utils/jwt");
const { requestYouTubeData } = require("../services/youTubeService");

/**
 *
 * Extracts and verifies the JWT from the Authorization header.
 *
 * @param {*} req Express request object
 * @returns {*} Decoded JWT payload if valid; otherwise null
 */
const getUser = (req) => {
  const auth = req.headers.authorization;
  if (!auth) return null;

  const token = auth.split(" ")[1];
  const payload = verify(token, process.env.JWT_SECRET);
  return payload;
};

/**
 *
 * GET /recent
 *
 * Retrieves the authenticated user's uploaded videos (recent uploads).
 *
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @returns {*} JSON response containing playlist items or error
 */
const recent = async (req, res) => {
  try {
    const payload = getUser(req);
    if (!payload) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findByPk(payload.uid);
    if (!user) return res.status(401).json({ error: "User not found" });
    if (!user.accessToken) return res.status(401).json({ error: "No access token" });

    const ch = await requestYouTubeData("channels", user.accessToken, {
      part: "contentDetails",
      mine: "true"
    });

    const uploadsId = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsId)
      return res.status(500).json({ error: "Could not find uploads playlist" });

    const pl = await requestYouTubeData("playlistItems", user.accessToken, {
      part: "snippet",
      playlistId: uploadsId,
      maxResults: 10
    });

    res.json(pl);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};

/**
 *
 * GET /search?q=...
 *
 * Searches the authenticated user's YouTube videos.
 *
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @returns {*} JSON response containing search results or error
 */
const search = async (req, res) => {
  try {
    const payload = getUser(req);
    if (!payload) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findByPk(payload.uid);
    if (!user) return res.status(401).json({ error: "User not found" });
    if (!user.accessToken) return res.status(401).json({ error: "No access token" });

    const q = (req.query.q || "").trim();
    if (!q) return res.status(400).json({ error: "Missing query param: q" });

    const data = await requestYouTubeData("search", user.accessToken, {
      part: "snippet",
      q,
      type: "video",
      forMine: "true",
      maxResults: 10
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};

module.exports = { recent, search };
