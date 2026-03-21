const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

// ── Temporary debug — remove after fixing the 500 error ──
console.log("GEMINI_API_KEY loaded:", !!process.env.GEMINI_API_KEY);
console.log("MONGO_URI loaded:     ", !!process.env.MONGO_URI);
console.log("CLIENT_URL:           ", process.env.CLIENT_URL);

const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/review");
const historyRoutes = require("./routes/history");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use("/api/", limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => res.json({ message: "AI Code Reviewer API running" }));

// Connect DB & Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));