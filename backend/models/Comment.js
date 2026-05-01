const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: 1000,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    isAuthorReply: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster lookups per experience
commentSchema.index({ experience: 1, parentComment: 1 });

module.exports = mongoose.model("Comment", commentSchema);
