const express = require("express");
const callController = require("../controllers/callController");

const router = express.Router();

// router.use(authMiddleware);

// Get call history
router.get("/history", callController.getCallHistory);

module.exports = router;
