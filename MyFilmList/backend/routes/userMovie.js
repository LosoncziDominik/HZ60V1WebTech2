const express = require("express");
const UserMovie = require("../models/UserMovie");
const CatalogMovie = require("../models/CatalogMovie");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/user-movies
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const ownerId = req.userId;

    const items = await UserMovie.find({ ownerId })
      .populate("catalogMovieId")
      .sort({ createdAt: -1 })
      .lean();

    res.json(items);
  } catch (err) {
    console.error("Get user movies error:", err);
    res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
});

/**
 * POST /api/user-movies
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const ownerId = req.userId;
    const { catalogMovieId } = req.body;

    const movie = await CatalogMovie.findById(catalogMovieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const existing = await UserMovie.findOne({ ownerId, catalogMovieId });
    if (existing) {
      return res.status(409).json({ error: "Already added" });
    }

    const userMovie = await UserMovie.create({
      ownerId,
      catalogMovieId,
      watched: false,
      onPlanList: true
    });

    res.status(201).json(userMovie);
  } catch (err) {
    console.error("Add user movie error:", err);
    res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
});

/**
 * PUT /api/user-movies/:id
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const ownerId = req.userId;
    const id = req.params.id;

    const updates = {};
    const allowed = ["watched", "onPlanList", "yourScore", "watchDate"];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const movie = await UserMovie.findOneAndUpdate(
      { _id: id, ownerId },
      { $set: updates },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(movie);
  } catch (err) {
    console.error("Update user movie error:", err);
    res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Movie.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.userId },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

/**
 * DELETE /api/user-movies/:id
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const ownerId = req.userId;
    const id = req.params.id;

    const deleted = await UserMovie.findOneAndDelete({ _id: id, ownerId });

    if (!deleted) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Delete user movie error:", err);
    res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
});

module.exports = router;