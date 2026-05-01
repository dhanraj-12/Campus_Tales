const Resource = require("../models/Resource");

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
exports.getResources = async (req, res, next) => {
  try {
    const resources = await Resource.find().sort({ category: 1, title: 1 });
    res.status(200).json(resources);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new resource
// @route   POST /api/resources
// @access  Private/Admin
exports.addResource = async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    await resource.deleteOne();
    res.status(200).json({ message: "Resource removed" });
  } catch (error) {
    next(error);
  }
};
