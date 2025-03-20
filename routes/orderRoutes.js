const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Correct usage of authorizeRoles
router.post("/", authMiddleware, authorizeRoles("customer"), orderController.createOrder);
router.get("/", authMiddleware, authorizeRoles("restaurantAdmin"), orderController.getAllOrders);
router.put("/:id", authMiddleware, authorizeRoles("restaurantAdmin", "deliveryPersonnel"), orderController.updateOrderStatus);
router.delete("/:id", authMiddleware, authorizeRoles("restaurantAdmin"), orderController.deleteOrder);

module.exports = router;
