// DECISION: Loading dotenv before anything else so MONGO_URI and PORT are
// available immediately. This is the standard pattern for Node/Express apps.
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const waitlistRoutes = require("./routes/waitlist");

const app = express();

// ---------- Middleware ----------

// DECISION: Using cors() with no options allows all origins in development.
// For production, you'd pass { origin: "https://yourdomain.com" } — but for
// a waitlist landing page, open CORS is acceptable and simpler to demo.
app.use(cors());
app.use(express.json());

// ---------- Routes ----------

app.use("/api/waitlist", waitlistRoutes);

// Root route — friendly API status and available endpoints
app.get("/", (req, res) => {
  res.json({
    name: "Standup Async Waitlist API",
    status: "online",
    endpoints: {
      health: "/api/health",
      waitlist_count: "/api/waitlist/count",
      join_waitlist: "POST /api/waitlist"
    }
  });
});

// Health check — useful for Render deploy verification
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---------- Start ----------

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not set in .env — server cannot start.");
  process.exit(1);
}

// DECISION: Connecting to MongoDB before starting the server. If the DB is
// unreachable, the process exits immediately instead of accepting requests
// it can't fulfill. This is clearer than lazy-connecting on first request.
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
