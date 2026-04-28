const Experience = require("../models/Experience");
const User = require("../models/User");

// @desc Get all experiences (any status)
// @route GET /api/admin/experience/all
// @access Admin
const getAllExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find()
      .populate("student", "name email year")
      .lean()
      .sort({ createdAt: -1 });

    res.json(experiences);
  } catch (error) {
    next(error);
  }
};

// @desc Get single experience by ID
// @route GET /api/admin/experience/:id
// @access Admin
const getExperienceById = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate("student", "name email year");

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json(experience);
  } catch (error) {
    next(error);
  }
};

// @desc Approve experience
// @route PUT /api/admin/experience/approve/:id
// @access Admin
const approveExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    experience.status = "approved";
    await experience.save();

    res.json({ message: "Experience approved", experience });
  } catch (error) {
    next(error);
  }
};

// @desc Reject experience
// @route PUT /api/admin/experience/reject/:id
// @access Admin
const rejectExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    experience.status = "rejected";
    await experience.save();

    res.json({ message: "Experience rejected", experience });
  } catch (error) {
    next(error);
  }
};

// @desc Get analytics overview
// @route GET /api/admin/analytics
// @access Admin
const getAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalExperiences, totalApproved, totalPending, totalRejected] =
      await Promise.all([
        User.countDocuments(),
        Experience.countDocuments(),
        Experience.countDocuments({ status: "approved" }),
        Experience.countDocuments({ status: "pending" }),
        Experience.countDocuments({ status: "rejected" }),
      ]);

    res.json({
      totalUsers,
      totalExperiences,
      totalApproved,
      totalPending,
      totalRejected,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExperiences,
  getExperienceById,
  approveExperience,
  rejectExperience,
  getAnalytics,
};
