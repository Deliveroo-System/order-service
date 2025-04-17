const express = require('express');
const router = express.Router();

const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware'); // Ensure correct import
const { createUserDetails } = require('../controllers/userDetailsController');

// Require login + specific role (e.g., only 'Customer' can place order)
router.post('/userdetails', authenticateToken, authorizeRoles('CUSTOMER'), createUserDetails); // Use uppercase role

module.exports = router;