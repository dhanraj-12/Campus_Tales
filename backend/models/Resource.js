const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    link: {
      type: String,
      required: [true, "Link is required"],
    },
    category: {
      type: String,
      required: true,
      enum: ["DSA", "Core Subjects", "System Design", "General"],
    },
    subCategory: {
      type: String,
      default: "", // e.g., "OS", "DBMS", "Computer Networks"
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
