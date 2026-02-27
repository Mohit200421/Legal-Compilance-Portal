const express = require("express");
const router = express.Router();

const City = require("../models/City");
const State = require("../models/State");
const Category = require("../models/Category");

/* ================= PUBLIC MASTER DATA ================= */

// ✅ Cities
router.get("/cities", async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load cities" });
  }
});

// ✅ States
router.get("/states", async (req, res) => {
  try {
    const states = await State.find().sort({ name: 1 });
    res.json(states);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load states" });
  }
});

// ✅ Categories (Practice Areas)
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load categories" });
  }
});

module.exports = router;
