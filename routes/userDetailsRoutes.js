const express = require('express');
const router = express.Router();

const { authMiddleware: authenticateToken, authorizeRoles } = require('../middleware/authMiddleware'); // Ensure correct import
const { createUserDetails } = require('../controllers/userDetailsController'); // Ensure correct import
const userDetailsController = require('../controllers/userDetailsController'); // Add this line
const orderController = require('../controllers/orderController');

// Protect user details route
router.post('/userdetails/userdetails', authenticateToken, userDetailsController.createUserDetails);

// Require login + specific role (e.g., only 'Customer' can place order)
router.post('/userdetails', authenticateToken, authorizeRoles('Customer'), createUserDetails); // Use uppercase role

// Protect order route and restrict to 'Customer' role
router.post('/orders', authenticateToken, authorizeRoles('Customer'), orderController.createOrder);


module.exports = router;