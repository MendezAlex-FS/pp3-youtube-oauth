const express = require("express");
const router = express.Router();
const youTubeCtrl = require("../controllers/youTubeController");
const { requireAuth } = require("../utils/auth");

router.get("/recent", requireAuth, youTubeCtrl.recent);
router.get("/search", requireAuth, youTubeCtrl.search);

module.exports = router;
