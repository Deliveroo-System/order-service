const express = require('express');
const router = express.Router();
const { createUserDetails } = require('../controllers/userDetailsController');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

// Require login
router.post('/userdetails', authMiddleware, createUserDetails);

// Or require login + specific role (e.g., only 'customer' can place order)
router.post('/userdetails', authMiddleware, authorizeRoles('customer'), createUserDetails);

module.exports = router;
