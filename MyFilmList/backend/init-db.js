const { connectDB } = require("./db");
const User = require("./models/user");
const Movie = require("./models/movie");

(async () => {
  await connectDB();

  // csak azért, hogy biztosan létrejöjjenek a collectionök + indexek
  await User.init();  // indexek létrehozása
  await Movie.init();

  console.log("Collections & indexes are ready.");
  process.exit(0);
})();