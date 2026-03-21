const express = require("express");
const router = express.Router();
const { analyzeCode } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

router.post("/analyze", protect, analyzeCode);

module.exports = router;
