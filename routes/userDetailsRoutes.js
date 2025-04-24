const express = require('express');
const router = express.Router();
const {
  createUserDetails,
  updateOrderStatus,
  getUserDetailsById
} = require('../controllers/userDetailsController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/userdetails', authMiddleware, createUserDetails);
router.put('/userdetails/:id/status', authMiddleware, updateOrderStatus);
router.get('/userdetails/:id', authMiddleware, getUserDetailsById);

module.exports = router;
