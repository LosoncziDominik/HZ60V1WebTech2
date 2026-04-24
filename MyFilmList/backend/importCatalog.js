require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { connectDB } = require("./db");
const CatalogMovie = require("./models/CatalogMovie");

async function run() {
  try {
    await connectDB();

    const filePath = path.join(__dirname, "movies.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const movies = JSON.parse(raw);

    await CatalogMovie.deleteMany({});
    await CatalogMovie.insertMany(movies);

    console.log(`Catalog import complete: ${movies.length} movies`);
    process.exit(0);
  } catch (err) {
    console.error("Import error:", err);
    process.exit(1);
  }
}

run();