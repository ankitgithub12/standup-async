const express = require("express");
const Waitlist = require("../models/Waitlist");

const router = express.Router();

// DECISION: Using a simple regex for email validation instead of a library like
// validator.js — one fewer dependency, and this regex covers real-world formats
// without being overly strict. Easy to explain in an interview.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/waitlist — add an email to the waitlist
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate: email must exist and match format
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "A valid email is required" });
    }

    // Attempt to create the entry
    await Waitlist.create({ email });
    return res.status(201).json({ message: "You're on the list" });
  } catch (err) {
    // DECISION: Catching Mongoose duplicate key error (code 11000) separately
    // so we can return a friendly 200 instead of a 409 or 500. The user doesn't
    // need to know it's a "conflict" — just that they're already signed up.
    if (err.code === 11000) {
      return res.status(200).json({ message: "You've already joined" });
    }

    console.error("Waitlist POST error:", err.message);
    return res.status(500).json({ error: "Something went wrong — try again" });
  }
});

// GET /api/waitlist/count — return total signup count
router.get("/count", async (req, res) => {
  try {
    // DECISION: Using countDocuments() over estimatedDocumentCount() — it's
    // slightly slower but accurate. At waitlist scale (<10k docs) the
    // performance difference is irrelevant.
    const count = await Waitlist.countDocuments();
    return res.json({ count });
  } catch (err) {
    console.error("Waitlist count error:", err.message);
    return res.status(500).json({ error: "Could not fetch count" });
  }
});

module.exports = router;
