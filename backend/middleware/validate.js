const { body, validationResult } = require("express-validator");

// Middleware to check validation result
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
};

// Validation rules for user registration
const registerRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters")
    .escape(),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

// Validation rules for user login
const loginRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required"),
];

// Validation rules for creating an experience
const experienceRules = [
  body("companyName")
    .trim()
    .notEmpty().withMessage("Company name is required")
    .isLength({ max: 200 }).withMessage("Company name too long")
    .escape(),
  body("type")
    .notEmpty().withMessage("Type is required")
    .isIn(["Internship", "PPO", "Internship+Placement"]).withMessage("Invalid experience type"),
  body("experienceText")
    .trim()
    .notEmpty().withMessage("Experience description is required")
    .isLength({ min: 20 }).withMessage("Experience must be at least 20 characters"),
  body("year")
    .notEmpty().withMessage("Year is required")
    .isIn(["1st", "2nd", "3rd", "4th"]).withMessage("Invalid year"),
  body("branch")
    .trim()
    .notEmpty().withMessage("Branch is required")
    .escape(),
  body("passoutYear")
    .trim()
    .notEmpty().withMessage("Passout year is required"),
  body("placementType")
    .notEmpty().withMessage("Placement type is required")
    .isIn(["On-Campus", "Off-Campus"]).withMessage("Invalid placement type"),
];

module.exports = {
  handleValidationErrors,
  registerRules,
  loginRules,
  experienceRules,
};
