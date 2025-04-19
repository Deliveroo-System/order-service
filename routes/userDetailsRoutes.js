const express = require('express');
const router = express.Router();

const { authMiddleware: authenticateToken, authorizeRoles } = require('../middleware/authMiddleware'); // Ensure correct import
const { createUserDetails } = require('../controllers/userDetailsController'); // Ensure correct import

// Require login + specific role (e.g., only 'Customer' can place order)
router.post('/userdetails', authenticateToken, authorizeRoles('Customer'), createUserDetails); // Use uppercase role

module.exports = router;