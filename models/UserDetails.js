const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
  userId: {
    type: String, 
    required: true
  },
  orderId: {
    type: String, 
    required: true
  },
  customerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Card', 'PayPal'], // Updated enum values
    default: 'Cash on Delivery',
  },
  cardDetails: {
    cardNumber: { type: String },
    expiryDate: { type: String },
    cvv: { type: String },
  },
  paymentId: { // Add this field to store PayPal transaction ID if needed
    type: String,
  },
  items: [
    {
      name: String,
      qty: Number,
      price: Number,
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },

  // Restaurant/Item details
  restaurantId: String,
  deliveryId: String,
  categoryId: String,
  menuId: String,
  menuItemId: String,
  categoryName: String,
  restaurantName: String,
  restaurantDescription: String,
  menuName: String,
  menuItemName: String,

  // Statuses
  restaurantAdmin: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  deliver: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  customerOrderRecive: {
    type: String,
    enum: ['Pending', 'Success'],
    default: 'Pending'
  },

  statusHistory: [
    {
      statusType: String,
      value: String,
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  status: {
    type: String,
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('UserDetails', userDetailsSchema);