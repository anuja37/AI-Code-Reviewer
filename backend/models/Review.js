const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  line: { type: Number },
  type: { type: String, enum: ["bug", "warning", "suggestion", "info"] },
  message: { type: String },
  fix: { type: String },
});

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled Review" },
    code: { type: String, required: true },
    language: { type: String, required: true, default: "javascript" },
    summary: { type: String },
    score: { type: Number, min: 0, max: 100 },
    issues: [issueSchema],
    complexity: {
      time: { type: String },
      space: { type: String },
      explanation: { type: String },
    },
    improvements: [{ type: String }],
    goodPractices: [{ type: String }],
    rawAIResponse: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
