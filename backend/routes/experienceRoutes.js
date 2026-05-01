const express = require("express");
const router = express.Router();
const {
  createExperience,
  getApprovedExperiences,
  getExperienceById,
  incrementViews,
  getMyPosts,
} = require("../controllers/experienceController");
const {
  getComments,
  addComment,
  addReply
} = require("../controllers/commentController");
const { experienceRules, handleValidationErrors } = require("../middleware/validate");
const QUESTIONS = require("../config/questions");
const { protect } = require("../middleware/authMiddleware");

// Get predefined questions (public)
router.get("/questions/list", (req, res) => {
  res.json(QUESTIONS);
});

// Student routes — specific paths BEFORE parameterized routes
router.get("/me", protect, getMyPosts);                    // my posts (any status)
router.post("/", protect, experienceRules, handleValidationErrors, createExperience); // submit new
router.get("/", getApprovedExperiences);                   // all approved (public)
router.put("/:id/view", incrementViews);                   // increment views (public)
router.get("/:id", protect, getExperienceById);            // single experience (auth)

// Forum/Comment routes
router.get("/:id/comments", getComments);                  // Get comments for an experience
router.post("/:id/comments", protect, addComment);         // Add a question/comment
router.post("/:id/comments/:commentId/reply", protect, addReply); // Add a reply

module.exports = router;
