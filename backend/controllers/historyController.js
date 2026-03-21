const Review = require("../models/Review");

// @desc Get all reviews for logged-in user
const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments({ user: req.user._id });
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-code -rawAIResponse");

    res.json({
      reviews,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single review by ID
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHistory, getReviewById, deleteReview };
