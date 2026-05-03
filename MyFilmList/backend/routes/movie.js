const express = require("express");
const mongoose = require("mongoose");
const Movie = require("../models/movie");
const { requireAuth } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/**
 * GET /api/movies
 * Query:
 *  - q: cím keresés (title)
 *  - watched: true/false
 *  - onPlanList: true/false
 *  - genre: műfaj (pl "Drama")
 *  - releaseFrom, releaseTo: év tartomány
 *  - sort: "newest" | "oldest" | "releaseDesc" | "releaseAsc" | "titleAsc" | "titleDesc"
 *  - page, limit
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const ownerId = req.userId;

    const q = String(req.query.q || "").trim();
    const watched = req.query.watched;
    const onPlanList = req.query.onPlanList;
    const genre = String(req.query.genre || "").trim();
    const yearFrom = req.query.yearFrom;
    const yearTo = req.query.yearTo;

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = { ownerId };

    if (q) {
      // egyszerű keresés title mezőben
      filter.title = { $regex: q, $options: "i" };
    }

    if (watched === "true") filter.watched = true;
    if (watched === "false") filter.watched = false;

    if (onPlanList === "true") filter.onPlanList = true;
    if (onPlanList === "false") filter.onPlanList = false;

    if (genre) {
      filter.genres = { $in: [genre] };
    }

    if (yearFrom || yearTo) {
      filter.year = {};
      if (yearFrom) filter.year.$gte = parseInt(yearFrom, 10);
      if (yearTo) filter.year.$lte = parseInt(yearTo, 10);
    }
    // rendezés
    const sortKey = String(req.query.sort || "newest");
    let sort = { createdAt: -1 };
    if (sortKey === "oldest") sort = { createdAt: 1 };
    if (sortKey === "yearDesc") sort = { year: -1 };
    if (sortKey === "yearAsc") sort = { year: 1 };
    if (sortKey === "titleAsc") sort = { title: 1 };
    if (sortKey === "titleDesc") sort = { title: -1 };

    const [items, total] = await Promise.all([
      Movie.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Movie.countDocuments(filter),
    ]);

    return res.json({
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
});

/**
 * GET /api/movies/:id
 * Csak owner láthatja
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const ownerId = req.userId;
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const movie = await Movie.findOne({ _id: id, ownerId }).lean();
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    return res.json(movie);
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
});

/**
 * POST /api/movies
 * Body: title (required), director (required), length (required), release (required)
 * + optional: imdbScore, yourScore, actors[], watched, onPlanList, synopsis, watchDate, genre[]
 */
router.post("/", requireAuth,  upload.single("poster"), async (req, res) => {
  try {
    const ownerId = req.userId;

    const title = String(req.body.title || "").trim();
    const director = String(req.body.director || "").trim();
    const length = Number(req.body.length);
    const year = Number(req.body.year);   
    const isWatched = req.body.watched === 'true';


    if (!title) return res.status(400).json({ error: "title is required" });
    if (!director) return res.status(400).json({ error: "director is required" });
    if (!Number.isFinite(length) || length < 1) return res.status(400).json({ error: "length must be >= 1" });
    if (!Number.isFinite(year) || year < 1888) {return res.status(400).json({ error: "year must be a valid year" });
    }

    // security: ownerId-t nem fogadunk el kliensből
    const doc = {
      ownerId,
      title,
      director,
      length,
      year,

      imdbScore: req.body.imdbScore,
      yourScore: req.body.yourScore ? Number(req.body.yourScore) : undefined,
      actors: Array.isArray(req.body.actors) ? req.body.actors : [],
      watched: isWatched,
      onPlanList: !isWatched,
      synopsis: req.body.synopsis ?? undefined,
      watchDate: req.body.watchDate ?? undefined,
      genres: Array.isArray(req.body.genres) ? req.body.genres : [],
      posterUrl: req.file ? `/uploads/${req.file.filename}` : ""
    };

    // ha watched false, ne maradjon bent random watchDate
    if (!doc.watched) doc.watchDate = undefined;

    const movie = await Movie.create(doc);
    return res.status(201).json(movie);
  } catch (err) {
      console.error("POST /api/movies ERROR:", err);

      if (err?.name === "ValidationError") {
        return res.status(400).json({ error: "ValidationError", details: err.message });
      }

      return res.status(500).json({
        error: "Server error",
        details: err?.message
      });
    }
});

/**
 * PUT /api/movies/:id
 * Csak owner módosíthatja
 */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const ownerId = req.userId;
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    // csak a megengedett mezőket engedjük
    const updates = {};
    const allowed = [
      "title",
      "imdbScore",
      "yourScore",
      "director",
      "actors",
      "length",
      "year",
      "watched",
      "onPlanList",
      "synopsis",
      "watchDate",
      "genres",
    ];

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    // ha watched false-ra állítják, töröljük watchDate-et
    if (updates.watched === false) {
      updates.watchDate = undefined;
    }

    const movie = await Movie.findOneAndUpdate(
      { _id: id, ownerId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!movie) return res.status(404).json({ error: "Movie not found" });
    return res.json(movie);
  } catch (err) {
    if (err?.name === "ValidationError") {
      return res.status(400).json({ error: "ValidationError", details: err.message });
    }
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
});

/**
 * DELETE /api/movies/:id
 * Csak owner törölheti
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const ownerId = req.userId;
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const deleted = await Movie.findOneAndDelete({ _id: id, ownerId }).lean();
    if (!deleted) return res.status(404).json({ error: "Movie not found" });

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err?.message });
  }
});

module.exports = router;