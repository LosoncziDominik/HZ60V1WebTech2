const { connectDB } = require("./db");
const User = require("./models/user");
const Movie = require("./models/movie");

(async () => {
  await connectDB();

  await User.init();
  await Movie.init();

  console.log("Collections & indexes are ready.");
  process.exit(0);
})();