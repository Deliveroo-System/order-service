const Order = require('../models/orderModel');
const UserDetails = require('../models/UserDetails');

exports.createUserDetails = async (req, res) => {
  try {
    const { orderId, phoneNumber, address, city, zipCode, paymentMethod } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const userDetails = await UserDetails.create({
      userId: req.user.userId,
      orderId: order._id, // Link to order
      customerName: order.customerName,
      phoneNumber,
      address,
      city,
      zipCode,
      paymentMethod,
      items: order.foodItems.map(item => ({
        name: item.name,
        qty: item.quantity,
        price: item.price
      })),
      totalAmount: order.totalPrice,

      restaurantId: '',
      deliveryId: '',
      categoryId: '',
      menuId: '',
      menuItemId: '',
      categoryName: '',
      restaurantName: '',
      restaurantDescription: '',
      menuName: '',
      menuItemName: '',

      restaurantAdmin: 'Pending',
      deliver: 'Pending',
      customerOrderRecive: 'Pending',
      statusHistory: []
    });

    res.status(201).json({
      message: "User details created from order",
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


exports.getUserDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await UserDetails.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ userDetails: order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};
