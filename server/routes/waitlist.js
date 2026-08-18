const express = require("express");
const Waitlist = require("../models/Waitlist");

const router = express.Router();

// Comprehensive email validation with typo detection
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const INVALID_TLD_TYPOS = [".cm", ".con", ".cmo", ".coom", ".comm", ".ocm"];

const COMMON_DOMAIN_TYPOS = {
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "yaho.com": "yahoo.com",
  "outlok.com": "outlook.com",
  "hotmial.com": "hotmail.com",
};

function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "A valid email is required" };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > 254 || trimmed.length < 5) {
    return { valid: false, error: "Email must be between 5 and 254 characters" };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  const [localPart, domain] = trimmed.split("@");
  if (!localPart || !domain) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  if (
    localPart.includes("..") ||
    localPart.startsWith(".") ||
    localPart.endsWith(".")
  ) {
    return { valid: false, error: "Invalid email format" };
  }

  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];

  if (!/^[a-zA-Z]{2,24}$/.test(tld)) {
    return { valid: false, error: "Invalid domain extension" };
  }

  const lastDotExt = "." + tld;
  if (INVALID_TLD_TYPOS.includes(lastDotExt)) {
    return {
      valid: false,
      error: `Did you mean .com? Please check "${lastDotExt}" in your email`,
    };
  }

  if (COMMON_DOMAIN_TYPOS[domain]) {
    return {
      valid: false,
      error: `Did you mean @${COMMON_DOMAIN_TYPOS[domain]}?`,
    };
  }

  return { valid: true, email: trimmed };
}

// POST /api/waitlist — add an email to the waitlist
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    const validation = validateEmail(email);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Attempt to create the entry with sanitized email
    await Waitlist.create({ email: validation.email });
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
