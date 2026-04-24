const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId,
    expiresIn: "1h",
  });
}

router.post("/register", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });

    const token = signToken(String(user._id));
    return res.status(201).json({
      token,
      user: { id: String(user._id), email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    // Ne áruljuk el, hogy email létezik-e
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(String(user._id));
    return res.json({
      token,
      user: { id: String(user._id), email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
});

// GET /api/auth/me  (védett)
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("_id email").lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ id: String(user._id), email: user.email });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
});

module.exports = router;