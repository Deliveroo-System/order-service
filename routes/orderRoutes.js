const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const userDetailsController = require("../controllers/userDetailsController");
const { authMiddleware: authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// Correct usage of authenticateToken and authorizeRoles
router.post("/", authenticateToken, authorizeRoles("Customer"), orderController.createOrder);
router.get("/", authenticateToken, authorizeRoles("RESTAURANTADMIN"), orderController.getAllOrders);
router.put("/:id", authenticateToken, authorizeRoles("RESTAURANTADMIN", "DELIVERYPERSONNEL"), orderController.updateOrderStatus);
router.delete("/:id", authenticateToken, authorizeRoles("RESTAURANTADMIN"), orderController.deleteOrder);

// Route to get all pending order details
router.get("/details/pending", authenticateToken, authorizeRoles("RESTAURANTADMIN"), userDetailsController.getPendingOrderDetails);

// Route to get all orders
router.get("/details/all", authenticateToken, authorizeRoles("RESTAURANTADMIN"), userDetailsController.getAllOrders);

// Route to get all approved orders
router.get("/details/approved", authenticateToken, authorizeRoles("RESTAURANTADMIN"), userDetailsController.getApprovedOrders);

// Route to get all orders with both admin and deliver approved
router.get("/details/admin-deliver-approved", authenticateToken, authorizeRoles("RESTAURANTADMIN"), userDetailsController.getAdminAndDeliverApprovedOrders);

// Route to get all fully approved orders
router.get("/details/fully-approved", authenticateToken, authorizeRoles("RESTAURANTADMIN"), userDetailsController.getFullyApprovedOrders);

module.exports = router;