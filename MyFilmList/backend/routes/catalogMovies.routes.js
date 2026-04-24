const express = require("express");
const router = express.Router();
const CatalogMovie = require("../models/CatalogMovie");

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

module.exports = router;