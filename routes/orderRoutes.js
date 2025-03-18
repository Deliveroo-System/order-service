const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/authMiddleware");

// ✅ Create order (Only Customers)
router.post("/", authMiddleware, orderController.createOrder);

// ✅ Get all orders (Only Restaurant Admins)
router.get("/", authMiddleware, orderController.getAllOrders);

// ✅ Get order by ID (Authenticated Users)
router.get("/:id", authMiddleware, orderController.getOrderById);

// ✅ Update order status (Only Restaurant Admins & Delivery Personnel)
router.put("/:id", authMiddleware, orderController.updateOrderStatus);

// ✅ Delete an order (Only Admins)
router.delete("/:id", authMiddleware, orderController.deleteOrder);

module.exports = router;
