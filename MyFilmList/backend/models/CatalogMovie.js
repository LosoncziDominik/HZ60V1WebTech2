const mongoose = require("mongoose");

const catalogMovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    director: { type: String, trim: true },
    year: { type: Number, min: 1888 },
    imdbScore: { type: Number, min: 0, max: 10 },
    length: { type: Number },
    actors: [{ type: String, trim: true }],
    synopsis: { type: String, default: "" },
    genres: [{ type: String, trim: true }],
    posterUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

catalogMovieSchema.index({ title: 1, year: -1 });

module.exports = mongoose.models.CatalogMovie || mongoose.model("CatalogMovie", catalogMovieSchema);