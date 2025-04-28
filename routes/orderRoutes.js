const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const userDetailsController = require("../controllers/userDetailsController");
const { authMiddleware: authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Correct usage of authenticateToken and authorizeRoles
router.post("/", authenticateToken, authorizeRoles("Customer"), orderController.createOrder);
router.get("/", authenticateToken, authorizeRoles("RESTAURANTADMIN"), orderController.getAllOrders);
router.put("/:id", authenticateToken, authorizeRoles("RESTAURANTADMIN", "DELIVERYPERSONNEL"), orderController.updateOrderStatus);
router.delete("/:id", authenticateToken, authorizeRoles("RESTAURANTADMIN"), orderController.deleteOrder);

// ✅ Route to get all pending order details
router.get("/details/pending", authenticateToken, authorizeRoles("RESTAURANTADMIN"), userDetailsController.getPendingOrderDetails);

module.exports = router;