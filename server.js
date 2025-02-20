require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5001;

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}

connectDB();

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("\n⚠️ Server shutting down...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed.");
  process.exit(0);
});
