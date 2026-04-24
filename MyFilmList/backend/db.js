require("dotenv").config();
const mongoose = require("mongoose");

function mongoUri() {
  const u = encodeURIComponent(process.env.MONGO_USER);
  const p = encodeURIComponent(process.env.MONGO_PASS);
  const hosts = process.env.MONGO_HOSTS;
  const db = process.env.MONGO_DB || "filmdb";
  return `mongodb://${u}:${p}@${hosts}/${db}?tls=true&retryWrites=true&w=majority&authSource=admin`;
}

async function connectDB() {
  await mongoose.connect(mongoUri(), { serverSelectionTimeoutMS: 20000 });
  console.log("MongoDB connected!");
}

module.exports = { connectDB };
