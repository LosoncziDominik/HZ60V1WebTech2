const express = require("express");
const router = express.Router();

const CatalogMovie = require("../models/CatalogMovie");
const Movie = require("../models/Movie");
const { requireAuth } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const q = req.query.q || "";

    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { director: { $regex: q, $options: "i" } },
            { genres: { $regex: q, $options: "i" } },
            { actors: { $regex: q, $options: "i" } }
          ]
        }
      : {};

    const movies = await CatalogMovie.find(filter).sort({ title: 1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: "Catalog lekérés hiba", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await CatalogMovie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Could not load movie" });
  }
});


router.post("/:id/add", requireAuth, async (req, res) => {
  try {
    const catalogMovie = await CatalogMovie.findById(req.params.id);

    if (!catalogMovie) {
      return res.status(404).json({ error: "Catalog movie not found" });
    }

    const existing = await Movie.findOne({
      ownerId: req.userId,
      title: catalogMovie.title
    });

    if (existing) {
      return res.status(400).json({ error: "Movie already in your list" });
    }

    const movie = await Movie.create({
      ownerId: req.userId,
      title: catalogMovie.title,
      director: catalogMovie.director,
      length: catalogMovie.length || 120,
      year: catalogMovie.year,
      imdbScore: catalogMovie.imdbScore,
      actors: catalogMovie.actors,
      genres: catalogMovie.genres,
      synopsis: catalogMovie.synopsis,
      posterUrl: catalogMovie.posterUrl,
      watched: false,
      onPlanList: true
    });

    res.status(201).json(movie);
  } catch (err) {
      console.error("Catalog add error:", err);
      res.status(500).json({ error: "Could not add movie", details: err.message });
    }
});

module.exports = router;