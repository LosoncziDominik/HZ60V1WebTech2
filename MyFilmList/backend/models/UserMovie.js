const mongoose = require("mongoose");

const userMovieSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    catalogMovieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CatalogMovie",
      required: true
    },

    watched: { type: Boolean, default: false },
    onPlanList: { type: Boolean, default: true },
    yourScore: { type: Number, min: 1, max: 10, default: null },
    watchDate: { type: Date, default: null }
  },
  { timestamps: true }
);

userMovieSchema.index({ ownerId: 1, catalogMovieId: 1 }, { unique: true });

module.exports = mongoose.model("UserMovie", userMovieSchema);