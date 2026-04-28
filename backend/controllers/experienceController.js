const Experience = require("../models/Experience");

// @desc Create new experience
// @route POST /api/experience
// @access Private (Student)
exports.createExperience = async (req, res, next) => {
  try {
    const {
      companyName, type, experienceText, year,
      branch, passoutYear, placementType, questions, additionalNotes,
    } = req.body;

    const experience = await Experience.create({
      student: req.user.id,
      companyName,
      type,
      experienceText,
      year,
      branch,
      passoutYear,
      placementType,
      questions: questions || [],
      additionalNotes: additionalNotes || "",
      status: "pending",
    });

    res.status(201).json(experience);
  } catch (error) {
    next(error);
  }
};

// @desc Get all approved experiences
// @route GET /api/experience
// @access Public
exports.getApprovedExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find({ status: "approved" })
      .populate("student", "name email")
      .sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    next(error);
  }
};

// @desc Get single experience by ID
// @route GET /api/experience/:id
// @access Private
exports.getExperienceById = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id)
      .populate("student", "name email");

    if (!exp) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // Not approved (pending / rejected)
    if (exp.status !== "approved") {
      return res.status(400).json({
        message: "Experience not approved",
        status: exp.status,
        studentId: exp.student._id.toString(),
      });
    }

    return res.status(200).json(exp);
  } catch (error) {
    next(error);
  }
};

// @desc Increment views
// @route PUT /api/experience/:id/view
// @access Public
exports.incrementViews = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) {
      return res.status(404).json({ message: "Experience not found" });
    }

    exp.views += 1;
    await exp.save();
    res.json({ views: exp.views });
  } catch (error) {
    next(error);
  }
};

// @desc Get all experiences of logged-in student (any status)
// @route GET /api/experience/me
// @access Private
exports.getMyPosts = async (req, res, next) => {
  try {
    const posts = await Experience.find({ student: req.user.id })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};