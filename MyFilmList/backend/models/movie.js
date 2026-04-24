const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true},

        title: { type: String, required: true, trim: true },
        imdbScore: { type: Number, min: 1, max: 10 },
        yourScore: { type: Number, min: 1, max: 10, default: null },
        director: { type: String, required: true, trim: true},
        actors: [{ type: String, trim: true, maxLength: 100 }],
        length: { type: Number, required: true, min: 1 },
        year: { type: Number, required: true, min: 1888 },
        watched: { type: Boolean, default: false },
        onPlanList: { type: Boolean, default: false },
        synopsis: { type: String, default: "" },
        watchDate: { type: Date },
        genres: [{ type: String, trim: true}],
        posterUrl: { type: String, default: "" }
 },
 { timestamps: true}
);

movieSchema.index({ ownerId: 1, title: 1,});
movieSchema.index({ ownerId: 1, release: -1});
movieSchema.index({ ownerId: 1, watched: 1 });

module.exports = mongoose.model("Movie", movieSchema);