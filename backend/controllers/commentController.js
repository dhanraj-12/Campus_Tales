const Comment = require("../models/Comment");
const Experience = require("../models/Experience");

// @desc    Get all comments for an experience
// @route   GET /api/experience/:id/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ 
      experience: req.params.id, 
      parentComment: null 
    })
    .populate("user", "name role")
    .sort({ createdAt: -1 });

    // Fetch replies for each top-level comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate("user", "name role")
          .sort({ isAuthorReply: -1, createdAt: 1 }); // Author replies first, then oldest to newest
        return { ...comment._doc, replies };
      })
    );

    res.status(200).json(commentsWithReplies);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching comments" });
  }
};

// @desc    Add a question/comment to an experience
// @route   POST /api/experience/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const comment = await Comment.create({
      experience: req.params.id,
      user: req.user._id,
      text,
      isAuthorReply: experience.student.toString() === req.user._id.toString()
    });

    const populatedComment = await comment.populate("user", "name role");
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: "Server error adding comment" });
  }
};

// @desc    Add a reply to a comment
// @route   POST /api/experience/:id/comments/:commentId/reply
// @access  Private
exports.addReply = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Reply text is required" });
  }

  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const parentComment = await Comment.findById(req.params.commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const isAuthorReply = experience.student.toString() === req.user._id.toString();

    const reply = await Comment.create({
      experience: req.params.id,
      user: req.user._id,
      text,
      parentComment: req.params.commentId,
      isAuthorReply
    });

    const populatedReply = await reply.populate("user", "name role");
    res.status(201).json(populatedReply);
  } catch (error) {
    res.status(500).json({ message: "Server error adding reply" });
  }
};
