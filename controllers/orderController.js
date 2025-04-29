const Order = require("../models/orderModel");
const User = require("../models/userModel");  

// Create a new order
exports.createOrder = async (req, res) => {
  try {
     
    const { userId, email } = req.user;  
    const { customerName, foodItems, totalPrice, address, paymentMethod, cardDetails } = req.body;

    const newOrder = new Order({
      userId,
      customerName,
      customerEmail: email,   
      foodItems,
      totalPrice,
      address,
      paymentMethod,
      cardDetails
    });

    const savedOrder = await newOrder.save();

     
    await User.findOneAndUpdate(
      { email: email },  
      { $set: { lastOrderId: savedOrder._id } }, 
      { new: true }
    );

    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  
      if (!order) return res.status(404).json({ message: "Order not found" });
  
      
      const io = req.app.get("io");
      io.emit("orderStatusUpdated", { orderId: order._id, status });
  
      res.json({ message: "Order status updated", order });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
