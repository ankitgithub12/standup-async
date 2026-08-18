const mongoose = require("mongoose");

// DECISION: Using Mongoose over raw MongoDB driver — it gives us schema
// validation, unique index, and lowercase/trim transforms with zero custom code.

const waitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Waitlist", waitlistSchema);
