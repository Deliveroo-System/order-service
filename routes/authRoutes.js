const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");

// ✅ Register Route
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  authController.registerUser
);

// ✅ Login Route
router.post("/login", authController.loginUser);

module.exports = router;
