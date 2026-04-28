const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Security Middleware ────────────────────────────────────────
app.use(helmet()); // HTTP security headers

// CORS — restrict to allowed origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(cors());

// ─── Body Parsing ───────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ─── Logging ────────────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// ─── Rate Limiting ──────────────────────────────────────────────
app.use("/api", apiLimiter);

// ─── Routes ─────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/experience", require("./routes/experienceRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Default route
app.get("/", (req, res) => {
  res.send("Campus Connect Backend is running");
});

// ─── Centralized Error Handler (must be last) ───────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`
  );
});
