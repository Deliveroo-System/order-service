const Order = require("../models/orderModel");

// ✅ Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, foodItems, totalPrice } = req.body;
    
    console.log("Received order data:", req.body);

    const newOrder = new Order({
      customerName,
      customerEmail,
      foodItems,
      totalPrice,
    });

    const savedOrder = await newOrder.save(); // ✅ store saved document
    console.log("Order saved:", savedOrder);  // ✅ log the saved order

    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("Error saving order:", error); // 👈 optional, helpful
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  
      if (!order) return res.status(404).json({ message: "Order not found" });
  
      // Emit real-time order status update
      const io = req.app.get("io");
      io.emit("orderStatusUpdated", { orderId: order._id, status });
  
      res.json({ message: "Order status updated", order });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// ✅ Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
