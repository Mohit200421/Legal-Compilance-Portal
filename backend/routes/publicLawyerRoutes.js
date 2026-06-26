const express = require("express");
const router = express.Router();

const { getLawyerProfile } = require("../controllers/lawyerController");

//  Public lawyer profile
router.get("/lawyers/:id", getLawyerProfile);

module.exports = router;
