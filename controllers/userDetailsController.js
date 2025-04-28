const Order = require('../models/orderModel');
const UserDetails = require('../models/UserDetails');
const User = require("../models/userModel"); 

exports.createUserDetails = async (req, res) => {
  try {
    const {
      orderId,
      deliveryId,
      customerName,
      phoneNumber,
      address,
      city,
      zipCode,
      paymentMethod,
      menus, // Array of menus, each containing items
      totalAmount,
      restaurantId,
      categoryId,
      categoryName,
      restaurantName,
      restaurantDescription,
      restaurantAdmin,
      deliver,
      customerOrderRecive,
      statusHistory
    } = req.body;

    // Validate required fields
    if (!orderId || !menus || !Array.isArray(menus) || menus.length === 0) {
      return res.status(400).json({
        message: "Order ID and menus are required, and menus should be a non-empty array."
      });
    }

    // Ensure each menu and its items have the required fields
    for (const menu of menus) {
      if (!menu.menuId || !menu.menuName || !menu.items || !Array.isArray(menu.items) || menu.items.length === 0) {
        return res.status(400).json({
          message: "Each menu must include menuId, menuName, and a non-empty items array."
        });
      }
      for (const item of menu.items) {
        if (!item.menuItemId || !item.menuItemName || item.qty == null || item.price == null) {
          return res.status(400).json({
            message: "Each item must include menuItemId, menuItemName, qty, and price."
          });
        }
      }
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Create the user details document
    const userDetails = await UserDetails.create({
      userId: req.user.userId,
      orderId,
      deliveryId,
      customerName,
      phoneNumber,
      address,
      city,
      zipCode,
      paymentMethod,
      menus, // Save the array of menus with items
      totalAmount,
      restaurantId,
      categoryId,
      categoryName,
      restaurantName,
      restaurantDescription,
      restaurantAdmin: restaurantAdmin || 'Pending',
      deliver: deliver || 'Pending',
      customerOrderRecive: customerOrderRecive || 'Pending',
      statusHistory: statusHistory || [],
      status: 'Pending',
      createdAt: new Date()
    });

    res.status(201).json({
      message: "User details created successfully.",
      userDetails
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user details', error: error.message });
  }
};

// userDetailsController.js
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusType, value } = req.body;

    const allowedTypes = ['restaurantAdmin', 'deliver', 'customerOrderRecive'];
    if (!allowedTypes.includes(statusType)) {
      return res.status(400).json({ message: 'Invalid status type' });
    }

    const userRole = req.user.role.toLowerCase();
    const rolePermissions = {
      restaurantadmin: 'restaurantAdmin',
      deliver: 'deliver',
      customer: 'customerOrderRecive'
    };

    const allowedStatusType = rolePermissions[userRole];
    if (statusType !== allowedStatusType) {
      return res.status(403).json({
        message: `Access denied: ${userRole} cannot update ${statusType} status`
      });
    }

    const order = await UserDetails.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'UserDetails not found' });
    }

    // Update status field
    order[statusType] = value;

    // Push into statusHistory
    order.statusHistory.push({
      statusType,
      value,
      updatedAt: new Date()
    });

    // Save changes
    await order.save();

    res.status(200).json({
      message: `${statusType} status updated to ${value}`,
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};


// filepath: c:\Users\HP\Desktop\DS_Project\order-service\controllers\userDetailsController.js
exports.getUserDetailsByUserId = async (req, res) => {
  try {
      // Extract the authenticated userId from the token (via authMiddleware)
      const tokenUserId = req.user.userId;

      // Extract the userId from the request parameters
      const requestedUserId = req.params.id;

      // Check if the requested userId matches the token userId
      if (tokenUserId !== requestedUserId) {
          return res.status(403).json({
              success: false,
              message: "Access denied: You can only view your own details"
          });
      }

      // Fetch the logged-in user's details (only name and email)
      const user = await User.findById(tokenUserId).select('name email');
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Fetch all orders and details for the logged-in user
      const userDetails = await UserDetails.find({ userId: tokenUserId })
          .populate('orderId')  // Populate order details if needed
          .select('-__v')       // Exclude version key
          .sort({ createdAt: -1 }); // Sort by latest first

      if (!userDetails || userDetails.length === 0) {
          return res.status(404).json({ 
              message: "No order details found for this user"
          });
      }

      // Respond with only the logged-in user's details
      res.status(200).json({
          success: true,
          user: {
              name: user.name,
              email: user.email
          },
          orderDetails: userDetails.map(detail => ({
              orderId: detail.orderId,
              customerName: detail.customerName,
              phoneNumber: detail.phoneNumber,
              address: detail.address,
              city: detail.city,
              zipCode: detail.zipCode,
              paymentMethod: detail.paymentMethod,
              items: detail.items,
              totalAmount: detail.totalAmount,
              status: {
                  restaurantAdmin: detail.restaurantAdmin,
                  deliver: detail.deliver,
                  customerOrderRecive: detail.customerOrderRecive
              },
              statusHistory: detail.statusHistory
          }))
      });
  } catch (error) {
      res.status(500).json({ 
          success: false, 
          message: "Error fetching user details", 
          error: error.message 
      });
  }
};

// ✅ Get all order details with status: "Pending"
exports.getPendingOrderDetails = async (req, res) => {
  try {
    const pendingOrders = await UserDetails.find({
      $and: [
        { status: "Pending" },
        { restaurantAdmin: "Pending" },
        { deliver: "Pending" },
        { customerOrderRecive: "Pending" }
      ]
    })
      .populate("orderId")
      .select("-__v")
      .sort({ createdAt: -1 });

    if (!pendingOrders || pendingOrders.length === 0) {
      return res.status(404).json({ message: "No pending orders found" });
    }

    // Group orders by restaurantId and exclude "Unknown"
    const groupedByRestaurant = pendingOrders.reduce((acc, order) => {
      const restaurantId = order.restaurantId;
      if (restaurantId) { // Only include valid restaurantId
        if (!acc[restaurantId]) acc[restaurantId] = [];
        acc[restaurantId].push(order);
      }
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      groupedByRestaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending orders",
      error: error.message
    });
  }
};

// ✅ Get all orders in UserDetails
exports.getAllOrders = async (req, res) => {
  try {
    const allOrders = await UserDetails.find()
      .populate("orderId")
      .select("-__v")
      .sort({ createdAt: -1 });

    if (!allOrders || allOrders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    // Group orders by restaurantId and exclude "Unknown"
    const groupedByRestaurant = allOrders.reduce((acc, order) => {
      const restaurantId = order.restaurantId;
      if (restaurantId) { // Only include valid restaurantId
        if (!acc[restaurantId]) acc[restaurantId] = [];
        acc[restaurantId].push(order);
      }
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      groupedByRestaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching all orders",
      error: error.message
    });
  }
};

// ✅ Get all orders with restaurantAdmin: "Approved"
exports.getApprovedOrders = async (req, res) => {
  try {
    const approvedOrders = await UserDetails.find({ restaurantAdmin: "Approved" })
      .populate("orderId")
      .select("-__v")
      .sort({ createdAt: -1 });

    if (!approvedOrders || approvedOrders.length === 0) {
      return res.status(404).json({ message: "No approved orders found" });
    }

    // Group orders by restaurantId and exclude "Unknown"
    const groupedByRestaurant = approvedOrders.reduce((acc, order) => {
      const restaurantId = order.restaurantId;
      if (restaurantId) { // Only include valid restaurantId
        if (!acc[restaurantId]) acc[restaurantId] = [];
        acc[restaurantId].push(order);
      }
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      groupedByRestaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching approved orders",
      error: error.message
    });
  }
};

// ✅ Get all orders with restaurantAdmin: "Approved" and deliver: "Approved"
exports.getAdminAndDeliverApprovedOrders = async (req, res) => {
  try {
    const adminAndDeliverApprovedOrders = await UserDetails.find({
      $and: [
        { restaurantAdmin: "Approved" },
        { deliver: "Approved" }
      ]
    })
      .populate("orderId")
      .select("-__v")
      .sort({ createdAt: -1 });

    if (!adminAndDeliverApprovedOrders || adminAndDeliverApprovedOrders.length === 0) {
      return res.status(404).json({ message: "No orders found with both admin and deliver approved" });
    }

    // Group orders by restaurantId and exclude "Unknown"
    const groupedByRestaurant = adminAndDeliverApprovedOrders.reduce((acc, order) => {
      const restaurantId = order.restaurantId;
      if (restaurantId) { // Only include valid restaurantId
        if (!acc[restaurantId]) acc[restaurantId] = [];
        acc[restaurantId].push(order);
      }
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      groupedByRestaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders with both admin and deliver approved",
      error: error.message
    });
  }
};

// ✅ Get all orders with restaurantAdmin: "Approved", deliver: "Approved", and customerOrderRecive: "Success"
exports.getFullyApprovedOrders = async (req, res) => {
  try {
    const fullyApprovedOrders = await UserDetails.find({
      $and: [
        { restaurantAdmin: "Approved" },
        { deliver: "Approved" },
        { customerOrderRecive: "Success" }
      ]
    })
      .populate("orderId")
      .select("-__v")
      .sort({ createdAt: -1 });

    if (!fullyApprovedOrders || fullyApprovedOrders.length === 0) {
      return res.status(404).json({ message: "No fully approved orders found" });
    }

    // Group orders by restaurantId and exclude "Unknown"
    const groupedByRestaurant = fullyApprovedOrders.reduce((acc, order) => {
      const restaurantId = order.restaurantId;
      if (restaurantId) { // Only include valid restaurantId
        if (!acc[restaurantId]) acc[restaurantId] = [];
        acc[restaurantId].push(order);
      }
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      groupedByRestaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching fully approved orders",
      error: error.message
    });
  }
};