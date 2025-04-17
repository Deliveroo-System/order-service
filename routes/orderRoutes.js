const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Correct usage of authenticateToken and authorizeRoles
router.post("/", authenticateToken, authorizeRoles("CUSTOMER"), orderController.createOrder);
router.get("/", authenticateToken, authorizeRoles("RESTAURANTADMIN"), orderController.getAllOrders);
router.put("/:id", authenticateToken, authorizeRoles("RESTAURANTADMIN", "DELIVERYPERSONNEL"), orderController.updateOrderStatus);
router.delete("/:id", authenticateToken, authorizeRoles("RESTAURANTADMIN"), orderController.deleteOrder);

module.exports = router;