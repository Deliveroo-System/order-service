// filepath: c:\Users\HP\Desktop\DS_Project\order-service\controllers\authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const { generateToken } = require("../middleware/generateToken"); // Use the imported function

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const normalizedRole = `ROLE_${role.toUpperCase()}`; // Normalize role to uppercase with ROLE_ prefix
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role: normalizedRole });

    await user.save();
    res.status(201).json({ message: "registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.email, user.role); // Ensure role is passed correctly
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};