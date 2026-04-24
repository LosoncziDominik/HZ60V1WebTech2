require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");

const authRoutes = require("./routes/auth");

const moviesRoutes = require("./routes/movie");

const app = express();

const catalogRoutes = require("./routes/catalogMovies.routes");
const userMovieRoutes = require("./routes/userMovie");

const path = require("path");

app.use(cors({ origin: "http://localhost:4200" })); // Angular dev
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);

app.use("/api/movies", moviesRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/catalog-movies", catalogRoutes);
app.use("/api/user-movies", userMovieRoutes);

connectDB()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API running on http://localhost:${port}`));
  })
  .catch((e) => {
    console.error("DB connect failed:", e);
    process.exit(1);
  });