const express = require("express");
const router = express.Router();
const { getResources, addResource, deleteResource } = require("../controllers/resourceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getResources);

// Admin routes
router.post("/", protect, adminOnly, addResource);
router.delete("/:id", protect, adminOnly, deleteResource);

module.exports = router;
