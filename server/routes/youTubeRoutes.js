const express = require("express");
const router = express.Router();
const youTubeCtrl = require("../controllers/youTubeController");
const { requireAuth, requireYouTubeAuth } = require("../middleware/auth");

/**
 *
 * GET /recent
 * 
 * Protected route that returns the authenticated user's
 * recently viewed or related YouTube data using the 
 * requireAuth middleware for the JWT.
 *
 */
router.get("/recent", requireAuth, requireYouTubeAuth, youTubeCtrl.recent);

/**
 *
 * GET /search
 * 
 * Protected route that performs a YouTube search query
 * on behalf of the authenticated user using the 
 * requireAuth middleware for the JWT.
 *
 */
router.get("/search", requireAuth, requireYouTubeAuth, youTubeCtrl.search);

module.exports = router;
